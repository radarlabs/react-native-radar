import { NativeEventEmitter, type EmitterSubscription } from 'react-native';
import type { Location, RadarEventChannel, RadarListenerCallback, RadarTrackCallback, RadarTrackOnceOptions } from './@types/types';
import Radar from './NativeRadar';

// Create event emitter for the TurboModule
const eventEmitter = new NativeEventEmitter(Radar as any);

export const initialize = (publishableKey: string, fraud: boolean = false): void => {
  Radar.initialize(publishableKey, fraud);
};

export const trackOnce = (
  options?: RadarTrackOnceOptions | Location
): Promise<RadarTrackCallback> => {
  let backCompatibleOptions = options;
  if (options && "latitude" in options) {
      backCompatibleOptions = {
          location: {
              ...options,
          },
      };
  }
  return Radar.trackOnce(backCompatibleOptions) as Promise<RadarTrackCallback>;
};

// Event listener interface - wrapping TurboModule addListener/removeListeners
export const on = (
  channel: RadarEventChannel,
  callback: RadarListenerCallback
): EmitterSubscription => eventEmitter.addListener(channel, callback);

export default Radar;
