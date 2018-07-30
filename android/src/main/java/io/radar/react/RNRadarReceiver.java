package io.radar.react;

import android.content.Context;
import android.location.Location;
import android.support.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import io.radar.sdk.Radar;
import io.radar.sdk.RadarReceiver;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarUser;

public class RNRadarReceiver extends RadarReceiver {

    private ReactNativeHost mReactNativeHost;

    private void invokeSendEvent(ReactContext reactContext, String eventName, Object data) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
    }

    private void sendEvent(final String eventName, final Object data) {
        final ReactInstanceManager reactInstanceManager = mReactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext == null) {
            final PendingResult result = goAsync();
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(ReactContext reactContext) {
                    invokeSendEvent(reactContext, eventName, data);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                    result.finish();
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
        try {
            ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
            mReactNativeHost = reactApplication.getReactNativeHost();

            WritableMap map = Arguments.createMap();
            map.putArray("events", RNRadarUtils.arrayForEvents(events));
            map.putMap("user", RNRadarUtils.mapForUser(user));

            sendEvent("events", map);
        } catch (Exception e) {

        }
    }

    @Override
    public void onLocationUpdated(@NonNull Context context, @NonNull Location location, @NonNull RadarUser user) {
        try {
            ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
            mReactNativeHost = reactApplication.getReactNativeHost();

            WritableMap map = Arguments.createMap();
            map.putMap("location", RNRadarUtils.mapForLocation(location));
            map.putMap("user", RNRadarUtils.mapForUser(user));

            sendEvent("location", map);
        } catch (Exception e) {

        }
    }

    @Override
    public void onError(@NonNull Context context, @NonNull Radar.RadarStatus status) {
        try {
            ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
            mReactNativeHost = reactApplication.getReactNativeHost();

            sendEvent("error", RNRadarUtils.stringForStatus(status));
        } catch (Exception e) {

        }
    }

}
