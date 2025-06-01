import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    // Configuration
    initialize(publishableKey: string): void;
    setUserId(userId: string): void;
    setDescription(description: string): void;
    setMetadata(metadata: Object): void;

    // Location
    getLocation(): Promise<Object>;
    trackOnce(): Promise<Object>;
    startTracking(): void;
    stopTracking(): void;
    mockTracking(options: Object): void;

    // Events and Places
    searchPlaces(options: Object): Promise<Object>;
    searchGeofences(options: Object): Promise<Object>;
    geocode(address: string): Promise<Object>;
    reverseGeocode(options: Object): Promise<Object>;
    ipGeocode(): Promise<Object>;
    getDistance(options: Object): Promise<Object>;

    // Context
    getContext(): Promise<Object>;

    // Trip Tracking
    startTrip(options: Object): Promise<void>;
    completeTrip(): Promise<void>;
    cancelTrip(): Promise<void>;
    getTripOptions(): Promise<Object>;

    // Event Listeners
    addListener(eventName: string): void;
    removeListener(eventName: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RadarTurboModuleSpec'); 