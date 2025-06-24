import type { EventSubscription } from 'react-native';
import type { RadarNativeInterface } from './@types/RadarNativeInterface';
import type { RadarTrackCallback, RadarTrackOnceOptions, RadarLocationUpdateCallback, RadarPermissionsStatus } from './@types/types';
//import NativeRadar from './NativeRadar';
import { NativeEventEmitter, NativeModules } from 'react-native';

// Extend global to include __turboModuleProxy
declare global {
  var __turboModuleProxy: any;
}

// Check if we're using the new architecture
const isNewArchitecture = global.__turboModuleProxy != null;

console.log('[Radar] Debugging module loading...');
console.log('[Radar] global.__turboModuleProxy:', global.__turboModuleProxy);
console.log('[Radar] isNewArchitecture:', isNewArchitecture);
console.log('[Radar] NativeModules:', Object.keys(NativeModules));

let NativeRadar: any;

try {
  if (isNewArchitecture) {
    console.log('[Radar] Attempting to load new architecture module...');
    const NativeRadarModule = require('./NativeRadar');
    console.log('[Radar] NativeRadarModule:', NativeRadarModule);
    NativeRadar = NativeRadarModule.default;
    console.log('[Radar] NativeRadar (new arch):', NativeRadar);
  } else {
    console.log('[Radar] Attempting to load old architecture module...');
    NativeRadar = NativeModules.RNRadar;
    console.log('[Radar] NativeRadar (old arch):', NativeRadar);
  }
} catch (error) {
  console.error('[Radar] Error loading NativeRadar module:', error);
  throw error;
}

// For old architecture, create a NativeEventEmitter
const eventEmitter = isNewArchitecture ? null : new NativeEventEmitter(NativeModules.RNRadar);

// For new architecture, use the locationEmitter directly
const locationEmitter = isNewArchitecture ? NativeRadar?.locationEmitter : null;

console.log('[Radar] Architecture detected:', isNewArchitecture ? 'New Architecture' : 'Old Architecture');
console.log('[Radar] NativeRadar methods:', NativeRadar ? Object.keys(NativeRadar) : 'NativeRadar is null/undefined');
console.log('[Radar] locationEmitter:', locationEmitter);
console.log('[Radar] eventEmitter:', eventEmitter);

let locationUpdateSubscription: EventSubscription | null = null;

export const Radar: RadarNativeInterface = {
  
  initialize: (publishableKey: string, fraud?: boolean) => {
    console.log('[Radar] initialize called with:', { publishableKey, fraud });
    console.log('[Radar] NativeRadar.initialize exists:', typeof NativeRadar?.initialize);
    
    if (!NativeRadar) {
      throw new Error('NativeRadar module is not available. Please check if the native module is properly linked.');
    }
    
    if (typeof NativeRadar.initialize !== 'function') {
      console.error('[Radar] NativeRadar.initialize is not a function:', NativeRadar.initialize);
      console.error('[Radar] Available methods on NativeRadar:', Object.keys(NativeRadar));
      throw new Error(`NativeRadar.initialize is not a function. Available methods: ${Object.keys(NativeRadar).join(', ')}`);
    }
    
    return NativeRadar.initialize(publishableKey, !!fraud);
  },
  
  trackOnce: async (options?: RadarTrackOnceOptions) => {
    if (!NativeRadar) {
      throw new Error('NativeRadar module is not available');
    }
    return NativeRadar.trackOnce(options || null) as Promise<RadarTrackCallback>;
  },

  onLocationUpdate: (callback: RadarLocationUpdateCallback) => {
    // Clear any existing subscription
    if (locationUpdateSubscription) {
      locationUpdateSubscription.remove();
      locationUpdateSubscription = null;
    }
  
    if (isNewArchitecture && locationEmitter) {
      // New architecture: use the locationEmitter directly
      console.log('[Radar] Using new architecture event emitter');
      locationUpdateSubscription = locationEmitter((event: { type: string; location: any; user: any }) => {
        try {
          // Transform the event data to match RadarLocationUpdate interface
          const locationUpdate = {
            location: event.location,
            user: event.user
          };
          
          callback(locationUpdate);
        } catch (error) {
          console.error('[Radar] Error in location update callback:', error);
        }
      });
    } else if (!isNewArchitecture && eventEmitter) {
      // Old architecture: use NativeEventEmitter with 'location' channel
      console.log('[Radar] Using old architecture event emitter');
      locationUpdateSubscription = eventEmitter.addListener('location', (event: { location: any; user: any }) => {
        try {
          // Transform the event data to match RadarLocationUpdate interface
          const locationUpdate = {
            location: event.location,
            user: event.user
          };
          
          callback(locationUpdate);
        } catch (error) {
          console.error('[Radar] Error in location update callback:', error);
        }
      });
    } else {
      console.warn('[Radar] No event emitter available for location updates');
    }
  },

  clearLocationUpdate: () => {
    if (locationUpdateSubscription) {
      console.log('[Radar] Clearing location update subscription');
      locationUpdateSubscription.remove();
      locationUpdateSubscription = null;
    } else {
      console.log('[Radar] No location update subscription to clear');
    }
  },

  requestPermissions: (background: boolean) => {
    if (!NativeRadar) {
      throw new Error('NativeRadar module is not available');
    }
    return NativeRadar.requestPermissions(background) as Promise<RadarPermissionsStatus>;
  }
}
