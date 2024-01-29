import {
  Location,
  RadarAutocompleteOptions,
  RadarContextCallback,
  RadarGeocodeCallback,
  RadarGetDistanceOptions,
  RadarLocationCallback,
  RadarLogConversionCallback,
  RadarLogConversionOptions,
  RadarLogLevel,
  RadarMockTrackingOptions,
  RadarNotificationOptions,
  RadarPermissionsStatus,
  RadarRouteCallback,
  RadarRouteMatrix,
  RadarSearchGeofencesCallback,
  RadarSearchGeofencesOptions,
  RadarSearchPlacesCallback,
  RadarSearchPlacesOptions,
  RadarStartTripOptions,
  RadarTrackCallback,
  RadarTrackOnceOptions,
  RadarTrackTokenCallback,
  RadarTrackingOptions,
  RadarTrackingOptionsDesiredAccuracy,
  RadarTrackingOptionsForegroundService,
  RadarTripCallback,
  RadarTripOptions,
  RadarUpdateTripOptions,
  Event,
} from "./types";

export interface RadarNativeInterface {
  initialize: (publishableKey: string, fraud: boolean) => void;
  setLogLevel: (level: RadarLogLevel) => void;
  setUserId: (userId: string) => void;
  getUserId: () => Promise<string>;
  setDescription: (description: string) => void;
  getDescription: () => Promise<string>;
  setMetadata: (metadata: object) => void;
  getMetadata: () => Promise<object>;
  setAnonymousTrackingEnabled: (enabled: boolean) => void;
  getPermissionsStatus: () => Promise<RadarPermissionsStatus>;
  requestPermissions: (background: boolean) => Promise<RadarPermissionsStatus>;
  getLocation: (
    desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy
  ) => Promise<RadarLocationCallback>;
  trackOnce: (
    options?: RadarTrackOnceOptions | Location
  ) => Promise<RadarTrackCallback>;
  trackVerifiedToken: () => Promise<RadarTrackTokenCallback>;
  trackVerified: () => Promise<RadarTrackCallback>;
  startTrackingEfficient: () => void;
  startTrackingResponsive: () => void;
  startTrackingContinuous: () => void;
  startTrackingCustom: (options: RadarTrackingOptions) => void;
  mockTracking: (options: RadarMockTrackingOptions) => void;
  stopTracking: () => void;
  getTrackingOptions: () => Promise<RadarTrackingOptions>;
  isUsingRemoteTrackingOptions: () => Promise<boolean>;
  isTracking: () => boolean;
  setForegroundServiceOptions: (
    options: RadarTrackingOptionsForegroundService
  ) => void;
  setNotificationOptions: (options: RadarNotificationOptions) => void;
  getTripOptions: () => Promise<RadarTripOptions>;
  startTrip: (options: RadarStartTripOptions) => Promise<RadarTripCallback>;
  completeTrip: () => Promise<RadarTripCallback>;
  cancelTrip: () => Promise<RadarTripCallback>;
  updateTrip: (options: RadarUpdateTripOptions) => Promise<RadarTripCallback>;
  acceptEvent: (eventId: string, verifiedPlaceId: string) => void;
  rejectEvent: (eventId: string) => void;
  getContext: (location?: Location) => Promise<RadarContextCallback>;
  searchPlaces: (
    options: RadarSearchPlacesOptions
  ) => Promise<RadarSearchPlacesCallback>;
  searchGeofences: (
    options: RadarSearchGeofencesOptions
  ) => Promise<RadarSearchGeofencesCallback>;
  autocomplete: (
    options: RadarAutocompleteOptions
  ) => Promise<RadarGeocodeCallback>;
  geocode: (address: string) => Promise<RadarGeocodeCallback>;
  reverseGeocode: (location: any) => Promise<RadarGeocodeCallback>;
  ipGeocode: () => Promise<RadarGeocodeCallback>;
  getDistance: (option: RadarGetDistanceOptions) => Promise<RadarRouteCallback>;
  getMatrix: (option: RadarGetDistanceOptions) => Promise<RadarRouteMatrix>;
  logConversion: (
    options: RadarLogConversionOptions
  ) => Promise<RadarLogConversionCallback>;
  sendEvent: (name: string, metadata: Object) => void;
  on: (event: Event, callback: Function | undefined) => void;
  off: (event: Event, callback: Function | undefined) => void;
  nativeSdkVersion: () => Promise<string>;
  rnSdkVersion: () => string;
}
