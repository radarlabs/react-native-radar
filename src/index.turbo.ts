import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import { version } from "../package.json";
import NativeRadar from './NativeRadar';
import type {
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
} from './@types/types';

// Create event emitter for the TurboModule
const eventEmitter = new NativeEventEmitter(NativeRadar as any);

// Core initialization and setup
const initialize = (publishableKey: string, fraud: boolean = false): void => {
    NativeRadar.initialize(publishableKey, fraud);
};

const setLogLevel = (level: RadarLogLevel): void => {
    NativeRadar.setLogLevel(level);
};

// User management
const setUserId = (userId: string): void => {
    NativeRadar.setUserId(userId);
};

const getUserId = (): Promise<string> => NativeRadar.getUserId() as Promise<string>;

const setDescription = (description: string): void => {
    NativeRadar.setDescription(description);
};

const getDescription = (): Promise<string> =>
    NativeRadar.getDescription() as Promise<string>;

const setMetadata = (metadata: RadarMetadata): void => {
    NativeRadar.setMetadata(metadata);
};

const getMetadata = (): Promise<RadarMetadata> =>
    NativeRadar.getMetadata() as Promise<RadarMetadata>;

const setAnonymousTrackingEnabled = (enabled: boolean): void =>
    NativeRadar.setAnonymousTrackingEnabled(enabled);

// Permissions
const getPermissionsStatus = (): Promise<RadarPermissionsStatus> =>
    NativeRadar.getPermissionsStatus() as Promise<RadarPermissionsStatus>;

const requestPermissions = (
    background: boolean
): Promise<RadarPermissionsStatus> =>
    NativeRadar.requestPermissions(background) as Promise<RadarPermissionsStatus>;

// Location and tracking
const getLocation = (
    desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy
): Promise<RadarLocationCallback> =>
    NativeRadar.getLocation(desiredAccuracy) as Promise<RadarLocationCallback>;

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
    return NativeRadar.trackOnce(backCompatibleOptions) as Promise<RadarTrackCallback>;
};

const trackVerified = (
    options?: RadarTrackVerifiedOptions
): Promise<RadarTrackVerifiedCallback> =>
    NativeRadar.trackVerified(options) as Promise<RadarTrackVerifiedCallback>;

const getVerifiedLocationToken = (): Promise<RadarTrackVerifiedCallback> =>
    NativeRadar.getVerifiedLocationToken() as Promise<RadarTrackVerifiedCallback>;

const clearVerifiedLocationToken = (): void =>
    NativeRadar.clearVerifiedLocationToken();

// Tracking control
const startTrackingEfficient = (): void =>
    NativeRadar.startTrackingEfficient();

const startTrackingResponsive = (): void =>
    NativeRadar.startTrackingResponsive();

const startTrackingContinuous = (): void =>
    NativeRadar.startTrackingContinuous();

const startTrackingCustom = (options: RadarTrackingOptions): void =>
    NativeRadar.startTrackingCustom(options);

const startTrackingVerified = (options?: RadarVerifiedTrackingOptions): void =>
    NativeRadar.startTrackingVerified(options);

const mockTracking = (options: RadarMockTrackingOptions): void =>
    NativeRadar.mockTracking(options);

const stopTracking = (): void => NativeRadar.stopTracking();

const stopTrackingVerified = (): void =>
    NativeRadar.stopTrackingVerified();

const isTracking = (): Promise<boolean> => NativeRadar.isTracking();

const isTrackingVerified = (): Promise<boolean> =>
    NativeRadar.isTrackingVerified();

// Product and configuration
const setProduct = (product: string): void =>
    NativeRadar.setProduct(product);

const getTrackingOptions = (): Promise<RadarTrackingOptions> =>
    NativeRadar.getTrackingOptions() as Promise<RadarTrackingOptions>;

const isUsingRemoteTrackingOptions = (): Promise<boolean> =>
    NativeRadar.isUsingRemoteTrackingOptions();

const setForegroundServiceOptions = (
    options: RadarTrackingOptionsForegroundService
): void => NativeRadar.setForegroundServiceOptions(options);

const setNotificationOptions = (options: RadarNotificationOptions): void =>
    NativeRadar.setNotificationOptions(options);

// Trip management
const getTripOptions = (): Promise<RadarTripOptions> =>
    NativeRadar.getTripOptions() as Promise<RadarTripOptions>;

const startTrip = (
    options: RadarStartTripOptions
): Promise<RadarTripCallback> => NativeRadar.startTrip(options) as Promise<RadarTripCallback>;

const completeTrip = (): Promise<RadarTripCallback> =>
    NativeRadar.completeTrip() as Promise<RadarTripCallback>;

const cancelTrip = (): Promise<RadarTripCallback> =>
    NativeRadar.cancelTrip() as Promise<RadarTripCallback>;

