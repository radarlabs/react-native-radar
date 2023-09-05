package io.radar.react;

import android.Manifest;
import android.app.Activity;
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
import io.radar.sdk.Radar;
import io.radar.sdk.RadarTrackingOptions;
import io.radar.sdk.RadarTrackingOptions.RadarTrackingOptionsForegroundService;
import io.radar.sdk.RadarTripOptions;
import io.radar.sdk.model.RadarAddress;
import io.radar.sdk.model.RadarContext;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarGeofence;
import io.radar.sdk.model.RadarPlace;
import io.radar.sdk.model.RadarRouteMatrix;
import io.radar.sdk.model.RadarRoutes;
import io.radar.sdk.model.RadarTrip;
import io.radar.sdk.model.RadarUser;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.EnumSet;
import java.util.Map;

public class RNRadarModule extends ReactContextBaseJavaModule implements PermissionListener {

    private static final String TAG = "RNRadarModule";
    private static final int PERMISSIONS_REQUEST_CODE = 20160525; // random request code (Radar's birthday!)
    private Promise mPermissionsRequestPromise;

    private RNRadarReceiver receiver;
    private int listenerCount = 0;

    public RNRadarModule(ReactApplicationContext reactContext) {
        super(reactContext);
        receiver = new RNRadarReceiver();
    }

    @ReactMethod
    public void addListener(String eventName) {
        if (listenerCount == 0) {
            receiver.hasListeners = true;
        }

        listenerCount += 1;
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        listenerCount -= count;
        if (listenerCount == 0) {
            receiver.hasListeners = false;
        }
    }

    @Override
    public String getName() {
        return "RNRadar";
    }

    @ReactMethod
    public void initialize(String publishableKey, boolean fraud) {
        if (fraud) {
            Radar.initialize(getReactApplicationContext(), publishableKey, receiver, Radar.RadarLocationServicesProvider.GOOGLE, fraud);
        } else {
            Radar.initialize(getReactApplicationContext(), publishableKey);
            Radar.setReceiver(receiver);
        }
    }

    @ReactMethod
    public void setLogLevel(String level) {
        Radar.RadarLogLevel logLevel = Radar.RadarLogLevel.NONE;
        if (level != null) {
            if (level.equals("error") || level.equals("ERROR")) {
                logLevel = Radar.RadarLogLevel.ERROR;
            } else if (level.equals("warning") || level.equals("WARNING")) {
                logLevel = Radar.RadarLogLevel.WARNING;
            } else if (level.equals("info") || level.equals("INFO")) {
                logLevel = Radar.RadarLogLevel.INFO;
            } else if (level.equals("debug") || level.equals("DEBUG")) {
                logLevel = Radar.RadarLogLevel.DEBUG;
            }
        }
        Radar.setLogLevel(logLevel);
    }

    @ReactMethod
    public void setUserId(String userId) {
        Radar.setUserId(userId);
    }

