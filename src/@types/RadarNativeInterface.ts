import {
  Location,
  RadarAddress,
  RadarAddressCallback,
  RadarAutocompleteOptions,
  RadarContextCallback,
  RadarEventChannel,
  RadarGeocodeOptions,
  RadarGetDistanceOptions,
  RadarGetMatrixOptions,
  RadarIPGeocodeCallback,
  RadarListenerCallback,
  RadarLocationCallback,
  RadarLogConversionCallback,
  RadarLogConversionOptions,
  RadarLogLevel,
  RadarMetadata,
  RadarMockTrackingOptions,
  RadarNotificationOptions,
  RadarPermissionsStatus,
  RadarReverseGeocodeOptions,
  RadarRouteCallback,
  RadarRouteMatrix,
  RadarSearchGeofencesCallback,
  RadarSearchGeofencesOptions,
  RadarSearchPlacesCallback,
  RadarSearchPlacesOptions,
  RadarStartTripOptions,
  RadarTrackCallback,
  RadarTrackingOptions,
  RadarTrackingOptionsDesiredAccuracy,
  RadarTrackingOptionsForegroundService,
  RadarTrackOnceOptions,
  RadarTrackVerifiedCallback,
  RadarTrackVerifiedOptions,
  RadarTripCallback,
  RadarTripOptions,
  RadarUpdateTripOptions,
  RadarValidateAddressCallback,
  RadarVerifiedTrackingOptions,
} from "./types";

export interface RadarNativeInterface {
  initialize: (publishableKey: string, fraud?: boolean) => void;
  setLogLevel: (level: RadarLogLevel) => void;
  setUserId: (userId: string) => void;
  getUserId: () => Promise<string>;
  setDescription: (description: string) => void;
  getDescription: () => Promise<string>;
  setMetadata: (metadata: RadarMetadata) => void;
  getMetadata: () => Promise<RadarMetadata>;
  setAnonymousTrackingEnabled: (enabled: boolean) => void;
  getPermissionsStatus: () => Promise<RadarPermissionsStatus>;
  requestPermissions: (background: boolean) => Promise<RadarPermissionsStatus>;
  getLocation: (
    desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy
  ) => Promise<RadarLocationCallback>;
  trackOnce: (
    options?: RadarTrackOnceOptions | Location
  ) => Promise<RadarTrackCallback>;
  trackVerified: (options?: RadarTrackVerifiedOptions) => Promise<RadarTrackVerifiedCallback>;
  getVerifiedLocationToken: () => Promise<RadarTrackVerifiedCallback>;
  clearVerifiedLocationToken: () => void;
  startTrackingEfficient: () => void;
  startTrackingResponsive: () => void;
  startTrackingContinuous: () => void;
  startTrackingCustom: (options: RadarTrackingOptions) => void;
  startTrackingVerified: (options?: RadarVerifiedTrackingOptions) => void;
  mockTracking: (options: RadarMockTrackingOptions) => void;
  stopTracking: () => void;
  stopTrackingVerified: () => void;
  getTrackingOptions: () => Promise<RadarTrackingOptions>;
  isUsingRemoteTrackingOptions: () => Promise<boolean>;
  isTracking: () => Promise<boolean>;
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
  ) => Promise<RadarAddressCallback>;
  geocode: (options: RadarGeocodeOptions) => Promise<RadarAddressCallback>;
  reverseGeocode: (options?: RadarReverseGeocodeOptions) => Promise<RadarAddressCallback>;
  ipGeocode: () => Promise<RadarIPGeocodeCallback>;
  validateAddress: (address: RadarAddress) => Promise<RadarValidateAddressCallback>;
  getDistance: (option: RadarGetDistanceOptions) => Promise<RadarRouteCallback>;
  getMatrix: (option: RadarGetMatrixOptions) => Promise<RadarRouteMatrix>;
  logConversion: (
    options: RadarLogConversionOptions
  ) => Promise<RadarLogConversionCallback>;
  
  sendEvent: (name: string, metadata: RadarMetadata) => void;
  on: (channel: RadarEventChannel, callback: RadarListenerCallback) => void;
  off: (channel: RadarEventChannel, callback?: Function | undefined) => void;
  nativeSdkVersion: () => Promise<string>;
  rnSdkVersion: () => string;
}
