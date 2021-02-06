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
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import io.radar.sdk.Radar;
import io.radar.sdk.RadarTrackingOptions;
import io.radar.sdk.RadarTripOptions;
import io.radar.sdk.model.RadarAddress;
import io.radar.sdk.model.RadarContext;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarGeofence;
import io.radar.sdk.model.RadarPlace;
import io.radar.sdk.model.RadarPoint;
import io.radar.sdk.model.RadarRoutes;
import io.radar.sdk.model.RadarUser;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.EnumSet;

public class RNRadarModule extends ReactContextBaseJavaModule {

    private static final String TAG = "RNRadarModule";

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
        if (promise == null) {
            return;
        }

        boolean foreground = ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        if (Build.VERSION.SDK_INT >= 29) {
            if (foreground) {
                boolean background = ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
                promise.resolve(background ? "GRANTED_BACKGROUND" : "GRANTED_FOREGROUND");
            } else {
                promise.resolve("DENIED");
            }
        } else {
            promise.resolve(foreground ? "GRANTED_BACKGROUND" : "DENIED");
        }
    }

    @ReactMethod
    public void requestPermissions(boolean background) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            if (Build.VERSION.SDK_INT >= 23) {
                int requestCode = 0;
                if (background && Build.VERSION.SDK_INT >= 29) {
                    ActivityCompat.requestPermissions(activity, new String[] { Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_BACKGROUND_LOCATION }, requestCode);
                } else {
                    ActivityCompat.requestPermissions(activity, new String[] { Manifest.permission.ACCESS_FINE_LOCATION }, requestCode);
                }
            }
        }
    }

    @ReactMethod
    public void getLocation(final Promise promise) {
        Radar.getLocation(new Radar.RadarLocationCallback() {
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
                            map.putArray("events", RNRadarUtils.arrayForJson(RadarEvent.toJson(events)));
                        }
                        if (user != null) {
                            map.putMap("user", RNRadarUtils.mapForJson(user.toJson()));
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
    public void trackOnce(ReadableMap locationMap, final Promise promise) {
        if (locationMap == null) {
            this.trackOnce(promise);

            return;
        }

        double latitude = locationMap.getDouble("latitude");
        double longitude = locationMap.getDouble("longitude");
        float accuracy = (float)locationMap.getDouble("accuracy");
        Location location = new Location("RNRadarModule");
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setAccuracy(accuracy);

        Radar.trackOnce(location, new Radar.RadarTrackCallback() {
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
    public void acceptEvent(String eventId, String verifiedPlaceId) {
        Radar.acceptEvent(eventId, verifiedPlaceId);
    }

    @ReactMethod
    public void rejectEvent(String eventId) {
        Radar.rejectEvent(eventId);
    }

    @ReactMethod
    public void startTrip(ReadableMap optionsMap) {
        try {
            JSONObject optionsObj = RNRadarUtils.jsonForMap(optionsMap);
            RadarTripOptions options = RadarTripOptions.fromJson(optionsObj);
            Radar.startTrip(options);
        } catch (JSONException e) {
            Log.e(TAG, "JSONException", e);
        }
    }

    @ReactMethod
    public void stopTrip() {
        Radar.stopTrip();
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
            Radar.searchPlaces(near, radius, chains, categories, groups, limit, callback);
        } else {
            Radar.searchPlaces(radius, chains, categories, groups, limit, callback);
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
    public void searchPoints(ReadableMap optionsMap, final Promise promise) {
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
        int limit = optionsMap.hasKey("limit") ? optionsMap.getInt("limit") : 10;

        Radar.RadarSearchPointsCallback callback = new Radar.RadarSearchPointsCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location, @Nullable RadarPoint[] points) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    try {
                        WritableMap map = Arguments.createMap();
                        map.putString("status", status.toString());
                        if (location != null) {
                            map.putMap("location", RNRadarUtils.mapForJson(Radar.jsonForLocation(location)));
                        }
                        if (points != null) {
                            map.putArray("points", RNRadarUtils.arrayForJson(RadarPoint.toJson(points)));
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
            Radar.searchPoints(near, radius, tags, limit, callback);
        } else {
            Radar.searchPoints(radius, tags, limit, callback);
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

        Radar.autocomplete(query, near, limit, new Radar.RadarGeocodeCallback() {
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

}
