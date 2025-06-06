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

export default TurboModuleRegistry.getEnforcing<Spec>('RNRadar'); 