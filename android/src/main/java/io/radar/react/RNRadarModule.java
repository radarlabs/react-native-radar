package io.radar.react;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.location.Location;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import io.radar.sdk.Radar;
import io.radar.sdk.Radar.RadarCallback;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarUser;

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
        Activity activity = getCurrentActivity();
        promise.resolve(RNRadarUtils.stringForPermissionsStatus(
            ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED,
            ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.ACCESS_FINE_LOCATION)
        ));
    }

    @ReactMethod
    public void requestPermissions(boolean background) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            ActivityCompat.requestPermissions(activity, new String[] { Manifest.permission.ACCESS_FINE_LOCATION }, 0);
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
            public void onComplete(@NonNull Radar.RadarStatus status, Location location, RadarEvent[] events, RadarUser user) {
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
            public void onComplete(@NonNull Radar.RadarStatus status, Location location, RadarEvent[] events, RadarUser user) {
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
    public void acceptEvent(String eventId, String verifiedPlaceId) {
        Radar.acceptEvent(eventId, verifiedPlaceId);
    }

    @ReactMethod
    public void rejectEvent(String eventId) {
        Radar.rejectEvent(eventId);
    }

}
