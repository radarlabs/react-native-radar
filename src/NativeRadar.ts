import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Core initialization and setup
  initialize(publishableKey: string, fraud?: boolean): void;
  trackOnce(options?: Object): Promise<Object>;

  setItem(value: string, key: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Radar');
