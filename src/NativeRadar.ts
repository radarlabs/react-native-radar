// TurboModule specification for React Native's new architecture
// This interface defines the native module API that will be implemented
// by both iOS and Android platforms

export interface RadarTurboModuleSpec {
    // Initialization
    initialize(publishableKey: string, fraud: boolean): void;

    // Configuration
    setLogLevel(level: string): void;
    setUserId(userId: string): void;
    getUserId(): Promise<string>;
    setDescription(description: string): void;
    getDescription(): Promise<string>;
    setMetadata(metadata: Object): void;
    getMetadata(): Promise<Object>;
    setAnonymousTrackingEnabled(enabled: boolean): void;

    // Permissions
    getPermissionsStatus(): Promise<string>;
    requestPermissions(background: boolean): Promise<string>;

    // Location and Tracking
    getLocation(desiredAccuracy?: string): Promise<Object>;
    trackOnce(options?: Object): Promise<Object>;
    trackVerified(options?: Object): Promise<Object>;
    isTrackingVerified(): Promise<boolean>;
    setProduct(product: string): void;
    getVerifiedLocationToken(): Promise<Object>;
    clearVerifiedLocationToken(): void;

    // Tracking Controls
    startTrackingEfficient(): void;
    startTrackingResponsive(): void;
    startTrackingContinuous(): void;
    startTrackingCustom(options: Object): void;
    startTrackingVerified(options?: Object): void;
    mockTracking(options: Object): void;
    stopTracking(): void;
    stopTrackingVerified(): void;
    isTracking(): Promise<boolean>;
    getTrackingOptions(): Promise<Object>;
    isUsingRemoteTrackingOptions(): Promise<boolean>;

    // Service Options
    setForegroundServiceOptions(options: Object): void;
    setNotificationOptions(options: Object): void;

    // Events
    acceptEvent(eventId: string, verifiedPlaceId: string): void;
    rejectEvent(eventId: string): void;

    // Trips
    getTripOptions(): Promise<Object>;
    startTrip(options: Object): Promise<Object>;
    completeTrip(): Promise<Object>;
    cancelTrip(): Promise<Object>;
    updateTrip(options: Object): Promise<Object>;

    // Context and Search
    getContext(location?: Object): Promise<Object>;
    searchPlaces(options: Object): Promise<Object>;
    searchGeofences(options: Object): Promise<Object>;

    // Geocoding
    autocomplete(options: Object): Promise<Object>;
    geocode(options: Object): Promise<Object>;
    reverseGeocode(options?: Object): Promise<Object>;
    ipGeocode(): Promise<Object>;
    validateAddress(address: Object): Promise<Object>;

    // Routes
    getDistance(options: Object): Promise<Object>;
    getMatrix(options: Object): Promise<Object>;

    // Events and Analytics
    logConversion(options: Object): Promise<Object>;
    sendEvent(name: string, metadata: Object): void;

    // Utilities
    nativeSdkVersion(): Promise<string>;
    getHost(): Promise<string>;
    getPublishableKey(): Promise<string>;

    // Event Listeners (new architecture compatible)
    addListener(eventName: string): void;
    removeListeners(count: number): void;
} 