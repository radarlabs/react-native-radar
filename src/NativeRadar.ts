import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
    // Core initialization
    initialize(publishableKey: string, fraud?: boolean): void;

    // Key tracking method
    trackOnce(options?: Object): Promise<Object>;

    // Event listener support
    addListener(eventName: string): void;
    removeListeners(count: number): void;

    // Additional core methods for completeness
    setUserId(userId: string): void;
    getUserId(): Promise<string | null>;
    getPermissionsStatus(): Promise<string>;
    requestPermissions(background: boolean): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNRadar'); 