import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Core initialization and setup
  initialize(publishableKey: string, fraud?: boolean): void;

  // Location tracking
  trackOnce(options?: Object): Promise<Object>;

  // Event listener support
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Radar');