const updateTrip = (
    options: RadarUpdateTripOptions
): Promise<RadarTripCallback> => NativeRadar.updateTrip(options) as Promise<RadarTripCallback>;

// Event handling
const acceptEvent = (eventId: string, verifiedPlaceId: string): void =>
    NativeRadar.acceptEvent(eventId, verifiedPlaceId);

const rejectEvent = (eventId: string): void =>
    NativeRadar.rejectEvent(eventId);

// Context and search
const getContext = (location?: Location): Promise<RadarContextCallback> =>
    NativeRadar.getContext(location) as Promise<RadarContextCallback>;

const searchPlaces = (
    options: RadarSearchPlacesOptions
): Promise<RadarSearchPlacesCallback> =>
    NativeRadar.searchPlaces(options) as Promise<RadarSearchPlacesCallback>;

const searchGeofences = (
    options: RadarSearchGeofencesOptions
): Promise<RadarSearchGeofencesCallback> =>
    NativeRadar.searchGeofences(options) as Promise<RadarSearchGeofencesCallback>;

// Geocoding
const autocomplete = (
    options: RadarAutocompleteOptions
): Promise<RadarAddressCallback> => NativeRadar.autocomplete(options) as Promise<RadarAddressCallback>;

const geocode = (options: RadarGeocodeOptions): Promise<RadarAddressCallback> =>
    NativeRadar.geocode(options) as Promise<RadarAddressCallback>;

const reverseGeocode = (
    options?: RadarReverseGeocodeOptions
): Promise<RadarAddressCallback> =>
    NativeRadar.reverseGeocode(options) as Promise<RadarAddressCallback>;

const ipGeocode = (): Promise<RadarIPGeocodeCallback> =>
    NativeRadar.ipGeocode() as Promise<RadarIPGeocodeCallback>;

const validateAddress = (address: RadarAddress): Promise<RadarValidateAddressCallback> =>
    NativeRadar.validateAddress(address) as Promise<RadarValidateAddressCallback>;

// Routing
const getDistance = (
    options: RadarGetDistanceOptions
): Promise<RadarRouteCallback> => NativeRadar.getDistance(options) as Promise<RadarRouteCallback>;

const getMatrix = (options: RadarGetMatrixOptions): Promise<RadarRouteMatrix> =>
    NativeRadar.getMatrix(options) as Promise<RadarRouteMatrix>;

// Analytics
const logConversion = (
    options: RadarLogConversionOptions
): Promise<RadarLogConversionCallback> =>
    NativeRadar.logConversion(options) as Promise<RadarLogConversionCallback>;

const sendEvent = (name: string, metadata: RadarMetadata): void =>
    NativeRadar.sendEvent(name, metadata);

// SDK info
const nativeSdkVersion = (): Promise<string> =>
    NativeRadar.nativeSdkVersion();

const rnSdkVersion = (): string => version;

// Event listener interface - wrapping TurboModule addListener/removeListeners
const on = (
    channel: RadarEventChannel,
    callback: RadarListenerCallback
): EmitterSubscription => eventEmitter.addListener(channel, callback);

const off = (
    channel: RadarEventChannel,
    callback?: Function | undefined
): void => {
    if (callback) {
        eventEmitter.removeAllListeners(channel);
    } else {
        eventEmitter.removeAllListeners(channel);
    }
};

export default {
    // Core initialization and setup
    initialize,
    setLogLevel,

    // User management
    setUserId,
    getUserId,
    setDescription,
    getDescription,
    setMetadata,
    getMetadata,
    setAnonymousTrackingEnabled,

    // Permissions
    getPermissionsStatus,
    requestPermissions,

    // Location and tracking
    getLocation,
    trackOnce,
    trackVerified,
    getVerifiedLocationToken,
    clearVerifiedLocationToken,

    // Tracking control
    startTrackingEfficient,
    startTrackingResponsive,
    startTrackingContinuous,
    startTrackingCustom,
    startTrackingVerified,
    mockTracking,
    stopTracking,
    stopTrackingVerified,
    isTracking,
    isTrackingVerified,

    // Product and configuration
    setProduct,
    getTrackingOptions,
    isUsingRemoteTrackingOptions,
    setForegroundServiceOptions,
    setNotificationOptions,

    // Trip management
    getTripOptions,
    startTrip,
    completeTrip,
    cancelTrip,
    updateTrip,

    // Event handling
    acceptEvent,
    rejectEvent,

    // Context and search
    getContext,
    searchPlaces,
    searchGeofences,

    // Geocoding
    autocomplete,
    geocode,
    reverseGeocode,
    ipGeocode,
    validateAddress,

    // Routing
    getDistance,
    getMatrix,

    // Analytics
    logConversion,
    sendEvent,

    // SDK info
    nativeSdkVersion,
    rnSdkVersion,

    // Event listeners
    on,
    off,
}; 