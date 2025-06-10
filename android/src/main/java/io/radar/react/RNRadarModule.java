package io.radar.react;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

// TurboModule imports
import com.facebook.react.module.annotations.ReactModule;
// New architecture imports
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

import io.radar.sdk.Radar;
import io.radar.sdk.RadarTrackingOptions;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarUser;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.EnumSet;
import java.util.Map;

@ReactModule(name = RNRadarModule.NAME)
public class RNRadarModule extends ReactContextBaseJavaModule implements PermissionListener, TurboModule {

    public static final String NAME = "RNRadar";
    private static final String TAG = "RNRadarModule";
    private static final int PERMISSIONS_REQUEST_CODE = 20160525; // random request code (Radar's birthday!)
    private Promise mPermissionsRequestPromise;

    private RNRadarReceiver receiver;
    private RNRadarVerifiedReceiver verifiedReceiver;
    private int listenerCount = 0;
    private boolean fraud = false;

    public RNRadarModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.d(TAG, "RNRadarModule constructor called - TurboModule should be available");
        receiver = new RNRadarReceiver();
        verifiedReceiver = new RNRadarVerifiedReceiver();

        // Set static reference for event sending
        RNRadarReceiver.setRadarModule(this);
    }

    @Override
    public String getName() {
        Log.d(TAG, "getName() called, returning: " + NAME);
        return NAME;
    }

    @Override
    public boolean canOverrideExistingModule() {
        return false;
    }

    @Override
    public void initialize() {
        // Optional: Add any initialization code here
    }

    @Override
    public void invalidate() {
        // Clean up any resources
        receiver = null;
        verifiedReceiver = null;
    }

    @ReactMethod
    public void addListener(String eventName) {
        if (listenerCount == 0) {
            if (fraud) {
                verifiedReceiver.hasListeners = true;
            }
            receiver.hasListeners = true;
        }

        listenerCount += 1;
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        listenerCount -= count;
        if (listenerCount == 0) {
            if (fraud) {
                verifiedReceiver.hasListeners = false;
            }
            receiver.hasListeners = false;
        }
    }

    @ReactMethod
    public void initialize(String publishableKey, boolean fraud) {
        this.fraud = fraud;
        SharedPreferences.Editor editor = getReactApplicationContext()
                .getSharedPreferences("RadarSDK", Context.MODE_PRIVATE).edit();
        editor.putString("x_platform_sdk_type", "ReactNative");
        editor.putString("x_platform_sdk_version", "3.20.3");
        editor.apply();
        if (fraud) {
            Radar.initialize(getReactApplicationContext(), publishableKey, receiver,
                    Radar.RadarLocationServicesProvider.GOOGLE, fraud);
            Radar.setVerifiedReceiver(verifiedReceiver);
        } else {
            Radar.initialize(getReactApplicationContext(), publishableKey);
            Radar.setReceiver(receiver);
        }
    }

    @ReactMethod
    public void trackOnce(ReadableMap optionsMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        Location location = null;
        RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy desiredAccuracy = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM;
        boolean beacons = false;

        if (optionsMap != null) {
            if (optionsMap.hasKey("location")) {
                ReadableMap locationMap = optionsMap.getMap("location");
                if (locationMap != null) {
                    // Create location from ReadableMap
                    location = new Location("RNRadarModule");
                    location.setLatitude(locationMap.getDouble("latitude"));
                    location.setLongitude(locationMap.getDouble("longitude"));
                    if (locationMap.hasKey("accuracy")) {
                        location.setAccuracy((float) locationMap.getDouble("accuracy"));
                    }
                }
            }
            if (optionsMap.hasKey("desiredAccuracy")) {
                String accuracyStr = optionsMap.getString("desiredAccuracy");
                if (accuracyStr != null) {
                    accuracyStr = accuracyStr.toLowerCase();
                    if (accuracyStr.equals("high")) {
                        desiredAccuracy = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.HIGH;
                    } else if (accuracyStr.equals("low")) {
                        desiredAccuracy = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.LOW;
                    } else {
                        desiredAccuracy = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM;
                    }
                }
            }
            if (optionsMap.hasKey("beacons")) {
                beacons = optionsMap.getBoolean("beacons");
            }
        }

        Radar.RadarTrackCallback trackCallback = new Radar.RadarTrackCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location,
                    @Nullable RadarEvent[] events, @Nullable RadarUser user) {
                if (promise == null) {
                    return;
                }

                try {
                    WritableMap map = Arguments.createMap();
                    map.putString("status", status.toString());

                    if (location != null) {
                        // Convert location to map manually
                        WritableMap locationMap = Arguments.createMap();
                        locationMap.putDouble("latitude", location.getLatitude());
                        locationMap.putDouble("longitude", location.getLongitude());
                        locationMap.putDouble("accuracy", location.getAccuracy());
                        map.putMap("location", locationMap);
                    }

                    if (events != null) {
                        // Convert events array using existing utility
                        map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent.toJson(events)));
                    }

                    if (user != null) {
                        // Convert user using existing utility
                        map.putMap("user", RNRadarUtils.mapForJson(user.toJson()));
                    }

                    promise.resolve(map);
                } catch (Exception e) {
                    Log.e(TAG, "trackOnce error", e);
                    promise.reject("ERROR", e.getMessage());
                }
            }
        };

        // Use the correct Radar.trackOnce API
        if (location != null) {
            Radar.trackOnce(location, trackCallback);
        } else {
            Radar.trackOnce(desiredAccuracy, beacons, trackCallback);
        }
    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == PERMISSIONS_REQUEST_CODE) {
            return false;
        }
        return false;
    }

    // Helper method to send events to JavaScript
    public void sendEvent(String eventName, Object params) {
        try {
            if (getReactApplicationContext() != null && getReactApplicationContext().hasActiveCatalystInstance()) {
                getReactApplicationContext()
                        .getJSModule(
                                com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(eventName, params);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error sending event: " + eventName, e);
        }
    }
}
