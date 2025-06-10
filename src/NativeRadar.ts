import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    // Core initialization and setup
    initialize(publishableKey: string, fraud?: boolean): void;
    setLogLevel(level: string): void;

    // User management
    setUserId(userId: string): void;
    getUserId(): Promise<string | null>;
    setDescription(description: string): void;
    getDescription(): Promise<string | null>;
    setMetadata(metadata: Object): void;
    getMetadata(): Promise<Object>;
    setAnonymousTrackingEnabled(enabled: boolean): void;

    // Permissions
    getPermissionsStatus(): Promise<string>;
    requestPermissions(background: boolean): Promise<string>;

    // Location and tracking
    getLocation(desiredAccuracy?: string): Promise<Object>;
    trackOnce(options?: Object): Promise<Object>;
    trackVerified(options?: Object): Promise<Object>;
    getVerifiedLocationToken(): Promise<Object>;
    clearVerifiedLocationToken(): void;

    // Tracking control
    startTrackingEfficient(): void;
    startTrackingResponsive(): void;
    startTrackingContinuous(): void;
    startTrackingCustom(options: Object): void;
    startTrackingVerified(options?: Object): void;
    mockTracking(options: Object): void;
    stopTracking(): void;
    stopTrackingVerified(): void;
    isTracking(): Promise<boolean>;
    isTrackingVerified(): Promise<boolean>;

    // Product and configuration
    setProduct(product: string): void;
    getTrackingOptions(): Promise<Object>;
    isUsingRemoteTrackingOptions(): Promise<boolean>;
    setForegroundServiceOptions(options: Object): void;
    setNotificationOptions(options: Object): void;

    // Trip management
    getTripOptions(): Promise<Object>;
    startTrip(options: Object): Promise<Object>;
    completeTrip(): Promise<Object>;
    cancelTrip(): Promise<Object>;
    updateTrip(options: Object): Promise<Object>;

    // Event handling
    acceptEvent(eventId: string, verifiedPlaceId: string): void;
    rejectEvent(eventId: string): void;

    // Context and search
    getContext(location?: Object): Promise<Object>;
    searchPlaces(options: Object): Promise<Object>;
    searchGeofences(options: Object): Promise<Object>;

    // Geocoding
    autocomplete(options: Object): Promise<Object>;
    geocode(options: Object): Promise<Object>;
    reverseGeocode(options?: Object): Promise<Object>;
    ipGeocode(): Promise<Object>;
    validateAddress(address: Object): Promise<Object>;

    // Routing
    getDistance(options: Object): Promise<Object>;
    getMatrix(options: Object): Promise<Object>;

    // Analytics
    logConversion(options: Object): Promise<Object>;
    sendEvent(name: string, metadata: Object): void;

    // SDK info
    nativeSdkVersion(): Promise<string>;

    // Event listener support - using standard TurboModule pattern
    addListener(eventName: string): void;
    removeListeners(count: number): void;
}

// Lazy initialization to avoid accessing TurboModuleRegistry during import
let _nativeModule: Spec | null = null;

const getNativeModule = (): Spec => {
    if (_nativeModule === null) {
        _nativeModule = TurboModuleRegistry.getEnforcing<Spec>('RNRadar');
    }
    return _nativeModule;
};

// Create a proxy object that lazily accesses the TurboModule
const LazyNativeRadar: Spec = {
    // Core initialization and setup
    initialize: (publishableKey, fraud) => getNativeModule().initialize(publishableKey, fraud),
    setLogLevel: (level) => getNativeModule().setLogLevel(level),

    // User management
    setUserId: (userId) => getNativeModule().setUserId(userId),
    getUserId: () => getNativeModule().getUserId(),
    setDescription: (description) => getNativeModule().setDescription(description),
    getDescription: () => getNativeModule().getDescription(),
    setMetadata: (metadata) => getNativeModule().setMetadata(metadata),
    getMetadata: () => getNativeModule().getMetadata(),
    setAnonymousTrackingEnabled: (enabled) => getNativeModule().setAnonymousTrackingEnabled(enabled),

    // Permissions
    getPermissionsStatus: () => getNativeModule().getPermissionsStatus(),
    requestPermissions: (background) => getNativeModule().requestPermissions(background),

    // Location and tracking
    getLocation: (desiredAccuracy) => getNativeModule().getLocation(desiredAccuracy),
    trackOnce: (options) => getNativeModule().trackOnce(options),
    trackVerified: (options) => getNativeModule().trackVerified(options),
    getVerifiedLocationToken: () => getNativeModule().getVerifiedLocationToken(),
    clearVerifiedLocationToken: () => getNativeModule().clearVerifiedLocationToken(),

    // Tracking control
    startTrackingEfficient: () => getNativeModule().startTrackingEfficient(),
    startTrackingResponsive: () => getNativeModule().startTrackingResponsive(),
    startTrackingContinuous: () => getNativeModule().startTrackingContinuous(),
    startTrackingCustom: (options) => getNativeModule().startTrackingCustom(options),
    startTrackingVerified: (options) => getNativeModule().startTrackingVerified(options),
    mockTracking: (options) => getNativeModule().mockTracking(options),
    stopTracking: () => getNativeModule().stopTracking(),
    stopTrackingVerified: () => getNativeModule().stopTrackingVerified(),
    isTracking: () => getNativeModule().isTracking(),
    isTrackingVerified: () => getNativeModule().isTrackingVerified(),

    // Product and configuration
    setProduct: (product) => getNativeModule().setProduct(product),
    getTrackingOptions: () => getNativeModule().getTrackingOptions(),
    isUsingRemoteTrackingOptions: () => getNativeModule().isUsingRemoteTrackingOptions(),
    setForegroundServiceOptions: (options) => getNativeModule().setForegroundServiceOptions(options),
    setNotificationOptions: (options) => getNativeModule().setNotificationOptions(options),

    // Trip management
    getTripOptions: () => getNativeModule().getTripOptions(),
    startTrip: (options) => getNativeModule().startTrip(options),
    completeTrip: () => getNativeModule().completeTrip(),
    cancelTrip: () => getNativeModule().cancelTrip(),
    updateTrip: (options) => getNativeModule().updateTrip(options),

    // Event handling
    acceptEvent: (eventId, verifiedPlaceId) => getNativeModule().acceptEvent(eventId, verifiedPlaceId),
    rejectEvent: (eventId) => getNativeModule().rejectEvent(eventId),

    // Context and search
    getContext: (location) => getNativeModule().getContext(location),
    searchPlaces: (options) => getNativeModule().searchPlaces(options),
    searchGeofences: (options) => getNativeModule().searchGeofences(options),

    // Geocoding
    autocomplete: (options) => getNativeModule().autocomplete(options),
    geocode: (options) => getNativeModule().geocode(options),
    reverseGeocode: (options) => getNativeModule().reverseGeocode(options),
    ipGeocode: () => getNativeModule().ipGeocode(),
    validateAddress: (address) => getNativeModule().validateAddress(address),

    // Routing
    getDistance: (options) => getNativeModule().getDistance(options),
    getMatrix: (options) => getNativeModule().getMatrix(options),

    // Analytics
    logConversion: (options) => getNativeModule().logConversion(options),
    sendEvent: (name, metadata) => getNativeModule().sendEvent(name, metadata),

    // SDK info
    nativeSdkVersion: () => getNativeModule().nativeSdkVersion(),

    // Event listener support - using standard TurboModule pattern
    addListener: (eventName) => getNativeModule().addListener(eventName),
    removeListeners: (count) => getNativeModule().removeListeners(count),
};

export default LazyNativeRadar;
