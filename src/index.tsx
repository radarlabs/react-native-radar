import type { EventSubscription } from 'react-native';
import type { RadarNativeInterface } from './@types/RadarNativeInterface';
import type { RadarTrackCallback, RadarTrackOnceOptions, RadarLocationUpdateCallback, RadarPermissionsStatus } from './@types/types';
import { NativeEventEmitter, NativeModules } from 'react-native';

declare global {
  var __turboModuleProxy: any;
}

const isNewArchitecture = global.__turboModuleProxy != null;

let NativeRadar: any;

try {
  if (isNewArchitecture) {
    const NativeRadarModule = require('./NativeRadar');
    NativeRadar = NativeRadarModule.default;
  } else {
    NativeRadar = NativeModules.RNRadar;
  }
} catch (error) {
  console.error('[Radar] Error loading NativeRadar module:', error);
  throw error;
}

// For old architecture, create a NativeEventEmitter
const eventEmitter = isNewArchitecture ? null : new NativeEventEmitter(NativeModules.RNRadar);

// For new architecture, use the locationEmitter directly
const locationEmitter = isNewArchitecture ? NativeRadar?.locationEmitter : null;

let locationUpdateSubscription: EventSubscription | null = null;

export const Radar: RadarNativeInterface = {
  
  initialize: (publishableKey: string, fraud?: boolean) => {   
    return NativeRadar.initialize(publishableKey, !!fraud);
  },
  
  trackOnce: async (options?: RadarTrackOnceOptions) => {
    return NativeRadar.trackOnce(options || null) as Promise<RadarTrackCallback>;
  },

  onLocationUpdate: (callback: RadarLocationUpdateCallback) => {
    // Clear any existing subscription
    if (locationUpdateSubscription) {
      locationUpdateSubscription.remove();
      locationUpdateSubscription = null;
    }
  
    if (isNewArchitecture && locationEmitter) {
      locationUpdateSubscription = locationEmitter((event: { type: string; location: any; user: any }) => {
        try {
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
      locationUpdateSubscription = eventEmitter.addListener('location', (event: { location: any; user: any }) => {
        try {
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
      locationUpdateSubscription.remove();
      locationUpdateSubscription = null;
    }
  },

  requestPermissions: (background: boolean) => {
    return NativeRadar.requestPermissions(background) as Promise<RadarPermissionsStatus>;
  }
}
