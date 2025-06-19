import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export type LocationEmitter = {
  type: string;
  location: string;
  user: string;
};

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  initialize(publishableKey: string, fraud: boolean): void;
  requestPermissions(background: boolean): void;
  trackOnce(): void;

  readonly locationEmitter: EventEmitter<LocationEmitter>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNRadar');
