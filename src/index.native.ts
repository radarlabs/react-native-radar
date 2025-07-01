import type { EventSubscription } from 'react-native';
import type { RadarNativeInterface } from './@types/RadarNativeInterface';
import type { RadarTrackCallback, RadarTrackOnceOptions, RadarLocationUpdateCallback, RadarPermissionsStatus, RadarClientLocationUpdateCallback, RadarLocationSource, RadarErrorCallback, RadarLogUpdateCallback, RadarTokenUpdateCallback, RadarEventUpdateCallback, RadarLogLevel, RadarMetadata, RadarLocationCallback, RadarTrackingOptionsDesiredAccuracy, RadarTrackVerifiedCallback, RadarTrackVerifiedOptions, RadarMockTrackingOptions, RadarTrackingOptions, RadarVerifiedTrackingOptions, RadarContextCallback, RadarNotificationOptions, RadarStartTripOptions, RadarTrackingOptionsForegroundService, RadarTripCallback, RadarTripOptions, RadarUpdateTripOptions, RadarAddress, RadarAddressCallback, RadarAutocompleteOptions, RadarGeocodeOptions, RadarGetDistanceOptions, RadarGetMatrixOptions, RadarIPGeocodeCallback, RadarLogConversionCallback, RadarLogConversionOptions, RadarReverseGeocodeOptions, RadarRouteCallback, RadarRouteMatrix, RadarSearchGeofencesCallback, RadarSearchGeofencesOptions, RadarSearchPlacesCallback, RadarSearchPlacesOptions, RadarValidateAddressCallback, RadarUser,
  Location,
  RadarEvent} from './@types/types';
