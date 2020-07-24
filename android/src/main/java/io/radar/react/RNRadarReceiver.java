package io.radar.react;

import android.content.Context;
import android.location.Location;
import android.util.Log;

import androidx.annotation.NonNull;

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
import java.util.concurrent.atomic.AtomicInteger;

public class RNRadarReceiver extends RadarReceiver {

    private ReactNativeHost reactNativeHost;
    private PendingResult result;
    private AtomicInteger pendingCount = new AtomicInteger(0);
    private static final String TAG = "RNRadarReceiver";

    private void invokeSendEvent(ReactContext reactContext, String eventName, Object data) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
    }

    private void sendEvent(final String eventName, final Object data) {
        final ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext == null) {
            if (result == null) {
                result = goAsync();
            }
            pendingCount.incrementAndGet();
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(ReactContext reactContext) {
                    invokeSendEvent(reactContext, eventName, data);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                    if (pendingCount.decrementAndGet() == 0) {
                        result.finish();
                    }
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
            reactNativeHost = reactApplication.getReactNativeHost();

            WritableMap map = Arguments.createMap();
            map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent.toJson(events)));
            map.putMap("user", RNRadarUtils.mapForJson(user.toJson()));

            sendEvent("events", map);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onLocationUpdated(@NonNull Context context, @NonNull Location location, @NonNull RadarUser user) {
        try {
            ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
            reactNativeHost = reactApplication.getReactNativeHost();

            WritableMap map = Arguments.createMap();
            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
            map.putMap("user", RNRadarUtils.mapForJson(user.toJson()));

            sendEvent("location", map);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onClientLocationUpdated(@NonNull Context context, @NonNull Location location, boolean stopped, @NonNull Radar.RadarLocationSource source) {
        try {
            ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
            reactNativeHost = reactApplication.getReactNativeHost();

            WritableMap map = Arguments.createMap();
            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
            map.putBoolean("stopped", stopped);
            map.putString("source", source.toString());

            sendEvent("clientLocation", map);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onError(@NonNull Context context, @NonNull Radar.RadarStatus status) {
        try {
            ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
            reactNativeHost = reactApplication.getReactNativeHost();

            sendEvent("error", status.toString());
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onLog(@NonNull Context context, @NonNull String message) {
        try {
            ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
            reactNativeHost = reactApplication.getReactNativeHost();

            sendEvent("log", message);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

}
