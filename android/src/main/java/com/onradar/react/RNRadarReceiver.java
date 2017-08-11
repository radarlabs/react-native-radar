package com.onradar.react;

import android.content.Context;
import android.support.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.onradar.sdk.Radar;
import com.onradar.sdk.RadarReceiver;
import com.onradar.sdk.model.RadarEvent;
import com.onradar.sdk.model.RadarUser;

public class RNRadarReceiver extends RadarReceiver {

    private ReactNativeHost mReactNativeHost;

    private void invokeSendEvent(ReactContext reactContext, String eventName, Object data) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
    }

    private void sendEvent(final String eventName, final Object data) {
        final ReactInstanceManager reactInstanceManager = mReactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext == null) {
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(ReactContext reactContext) {
                    invokeSendEvent(reactContext, eventName, data);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                }
            });
            if (!reactInstanceManager.hasStartedCreatingInitialContext()) {
                reactInstanceManager.createReactContextInBackground();
            }
        } else {
            invokeSendEvent(reactContext, eventName, data);
        }
    }

    @Override
    public void onEventsReceived(@NonNull Context context, @NonNull RadarEvent[] events, @NonNull RadarUser user) {
        ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
        mReactNativeHost = reactApplication.getReactNativeHost();

        WritableMap map = Arguments.createMap();
        map.putArray("events", RNRadarUtils.arrayForEvents(events));
        map.putMap("user", RNRadarUtils.mapForUser(user));

        sendEvent("events", map);
    }

    @Override
    public void onError(@NonNull Context context, @NonNull Radar.RadarStatus status) {
        ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
        mReactNativeHost = reactApplication.getReactNativeHost();

        sendEvent("error", RNRadarUtils.stringForStatus(status));
    }

}