import { DeviceEventEmitter, NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { VERSION } from './version';
import NativeRadar, { ClientLocationEmitter, ErrorEmitter, EventsEmitter, LocationEmitter, LogEmitter, TokenEmitter } from './NativeRadar';


// declare global {
//   var __turboModuleProxy: any;
// }

// const isNewArchitecture = global.__turboModuleProxy != null;



const compatEventEmitter = NativeRadar.locationEmitter == null 
  ? new NativeEventEmitter(NativeModules.RNRadar)
  : null;

type Events =
  | 'locationEmitter'
  | 'clientLocationEmitter'
  | 'errorEmitter'
  | 'logEmitter'
  | 'eventsEmitter'
  | 'tokenEmitter';

export function addListener<EventT extends Events>(
  event: EventT,
  handler: Parameters<(typeof NativeRadar)[EventT]>[0]
): EventSubscription {
  if (compatEventEmitter != null) {
    return compatEventEmitter.addListener(event, handler);
  }
  return NativeRadar[event](handler as any);
}

// try {
//   if (isNewArchitecture) {
//     const NativeRadarModule = require('./NativeRadar');
//     NativeRadar = NativeRadarModule.default;
//   } else {
//     NativeRadar = NativeModules.RNRadar;
//   }
// } catch (error) {
//   console.error('[Radar] Error loading NativeRadar module:', error);
//   throw error;
// }

// For old architecture, create a NativeEventEmitter
// const eventEmitter = isNewArchitecture ? null : new NativeEventEmitter(NativeModules.RNRadar);

// const locationEmitter = isNewArchitecture ? NativeRadar?.locationEmitter : null;
// const clientLocationEmitter = isNewArchitecture ? NativeRadar?.clientLocationEmitter : null;
// const errorEmitter = isNewArchitecture ? NativeRadar?.errorEmitter : null;
// const logEmitter = isNewArchitecture ? NativeRadar?.logEmitter : null;
// const eventsEmitter = isNewArchitecture ? NativeRadar?.eventsEmitter : null;
// const tokenEmitter = isNewArchitecture ? NativeRadar?.tokenEmitter : null;

let locationUpdateSubscription: EventSubscription | null = null;
let clientLocationUpdateSubscription: EventSubscription | null = null;
let errorUpdateSubscription: EventSubscription | null = null;
let logUpdateSubscription: EventSubscription | null = null;
let eventsUpdateSubscription: EventSubscription | null = null;
let tokenUpdateSubscription: EventSubscription | null = null;

const Radar: RadarNativeInterface = {
  initialize: (publishableKey: string, fraud?: boolean) => {
    return NativeRadar.initialize(publishableKey, !!fraud);
  },

  trackOnce: async (options?: RadarTrackOnceOptions) => {
    return NativeRadar.trackOnce(options || null) as Promise<RadarTrackCallback>;
  },

  onLocationUpdated: (callback: RadarLocationUpdateCallback | null) => {
    // Clear any existing subscription
    if (locationUpdateSubscription) {
      locationUpdateSubscription.remove();
    }

    if (!callback) {
      return;
    }

    locationUpdateSubscription = addListener('locationEmitter', (event: LocationEmitter) => {
      try {
        const locationUpdate = {
          location: event.location as Location,
          user: event.user as RadarUser
        };
        callback(locationUpdate);
      } catch (error) {
        console.error('[Radar] Error in location update callback:', error);
      }
    });

    // if (isNewArchitecture && locationEmitter) {
    //   locationUpdateSubscription = locationEmitter((event: { type: string; location: any; user: any; }) => {
    //     try {
    //       const locationUpdate = {
    //         location: event.location,
    //         user: event.user
    //       };

    //       callback(locationUpdate);
    //     } catch (error) {
    //       console.error('[Radar] Error in location update callback:', error);
    //     }
    //   });
    // } else if (!isNewArchitecture && eventEmitter) {
    //   locationUpdateSubscription = eventEmitter.addListener('location', (event: { location: any; user: any; }) => {
    //     try {
    //       const locationUpdate = {
    //         location: event.location,
    //         user: event.user
    //       };

    //       callback(locationUpdate);
    //     } catch (error) {
    //       console.error('[Radar] Error in location update callback:', error);
    //     }
    //   });
    // } else {
    //   console.warn('[Radar] No event emitter available for location updates');
    // }
  },

  // clearLocationUpdate: () => {
  //   if (locationUpdateSubscription) {
  //     locationUpdateSubscription.remove();
  //     locationUpdateSubscription = null;
  //   }
  // },

  onClientLocationUpdated: (callback: RadarClientLocationUpdateCallback | null) => {
    if (clientLocationUpdateSubscription) {
      clientLocationUpdateSubscription.remove();
      clientLocationUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    clientLocationUpdateSubscription = addListener('clientLocationEmitter', (event: ClientLocationEmitter) => {
      const clientLocationUpdate = {
        location: event.location as Location,
        stopped: event.stopped,
        source: event.source as RadarLocationSource
      };
      callback(clientLocationUpdate);
    });

    // if (isNewArchitecture && clientLocationEmitter) {
    //   clientLocationUpdateSubscription = clientLocationEmitter((event: { location: any; stopped: boolean; source: string; }) => {
    //     try {
    //       const clientLocationUpdate = {
    //         location: event.location,
    //         stopped: event.stopped,
    //         source: event.source as RadarLocationSource
    //       };
    //       callback(clientLocationUpdate);
    //     } catch (error) {
    //       console.error('[Radar] Error in client location update callback:', error);
    //     }
    //   });
    // } else if (!isNewArchitecture && eventEmitter) {
    //   clientLocationUpdateSubscription = eventEmitter.addListener('clientLocation', (event: { location: any; stopped: boolean; source: string; }) => {
    //     try {
    //       const clientLocationUpdate = {
    //         location: event.location,
    //         stopped: event.stopped,
    //         source: event.source as RadarLocationSource
    //       };
    //       callback(clientLocationUpdate);
    //     } catch (error) {
    //       console.error('[Radar] Error in client location update callback:', error);
    //     }
    //   });
    // } else {
    //   console.warn('[Radar] No event emitter available for client location updates');
    // }
  },

  // clearClientLocationUpdate: () => {
  //   if (clientLocationUpdateSubscription) {
  //     clientLocationUpdateSubscription.remove();
  //     clientLocationUpdateSubscription = null;
  //   }
  // },

  onError: (callback: RadarErrorCallback | null) => {
    if (errorUpdateSubscription) {
      errorUpdateSubscription.remove();
      errorUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    errorUpdateSubscription = addListener('errorEmitter', (event: ErrorEmitter) => {
      const errorUpdate = {
        status: event.status,
      };
      callback(errorUpdate.status);
    });

    // if (isNewArchitecture && errorEmitter) {
    //   errorUpdateSubscription = errorEmitter((event: { status: string; }) => {
    //     callback(event.status);
    //   });
    // } else if (!isNewArchitecture && eventEmitter) {
    //   errorUpdateSubscription = eventEmitter.addListener('error', (event: { status: string; }) => {
    //     callback(event.status);
    //   });
    // } else {
    //   console.warn('[Radar] No event emitter available for error updates');
    // }
  },

  // clearError: () => {
  //   if (errorUpdateSubscription) {
  //     errorUpdateSubscription.remove();
  //     errorUpdateSubscription = null;
  //   }
  // },

  onLog: (callback: RadarLogUpdateCallback | null) => {
    if (logUpdateSubscription) {
      logUpdateSubscription.remove();
      logUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    logUpdateSubscription = addListener('logEmitter', (event: LogEmitter) => {
      callback(event.message);
    });

    // if (isNewArchitecture && logEmitter) {
    //   logUpdateSubscription = logEmitter((event: { message: string; }) => {
    //     callback(event.message);
    //   });
    // } else if (!isNewArchitecture && eventEmitter) {
    //   logUpdateSubscription = eventEmitter.addListener('log', (event: { message: string; }) => {
    //     callback(event.message);
    //   });
    // } else {
    //   console.warn('[Radar] No event emitter available for log updates');
    // }
  },

  // clearLog: () => {
  //   if (logUpdateSubscription) {
  //     logUpdateSubscription.remove();
  //     logUpdateSubscription = null;
  //   }
  // },

  onEventsReceived: (callback: RadarEventUpdateCallback | null) => {
    if (eventsUpdateSubscription) {
      eventsUpdateSubscription.remove();
      eventsUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    eventsUpdateSubscription = addListener('eventsEmitter', (event: EventsEmitter) => {
      const eventUpdate = {
        user: event.user as RadarUser,
        events: event.events as RadarEvent[]
      };
      callback(eventUpdate);
    });

    // if (isNewArchitecture && eventsEmitter) {
    //   eventsUpdateSubscription = eventsEmitter((event: { events: any[]; user: any; }) => {
    //     try {
    //       const eventUpdate = {
    //         user: event.user,
    //         events: event.events
    //       };
    //       callback(eventUpdate);
    //     } catch (error) {
    //       console.error('[Radar] Error in event update callback:', error);
    //     }
    //   });
    // } else if (!isNewArchitecture && eventEmitter) {
    //   eventsUpdateSubscription = eventEmitter.addListener('events', (event: { events: any[]; user: any; }) => {
    //     try {
    //       const eventUpdate = {
    //         user: event.user,
    //         events: event.events
    //       };
    //       callback(eventUpdate);
    //     } catch (error) {
    //       console.error('[Radar] Error in event update callback:', error);
    //     }
    //   });
    // } else {
    //   console.warn('[Radar] No event emitter available for event updates');
    // }
  },

  // clearEventUpdate: () => {
  //   if (eventsUpdateSubscription) {
  //     eventsUpdateSubscription.remove();
  //     eventsUpdateSubscription = null;
  //   }
  // },

  onTokenUpdated: (callback: RadarTokenUpdateCallback | null) => {
    if (tokenUpdateSubscription) {
      tokenUpdateSubscription.remove();
      tokenUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    tokenUpdateSubscription = addListener('tokenEmitter', (event: TokenEmitter) => {
      callback(event.token);
    });

    // if (isNewArchitecture && tokenEmitter) {
    //   tokenUpdateSubscription = tokenEmitter((event: { token: any; }) => {
    //     callback(event.token);
    //   });
    // } else if (!isNewArchitecture && eventEmitter) {
    //   tokenUpdateSubscription = eventEmitter.addListener('token', (event: { token: any; }) => {
    //     callback(event.token);
    //   });
    // } else {
    //   console.warn('[Radar] No event emitter available for token updates');
    // }
  },

  // clearTokenUpdate: () => {
  //   if (tokenUpdateSubscription) {
  //     tokenUpdateSubscription.remove();
  //     tokenUpdateSubscription = null;
  //   }
  // },

  requestPermissions: (background: boolean) => {
    return NativeRadar.requestPermissions(background) as Promise<RadarPermissionsStatus>;
  },
  setLogLevel: function (level: RadarLogLevel): void {
    return NativeRadar.setLogLevel(level);
  },
  setUserId: function (userId: string): void {
    return NativeRadar.setUserId(userId);
  },
  getUserId: function (): Promise<string> {
    return NativeRadar.getUserId();
  },
  setDescription: function (description: string): void {
    return NativeRadar.setDescription(description);
  },
  getDescription: function (): Promise<string> {
    return NativeRadar.getDescription();
  },
  setMetadata: function (metadata: RadarMetadata): void {
    return NativeRadar.setMetadata(metadata);
  },
  getMetadata: function (): Promise<RadarMetadata> {
    return NativeRadar.getMetadata() as Promise<RadarMetadata>;
  },
  setAnonymousTrackingEnabled: function (enabled: boolean): void {
    return NativeRadar.setAnonymousTrackingEnabled(enabled);
  },
  getPermissionsStatus: function (): Promise<RadarPermissionsStatus> {
    return NativeRadar.getPermissionsStatus() as Promise<RadarPermissionsStatus>;
  },
  getLocation: function (desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy): Promise<RadarLocationCallback> {
    return NativeRadar.getLocation(desiredAccuracy || null) as Promise<RadarLocationCallback>;
  },
  trackVerified: function (options?: RadarTrackVerifiedOptions): Promise<RadarTrackVerifiedCallback> {
    return NativeRadar.trackVerified(options || null) as Promise<RadarTrackVerifiedCallback>;
  },
  getVerifiedLocationToken: function (): Promise<RadarTrackVerifiedCallback> {
    return NativeRadar.getVerifiedLocationToken() as Promise<RadarTrackVerifiedCallback>;
  },
  clearVerifiedLocationToken: function (): void {
    return NativeRadar.clearVerifiedLocationToken();
  },
  startTrackingEfficient: function (): void {
    return NativeRadar.startTrackingEfficient();
  },
  startTrackingResponsive: function (): void {
    return NativeRadar.startTrackingResponsive();
  },
  startTrackingContinuous: function (): void {
    return NativeRadar.startTrackingContinuous();
  },
  startTrackingCustom: function (options: RadarTrackingOptions): void {
    return NativeRadar.startTrackingCustom(options);
  },
  startTrackingVerified: function (options?: RadarVerifiedTrackingOptions): void {
    return NativeRadar.startTrackingVerified(options || null);
  },
  isTrackingVerified: function (): Promise<boolean> {
    return NativeRadar.isTrackingVerified();
  },
  setProduct: function (product: string): void {
    return NativeRadar.setProduct(product);
  },
  mockTracking: function (options: RadarMockTrackingOptions): void {
    return NativeRadar.mockTracking(options);
  },
  stopTracking: function (): void {
    return NativeRadar.stopTracking();
  },
  stopTrackingVerified: function (): void {
    return NativeRadar.stopTrackingVerified();
  },
  getTrackingOptions: function (): Promise<RadarTrackingOptions> {
    return NativeRadar.getTrackingOptions() as Promise<RadarTrackingOptions>;
  },
  isUsingRemoteTrackingOptions: function (): Promise<boolean> {
    return NativeRadar.isUsingRemoteTrackingOptions();
  },
  isTracking: function (): Promise<boolean> {
    return NativeRadar.isTracking();
  },
  setForegroundServiceOptions: function (options: RadarTrackingOptionsForegroundService): void {
    return NativeRadar.setForegroundServiceOptions(options);
  },
  setNotificationOptions: function (options: RadarNotificationOptions): void {
    return NativeRadar.setNotificationOptions(options);
  },
  getTripOptions: function (): Promise<RadarTripOptions> {
    return NativeRadar.getTripOptions() as Promise<RadarTripOptions>;
  },
  startTrip: function (options: RadarStartTripOptions): Promise<RadarTripCallback> {
    return NativeRadar.startTrip(options) as Promise<RadarTripCallback>;
  },
  completeTrip: function (): Promise<RadarTripCallback> {
    return NativeRadar.completeTrip() as Promise<RadarTripCallback>;
  },
  cancelTrip: function (): Promise<RadarTripCallback> {
    return NativeRadar.cancelTrip() as Promise<RadarTripCallback>;
  },
  updateTrip: function (options: RadarUpdateTripOptions): Promise<RadarTripCallback> {
    return NativeRadar.updateTrip(options) as Promise<RadarTripCallback>;
  },
  acceptEvent: function (eventId: string, verifiedPlaceId: string): void {
    return NativeRadar.acceptEvent(eventId, verifiedPlaceId);
  },
  rejectEvent: function (eventId: string): void {
    return NativeRadar.rejectEvent(eventId);
  },
  getContext: function (location?: Location): Promise<RadarContextCallback> {
    return NativeRadar.getContext(location || null) as Promise<RadarContextCallback>;
  },
  searchPlaces: function (options: RadarSearchPlacesOptions): Promise<RadarSearchPlacesCallback> {
    return NativeRadar.searchPlaces(options) as Promise<RadarSearchPlacesCallback>;
  },
  searchGeofences: function (options: RadarSearchGeofencesOptions): Promise<RadarSearchGeofencesCallback> {
    return NativeRadar.searchGeofences(options) as Promise<RadarSearchGeofencesCallback>;
  },
  autocomplete: function (options: RadarAutocompleteOptions): Promise<RadarAddressCallback> {
    return NativeRadar.autocomplete(options) as Promise<RadarAddressCallback>;
  },
  geocode: function (options: RadarGeocodeOptions): Promise<RadarAddressCallback> {
    return NativeRadar.geocode(options) as Promise<RadarAddressCallback>;
  },
  reverseGeocode: function (options?: RadarReverseGeocodeOptions): Promise<RadarAddressCallback> {
    return NativeRadar.reverseGeocode(options || null) as Promise<RadarAddressCallback>;
  },
  ipGeocode: function (): Promise<RadarIPGeocodeCallback> {
    return NativeRadar.ipGeocode() as Promise<RadarIPGeocodeCallback>;
  },
  validateAddress: function (address: RadarAddress): Promise<RadarValidateAddressCallback> {
    return NativeRadar.validateAddress(address) as Promise<RadarValidateAddressCallback>;
  },
  getDistance: function (option: RadarGetDistanceOptions): Promise<RadarRouteCallback> {
    return NativeRadar.getDistance(option) as Promise<RadarRouteCallback>;
  },
  getMatrix: function (option: RadarGetMatrixOptions): Promise<RadarRouteMatrix> {
    return NativeRadar.getMatrix(option) as Promise<RadarRouteMatrix>;
  },
  logConversion: function (options: RadarLogConversionOptions): Promise<RadarLogConversionCallback> {
    return NativeRadar.logConversion(options) as Promise<RadarLogConversionCallback>;
  },

  nativeSdkVersion: function (): Promise<string> {
    return NativeRadar.nativeSdkVersion();
  },
  rnSdkVersion: function (): string {
    return VERSION;
  },
  getHost: function (): Promise<string> {
    return NativeRadar.getHost();
  },
  getPublishableKey: function (): Promise<string> {
    return NativeRadar.getPublishableKey();
  }
}

export default Radar;
