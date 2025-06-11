import { EmitterSubscription, NativeEventEmitter, NativeModules, Platform } from "react-native";
import { version } from "../package.json";
import { RadarNativeInterface } from "./@types/RadarNativeInterface";
import {
  Location,
  RadarAutocompleteOptions,
  RadarContextCallback,
  RadarAddressCallback,
  RadarEventChannel,
  RadarGeocodeOptions,
  RadarGetDistanceOptions,
  RadarLocationCallback,
  RadarLogConversionCallback,
  RadarLogConversionOptions,
  RadarLogLevel,
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
  RadarTrackOnceOptions,
  RadarTrackingOptions,
  RadarTrackingOptionsDesiredAccuracy,
  RadarTrackingOptionsForegroundService,
  RadarTripCallback,
  RadarTripOptions,
  RadarUpdateTripOptions,
  RadarVerifiedTrackingOptions,
  RadarListenerCallback,
  RadarGetMatrixOptions,
  RadarMetadata,
  RadarIPGeocodeCallback,
  RadarTrackVerifiedOptions,
  RadarTrackVerifiedCallback,
  RadarValidateAddressCallback,
  RadarAddress,
} from "./@types/types";

if (
  !NativeModules.RNRadar &&
  (Platform.OS === "ios" || Platform.OS === "android")
) {
  throw new Error("NativeModules.RNRadar is undefined");
}

const eventEmitter = new NativeEventEmitter(NativeModules.RNRadar);

const initialize = (publishableKey: string, fraud: boolean = false): void => {
  NativeModules.RNRadar.initialize(publishableKey, fraud);
};

const setLogLevel = (level: RadarLogLevel): void => {
  NativeModules.RNRadar.setLogLevel(level);
};

const setUserId = (userId: string): void => {
  NativeModules.RNRadar.setUserId(userId);
};

const getUserId = (): Promise<string> => NativeModules.RNRadar.getUserId();

const setDescription = (description: string): void => {
  NativeModules.RNRadar.setDescription(description);
};

const getDescription = (): Promise<string> =>
  NativeModules.RNRadar.getDescription();

const setMetadata = (metadata: RadarMetadata): void => {
  NativeModules.RNRadar.setMetadata(metadata);
};

const getMetadata = (): Promise<RadarMetadata> =>
  NativeModules.RNRadar.getMetadata();

const setProduct = (product: string): void => {
  NativeModules.RNRadar.setProduct(product);
};

const getProduct = (): Promise<string> =>
  NativeModules.RNRadar.getProduct();

const setAnonymousTrackingEnabled = (enabled: boolean): void =>
  NativeModules.RNRadar.setAnonymousTrackingEnabled(enabled);

const getPermissionsStatus = (): Promise<RadarPermissionsStatus> =>
  NativeModules.RNRadar.getPermissionsStatus();

const requestPermissions = (
  background: boolean
): Promise<RadarPermissionsStatus> =>
  NativeModules.RNRadar.requestPermissions(background);

const getLocation = (
  desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy
): Promise<RadarLocationCallback> =>
  NativeModules.RNRadar.getLocation(desiredAccuracy);

const trackOnce = (
  options?: RadarTrackOnceOptions | Location
): Promise<RadarTrackCallback> => {
  let backCompatibleOptions = options;
  if (options && "latitude" in options) {
    backCompatibleOptions = {
      location: {
        ...options,
      },
    };
  }
  return NativeModules.RNRadar.trackOnce(backCompatibleOptions);
};

const trackVerified = (
  options?: RadarTrackVerifiedOptions
): Promise<RadarTrackVerifiedCallback> =>
  NativeModules.RNRadar.trackVerified(options);

const getVerifiedLocationToken = (): Promise<RadarTrackVerifiedCallback> =>
  NativeModules.RNRadar.getVerifiedLocationToken();

const clearVerifiedLocationToken = (): void =>
  NativeModules.RNRadar.clearVerifiedLocationToken();

const startTrackingEfficient = (): void =>
  NativeModules.RNRadar.startTrackingEfficient();

const startTrackingResponsive = (): void =>
  NativeModules.RNRadar.startTrackingResponsive();

const startTrackingContinuous = (): void =>
  NativeModules.RNRadar.startTrackingContinuous();

const startTrackingCustom = (options: RadarTrackingOptions): void =>
  NativeModules.RNRadar.startTrackingCustom(options);

const startTrackingVerified = (options?: RadarVerifiedTrackingOptions): void =>
  NativeModules.RNRadar.startTrackingVerified(options);

const mockTracking = (options: RadarMockTrackingOptions): void =>
  NativeModules.RNRadar.mockTracking(options);

const stopTracking = (): void => NativeModules.RNRadar.stopTracking();

const stopTrackingVerified = (): void =>
  NativeModules.RNRadar.stopTrackingVerified();

const isTracking = (): Promise<boolean> => NativeModules.RNRadar.isTracking();

const isTrackingVerified = (): Promise<boolean> =>
  NativeModules.RNRadar.isTrackingVerified();

const getTrackingOptions = (): Promise<RadarTrackingOptions> =>
  NativeModules.RNRadar.getTrackingOptions();

