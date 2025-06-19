import type { RadarNativeInterface } from './@types/RadarNativeInterface';
import type { RadarTrackCallback, RadarTrackOnceOptions } from './@types/types';
import NativeRadar from './NativeRadar';

export function multiply(a: number, b: number): number {
  return NativeRadar.multiply(a, b);
}

export function initialize(publishableKey: string, fraud: boolean): void {
  return NativeRadar.initialize(publishableKey, fraud);
}

export function requestPermissions(background: boolean): void {
  return NativeRadar.requestPermissions(background);
}

export function isEven(number: number): Promise<number> {
  return NativeRadar.isEven(number);
}

export const locationEmitter = NativeRadar.locationEmitter;


export const Radar: RadarNativeInterface = {
  initialize: (publishableKey: string, fraud?: boolean) => NativeRadar.initialize(publishableKey, !!fraud),
  trackOnce: async (options?: RadarTrackOnceOptions) => NativeRadar.trackOnce(options || null) as Promise<RadarTrackCallback>,
}
