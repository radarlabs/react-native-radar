import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export type LocationEmitter = {
  location: Object;
  user: Object;
};

export type ClientLocationEmitter = {
  location: Object;
  stopped: boolean;
  source: string;
};

export type ErrorEmitter = {
  status: string;
};

export type LogEmitter = {
  message: string;
};

export type EventsEmitter = {
  events: Array<Object>;
  user: Object;
};

export type TokenEmitter = {
  token: Object;
};


export interface Spec extends TurboModule {
  initialize(publishableKey: string, fraud: boolean): void;
  requestPermissions(background: boolean): Promise<string>;
  getPermissionsStatus(): Promise<string>;
  trackOnce(trackOnceOptions: Object | null): Promise<Object>;

  readonly locationEmitter: EventEmitter<LocationEmitter>;
  readonly clientLocationEmitter: EventEmitter<ClientLocationEmitter>;
  readonly errorEmitter: EventEmitter<ErrorEmitter>;
  readonly logEmitter: EventEmitter<LogEmitter>;
  readonly eventsEmitter: EventEmitter<EventsEmitter>;
  readonly tokenEmitter: EventEmitter<TokenEmitter>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNRadar');
