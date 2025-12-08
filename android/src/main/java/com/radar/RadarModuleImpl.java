package com.radar;

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
import io.radar.sdk.Radar;
import io.radar.sdk.RadarTrackingOptions;
import io.radar.sdk.RadarTrackingOptions.RadarTrackingOptionsForegroundService;
import io.radar.sdk.RadarTripOptions;
import io.radar.sdk.RadarVerifiedReceiver;
import io.radar.sdk.model.RadarAddress;
import io.radar.sdk.model.RadarContext;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarGeofence;
import io.radar.sdk.model.RadarPlace;
import io.radar.sdk.model.RadarRouteMatrix;
import io.radar.sdk.model.RadarRoutes;
import io.radar.sdk.model.RadarTrip;
import io.radar.sdk.model.RadarUser;
import io.radar.sdk.model.RadarVerifiedLocationToken;
import io.radar.sdk.model.RadarInAppMessage;
import io.radar.sdk.RadarNotificationOptions;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.EnumSet;
import java.util.Map;

public class RadarModuleImpl {

    private static final String TAG = "RNRadarModule";


    private boolean fraud = false;

    public String getName() {
        return "RNRadar";
    }

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


    public void setUserId(String userId) {
        Radar.setUserId(userId);
    }


    public void getUserId(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.getUserId());
    }


    public void setDescription(String description) {
        Radar.setDescription(description);
    }


    public void getDescription(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.getDescription());
    }


    public void nativeSdkVersion(final Promise promise) {
        if (promise == null) {
            return;
        }
        String sdkVersion = Radar.sdkVersion();

        if (sdkVersion != null) {
            promise.resolve(sdkVersion);
        } else {
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());
        }
    }


    public void setMetadata(ReadableMap metadataMap) throws JSONException {
        Radar.setMetadata(RadarUtils.jsonForMap(metadataMap));
    }


    public void getMetadata(final Promise promise) throws JSONException {
        if (promise == null) {
            return;
        }

        JSONObject metaJson =  Radar.getMetadata();
        promise.resolve(RadarUtils.mapForJson(metaJson));
    }
    
    public void setTags(ReadableArray tags) throws JSONException {
        Radar.setTags(RadarUtils.stringArrayForArray(tags));
    }

    public void getTags(final Promise promise) throws JSONException {
        if (promise == null) {
            return;
        }

        promise.resolve(RadarUtils.arrayForStringArray(Radar.getTags()));
    }

    public void addTags(ReadableArray tags) throws JSONException {
        Radar.addTags(RadarUtils.stringArrayForArray(tags));
    }

    public void removeTags(ReadableArray tags) throws JSONException {
        Radar.removeTags(RadarUtils.stringArrayForArray(tags));
    }

    public void setProduct(String product) {
        Radar.setProduct(product);
    }

    public void getProduct(final Promise promise) throws JSONException {
        if (promise == null) {
            return;
        }

        String product = Radar.getProduct();
        promise.resolve(product);
    }


    public void setAnonymousTrackingEnabled(boolean enabled) {
        Radar.setAnonymousTrackingEnabled(enabled);
    }


    public void getHost(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.getHost());
    }


    public void getPublishableKey(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.getPublishableKey());
    }

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

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, boolean stopped) {
                if (promise == null) {
                    return;
                }

                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RadarUtils.mapForJson(Radar.jsonForLocation(location)));
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

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarEvent[] events, @Nullable RadarUser user) {
                if (promise == null) {
                    return;
                }

                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (events != null) {
                            map.putArray("events", RadarUtils.arrayForJson(RadarEvent.toJson(events)));
                        }
                        if (user != null) {
                            map.putMap("user", RadarUtils.mapForJson(user.toJson()));
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


    public void trackVerified(ReadableMap optionsMap, final Promise promise) {

        boolean beaconsTrackingOption = false;
        RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM;
        String reason = null;
        String transactionId = null;

        if (optionsMap != null) {
            if (optionsMap.hasKey("beacons")) {
                beaconsTrackingOption = optionsMap.getBoolean("beacons");
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
            if (optionsMap.hasKey("reason")) {
                reason = optionsMap.getString("reason");
            }
            if (optionsMap.hasKey("transactionId")) {
                transactionId = optionsMap.getString("transactionId");
            }
        }

        Radar.RadarTrackVerifiedCallback trackCallback = new Radar.RadarTrackVerifiedCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarVerifiedLocationToken token) {
                if (promise == null) {
                    return;
                }

                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (token != null) {
                            map.putMap("token", RadarUtils.mapForJson(token.toJson()));
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

        Radar.trackVerified(beaconsTrackingOption, accuracyLevel, reason, transactionId, trackCallback);
    }


    public void isTrackingVerified(final Promise promise) {
        promise.resolve(Radar.isTrackingVerified());
    }

    public void getVerifiedLocationToken(final Promise promise) {
        Radar.RadarTrackVerifiedCallback trackCallback = new Radar.RadarTrackVerifiedCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarVerifiedLocationToken token) {
                if (promise == null) {
                    return;
                }

                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (token != null) {
                            map.putMap("token", RadarUtils.mapForJson(token.toJson()));
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

        Radar.getVerifiedLocationToken(trackCallback);
    }


    public void clearVerifiedLocationToken() {
        Radar.clearVerifiedLocationToken();
    }


    public void startTrackingEfficient() {
        Radar.startTracking(RadarTrackingOptions.EFFICIENT);
    }


    public void startTrackingResponsive() {
        Radar.startTracking(RadarTrackingOptions.RESPONSIVE);
    }


    public void startTrackingContinuous() {
        Radar.startTracking(RadarTrackingOptions.CONTINUOUS);
    }


    public void startTrackingCustom(ReadableMap optionsMap) {
        try {
            JSONObject optionsObj = RadarUtils.jsonForMap(optionsMap);
            RadarTrackingOptions options = RadarTrackingOptions.fromJson(optionsObj);
            Radar.startTracking(options);
        } catch (JSONException e) {
            Log.e(TAG, "JSONException", e);
        }
    }


    public void startTrackingVerified(ReadableMap optionsMap) {
        boolean beacons = false;
        int interval = 1200;

        if (optionsMap != null) {
            beacons = optionsMap.hasKey("beacons") ? optionsMap.getBoolean("beacons") : beacons;
            interval = optionsMap.hasKey("interval") ? optionsMap.getInt("interval") : interval;
        }

        Radar.startTrackingVerified(interval, beacons);
    }


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

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarEvent[] events, @Nullable RadarUser user) {

            }
        });
    }


    public void stopTracking() {
        Radar.stopTracking();
    }


    public void stopTrackingVerified() {
        Radar.stopTrackingVerified();
    }


    public void isTracking(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.isTracking());
    }


    public void getTrackingOptions(final Promise promise) {
        if (promise == null) {
            return;
        }
        try {
            RadarTrackingOptions options = Radar.getTrackingOptions();
            promise.resolve(RadarUtils.mapForJson(options.toJson()));
        } catch(JSONException e) {
            Log.e(TAG, "JSONException", e);
            promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
        }
    }


    public void isUsingRemoteTrackingOptions(final Promise promise) {
        if (promise == null) {
            return;
        }

        promise.resolve(Radar.isUsingRemoteTrackingOptions());
    }


    public void setForegroundServiceOptions(ReadableMap optionsMap) {
        try {
            JSONObject optionsObj = RadarUtils.jsonForMap(optionsMap);
            RadarTrackingOptionsForegroundService options = RadarTrackingOptionsForegroundService.fromJson(optionsObj);
            Radar.setForegroundServiceOptions(options);
        } catch (JSONException e) {
            Log.e(TAG, "JSONException", e);
        }
    }


    public void setNotificationOptions(ReadableMap optionsMap) {
        try {
            JSONObject optionsObj = RadarUtils.jsonForMap(optionsMap);
            RadarNotificationOptions options = RadarNotificationOptions.fromJson(optionsObj);
            Radar.setNotificationOptions(options);
        } catch (JSONException e) {
            Log.e(TAG, "JSONException", e);
        }
    }


    public void acceptEvent(String eventId, String verifiedPlaceId) {
        Radar.acceptEvent(eventId, verifiedPlaceId);
    }


    public void rejectEvent(String eventId) {
        Radar.rejectEvent(eventId);
    }


    public void getTripOptions(final Promise promise) {
        if (promise == null) {
            return;
        }
        try {
            RadarTripOptions options = Radar.getTripOptions();
            promise.resolve(options != null ? RadarUtils.mapForJson(options.toJson()) : null);
        } catch(JSONException e) {
            Log.e(TAG, "JSONException", e);
            promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString());
        }
    }


    public void startTrip(ReadableMap optionsMap, final Promise promise) {
        try {
            JSONObject optionsJson = RadarUtils.jsonForMap(optionsMap);
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

                public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarTrip trip, @Nullable RadarEvent[] events) {
                    if (promise == null) {
                        return;
                    }
                    try {
                        if (status == Radar.RadarStatus.SUCCESS) {
                            WritableMap map = Arguments.createMap();
                            map.putString("status", status.toString());
                            if (trip != null) {
                                map.putMap("trip", RadarUtils.mapForJson(trip.toJson()));
                            }
                            if (events != null) {
                                map.putArray("events", RadarUtils.arrayForJson(RadarEvent.toJson(events)));
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


    public void completeTrip(final Promise promise) {
        Radar.completeTrip(new Radar.RadarTripCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarTrip trip, @Nullable RadarEvent[] events) {
                if (promise == null) {
                    return;
                }
                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (trip != null) {
                            map.putMap("trip", RadarUtils.mapForJson(trip.toJson()));
                        }
                        if (events != null) {
                            map.putArray("events", RadarUtils.arrayForJson(RadarEvent.toJson(events)));
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


    public void cancelTrip(final Promise promise) {
        Radar.cancelTrip(new Radar.RadarTripCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarTrip trip, @Nullable RadarEvent[] events) {
                if (promise == null) {
                    return;
                }
                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (trip != null) {
                            map.putMap("trip", RadarUtils.mapForJson(trip.toJson()));
                        }
                        if (events != null) {
                            map.putArray("events", RadarUtils.arrayForJson(RadarEvent.toJson(events)));
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


    public void updateTrip(ReadableMap optionsMap, final Promise promise) {

        try {
            JSONObject optionsObj = RadarUtils.jsonForMap(optionsMap);
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

                public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarTrip trip, @Nullable RadarEvent[] events) {
                    if (promise == null) {
                        return;
                    }
                    try {
                        if (status == Radar.RadarStatus.SUCCESS) {
                            WritableMap map = Arguments.createMap();
                            map.putString("status", status.toString());
                            if (trip != null) {
                                map.putMap("trip", RadarUtils.mapForJson(trip.toJson()));
                            }
                            if (events != null) {
                                map.putArray("events", RadarUtils.arrayForJson(RadarEvent.toJson(events)));
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


    public void getContext(@Nullable ReadableMap locationMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        Radar.RadarContextCallback callback = new Radar.RadarContextCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarContext context) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (context != null) {
                            map.putMap("context", RadarUtils.mapForJson(context.toJson()));
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

        if (locationMap == null) {
            Radar.getContext(callback);
        } else {
            double latitude = locationMap.getDouble("latitude");
            double longitude = locationMap.getDouble("longitude");
            Location location = new Location("RNRadarModule");
            location.setLatitude(latitude);
            location.setLongitude(longitude);
            Radar.getContext(location, callback);
        }
    }


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
        String[] chains = optionsMap.hasKey("chains") ? RadarUtils.stringArrayForArray(optionsMap.getArray("chains")) : null;
        Map<String, String> chainMetadata = RadarUtils.stringStringMap(optionsMap.getMap("chainMetadata"));
        String[] categories = optionsMap.hasKey("categories") ? RadarUtils.stringArrayForArray(optionsMap.getArray("categories")) : null;
        String[] groups = optionsMap.hasKey("groups") ? RadarUtils.stringArrayForArray(optionsMap.getArray("groups")) : null;
        String[] countryCodes = optionsMap.hasKey("countryCodes") ? RadarUtils.stringArrayForArray(optionsMap.getArray("countryCodes")) : null;
        int limit = optionsMap.hasKey("limit") ? optionsMap.getInt("limit") : 10;

        Radar.RadarSearchPlacesCallback callback = new Radar.RadarSearchPlacesCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarPlace[] places) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (places != null) {
                            map.putArray("places", RadarUtils.arrayForJson(RadarPlace.toJson(places)));
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
            Radar.searchPlaces(near, radius, chains, chainMetadata, categories, groups, countryCodes, limit, callback);
        } else {
            Radar.searchPlaces(radius, chains, chainMetadata, categories, groups, countryCodes, limit, callback);
        }
    }


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
        Integer radius = optionsMap.hasKey("radius") ? optionsMap.getInt("radius") : null;
        String[] tags = optionsMap.hasKey("tags") ? RadarUtils.stringArrayForArray(optionsMap.getArray("tags")) : null;
        JSONObject metadata = null;
        if (optionsMap.hasKey("metadata")) {
            try {
                metadata = RadarUtils.jsonForMap(optionsMap.getMap("metadata"));
            } catch (JSONException e) {
                Log.e(TAG, "JSONException", e);
                promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());

                return;
            }
        }

        int limit = optionsMap.hasKey("limit") ? optionsMap.getInt("limit") : 100;
        boolean includeGeometry = optionsMap.hasKey("includeGeometry") ? optionsMap.getBoolean("includeGeometry") : false;

        Radar.RadarSearchGeofencesCallback callback = new Radar.RadarSearchGeofencesCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarGeofence[] geofences) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (geofences != null) {
                            map.putArray("geofences", RadarUtils.arrayForJson(RadarGeofence.toJson(geofences)));
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
            Radar.searchGeofences(near, radius, tags, metadata, limit, includeGeometry, callback);
        } else {
            Radar.searchGeofences(radius, tags, metadata, limit, includeGeometry, callback);
        }
    }


    public void autocomplete(ReadableMap optionsMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        if (!optionsMap.hasKey("query")) {
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());

            return;
        }

        String query = optionsMap.getString("query");
        Location near = null;

        if (optionsMap.hasKey("near")) {
            ReadableMap nearMap = optionsMap.getMap("near");
            if (nearMap != null && nearMap.hasKey("latitude") && nearMap.hasKey("longitude")) {
                try {
                    double latitude = nearMap.getDouble("latitude");
                    double longitude = nearMap.getDouble("longitude");
                    near = new Location("RNRadarModule");
                    near.setLatitude(latitude);
                    near.setLongitude(longitude);
                } catch (Exception e) {
                    promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), "Invalid near coordinates");
                    return;
                }
            }
        }

        int limit = optionsMap.hasKey("limit") ? optionsMap.getInt("limit") : 10;
        String country = optionsMap.hasKey("countryCode") ? optionsMap.getString("countryCode") : optionsMap.hasKey("country") ? optionsMap.getString("country") : null;
        String[] layers = optionsMap.hasKey("layers") ? RadarUtils.stringArrayForArray(optionsMap.getArray("layers")) : null;

        boolean mailable = optionsMap.hasKey("mailable") ? optionsMap.getBoolean("mailable") : false;

        Radar.autocomplete(query, near, layers, limit, country, true, mailable, new Radar.RadarGeocodeCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress[] addresses) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (addresses != null) {
                            map.putArray("addresses", RadarUtils.arrayForJson(RadarAddress.toJson(addresses)));
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


    public void geocode(ReadableMap optionsMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        if (!optionsMap.hasKey("address")) {
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());

            return;
        }

        String address = optionsMap.getString("address");
        String[] layers = optionsMap.hasKey("layers") ? RadarUtils.stringArrayForArray(optionsMap.getArray("layers")) : null;
        String[] countries = optionsMap.hasKey("countries") ? RadarUtils.stringArrayForArray(optionsMap.getArray("countries")) : null;

        Radar.geocode(address, layers, countries, new Radar.RadarGeocodeCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress[] addresses) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (addresses != null) {
                            map.putArray("addresses", RadarUtils.arrayForJson(RadarAddress.toJson(addresses)));
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


    public void reverseGeocode(ReadableMap optionsMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        ReadableMap locationMap = null;
        String[] layers = null;

        if (optionsMap != null) {
            locationMap = optionsMap.getMap("location");
            layers = optionsMap.hasKey("layers") ? RadarUtils.stringArrayForArray(optionsMap.getArray("layers")) : null;
        }

        Radar.RadarGeocodeCallback callback = new Radar.RadarGeocodeCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress[] addresses) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (addresses != null) {
                            map.putArray("addresses", RadarUtils.arrayForJson(RadarAddress.toJson(addresses)));
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

        if (locationMap != null) {
            double latitude = locationMap.getDouble("latitude");
            double longitude = locationMap.getDouble("longitude");
            Location location = new Location("RNRadarModule");
            location.setLatitude(latitude);
            location.setLongitude(longitude);

            Radar.reverseGeocode(location, layers, callback);
        } else {
            Radar.reverseGeocode(layers, callback);
        }
    }


    public void ipGeocode(final Promise promise) {
        if (promise == null) {
            return;
        }

        Radar.ipGeocode(new Radar.RadarIpGeocodeCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress address, boolean proxy) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (address != null) {
                            map.putMap("address", RadarUtils.mapForJson(address.toJson()));
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


    public void validateAddress(ReadableMap addressMap, final Promise promise) {
        if (promise == null) {
            return;
        }

        RadarAddress address;
        try {
            address = RadarAddress.fromJson(RadarUtils.jsonForMap(addressMap));
        } catch (JSONException e) {
            promise.reject(Radar.RadarStatus.ERROR_BAD_REQUEST.toString(), Radar.RadarStatus.ERROR_BAD_REQUEST.toString());
            return;
        }
        Radar.validateAddress(address, new Radar.RadarValidateAddressCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarAddress address, @Nullable Radar.RadarAddressVerificationStatus verificationStatus) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (address != null) {
                            map.putMap("address", RadarUtils.mapForJson(address.toJson()));
                        }
                        if (verificationStatus != null) {
                            map.putString("verificationStatus", verificationStatus.toString());
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
        String[] modesArr = optionsMap.hasKey("modes") ? RadarUtils.stringArrayForArray(optionsMap.getArray("modes")) : new String[]{};
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

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarRoutes routes) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (routes != null) {
                            map.putMap("routes", RadarUtils.mapForJson(routes.toJson()));
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

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarRouteMatrix matrix) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (matrix != null) {
                            map.putArray("matrix", RadarUtils.arrayForJson(matrix.toJson()));
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

        JSONObject metadataObj = RadarUtils.jsonForMap(metadata);
        Radar.RadarLogConversionCallback callback = new Radar.RadarLogConversionCallback() {

            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable RadarEvent event) {
                try {
                    if (status == Radar.RadarStatus.SUCCESS) {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (event != null) {
                            map.putMap("event", RadarUtils.mapForJson(event.toJson()));
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

    public void showInAppMessage(ReadableMap inAppMessageMap) {
        RadarInAppMessage inAppMessage;
        try {
            inAppMessage = RadarInAppMessage.fromJson(RadarUtils.jsonForMap(inAppMessageMap).toString());
        } catch (JSONException e) {
            Log.e(TAG, "JSONException", e);
            return;
        }
        Radar.showInAppMessage(inAppMessage);
    }

    public void setPushNotificationToken(String token) {
        Radar.setPushNotificationToken(token);
    }

    public void isInitialized(final Promise promise) {
        if (promise == null) {
            return;
        }
        promise.resolve(Radar.isInitialized());
    }

    public void setAppGroup(String groupId) {
        // No-op on Android - app groups are iOS-specific
    }

    public void setLocationExtensionToken(String token) {
        // No-op on Android - location extensions are iOS-specific
    }
}