const isUsingRemoteTrackingOptions = (): Promise<boolean> =>
  NativeModules.RNRadar.isUsingRemoteTrackingOptions();

const setForegroundServiceOptions = (
  options: RadarTrackingOptionsForegroundService
): void => NativeModules.RNRadar.setForegroundServiceOptions(options);

const setNotificationOptions = (options: RadarNotificationOptions): void =>
  NativeModules.RNRadar.setNotificationOptions(options);

const getTripOptions = (): Promise<RadarTripOptions> =>
  NativeModules.RNRadar.getTripOptions();

const startTrip = (
  options: RadarStartTripOptions
): Promise<RadarTripCallback> => NativeModules.RNRadar.startTrip(options);

const completeTrip = (): Promise<RadarTripCallback> =>
  NativeModules.RNRadar.completeTrip();

const cancelTrip = (): Promise<RadarTripCallback> =>
  NativeModules.RNRadar.cancelTrip();

const updateTrip = (
  options: RadarUpdateTripOptions
): Promise<RadarTripCallback> => NativeModules.RNRadar.updateTrip(options);

const acceptEvent = (eventId: string, verifiedPlaceId: string): void =>
  NativeModules.RNRadar.acceptEvent(eventId, verifiedPlaceId);

const rejectEvent = (eventId: string): void =>
  NativeModules.RNRadar.rejectEvent(eventId);

const getContext = (location?: Location): Promise<RadarContextCallback> =>
  NativeModules.RNRadar.getContext(location);

const searchPlaces = (
  options: RadarSearchPlacesOptions
): Promise<RadarSearchPlacesCallback> =>
  NativeModules.RNRadar.searchPlaces(options);

const searchGeofences = (
  options: RadarSearchGeofencesOptions
): Promise<RadarSearchGeofencesCallback> =>
  NativeModules.RNRadar.searchGeofences(options);

const autocomplete = (
  options: RadarAutocompleteOptions
): Promise<RadarAddressCallback> => NativeModules.RNRadar.autocomplete(options);

const geocode = (options: RadarGeocodeOptions): Promise<RadarAddressCallback> =>
  NativeModules.RNRadar.geocode(options);

const reverseGeocode = (
  options?: RadarReverseGeocodeOptions
): Promise<RadarAddressCallback> =>
  NativeModules.RNRadar.reverseGeocode(options);

const ipGeocode = (): Promise<RadarIPGeocodeCallback> =>
  NativeModules.RNRadar.ipGeocode();

const validateAddress = (address: RadarAddress): Promise<RadarValidateAddressCallback> =>
  NativeModules.RNRadar.validateAddress(address);

const getDistance = (
  options: RadarGetDistanceOptions
): Promise<RadarRouteCallback> => NativeModules.RNRadar.getDistance(options);

const getMatrix = (options: RadarGetMatrixOptions): Promise<RadarRouteMatrix> =>
  NativeModules.RNRadar.getMatrix(options);

const logConversion = (
  options: RadarLogConversionOptions
): Promise<RadarLogConversionCallback> =>
  NativeModules.RNRadar.logConversion(options);

const sendEvent = (name: string, metadata: RadarMetadata): void =>
  NativeModules.RNRadar.sendEvent(name, metadata);

const on = (
  channel: RadarEventChannel,
  callback: RadarListenerCallback
): EmitterSubscription => eventEmitter.addListener(channel, callback);

const off = (
  channel: RadarEventChannel,
  callback?: Function | undefined
): void => {
  if (callback) {
    // @ts-ignore
    eventEmitter.removeListener(channel, callback);
  } else {
    eventEmitter.removeAllListeners(channel);
  }
};

const nativeSdkVersion = (): Promise<string> =>
  NativeModules.RNRadar.nativeSdkVersion();

const rnSdkVersion = (): string => version;

const Radar: RadarNativeInterface = {
  initialize,
  setLogLevel,
  setUserId,
  getUserId,
  setDescription,
  getDescription,
  setMetadata,
  getMetadata,
  setProduct,
  getProduct,
  setAnonymousTrackingEnabled,
  getPermissionsStatus,
  requestPermissions,
  getLocation,
  trackOnce,
  trackVerified,
  isTrackingVerified,
  getVerifiedLocationToken,
  clearVerifiedLocationToken,
  startTrackingEfficient,
  startTrackingResponsive,
  startTrackingContinuous,
  startTrackingCustom,
  startTrackingVerified,
  mockTracking,
  stopTracking,
  stopTrackingVerified,
  isTracking,
  getTrackingOptions,
  isUsingRemoteTrackingOptions,
  setForegroundServiceOptions,
  setNotificationOptions,
  getTripOptions,
  startTrip,
  completeTrip,
  cancelTrip,
  updateTrip,
  acceptEvent,
  rejectEvent,
  getContext,
  searchPlaces,
  searchGeofences,
  autocomplete,
  geocode,
  reverseGeocode,
  ipGeocode,
  validateAddress,
  getDistance,
  getMatrix,
  logConversion,
  sendEvent,
  on,
  off,
  nativeSdkVersion,
  rnSdkVersion,
};

export default Radar;
