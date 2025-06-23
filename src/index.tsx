import type { EventSubscription } from 'react-native';
import type { RadarNativeInterface } from './@types/RadarNativeInterface';
import type { RadarTrackCallback, RadarTrackOnceOptions, RadarLocationUpdateCallback, RadarPermissionsStatus } from './@types/types';
import NativeRadar from './NativeRadar';

export function multiply(a: number, b: number): number {
  return NativeRadar.multiply(a, b);
}

export function initialize(publishableKey: string, fraud: boolean): void {
  return NativeRadar.initialize(publishableKey, fraud);
}

export function requestPermissions(background: boolean): void {
  NativeRadar.requestPermissions(background);
}

export function isEven(number: number): Promise<number> {
  return NativeRadar.isEven(number);
}

const locationEmitter = NativeRadar.locationEmitter;

let locationUpdateSubscription: EventSubscription | null = null;


export const Radar: RadarNativeInterface = {
  
  initialize: (publishableKey: string, fraud?: boolean) => NativeRadar.initialize(publishableKey, !!fraud),
  trackOnce: async (options?: RadarTrackOnceOptions) => NativeRadar.trackOnce(options || null) as Promise<RadarTrackCallback>,

  onLocationUpdate: (callback: RadarLocationUpdateCallback) => {
    // Clear any existing subscription
    if (locationUpdateSubscription) {
      locationUpdateSubscription.remove();
      locationUpdateSubscription = null;
    }
  
    // Set up new subscription using locationEmitter as a function
    locationUpdateSubscription = locationEmitter((event: { location: any; user: any }) => {
      // Transform the event data to match RadarLocationUpdate interface
      const locationUpdate = {
        location: event.location,
        user: event.user
      };
      
      callback(locationUpdate);
    });
  },

  clearLocationUpdate: () => {
    if (locationUpdateSubscription) {
      locationUpdateSubscription.remove();
      locationUpdateSubscription = null;
    }
  },

  requestPermissions: (background: boolean) => NativeRadar.requestPermissions(background) as Promise<RadarPermissionsStatus>
}
