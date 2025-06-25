import type { EventSubscription } from 'react-native';
import type { RadarNativeInterface } from './@types/RadarNativeInterface';
import type { RadarTrackCallback, RadarTrackOnceOptions, RadarLocationUpdateCallback, RadarPermissionsStatus, RadarClientLocationUpdateCallback, RadarLocationSource, RadarErrorCallback, RadarLogUpdateCallback, RadarTokenUpdateCallback, RadarEventUpdateCallback,
  //  RadarErrorCallback, RadarLogUpdateCallback, RadarEventUpdateCallback, RadarTokenUpdateCallback 
  } from './@types/types';
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

const locationEmitter = isNewArchitecture ? NativeRadar?.locationEmitter : null;
const clientLocationEmitter = isNewArchitecture ? NativeRadar?.clientLocationEmitter : null;
const errorEmitter = isNewArchitecture ? NativeRadar?.errorEmitter : null;
const logEmitter = isNewArchitecture ? NativeRadar?.logEmitter : null;
const eventsEmitter = isNewArchitecture ? NativeRadar?.eventsEmitter : null;
const tokenEmitter = isNewArchitecture ? NativeRadar?.tokenEmitter : null;

let locationUpdateSubscription: EventSubscription | null = null;
let clientLocationUpdateSubscription: EventSubscription | null = null;
let errorUpdateSubscription: EventSubscription | null = null;
let logUpdateSubscription: EventSubscription | null = null;
let eventsUpdateSubscription: EventSubscription | null = null;
let tokenUpdateSubscription: EventSubscription | null = null;

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

  onClientLocationUpdate: (callback: RadarClientLocationUpdateCallback) => {
    if (clientLocationUpdateSubscription) {
      clientLocationUpdateSubscription.remove();
      clientLocationUpdateSubscription = null;
    }

    if (isNewArchitecture && clientLocationEmitter) {
      clientLocationUpdateSubscription = clientLocationEmitter((event: { location: any; stopped: boolean; source: string }) => {
        try {
          const clientLocationUpdate = {
            location: event.location,
            stopped: event.stopped,
            source: event.source as RadarLocationSource
          };
          callback(clientLocationUpdate);
        } catch (error) {
          console.error('[Radar] Error in client location update callback:', error);
        }
      });
    } else if (!isNewArchitecture && eventEmitter) {
      clientLocationUpdateSubscription = eventEmitter.addListener('clientLocation', (event: { location: any; stopped: boolean; source: string }) => {
        try {
          const clientLocationUpdate = {
            location: event.location,
            stopped: event.stopped,
            source: event.source as RadarLocationSource
          };
          callback(clientLocationUpdate);
        } catch (error) {
          console.error('[Radar] Error in client location update callback:', error);
        }
      });
    } else {
      console.warn('[Radar] No event emitter available for client location updates');
    }
  },

  clearClientLocationUpdate: () => {
    if (clientLocationUpdateSubscription) {
      clientLocationUpdateSubscription.remove();
      clientLocationUpdateSubscription = null;
    }
  },

  onError: (callback: RadarErrorCallback) => {
    if (errorUpdateSubscription) {
      errorUpdateSubscription.remove();
      errorUpdateSubscription = null;
    }

    if (isNewArchitecture && errorEmitter) {
      errorUpdateSubscription = errorEmitter((event: { status: string }) => {
        callback(event.status);
      });
    } else if (!isNewArchitecture && eventEmitter) {
      errorUpdateSubscription = eventEmitter.addListener('error', (event: { status: string }) => {
        callback(event.status);
      });
    } else {
      console.warn('[Radar] No event emitter available for error updates');
    }
  },

  clearError: () => {
    if (errorUpdateSubscription) {
      errorUpdateSubscription.remove();
      errorUpdateSubscription = null;
    }
  },

  onLog: (callback: RadarLogUpdateCallback) => {
    if (logUpdateSubscription) {
      logUpdateSubscription.remove();
      logUpdateSubscription = null;
    }

    if (isNewArchitecture && logEmitter) {
      logUpdateSubscription = logEmitter((event: { message: string }) => {
        callback(event.message);
      });
    } else if (!isNewArchitecture && eventEmitter) {
      logUpdateSubscription = eventEmitter.addListener('log', (event: { message: string }) => {
        callback(event.message);
      });
    } else {
      console.warn('[Radar] No event emitter available for log updates');
    }
  },

  clearLog: () => {
    if (logUpdateSubscription) {
      logUpdateSubscription.remove();
      logUpdateSubscription = null;
    }
  },

  onEventUpdate: (callback: RadarEventUpdateCallback) => {
    if (eventsUpdateSubscription) {
      eventsUpdateSubscription.remove();
      eventsUpdateSubscription = null;
    }

    if (isNewArchitecture && eventsEmitter) {
      eventsUpdateSubscription = eventsEmitter((event: { events: any[]; user: any }) => {
        try {
          const eventUpdate = {
            user: event.user,
            events: event.events
          };
          callback(eventUpdate);
        } catch (error) {
          console.error('[Radar] Error in event update callback:', error);
        }
      });
    } else if (!isNewArchitecture && eventEmitter) {
      eventsUpdateSubscription = eventEmitter.addListener('events', (event: { events: any[]; user: any }) => {
        try {
          const eventUpdate = {
            user: event.user,
            events: event.events
          };
          callback(eventUpdate);
        } catch (error) {
          console.error('[Radar] Error in event update callback:', error);
        }
      });
    } else {
      console.warn('[Radar] No event emitter available for event updates');
    }
  },

  clearEventUpdate: () => {
    if (eventsUpdateSubscription) {
      eventsUpdateSubscription.remove();
      eventsUpdateSubscription = null;
    }
  },

  onTokenUpdate: (callback: RadarTokenUpdateCallback) => {
    if (tokenUpdateSubscription) {
      tokenUpdateSubscription.remove();
      tokenUpdateSubscription = null;
    }
    
    if (isNewArchitecture && tokenEmitter) {
      tokenUpdateSubscription = tokenEmitter((event: { token: any }) => {
        callback(event.token);
      });
    } else if (!isNewArchitecture && eventEmitter) {
      tokenUpdateSubscription = eventEmitter.addListener('token', (event: { token: any }) => {
        callback(event.token);
      });
    } else {
      console.warn('[Radar] No event emitter available for token updates');
    }
  },

  clearTokenUpdate: () => {
    if (tokenUpdateSubscription) {
      tokenUpdateSubscription.remove();
      tokenUpdateSubscription = null;
    }
  },

  requestPermissions: (background: boolean) => {
    return NativeRadar.requestPermissions(background) as Promise<RadarPermissionsStatus>;
  }
}
