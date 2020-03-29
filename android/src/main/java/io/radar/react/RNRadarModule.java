package io.radar.react;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import io.radar.sdk.Radar;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarUser;
import org.json.JSONException;

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
    public void setMetadata(ReadableMap metadataMap) throws JSONException {
        Radar.setMetadata(RNRadarUtils.jsonForMap(metadataMap));
    }

    @ReactMethod
    public void getPermissionsStatus(Promise promise) {
        boolean foreground = ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        if (Build.VERSION.SDK_INT >= 29) {
            if (foreground) {
                boolean background = ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
                return background ? "GRANTED_BACKGROUND" : "GRANTED_FOREGROUND";
            } else {
                return "DENIED";
            }
        } else {
            return foreground ? "GRANTED_FOREGROUND" : "DENIED";
        }
    }

    @ReactMethod
    public void requestPermissions(boolean background) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            if (Build.VERSION.SDK_INT >= 23) {
                int requestCode = 0;
                if (Build.VERSION.SDK_INT >= 29) {
                    ActivityCompat.requestPermissions(this, new String[] { Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_BACKGROUND_LOCATION }, requestCode)
                } else {
                    ActivityCompat.requestPermissions(this, new String[] { Manifest.permission.ACCESS_FINE_LOCATION }, requestCode)
                }
            }
        }
    }

    @ReactMethod
    public void trackOnce(final Promise promise) {
        Radar.trackOnce(new Radar.RadarTrackCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarEvent[] events, @Nullable RadarUser user) {
                if (promise == null) {
                    return;
                }

                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (events != null) {
                            map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent(events)));
                        }
                        if (user != null) {
                            map.putMap("user", RNRadarUtils.mapForJson(user.toJson()));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void trackOnce(ReadableMap locationMap, final Promise promise) {
        double latitude = locationMap.getDouble("latitude");
        double longitude = locationMap.getDouble("longitude");
        float accuracy = (float)locationMap.getDouble("accuracy");
        Location location = new Location("RNRadarModule");
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setAccuracy(accuracy);

        Radar.trackOnce(location, new RadarCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarEvent[] events, @Nullable RadarUser user) {
                if (promise == null) {
                    return;
                }

                if (status == Radar.RadarStatus.SUCCESS) {
                    WritableMap map = Arguments.createMap();
                    map.putString("status", status.toString());
                    if (location != null) {
                        map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
                    }
                    if (events != null) {
                        map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent.toJson(events)));
                    }
                    if (user != null) {
                        map.putMap("user", RNRadarUtils.mapForJson(user.toJson()));
                    }
                    promise.resolve(map);
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void startTracking(ReadableMap optionsMap) {
        JSONObject optionsObj = RNRadarUtils.jsonForMap(optionsMap);
        RaarTrackingOptions options = RadarTrackingOptions.fromJson(optionsObj);
        Radar.startTracking(options);
    }

    @ReactMethod
    public void stopTracking() {
        Radar.stopTracking();
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
