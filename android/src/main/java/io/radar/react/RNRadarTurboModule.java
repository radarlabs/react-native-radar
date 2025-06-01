package io.radar.react;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.location.Location;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.turbomodule.core.CallInvokerHolderImpl;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import io.radar.sdk.Radar;
import io.radar.sdk.RadarReceiver;
import io.radar.sdk.model.RadarEvent;
import io.radar.sdk.model.RadarUser;

@ReactModule(name = RNRadarTurboModule.NAME)
public class RNRadarTurboModule extends NativeRadarTurboModuleSpec implements TurboModule, RadarReceiver {
    public static final String NAME = "RadarTurboModuleSpec";
    private final Set<String> activeListeners = new HashSet<>();
    private final ReactApplicationContext reactContext;

    public RNRadarTurboModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        Radar.setReceiver(this);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    private void sendEvent(String eventName, @Nullable WritableMap params) {
        if (activeListeners.contains(eventName)) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }

    @ReactMethod
    public void initialize(String publishableKey) {
        Radar.initialize(getReactApplicationContext(), publishableKey);
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
    public void setMetadata(ReadableMap metadata) {
        Radar.setMetadata(RNRadarUtils.convertReadableMapToJson(metadata));
    }

    @ReactMethod
    public void getLocation(Promise promise) {
        Radar.getLocation(new Radar.RadarLocationCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location) {
                if (status == Radar.RadarStatus.SUCCESS && location != null) {
                    WritableMap map = Arguments.createMap();
                    map.putDouble("latitude", location.getLatitude());
                    map.putDouble("longitude", location.getLongitude());
                    map.putDouble("accuracy", location.getAccuracy());
                    promise.resolve(map);
                } else {
                    promise.reject("error", "Failed to get location");
                }
            }
        });
    }

    @ReactMethod
    public void trackOnce(Promise promise) {
        Radar.trackOnce(new Radar.RadarCallback() {
            @Override
            public void onComplete(@NonNull Radar.RadarStatus status, @Nullable Location location,
                    @Nullable RadarUser user, @Nullable RadarEvents events) {
                if (status == Radar.RadarStatus.SUCCESS) {
                    WritableMap map = Arguments.createMap();
                    if (location != null) {
                        WritableMap locationMap = Arguments.createMap();
                        locationMap.putDouble("latitude", location.getLatitude());
                        locationMap.putDouble("longitude", location.getLongitude());
                        locationMap.putDouble("accuracy", location.getAccuracy());
                        map.putMap("location", locationMap);
                    }
                    promise.resolve(map);
                } else {
                    promise.reject("error", "Failed to track location");
                }
            }
        });
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
    public void mockTracking(ReadableMap options) {
        // Implementation for mock tracking
    }

    @ReactMethod
    public void searchPlaces(ReadableMap options, Promise promise) {
        // Implementation for searching places
    }

    @ReactMethod
    public void searchGeofences(ReadableMap options, Promise promise) {
        // Implementation for searching geofences
    }

    @ReactMethod
    public void startTrip(ReadableMap options, Promise promise) {
        // Implementation for starting a trip
    }

    @ReactMethod
    public void completeTrip(Promise promise) {
        // Implementation for completing a trip
    }

    @ReactMethod
    public void cancelTrip(Promise promise) {
        // Implementation for canceling a trip
    }

    @ReactMethod
    public void addListener(String eventName) {
        activeListeners.add(eventName);
    }

    @ReactMethod
    public void removeListener(String eventName) {
        activeListeners.remove(eventName);
    }

    // RadarReceiver implementation
    @Override
    public void onEventsReceived(@NonNull List<RadarEvent> events, @NonNull RadarUser user) {
        if (!activeListeners.contains("events"))
            return;

        WritableMap params = Arguments.createMap();
        WritableArray eventsArray = Arguments.createArray();

        for (RadarEvent event : events) {
            eventsArray.pushMap(convertEventToWritableMap(event));
        }

        params.putArray("events", eventsArray);
        params.putMap("user", convertUserToWritableMap(user));

        sendEvent("events", params);
    }

    @Override
    public void onLocationUpdated(@NonNull Location location, @NonNull RadarUser user) {
        if (!activeListeners.contains("location"))
            return;

        WritableMap params = Arguments.createMap();
        params.putMap("location", convertLocationToWritableMap(location));
        params.putMap("user", convertUserToWritableMap(user));

        sendEvent("location", params);
    }

    @Override
    public void onClientLocationUpdated(@NonNull Location location, boolean stopped,
            @NonNull Radar.RadarLocationSource source) {
        if (!activeListeners.contains("clientLocation"))
            return;

        WritableMap params = Arguments.createMap();
        params.putMap("location", convertLocationToWritableMap(location));
        params.putBoolean("stopped", stopped);
        params.putString("source", convertLocationSourceToString(source));

        sendEvent("clientLocation", params);
    }

    @Override
    public void onError(@NonNull Radar.RadarStatus status) {
        if (!activeListeners.contains("error"))
            return;

        WritableMap params = Arguments.createMap();
        params.putString("status", convertStatusToString(status));

        sendEvent("error", params);
    }

    // Helper methods for converting Radar objects to WritableMap
    private WritableMap convertLocationToWritableMap(Location location) {
        WritableMap map = Arguments.createMap();
        map.putDouble("latitude", location.getLatitude());
        map.putDouble("longitude", location.getLongitude());
        map.putDouble("accuracy", location.getAccuracy());
        return map;
    }

    private WritableMap convertUserToWritableMap(RadarUser user) {
        WritableMap map = Arguments.createMap();
        map.putString("_id", user.getId());
        map.putString("userId", user.getUserId());
        if (user.getDescription() != null) {
            map.putString("description", user.getDescription());
        }
        if (user.getMetadata() != null) {
            map.putMap("metadata", RNRadarUtils.convertJsonToWritableMap(user.getMetadata()));
        }
        return map;
    }

    private WritableMap convertEventToWritableMap(RadarEvent event) {
        WritableMap map = Arguments.createMap();
        map.putString("_id", event.getId());
        map.putString("type", event.getType().toString());
        if (event.getMetadata() != null) {
            map.putMap("metadata", RNRadarUtils.convertJsonToWritableMap(event.getMetadata()));
        }
        return map;
    }

    private String convertLocationSourceToString(Radar.RadarLocationSource source) {
        switch (source) {
            case FOREGROUND_LOCATION:
                return "FOREGROUND_LOCATION";
            case BACKGROUND_LOCATION:
                return "BACKGROUND_LOCATION";
            case MANUAL:
                return "MANUAL";
            case VISIT:
                return "VISIT";
            case GEOFENCE_ENTER:
                return "GEOFENCE_ENTER";
            case GEOFENCE_EXIT:
                return "GEOFENCE_EXIT";
            default:
                return "UNKNOWN";
        }
    }

    private String convertStatusToString(Radar.RadarStatus status) {
        switch (status) {
            case SUCCESS:
                return "SUCCESS";
            case ERROR_PUBLISHABLE_KEY:
                return "ERROR_PUBLISHABLE_KEY";
            case ERROR_PERMISSIONS:
                return "ERROR_PERMISSIONS";
            case ERROR_LOCATION:
                return "ERROR_LOCATION";
            case ERROR_NETWORK:
                return "ERROR_NETWORK";
            case ERROR_BAD_REQUEST:
                return "ERROR_BAD_REQUEST";
            case ERROR_UNAUTHORIZED:
                return "ERROR_UNAUTHORIZED";
            case ERROR_PAYMENT_REQUIRED:
                return "ERROR_PAYMENT_REQUIRED";
            case ERROR_FORBIDDEN:
                return "ERROR_FORBIDDEN";
            case ERROR_NOT_FOUND:
                return "ERROR_NOT_FOUND";
            case ERROR_RATE_LIMIT:
                return "ERROR_RATE_LIMIT";
            case ERROR_SERVER:
                return "ERROR_SERVER";
            default:
                return "ERROR_UNKNOWN";
        }
    }
}