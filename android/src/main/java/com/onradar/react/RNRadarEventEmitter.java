package com.onradar.react;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RNRadarEventEmitter {

    private static RNRadarEventEmitter sInstance;

    private ReactContext mReactContext;

    private RNRadarEventEmitter(ReactContext reactContext) {
        mReactContext = reactContext;
    }

    static synchronized RNRadarEventEmitter getSharedInstance() {
        return sInstance;
    }

    static synchronized void initialize(ReactContext reactContext) {
        if (RNRadarEventEmitter.sInstance == null) {
            RNRadarEventEmitter.sInstance = new RNRadarEventEmitter(reactContext);
        } else {
            if (RNRadarEventEmitter.sInstance.mReactContext.getCatalystInstance().isDestroyed()) {
                RNRadarEventEmitter.sInstance = new RNRadarEventEmitter(reactContext);
            }
        }
    }

    void sendEvent(String eventName, Object data) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
    }

}
