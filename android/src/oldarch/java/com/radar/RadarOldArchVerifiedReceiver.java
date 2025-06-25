package com.radar;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import io.radar.sdk.Radar;
import io.radar.sdk.RadarVerifiedReceiver;
import io.radar.sdk.model.RadarVerifiedLocationToken;

public class RadarOldArchVerifiedReceiver extends RadarVerifiedReceiver {

    private ReactNativeHost reactNativeHost;
    private static final String TAG = "RadarOldArchVerifiedReceiver";
    protected boolean hasListeners = false;

    private void sendEvent(final String eventName, final Object data) {
        final ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext != null && hasListeners) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
        }
    }

    @Override
    public void onTokenUpdated(@NonNull Context context, @NonNull RadarVerifiedLocationToken token) {
        try {
            ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
            reactNativeHost = reactApplication.getReactNativeHost();

            sendEvent("token", RadarUtils.mapForJson(token.toJson()));
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

}
