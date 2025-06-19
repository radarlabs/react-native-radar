import Radar from './NativeRadar';

export function multiply(a: number, b: number): number {
  return Radar.multiply(a, b);
}

export function initialize(publishableKey: string, fraud: boolean): void {
  return Radar.initialize(publishableKey, fraud);
}

export function requestPermissions(background: boolean): void {
  return Radar.requestPermissions(background);
}

export function trackOnce(): void {
  return Radar.trackOnce();
}

export const locationEmitter = Radar.locationEmitter;
