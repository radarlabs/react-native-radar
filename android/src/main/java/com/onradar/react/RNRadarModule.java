package com.onradar.react;

import android.app.Activity;
import android.content.Context;
import android.content.IntentFilter;
import android.location.Location;
import android.support.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactContext;

import com.onradar.sdk.Radar;
import com.onradar.sdk.RadarCallback;
import com.onradar.sdk.RadarReceiver;
import com.onradar.sdk.model.RadarEvent;
import com.onradar.sdk.model.RadarUser;

public class RNRadarModule extends ReactContextBaseJavaModule {

    public RNRadarModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNRadar";
    }

    @ReactMethod
    public void setUserId(String userId) {
        Radar.setUserId(userId);
    }

    @ReactMethod
    public void setDescription(String description) {
        Radar.setDescription(description);
    }

    @ReactMethod
    public void setPlacesProvider(String providerStr) {
        Radar.setPlacesProvider(RNRadarUtils.placesProviderForString(providerStr));
    }

    @ReactMethod
    public void getPermissionsStatus(Promise promise) {
        promise.resolve(RNRadarUtils.stringForPermissionsStatus(Radar.checkSelfPermissions()));
    }

    @ReactMethod
    public void requestPermissions(boolean background) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Radar.requestPermissions(activity);
        }
    }

    @ReactMethod
    public void startTracking() {
        Radar.startTracking();
    }

    @ReactMethod
    public void stopTracking() {
        Radar.stopTracking();
    }

    @ReactMethod
    public void trackOnce(final Promise promise) {
        Radar.trackOnce(new RadarCallback() {
            @Override
            public void onCallback(@NonNull Radar.RadarStatus status, Location location, RadarEvent[] events, RadarUser user) {
                if (promise == null)
                    return;

                if (status == Radar.RadarStatus.SUCCESS) {
                    WritableMap map = Arguments.createMap();
                    map.putString("status", RNRadarUtils.stringForStatus(status));
                    if (location != null)
                        map.putMap("location", RNRadarUtils.mapForLocation(location));
                    if (events != null)
                        map.putArray("events", RNRadarUtils.arrayForEvents(events));
                    if (user != null)
                        map.putMap("user", RNRadarUtils.mapForUser(user));
                    promise.resolve(map);
                } else {
                    promise.reject(RNRadarUtils.stringForStatus(status), RNRadarUtils.stringForStatus(status));
                }
            }
        });
    }

    @ReactMethod
    public void updateLocation(ReadableMap locationMap, final Promise promise) {
        double latitude = locationMap.getDouble("latitude");
        double longitude = locationMap.getDouble("longitude");
        float accuracy = (float)locationMap.getDouble("accuracy");
        Location location = new Location("RNRadarModule");
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setAccuracy(accuracy);
        Radar.updateLocation(location, new RadarCallback() {
            @Override
            public void onCallback(@NonNull Radar.RadarStatus status, Location location, RadarEvent[] events, RadarUser user) {
                if (promise == null)
                    return;

                if (status == Radar.RadarStatus.SUCCESS) {
                    WritableMap map = Arguments.createMap();
                    map.putString("status", RNRadarUtils.stringForStatus(status));
                    if (location != null)
                        map.putMap("location", RNRadarUtils.mapForLocation(location));
                    if (events != null)
                        map.putArray("events", RNRadarUtils.arrayForEvents(events));
                    if (user != null)
                        map.putMap("user", RNRadarUtils.mapForUser(user));
                    promise.resolve(map);
                } else {
                    promise.reject(RNRadarUtils.stringForStatus(status), RNRadarUtils.stringForStatus(status));
                }
            }
        });
    }

}
