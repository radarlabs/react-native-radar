import type {
  RadarPermissionsStatus,
  RadarTrackCallback,
  RadarTrackOnceOptions,
  RadarLocationUpdateCallback,
  RadarClientLocationUpdateCallback,
  RadarErrorCallback,
  RadarLogUpdateCallback,
  RadarEventUpdateCallback,
  RadarTokenUpdateCallback,
  RadarLogLevel,
  RadarMetadata,
  RadarTrackingOptionsDesiredAccuracy,
  RadarLocationCallback,
  RadarTrackVerifiedCallback,
  RadarTrackVerifiedOptions,
  RadarTrackingOptions,
  RadarVerifiedTrackingOptions,
  RadarMockTrackingOptions,
  RadarTrackingOptionsForegroundService,
  RadarNotificationOptions,
  RadarTripOptions,
  RadarStartTripOptions,
  RadarTripCallback,
  RadarUpdateTripOptions,
  RadarContextCallback,
  RadarSearchPlacesOptions,
  RadarSearchPlacesCallback,
  RadarSearchGeofencesCallback,
  RadarSearchGeofencesOptions,
  RadarAutocompleteOptions,
  RadarAddressCallback,
  RadarReverseGeocodeOptions,
  RadarGeocodeOptions,
  RadarValidateAddressCallback,
  RadarIPGeocodeCallback,
  RadarAddress,
  RadarLogConversionOptions,
  RadarGetDistanceOptions,
  RadarRouteCallback,
  RadarGetMatrixOptions,
  RadarLogConversionCallback,
  RadarRouteMatrix,
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
    options?: RadarTrackOnceOptions
  ) => Promise<RadarTrackCallback>;
  trackVerified: (options?: RadarTrackVerifiedOptions) => Promise<RadarTrackVerifiedCallback>;
  getVerifiedLocationToken: () => Promise<RadarTrackVerifiedCallback>;
  clearVerifiedLocationToken: () => void;
  startTrackingEfficient: () => void;
  startTrackingResponsive: () => void;
  startTrackingContinuous: () => void;
  startTrackingCustom: (options: RadarTrackingOptions) => void;
  startTrackingVerified: (options?: RadarVerifiedTrackingOptions) => void;
  isTrackingVerified: () => Promise<boolean>;
  setProduct(product: string): void;
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
  nativeSdkVersion: () => Promise<string>;
  rnSdkVersion: () => string;
  
  onLocationUpdate: (callback: RadarLocationUpdateCallback) => void;
  clearLocationUpdate: () => void;
  onClientLocationUpdate: (callback: RadarClientLocationUpdateCallback) => void;
  clearClientLocationUpdate: () => void;
  onError: (callback: RadarErrorCallback) => void;
  clearError: () => void;
  onLog: (callback: RadarLogUpdateCallback) => void;
  clearLog: () => void;
  onEventUpdate: (callback: RadarEventUpdateCallback) => void;
  clearEventUpdate: () => void;
  onTokenUpdate: (callback: RadarTokenUpdateCallback) => void;
  clearTokenUpdate: () => void;
}
