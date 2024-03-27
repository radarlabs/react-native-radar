"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const package_json_1 = require("../package.json");
if (!react_native_1.NativeModules.RNRadar &&
    (react_native_1.Platform.OS === "ios" || react_native_1.Platform.OS === "android")) {
    throw new Error("NativeModules.RNRadar is undefined");
}
const eventEmitter = new react_native_1.NativeEventEmitter(react_native_1.NativeModules.RNRadar);
const initialize = (publishableKey, fraud = false) => {
    react_native_1.NativeModules.RNRadar.initialize(publishableKey, fraud);
};
const setLogLevel = (level) => {
    react_native_1.NativeModules.RNRadar.setLogLevel(level);
};
const setUserId = (userId) => {
    react_native_1.NativeModules.RNRadar.setUserId(userId);
};
const getUserId = () => react_native_1.NativeModules.RNRadar.getUserId();
const setDescription = (description) => {
    react_native_1.NativeModules.RNRadar.setDescription(description);
};
const getDescription = () => react_native_1.NativeModules.RNRadar.getDescription();
const setMetadata = (metadata) => {
    react_native_1.NativeModules.RNRadar.setMetadata(metadata);
};
const getMetadata = () => react_native_1.NativeModules.RNRadar.getMetadata();
const setAnonymousTrackingEnabled = (enabled) => react_native_1.NativeModules.RNRadar.setAnonymousTrackingEnabled(enabled);
const getPermissionsStatus = () => react_native_1.NativeModules.RNRadar.getPermissionsStatus();
const requestPermissions = (background) => react_native_1.NativeModules.RNRadar.requestPermissions(background);
const getLocation = (desiredAccuracy) => react_native_1.NativeModules.RNRadar.getLocation(desiredAccuracy);
const trackOnce = (options) => {
    let backCompatibleOptions = options;
    if (options && "latitude" in options) {
        backCompatibleOptions = {
            location: Object.assign({}, options),
        };
    }
    return react_native_1.NativeModules.RNRadar.trackOnce(backCompatibleOptions);
};
const trackVerified = (options) => react_native_1.NativeModules.RNRadar.trackVerified(options);
const trackVerifiedToken = (options) => react_native_1.NativeModules.RNRadar.trackVerifiedToken(options);
const startTrackingEfficient = () => react_native_1.NativeModules.RNRadar.startTrackingEfficient();
const startTrackingResponsive = () => react_native_1.NativeModules.RNRadar.startTrackingResponsive();
const startTrackingContinuous = () => react_native_1.NativeModules.RNRadar.startTrackingContinuous();
const startTrackingCustom = (options) => react_native_1.NativeModules.RNRadar.startTrackingCustom(options);
const startTrackingVerified = (options) => react_native_1.NativeModules.RNRadar.startTrackingVerified(options);
const mockTracking = (options) => react_native_1.NativeModules.RNRadar.mockTracking(options);
const stopTracking = () => react_native_1.NativeModules.RNRadar.stopTracking();
const getTrackingOptions = () => react_native_1.NativeModules.RNRadar.getTrackingOptions();
const isUsingRemoteTrackingOptions = () => react_native_1.NativeModules.RNRadar.isUsingRemoteTrackingOptions();
const isTracking = () => react_native_1.NativeModules.RNRadar.isTracking();
const setForegroundServiceOptions = (options) => react_native_1.NativeModules.RNRadar.setForegroundServiceOptions(options);
const setNotificationOptions = (options) => react_native_1.NativeModules.RNRadar.setNotificationOptions(options);
const getTripOptions = () => react_native_1.NativeModules.RNRadar.getTripOptions();
const startTrip = (options) => react_native_1.NativeModules.RNRadar.startTrip(options);
const completeTrip = () => react_native_1.NativeModules.RNRadar.completeTrip();
const cancelTrip = () => react_native_1.NativeModules.RNRadar.cancelTrip();
const updateTrip = (options) => react_native_1.NativeModules.RNRadar.updateTrip(options);
const acceptEvent = (eventId, verifiedPlaceId) => react_native_1.NativeModules.RNRadar.acceptEvent(eventId, verifiedPlaceId);
const rejectEvent = (eventId) => react_native_1.NativeModules.RNRadar.rejectEvent(eventId);
const getContext = (location) => react_native_1.NativeModules.RNRadar.getContext(location);
const searchPlaces = (options) => react_native_1.NativeModules.RNRadar.searchPlaces(options);
const searchGeofences = (options) => react_native_1.NativeModules.RNRadar.searchGeofences(options);
const autocomplete = (options) => react_native_1.NativeModules.RNRadar.autocomplete(options);
const geocode = (address) => react_native_1.NativeModules.RNRadar.geocode(address);
const reverseGeocode = (location) => react_native_1.NativeModules.RNRadar.reverseGeocode(location);
const ipGeocode = () => react_native_1.NativeModules.RNRadar.ipGeocode();
const getDistance = (options) => react_native_1.NativeModules.RNRadar.getDistance(options);
const getMatrix = (options) => react_native_1.NativeModules.RNRadar.getMatrix(options);
const logConversion = (options) => react_native_1.NativeModules.RNRadar.logConversion(options);
const sendEvent = (name, metadata) => react_native_1.NativeModules.RNRadar.sendEvent(name, metadata);
const on = (channel, callback) => eventEmitter.addListener(channel, callback);
const off = (channel, callback) => {
    if (callback) {
        // @ts-ignore
        eventEmitter.removeListener(channel, callback);
    }
    else {
        eventEmitter.removeAllListeners(channel);
    }
};
const nativeSdkVersion = () => react_native_1.NativeModules.RNRadar.nativeSdkVersion();
const rnSdkVersion = () => package_json_1.version;
const Radar = {
    initialize,
    setLogLevel,
    setUserId,
    getUserId,
    setDescription,
    getDescription,
    setMetadata,
    getMetadata,
    setAnonymousTrackingEnabled,
    isUsingRemoteTrackingOptions,
    getPermissionsStatus,
    requestPermissions,
    getLocation,
    trackOnce,
    trackVerified,
    trackVerifiedToken,
    startTrackingEfficient,
    startTrackingResponsive,
    startTrackingContinuous,
    startTrackingCustom,
    startTrackingVerified,
    mockTracking,
    stopTracking,
    isTracking,
    getTrackingOptions,
    setForegroundServiceOptions,
    setNotificationOptions,
    acceptEvent,
    rejectEvent,
    getTripOptions,
    startTrip,
    updateTrip,
    completeTrip,
    cancelTrip,
    getContext,
    searchPlaces,
    searchGeofences,
    autocomplete,
    geocode,
    reverseGeocode,
    ipGeocode,
    getDistance,
    getMatrix,
    logConversion,
    sendEvent,
    on,
    off,
    nativeSdkVersion,
    rnSdkVersion,
};
exports.default = Radar;
