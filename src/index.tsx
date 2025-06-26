import type { EventSubscription } from 'react-native';
import type { RadarNativeInterface } from './@types/RadarNativeInterface';
import type { RadarTrackCallback, RadarTrackOnceOptions, RadarLocationUpdateCallback, RadarPermissionsStatus, RadarClientLocationUpdateCallback, RadarLocationSource, RadarErrorCallback, RadarLogUpdateCallback, RadarTokenUpdateCallback, RadarEventUpdateCallback, RadarLogLevel, RadarMetadata, RadarLocationCallback, RadarTrackingOptionsDesiredAccuracy, RadarTrackVerifiedCallback, RadarTrackVerifiedOptions, RadarMockTrackingOptions, RadarTrackingOptions, RadarVerifiedTrackingOptions, RadarContextCallback, RadarNotificationOptions, RadarStartTripOptions, RadarTrackingOptionsForegroundService, RadarTripCallback, RadarTripOptions, RadarUpdateTripOptions, RadarAddress, RadarAddressCallback, RadarAutocompleteOptions, RadarGeocodeOptions, RadarGetDistanceOptions, RadarGetMatrixOptions, RadarIPGeocodeCallback, RadarLogConversionCallback, RadarLogConversionOptions, RadarReverseGeocodeOptions, RadarRouteCallback, RadarRouteMatrix, RadarSearchGeofencesCallback, RadarSearchGeofencesOptions, RadarSearchPlacesCallback, RadarSearchPlacesOptions, RadarValidateAddressCallback,
  //  RadarErrorCallback, RadarLogUpdateCallback, RadarEventUpdateCallback, RadarTokenUpdateCallback 
  } from './@types/types';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { VERSION } from './version';

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
      locationUpdateSubscription = locationEmitter((event: { type: string; location: any; user: any; }) => {
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
      locationUpdateSubscription = eventEmitter.addListener('location', (event: { location: any; user: any; }) => {
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
      clientLocationUpdateSubscription = clientLocationEmitter((event: { location: any; stopped: boolean; source: string; }) => {
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
      clientLocationUpdateSubscription = eventEmitter.addListener('clientLocation', (event: { location: any; stopped: boolean; source: string; }) => {
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
      errorUpdateSubscription = errorEmitter((event: { status: string; }) => {
        callback(event.status);
      });
    } else if (!isNewArchitecture && eventEmitter) {
      errorUpdateSubscription = eventEmitter.addListener('error', (event: { status: string; }) => {
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
      logUpdateSubscription = logEmitter((event: { message: string; }) => {
        callback(event.message);
      });
    } else if (!isNewArchitecture && eventEmitter) {
      logUpdateSubscription = eventEmitter.addListener('log', (event: { message: string; }) => {
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
      eventsUpdateSubscription = eventsEmitter((event: { events: any[]; user: any; }) => {
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
      eventsUpdateSubscription = eventEmitter.addListener('events', (event: { events: any[]; user: any; }) => {
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
      tokenUpdateSubscription = tokenEmitter((event: { token: any; }) => {
        callback(event.token);
      });
    } else if (!isNewArchitecture && eventEmitter) {
      tokenUpdateSubscription = eventEmitter.addListener('token', (event: { token: any; }) => {
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
    return NativeRadar.getMetadata();
  },
  setAnonymousTrackingEnabled: function (enabled: boolean): void {
    return NativeRadar.setAnonymousTrackingEnabled(enabled);
  },
  getPermissionsStatus: function (): Promise<RadarPermissionsStatus> {
    return NativeRadar.getPermissionsStatus();
  },
  getLocation: function (desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy): Promise<RadarLocationCallback> {
    return NativeRadar.getLocation(desiredAccuracy);
  },
  trackVerified: function (options?: RadarTrackVerifiedOptions): Promise<RadarTrackVerifiedCallback> {
    return NativeRadar.trackVerified(options);
  },
  getVerifiedLocationToken: function (): Promise<RadarTrackVerifiedCallback> {
    return NativeRadar.getVerifiedLocationToken();
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
    return NativeRadar.startTrackingVerified(options);
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
    return NativeRadar.getTrackingOptions();
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
    return NativeRadar.getTripOptions();
  },
  startTrip: function (options: RadarStartTripOptions): Promise<RadarTripCallback> {
    return NativeRadar.startTrip(options);
  },
  completeTrip: function (): Promise<RadarTripCallback> {
    return NativeRadar.completeTrip();
  },
  cancelTrip: function (): Promise<RadarTripCallback> {
    return NativeRadar.cancelTrip();
  },
  updateTrip: function (options: RadarUpdateTripOptions): Promise<RadarTripCallback> {
    return NativeRadar.updateTrip(options);
  },
  acceptEvent: function (eventId: string, verifiedPlaceId: string): void {
    return NativeRadar.acceptEvent(eventId, verifiedPlaceId);
  },
  rejectEvent: function (eventId: string): void {
    return NativeRadar.rejectEvent(eventId);
  },
  getContext: function (location?: Location): Promise<RadarContextCallback> {
    return NativeRadar.getContext(location);
  },
  searchPlaces: function (options: RadarSearchPlacesOptions): Promise<RadarSearchPlacesCallback> {
    return NativeRadar.searchPlaces(options);
  },
  searchGeofences: function (options: RadarSearchGeofencesOptions): Promise<RadarSearchGeofencesCallback> {
    return NativeRadar.searchGeofences(options);
  },
  autocomplete: function (options: RadarAutocompleteOptions): Promise<RadarAddressCallback> {
    return NativeRadar.autocomplete(options);
  },
  geocode: function (options: RadarGeocodeOptions): Promise<RadarAddressCallback> {
    return NativeRadar.geocode(options);
  },
  reverseGeocode: function (options?: RadarReverseGeocodeOptions): Promise<RadarAddressCallback> {
    return NativeRadar.reverseGeocode(options);
  },
  ipGeocode: function (): Promise<RadarIPGeocodeCallback> {
    return NativeRadar.ipGeocode();
  },
  validateAddress: function (address: RadarAddress): Promise<RadarValidateAddressCallback> {
    return NativeRadar.validateAddress(address);
  },
  getDistance: function (option: RadarGetDistanceOptions): Promise<RadarRouteCallback> {
    return NativeRadar.getDistance(option);
  },
  getMatrix: function (option: RadarGetMatrixOptions): Promise<RadarRouteMatrix> {
    return NativeRadar.getMatrix(option);
  },
  logConversion: function (options: RadarLogConversionOptions): Promise<RadarLogConversionCallback> {
    return NativeRadar.logConversion(options);
  },

  nativeSdkVersion: function (): Promise<string> {
    return NativeRadar.nativeSdkVersion();
  },
  rnSdkVersion: function (): string {
    return VERSION;
  }
}