    @ReactMethod
    public void getUserId(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.getUserId());
    }

    @ReactMethod
    public void setDescription(String description) {
        Radar.setDescription(description);
    }

    @ReactMethod
    public void getDescription(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.getDescription());
    }

    @ReactMethod
    public void setMetadata(ReadableMap metadataMap) throws JSONException {
        Radar.setMetadata(RNRadarUtils.jsonForMap(metadataMap));
    }

    @ReactMethod
    public void getMetadata(final Promise promise) throws JSONException {        
        if (promise == null) {
            return;
        }

        JSONObject metaJson =  Radar.getMetadata();        
        promise.resolve(RNRadarUtils.mapForJson(metaJson));
    }

    @ReactMethod
    public void setAnonymousTrackingEnabled(boolean enabled) {
        Radar.setAnonymousTrackingEnabled(enabled);
    }

    @ReactMethod
    public void getHost(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.getHost());
    }

    @ReactMethod
    public void getPublishableKey(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.getPublishableKey());
    }

    @ReactMethod
    public void getPermissionsStatus(final Promise promise) {
        if (promise == null) {
            return;
        }

        Activity activity = getCurrentActivity();

        if (activity == null) {
            promise.resolve("UNKNOWN");

            return;
        }

        boolean foreground = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        boolean background = foreground;
        boolean denied = ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.ACCESS_FINE_LOCATION);
        
        if (Build.VERSION.SDK_INT >= 29) {
            background = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
        }

        if (background) {
            promise.resolve("GRANTED_BACKGROUND");
        } else if (foreground) {
            promise.resolve("GRANTED_FOREGROUND");
        } else if (denied) {
            promise.resolve("DENIED");
        } else {
            promise.resolve("NOT_DETERMINED");
        }
    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == PERMISSIONS_REQUEST_CODE && mPermissionsRequestPromise != null) {
            getPermissionsStatus(mPermissionsRequestPromise);
            mPermissionsRequestPromise = null;
        }
        return true;
    }

    @ReactMethod
    public void requestPermissions(boolean background, final Promise promise) {
        PermissionAwareActivity activity = (PermissionAwareActivity)getCurrentActivity();
        mPermissionsRequestPromise = promise;
        if (activity != null) {
            if (Build.VERSION.SDK_INT >= 23) {
                if (background && Build.VERSION.SDK_INT >= 29) {
                    activity.requestPermissions(new String[] { Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_BACKGROUND_LOCATION }, PERMISSIONS_REQUEST_CODE, this);
                } else {
                    activity.requestPermissions(new String[] { Manifest.permission.ACCESS_FINE_LOCATION }, PERMISSIONS_REQUEST_CODE, this);
                }
            }
        }
    }

    @ReactMethod
    public void getLocation(String desiredAccuracy, final Promise promise) {
        
        RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM;        
        String accuracy = desiredAccuracy != null ? desiredAccuracy.toLowerCase()  : "medium";
        
        if (accuracy.equals("low")) {
            accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.LOW;
        } else if (accuracy.equals("medium")) {
            accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM;
        } else if (accuracy.equals("high")) {
            accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.HIGH;
        } else {
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());
        }

        Radar.getLocation(accuracyLevel, new Radar.RadarLocationCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, boolean stopped) {
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
                        map.putBoolean("stopped", stopped);
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void trackOnce(ReadableMap optionsMap, final Promise promise) {
        
        Location location = null;
        RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM;
        boolean beaconsTrackingOption = false;

        if (optionsMap != null) {
            if (optionsMap.hasKey("location")) {
                ReadableMap locationMap = optionsMap.getMap("location");
                location = new Location("RNRadarModule");
                double latitude = locationMap.getDouble("latitude");
                double longitude = locationMap.getDouble("longitude");
                float accuracy = (float)locationMap.getDouble("accuracy");
                location.setLatitude(latitude);
                location.setLongitude(longitude);
                location.setAccuracy(accuracy);
            }
            if (optionsMap.hasKey("desiredAccuracy")) {
                String desiredAccuracy = optionsMap.getString("desiredAccuracy").toLowerCase();
                if (desiredAccuracy.equals("none")) {
                    accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.NONE;
                } else if (desiredAccuracy.equals("low")) {
                    accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.LOW;
                } else if (desiredAccuracy.equals("medium")) {
                    accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM;
                } else if (desiredAccuracy.equals("high")) {
                    accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.HIGH;
                }
            }
            if (optionsMap.hasKey("beacons")) {
                beaconsTrackingOption = optionsMap.getBoolean("beacons");
            }
        }

        Radar.RadarTrackCallback trackCallback = new Radar.RadarTrackCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarEvent[] events, @Nullable RadarUser user) {
                if (promise == null) {
                    return;
                }

                try {
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
                } catch (JSONException e) {
                    Log.e(TAG, "JSONException", e);
                    promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                }
            }
        };

        if (location != null) {
            Radar.trackOnce(location, trackCallback);
        } else {
            Radar.trackOnce(accuracyLevel, beaconsTrackingOption, trackCallback);
        }
    }

    @ReactMethod
    public void trackVerified(final Promise promise) {
        Radar.trackVerified(new Radar.RadarTrackCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarEvent[] events, @Nullable RadarUser user) {
                if (promise == null) {
                    return;
                }

                try {
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
                } catch (JSONException e) {
                    Log.e(TAG, "JSONException", e);
                    promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                }
            }
        });
    }

    @ReactMethod
    public void trackVerifiedToken(final Promise promise) {
        Radar.trackVerifiedToken(new Radar.RadarTrackTokenCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable String token) {
                if (promise == null) {
                    return;
                }

                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (token != null) {
                            map.putString("token", token);
                        }
                        promise.resolve(map);
                    } else {
                        promise.reject(status.toString(), status.toString());
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Exception", e);
                    promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                }
            }
        });
    }

    @ReactMethod
    public void startTrackingEfficient() {
        Radar.startTracking(RadarTrackingOptions.EFFICIENT);
    }

    @ReactMethod
    public void startTrackingResponsive() {
        Radar.startTracking(RadarTrackingOptions.RESPONSIVE);
    }

    @ReactMethod
    public void startTrackingContinuous() {
        Radar.startTracking(RadarTrackingOptions.CONTINUOUS);
    }

    @ReactMethod
    public void startTrackingCustom(ReadableMap optionsMap) {
        try {
            JSONObject optionsObj = RNRadarUtils.jsonForMap(optionsMap);
            RadarTrackingOptions options = RadarTrackingOptions.fromJson(optionsObj);
            Radar.startTracking(options);
        } catch (JSONException e) {
            Log.e(TAG, "JSONException", e);
        }
    }

    @ReactMethod
    public void mockTracking(ReadableMap optionsMap) {
        ReadableMap originMap = optionsMap.getMap("origin");
        double originLatitude = originMap.getDouble("latitude");
        double originLongitude = originMap.getDouble("longitude");
        Location origin = new Location("RNRadarModule");
        origin.setLatitude(originLatitude);
        origin.setLongitude(originLongitude);
        ReadableMap destinationMap = optionsMap.getMap("destination");
        double destinationLatitude = destinationMap.getDouble("latitude");
        double destinationLongitude = destinationMap.getDouble("longitude");
        Location destination = new Location("RNRadarModule");
        destination.setLatitude(destinationLatitude);
        destination.setLongitude(destinationLongitude);
        String modeStr = optionsMap.getString("mode");
        Radar.RadarRouteMode mode = Radar.RadarRouteMode.CAR;
        if (modeStr.equals("FOOT") || modeStr.equals("foot")) {
            mode = Radar.RadarRouteMode.FOOT;
        } else if (modeStr.equals("BIKE") || modeStr.equals("bike")) {
            mode = Radar.RadarRouteMode.BIKE;
        } else if (modeStr.equals("CAR") || modeStr.equals("car")) {
            mode = Radar.RadarRouteMode.CAR;
        }
        int steps = optionsMap.hasKey("steps") ? optionsMap.getInt("steps") : 10;
        int interval = optionsMap.hasKey("interval") ? optionsMap.getInt("interval") : 1;

        Radar.mockTracking(origin, destination, mode, steps, interval, new Radar.RadarTrackCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarEvent[] events, @Nullable RadarUser user) {

            }
        });
    }

    @ReactMethod
    public void stopTracking() {
        Radar.stopTracking();
    }

    @ReactMethod
    public void isTracking(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.isTracking());
    }

    @ReactMethod
    public void getTrackingOptions(final Promise promise) {
        if (promise == null) {
            return;
        }
        try {
            RadarTrackingOptions options = Radar.getTrackingOptions();
            promise.resolve(RNRadarUtils.mapForJson(options.toJson()));
        } catch(JSONException e) {
            Log.e(TAG, "JSONException", e);
            promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
        }
    }

    @ReactMethod
    public void isUsingRemoteTrackingOptions(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.isUsingRemoteTrackingOptions());
    }

    @ReactMethod
    public void setForegroundServiceOptions(ReadableMap optionsMap) {
        try {
            JSONObject optionsObj = RNRadarUtils.jsonForMap(optionsMap);
            RadarTrackingOptionsForegroundService options = RadarTrackingOptionsForegroundService.fromJson(optionsObj);
            Radar.setForegroundServiceOptions(options);
        } catch (JSONException e) {
            Log.e(TAG, "JSONException", e);
        }
    }

    @ReactMethod
    public void acceptEvent(String eventId, String verifiedPlaceId) {
        Radar.acceptEvent(eventId, verifiedPlaceId);
    }

    @ReactMethod
    public void rejectEvent(String eventId) {
        Radar.rejectEvent(eventId);
    }

    @ReactMethod
    public void getTripOptions(final Promise promise) {
        if (promise == null) {
            return;
        }
        try {
            RadarTripOptions options = Radar.getTripOptions();
            promise.resolve(options != null ? RNRadarUtils.mapForJson(options.toJson()) : null);
        } catch(JSONException e) {
            Log.e(TAG, "JSONException", e);
            promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
        }
    }

    @ReactMethod
    public void startTrip(ReadableMap optionsMap, final Promise promise) {
        try {
            JSONObject optionsJson = RNRadarUtils.jsonForMap(optionsMap);
            // new format is { tripOptions, trackingOptions }
            JSONObject tripOptionsJson = optionsJson.optJSONObject("tripOptions");
            if (tripOptionsJson == null) {
              // legacy format
              tripOptionsJson = optionsJson;
            }
            RadarTripOptions options = RadarTripOptions.fromJson(tripOptionsJson);

            RadarTrackingOptions trackingOptions = null;
            JSONObject trackingOptionsJson = optionsJson.optJSONObject("trackingOptions");
            if (trackingOptionsJson != null) {
                trackingOptions = RadarTrackingOptions.fromJson(trackingOptionsJson);
            }
            Radar.startTrip(options, trackingOptions, new Radar.RadarTripCallback() {
                @Override
                public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarTrip trip, @Nullable RadarEvent[] events) {
                    if (promise == null) {
                        return;
                    }
                    try {
                        if (status == Radar.RadarStatus.SUCCESS) {
                            WritableMap map = Arguments.createMap();
                            map.putString("status", status.toString());
                            if (trip != null) {
                                map.putMap("trip", RNRadarUtils.mapForJson(trip.toJson()));
                            }
                            if (events != null) {
                                map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent.toJson(events)));
                            }
                            promise.resolve(map);
                        } else {
                            promise.reject(status.toString(), status.toString());
                        }
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                }
            });
        } catch (JSONException e) {
            Log.e(TAG, "JSONException", e);
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());
        }
    }

    @ReactMethod
    public void completeTrip(final Promise promise) {
        Radar.completeTrip(new Radar.RadarTripCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarTrip trip, @Nullable RadarEvent[] events) {
                if (promise == null) {
                    return;
                }
                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (trip != null) {
                            map.putMap("trip", RNRadarUtils.mapForJson(trip.toJson()));
                        }
                        if (events != null) {
                            map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent.toJson(events)));
                        }
                        promise.resolve(map);
                    } else {
                        promise.reject(status.toString(), status.toString());
                    }
                } catch (JSONException e) {
                    Log.e(TAG, "JSONException", e);
                    promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                }
            }
        });
    }

    @ReactMethod
    public void cancelTrip(final Promise promise) {
        Radar.cancelTrip(new Radar.RadarTripCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarTrip trip, @Nullable RadarEvent[] events) {
                if (promise == null) {
                    return;
                }
                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (trip != null) {
                            map.putMap("trip", RNRadarUtils.mapForJson(trip.toJson()));
                        }
                        if (events != null) {
                            map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent.toJson(events)));
                        }
                        promise.resolve(map);
                    } else {
                        promise.reject(status.toString(), status.toString());
                    }
                } catch (JSONException e) {
                    Log.e(TAG, "JSONException", e);
                    promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                }
            }
        });
    }

    @ReactMethod
    public void updateTrip(ReadableMap optionsMap, final Promise promise) {

        try {
            JSONObject optionsObj = RNRadarUtils.jsonForMap(optionsMap);
            RadarTripOptions options = RadarTripOptions.fromJson(optionsObj.getJSONObject("options"));
            RadarTrip.RadarTripStatus status = RadarTrip.RadarTripStatus.UNKNOWN;

            if (optionsObj.has("status")) {
                String statusStr = optionsObj.getString("status");
                if (statusStr != null) {
                    if (statusStr.equalsIgnoreCase("started")) {
                        status = RadarTrip.RadarTripStatus.STARTED;
                    } else if (statusStr.equalsIgnoreCase("approaching")) {
                        status = RadarTrip.RadarTripStatus.APPROACHING;
                    } else if (statusStr.equalsIgnoreCase("arrived")) {
                        status = RadarTrip.RadarTripStatus.ARRIVED;
                    } else if (statusStr.equalsIgnoreCase("completed")) {
                        status = RadarTrip.RadarTripStatus.COMPLETED;
                    } else if (statusStr.equalsIgnoreCase("canceled")) {
                        status = RadarTrip.RadarTripStatus.CANCELED;
                    } else if (statusStr.equalsIgnoreCase("unknown")) {
                        status = RadarTrip.RadarTripStatus.UNKNOWN;
                    } else {
                        promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());
                    }
                }
            } else {
                promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());
            }

            Radar.updateTrip(options, status, new Radar.RadarTripCallback() {
                @Override
                public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarTrip trip, @Nullable RadarEvent[] events) {
                    if (promise == null) {
                        return;
                    }
                    try {
                        if (status == Radar.RadarStatus.SUCCESS) {
                            WritableMap map = Arguments.createMap();
                            map.putString("status", status.toString());
                            if (trip != null) {
                                map.putMap("trip", RNRadarUtils.mapForJson(trip.toJson()));
                            }
                            if (events != null) {
                                map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent.toJson(events)));
                            }
                            promise.resolve(map);
                        } else {
                            promise.reject(status.toString(), status.toString());
                        }
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                }
            });
        } catch (JSONException e) {
            Log.e(TAG, "JSONException", e);
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());
        }
    }

    @ReactMethod
    public void getContext(final Promise promise) {
        if (promise == null) {
            return;
        }

        Radar.getContext(new Radar.RadarContextCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarContext context) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (context != null) {
                            map.putMap("context", RNRadarUtils.mapForJson(context.toJson()));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void getContext(ReadableMap locationMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        double latitude = locationMap.getDouble("latitude");
        double longitude = locationMap.getDouble("longitude");
        Location location = new Location("RNRadarModule");
        location.setLatitude(latitude);
        location.setLongitude(longitude);

        Radar.getContext(location, new Radar.RadarContextCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarContext context) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (context != null) {
                            map.putMap("context", RNRadarUtils.mapForJson(context.toJson()));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void searchPlaces(ReadableMap optionsMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        Location near = null;
        if (optionsMap.hasKey("near")) {
            ReadableMap nearMap = optionsMap.getMap("near");
            double latitude = nearMap.getDouble("latitude");
            double longitude = nearMap.getDouble("longitude");
            near = new Location("RNRadarModule");
            near.setLatitude(latitude);
            near.setLongitude(longitude);
        }
        int radius = optionsMap.hasKey("radius") ? optionsMap.getInt("radius") : 1000;
        String[] chains = optionsMap.hasKey("chains") ? RNRadarUtils.stringArrayForArray(optionsMap.getArray("chains")) : null;
        Map<String, String> chainMetadata = RNRadarUtils.stringStringMap(optionsMap.getMap("chainMetadata"));
        String[] categories = optionsMap.hasKey("categories") ? RNRadarUtils.stringArrayForArray(optionsMap.getArray("categories")) : null;
        String[] groups = optionsMap.hasKey("groups") ? RNRadarUtils.stringArrayForArray(optionsMap.getArray("groups")) : null;
        int limit = optionsMap.hasKey("limit") ? optionsMap.getInt("limit") : 10;

        Radar.RadarSearchPlacesCallback callback = new Radar.RadarSearchPlacesCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarPlace[] places) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (places != null) {
                            map.putArray("places", RNRadarUtils.arrayForJson(RadarPlace.toJson(places)));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        };

        if (near != null) {
            Radar.searchPlaces(near, radius, chains, chainMetadata, categories, groups, limit, callback);
        } else {
            Radar.searchPlaces(radius, chains, chainMetadata, categories, groups, limit, callback);
        }
    }

    @ReactMethod
    public void searchGeofences(ReadableMap optionsMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        Location near = null;
        if (optionsMap.hasKey("near")) {
            ReadableMap nearMap = optionsMap.getMap("near");
            double latitude = nearMap.getDouble("latitude");
            double longitude = nearMap.getDouble("longitude");
            near = new Location("RNRadarModule");
            near.setLatitude(latitude);
            near.setLongitude(longitude);
        }
        int radius = optionsMap.hasKey("radius") ? optionsMap.getInt("radius") : 1000;
        String[] tags = optionsMap.hasKey("tags") ? RNRadarUtils.stringArrayForArray(optionsMap.getArray("tags")) : null;
        JSONObject metadata = null;
        if (optionsMap.hasKey("metadata")) {
            try {
                metadata = RNRadarUtils.jsonForMap(optionsMap.getMap("metadata"));
            } catch (JSONException e) {
                Log.e(TAG, "JSONException", e);
                promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());

                return;
            }
        }

        int limit = optionsMap.hasKey("limit") ? optionsMap.getInt("limit") : 10;

        Radar.RadarSearchGeofencesCallback callback = new Radar.RadarSearchGeofencesCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarGeofence[] geofences) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (geofences != null) {
                            map.putArray("geofences", RNRadarUtils.arrayForJson(RadarGeofence.toJson(geofences)));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        };

        if (near != null) {
            Radar.searchGeofences(near, radius, tags, metadata, limit, callback);
        } else {
            Radar.searchGeofences(radius, tags, metadata, limit, callback);
        }
    }

    @ReactMethod
    public void autocomplete(ReadableMap optionsMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        if (!optionsMap.hasKey("query") || !optionsMap.hasKey("near")) {
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());

            return;
        }

        String query = optionsMap.getString("query");
        ReadableMap nearMap = optionsMap.getMap("near");
        double latitude = nearMap.getDouble("latitude");
        double longitude = nearMap.getDouble("longitude");
        Location near = new Location("RNRadarModule");
        near.setLatitude(latitude);
        near.setLongitude(longitude);
        int limit = optionsMap.hasKey("limit") ? optionsMap.getInt("limit") : 10;
        String country = optionsMap.hasKey("countryCode") ? optionsMap.getString("countryCode") : optionsMap.hasKey("country") ? optionsMap.getString("country") : null;
        String[] layers = optionsMap.hasKey("layers") ? RNRadarUtils.stringArrayForArray(optionsMap.getArray("layers")) : null;

        boolean expandUnits = optionsMap.hasKey("expandUnits") ? optionsMap.getBoolean("expandUnits") : false;

        Radar.autocomplete(query, near, layers, limit, country, expandUnits,new Radar.RadarGeocodeCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress[] addresses) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (addresses != null) {
                            map.putArray("addresses", RNRadarUtils.arrayForJson(RadarAddress.toJson(addresses)));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void geocode(String query, final Promise promise) {
        if (promise == null) {
            return;
        }

        Radar.geocode(query, new Radar.RadarGeocodeCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress[] addresses) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (addresses != null) {
                            map.putArray("addresses", RNRadarUtils.arrayForJson(RadarAddress.toJson(addresses)));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void reverseGeocode(final Promise promise) {
        if (promise == null) {
            return;
        }

        Radar.reverseGeocode(new Radar.RadarGeocodeCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress[] addresses) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (addresses != null) {
                            map.putArray("addresses", RNRadarUtils.arrayForJson(RadarAddress.toJson(addresses)));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void reverseGeocode(ReadableMap locationMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        if (locationMap == null) {
            this.reverseGeocode(promise);

            return;
        }

        double latitude = locationMap.getDouble("latitude");
        double longitude = locationMap.getDouble("longitude");
        Location location = new Location("RNRadarModule");
        location.setLatitude(latitude);
        location.setLongitude(longitude);

        Radar.reverseGeocode(location, new Radar.RadarGeocodeCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress[] addresses) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (addresses != null) {
                            map.putArray("addresses", RNRadarUtils.arrayForJson(RadarAddress.toJson(addresses)));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void ipGeocode(final Promise promise) {
        if (promise == null) {
            return;
        }

        Radar.ipGeocode(new Radar.RadarIpGeocodeCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress address, boolean proxy) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (address != null) {
                            map.putMap("address", RNRadarUtils.mapForJson(address.toJson()));
                            map.putBoolean("proxy", proxy);
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void getDistance(ReadableMap optionsMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        if (!optionsMap.hasKey("destination")) {
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());

            return;
        }

        ReadableMap originMap = optionsMap.getMap("origin");
        Location origin = null;
        if (originMap != null) {
            double latitude = originMap.getDouble("latitude");
            double longitude = originMap.getDouble("longitude");
            origin = new Location("RNRadarModule");
            origin.setLatitude(latitude);
            origin.setLongitude(longitude);
        }
        ReadableMap destinationMap = optionsMap.getMap("destination");
        double latitude = destinationMap.getDouble("latitude");
        double longitude = destinationMap.getDouble("longitude");
        Location destination = new Location("RNRadarModule");
        destination.setLatitude(latitude);
        destination.setLongitude(longitude);
        String[] modesArr = optionsMap.hasKey("modes") ? RNRadarUtils.stringArrayForArray(optionsMap.getArray("modes")) : new String[]{};
        EnumSet<Radar.RadarRouteMode> modes = EnumSet.noneOf(Radar.RadarRouteMode.class);
        for (String modeStr : modesArr) {
            if (modeStr.equals("FOOT") || modeStr.equals("foot")) {
                modes.add(Radar.RadarRouteMode.FOOT);
            }
            if (modeStr.equals("BIKE") || modeStr.equals("bike")) {
                modes.add(Radar.RadarRouteMode.BIKE);
            }
            if (modeStr.equals("CAR") || modeStr.equals("car")) {
                modes.add(Radar.RadarRouteMode.CAR);
            }
        }
        String unitsStr = optionsMap.hasKey("units") ? optionsMap.getString("units") : null;
        Radar.RadarRouteUnits units = unitsStr != null && (unitsStr.equals("METRIC") || unitsStr.equals("metric")) ? Radar.RadarRouteUnits.METRIC : Radar.RadarRouteUnits.IMPERIAL;

        Radar.RadarRouteCallback callback = new Radar.RadarRouteCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarRoutes routes) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (routes != null) {
                            map.putMap("routes", RNRadarUtils.mapForJson(routes.toJson()));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        };

        if (origin != null) {
            Radar.getDistance(origin, destination, modes, units, callback);
        } else {
            Radar.getDistance(destination, modes, units, callback);
        }
    }

    @ReactMethod
    public void getMatrix(ReadableMap optionsMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        ReadableArray originsArr = optionsMap.getArray("origins");
        Location[] origins = new Location[originsArr.size()];
        for (int i = 0; i < originsArr.size(); i++) {
            ReadableMap originMap = originsArr.getMap(i);
            double latitude = originMap.getDouble("latitude");
            double longitude = originMap.getDouble("longitude");
            Location origin = new Location("RNRadarModule");
            origin.setLatitude(latitude);
            origin.setLongitude(longitude);
            origins[i] = origin;
        }
        ReadableArray destinationsArr = optionsMap.getArray("destinations");
        Location[] destinations = new Location[destinationsArr.size()];
        for (int i = 0; i < destinationsArr.size(); i++) {
            ReadableMap destinationMap = destinationsArr.getMap(i);
            double latitude = destinationMap.getDouble("latitude");
            double longitude = destinationMap.getDouble("longitude");
            Location destination = new Location("RNRadarModule");
            destination.setLatitude(latitude);
            destination.setLongitude(longitude);
            destinations[i] = destination;
        }
        String modeStr = optionsMap.getString("mode");
        Radar.RadarRouteMode mode = Radar.RadarRouteMode.CAR;
        if (modeStr != null) {
            if (modeStr.equals("FOOT") || modeStr.equals("foot")) {
                mode = Radar.RadarRouteMode.FOOT;
            } else if (modeStr.equals("BIKE") || modeStr.equals("bike")) {
                mode = Radar.RadarRouteMode.BIKE;
            } else if (modeStr.equals("CAR") || modeStr.equals("car")) {
                mode = Radar.RadarRouteMode.CAR;
            } else if (modeStr.equals("TRUCK") || modeStr.equals("truck")) {
                mode = Radar.RadarRouteMode.TRUCK;
            } else if (modeStr.equals("MOTORBIKE") || modeStr.equals("motorbike")) {
                mode = Radar.RadarRouteMode.MOTORBIKE;
            }
        }
        String unitsStr = optionsMap.hasKey("units") ? optionsMap.getString("units") : null;
        Radar.RadarRouteUnits units = unitsStr != null && (unitsStr.equals("METRIC") || unitsStr.equals("metric")) ? Radar.RadarRouteUnits.METRIC : Radar.RadarRouteUnits.IMPERIAL;

        Radar.getMatrix(origins, destinations, mode, units, new Radar.RadarMatrixCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarRouteMatrix matrix) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (matrix != null) {
                            map.putArray("matrix", RNRadarUtils.arrayForJson(matrix.toJson()));
                        }
                        promise.resolve(map);
                    } catch (JSONException e) {
                        Log.e(TAG, "JSONException", e);
                        promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                    }
                } else {
                    promise.reject(status.toString(), status.toString());
                }
            }
        });
    }

    @ReactMethod
    public void logConversion(ReadableMap optionsMap, final Promise promise) throws JSONException  {
        if (promise == null) {
            return;
        }

        if (!optionsMap.hasKey("name")) {
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());

            return;
        }

        String name = optionsMap.getString("name");
        Double revenue = optionsMap.hasKey("revenue") ? new Double(optionsMap.getDouble("revenue")) : null;
        ReadableMap metadata = optionsMap.hasKey("metadata") ? optionsMap.getMap("metadata") : null;
        
        JSONObject metadataObj = RNRadarUtils.jsonForMap(metadata);
        Radar.RadarLogConversionCallback callback = new Radar.RadarLogConversionCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarEvent event) {
                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (event != null) {
                            map.putMap("event", RNRadarUtils.mapForJson(event.toJson()));
                        }
                        promise.resolve(map);
                    } else {
                        promise.reject(status.toString(), status.toString());
                    }
                } catch (JSONException e) {
                    Log.e(TAG, "JSONException", e);
                    promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
                }
            }
        };

        if (revenue != null) {
            Radar.logConversion(name, revenue, metadataObj, callback);
        } else {
            Radar.logConversion(name, metadataObj, callback);
        }
    }

}
