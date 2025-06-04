import { NativeEventEmitter, Platform } from 'react-native';
import NativeRadar from './NativeRadar';
import type {
    RadarTrackOnceOptions,
    RadarTrackCallback,
    Location,
    RadarEventChannel,
    RadarListenerCallback
} from './@types/types';

// Create event emitter for the TurboModule
const eventEmitter = new NativeEventEmitter(NativeRadar as any);

// Core implementation using TurboModule
const initialize = (publishableKey: string, fraud: boolean = false): void => {
    NativeRadar.initialize(publishableKey, fraud);
};

const trackOnce = (
    options?: RadarTrackOnceOptions | Location
): Promise<RadarTrackCallback> => {
    let processedOptions = options;
    if (options && "latitude" in options) {
        processedOptions = {
            location: {
                ...options,
            },
        };
    }
    return NativeRadar.trackOnce(processedOptions) as Promise<RadarTrackCallback>;
};

const on = (
    channel: RadarEventChannel,
    callback: RadarListenerCallback
) => {
    return eventEmitter.addListener(channel, callback);
};

const setUserId = (userId: string): void => {
    NativeRadar.setUserId(userId);
};

const getUserId = (): Promise<string | null> => {
    return NativeRadar.getUserId();
};

const getPermissionsStatus = (): Promise<string> => {
    return NativeRadar.getPermissionsStatus();
};

const requestPermissions = (background: boolean = false): Promise<string> => {
    return NativeRadar.requestPermissions(background);
};

export default {
    initialize,
    trackOnce,
    on,
    setUserId,
    getUserId,
    getPermissionsStatus,
    requestPermissions,
}; 