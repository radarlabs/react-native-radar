package io.radar.react;

import android.content.Context;
import android.location.Location;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

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

/**
 * Implementation of {@link RadarReceiver} that relays events received on Android to React Native
 * code
 */
public class RNRadarReceiver extends RadarReceiver {

    private static final String TAG = "RNRadarReceiver";

    private void invokeSendEvent(ReactContext reactContext, String eventName, Object data) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, data);
    }

    private void sendEvent(ReactNativeHost reactNativeHost,
                           final String eventName,
                           final Object data) {
        final ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext == null) {
            reactInstanceManager.addReactInstanceEventListener(
                    new ReactInstanceManager.ReactInstanceEventListener() {

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
    public void onEventsReceived(@NonNull Context context,
                                 @NonNull RadarEvent[] events,
                                 @Nullable RadarUser user) {
        try {
            WritableMap map = Arguments.createMap();
            map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent.toJson(events)));
            if (user != null) {
                map.putMap("user", RNRadarUtils.mapForJson(user.toJson()));
            }

            ReactApplication reactApplication = (ReactApplication) context.getApplicationContext();
            sendEvent(reactApplication.getReactNativeHost(), "events", map);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onLocationUpdated(@NonNull Context context,
                                  @NonNull Location location,
                                  @NonNull RadarUser user) {
        try {
            WritableMap map = Arguments.createMap();
            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
            map.putMap("user", RNRadarUtils.mapForJson(user.toJson()));

            ReactApplication reactApplication = (ReactApplication) context.getApplicationContext();
            sendEvent(reactApplication.getReactNativeHost(), "location", map);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onClientLocationUpdated(@NonNull Context context,
                                        @NonNull Location location,
                                        boolean stopped,
                                        @NonNull Radar.RadarLocationSource source) {
        try {
            WritableMap map = Arguments.createMap();
            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
            map.putBoolean("stopped", stopped);
            map.putString("source", source.toString());

            ReactApplication reactApplication = (ReactApplication) context.getApplicationContext();
            sendEvent(reactApplication.getReactNativeHost(), "clientLocation", map);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onError(@NonNull Context context, @NonNull Radar.RadarStatus status) {
        try {
            ReactApplication reactApplication = (ReactApplication) context.getApplicationContext();
            sendEvent(reactApplication.getReactNativeHost(), "error", status.toString());
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onLog(@NonNull Context context, @NonNull String message) {
        try {
            ReactApplication reactApplication = (ReactApplication) context.getApplicationContext();
            sendEvent(reactApplication.getReactNativeHost(), "log", message);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

}
