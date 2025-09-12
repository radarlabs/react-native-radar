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
import io.radar.sdk.RadarNotificationOptions;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.EnumSet;
import java.util.Map;

public class RadarModule extends ReactContextBaseJavaModule implements PermissionListener {

    public static final String NAME = "RNRadar";
    private static final String TAG = "RadarModule";
    private static final int PERMISSIONS_REQUEST_CODE = 20160525; // random request code (Radar's birthday!)
    private Promise mPermissionsRequestPromise;

    private RadarOldArchReceiver receiver;
    private RadarOldArchVerifiedReceiver verifiedReceiver;
    private RadarOldArchInAppMessageReceiver inAppMessageReceiver;
    private int listenerCount = 0;
    private boolean fraud = false;
    private RadarModuleImpl radarModuleImpl;

    public RadarModule(ReactApplicationContext reactContext) {
        super(reactContext);
        receiver = new RadarOldArchReceiver();
        verifiedReceiver = new RadarOldArchVerifiedReceiver();
        inAppMessageReceiver = new RadarOldArchInAppMessageReceiver(reactContext);
        radarModuleImpl = new RadarModuleImpl();
    }

    @ReactMethod
    public void addListener(String eventName) {
        if (listenerCount == 0) {
            if (fraud) {
                verifiedReceiver.hasListeners = true;
            }
            receiver.hasListeners = true;
            inAppMessageReceiver.hasListeners = true;
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
            inAppMessageReceiver.hasListeners = false;
        }
    }

    @Override
    public String getName() {
        return "RNRadar";
    }

    @ReactMethod
    public void initialize(String publishableKey, boolean fraud) {
        this.fraud = fraud;
        SharedPreferences.Editor editor = getReactApplicationContext().getSharedPreferences("RadarSDK", Context.MODE_PRIVATE).edit();
        editor.putString("x_platform_sdk_type", "ReactNative");
        editor.putString("x_platform_sdk_version", "3.23.2");
        editor.apply();
        Radar.initialize(getReactApplicationContext(), publishableKey, receiver, Radar.RadarLocationServicesProvider.GOOGLE, fraud, null, inAppMessageReceiver, getCurrentActivity());
        if (fraud) { 
            Radar.setVerifiedReceiver(verifiedReceiver);
        }
    }

    @ReactMethod
    public void setLogLevel(String level) {
        radarModuleImpl.setLogLevel(level);
    }

    @ReactMethod
    public void setUserId(String userId) {
        radarModuleImpl.setUserId(userId);
    }

    @ReactMethod
    public void getUserId(final Promise promise) {
        radarModuleImpl.getUserId(promise);
    }

    @ReactMethod
    public void setDescription(String description) {
        radarModuleImpl.setDescription(description);
    }

    @ReactMethod
    public void getDescription(final Promise promise) {
        radarModuleImpl.getDescription(promise);
    }

    @ReactMethod
    public void nativeSdkVersion(final Promise promise) {
        radarModuleImpl.nativeSdkVersion(promise);
    }

    @ReactMethod
    public void setMetadata(ReadableMap metadataMap) throws JSONException {
        radarModuleImpl.setMetadata(metadataMap);
    }

    @ReactMethod
    public void getMetadata(final Promise promise) throws JSONException {
        radarModuleImpl.getMetadata(promise);
    }

    @ReactMethod
    public void setTags(ReadableArray tags) throws JSONException {
        radarModuleImpl.setTags(tags);
    }

    @ReactMethod
    public void getTags(final Promise promise) throws JSONException {
        radarModuleImpl.getTags(promise);
    }

    @ReactMethod
    public void addTags(ReadableArray tags) throws JSONException {
        radarModuleImpl.addTags(tags);
    }

    @ReactMethod
    public void removeTags(ReadableArray tags) throws JSONException {
        radarModuleImpl.removeTags(tags);
    }

    @ReactMethod
    public void setAnonymousTrackingEnabled(boolean enabled) {
        radarModuleImpl.setAnonymousTrackingEnabled(enabled);
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

        boolean foreground = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                             ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
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
                    activity.requestPermissions(new String[] { Manifest.permission.ACCESS_BACKGROUND_LOCATION }, PERMISSIONS_REQUEST_CODE, this);
                } else {
                    activity.requestPermissions(new String[] { Manifest.permission.ACCESS_FINE_LOCATION }, PERMISSIONS_REQUEST_CODE, this);
                }
            }
        }
    }

    @ReactMethod
    public void getLocation(String desiredAccuracy, final Promise promise) {
        radarModuleImpl.getLocation(desiredAccuracy, promise);
    }

    @ReactMethod
    public void trackOnce(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.trackOnce(optionsMap, promise);
    }

    @ReactMethod
    public void trackVerified(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.trackVerified(optionsMap, promise);
    }

    @ReactMethod
    public void isTrackingVerified(final Promise promise) {
        radarModuleImpl.isTrackingVerified(promise);
    }

    @ReactMethod
    public void setProduct(String product) {
        radarModuleImpl.setProduct(product);
    }

    @ReactMethod
    public void getProduct(final Promise promise) throws JSONException {
        radarModuleImpl.getProduct(promise);
    }

    @ReactMethod
    public void getVerifiedLocationToken(final Promise promise) {
        radarModuleImpl.getVerifiedLocationToken(promise);
    }

    @ReactMethod
    public void clearVerifiedLocationToken() {
        radarModuleImpl.clearVerifiedLocationToken();
    }

    @ReactMethod
    public void startTrackingEfficient() {
        radarModuleImpl.startTrackingEfficient();
    }

    @ReactMethod
    public void startTrackingResponsive() {
        radarModuleImpl.startTrackingResponsive();
    }

    @ReactMethod
    public void startTrackingContinuous() {
        radarModuleImpl.startTrackingContinuous();
    }

    @ReactMethod
    public void startTrackingCustom(ReadableMap optionsMap) {
        radarModuleImpl.startTrackingCustom(optionsMap);
    }

    @ReactMethod
    public void startTrackingVerified(ReadableMap optionsMap) {
        radarModuleImpl.startTrackingVerified(optionsMap);
    }

    @ReactMethod
    public void mockTracking(ReadableMap optionsMap) {
        radarModuleImpl.mockTracking(optionsMap);
    }

    @ReactMethod
    public void stopTracking() {
        radarModuleImpl.stopTracking();
    }

    @ReactMethod
    public void stopTrackingVerified() {
        radarModuleImpl.stopTrackingVerified();
    }

    @ReactMethod
    public void isTracking(final Promise promise) {
        radarModuleImpl.isTracking(promise);
    }

    @ReactMethod
    public void getTrackingOptions(final Promise promise) {
        radarModuleImpl.getTrackingOptions(promise);
    }

    @ReactMethod
    public void isUsingRemoteTrackingOptions(final Promise promise) {
        radarModuleImpl.isUsingRemoteTrackingOptions(promise);
    }

    @ReactMethod
    public void setForegroundServiceOptions(ReadableMap optionsMap) {
        radarModuleImpl.setForegroundServiceOptions(optionsMap);
    }

    @ReactMethod
    public void setNotificationOptions(ReadableMap optionsMap) {
        radarModuleImpl.setNotificationOptions(optionsMap);
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
        radarModuleImpl.getTripOptions(promise);
    }

    @ReactMethod
    public void startTrip(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.startTrip(optionsMap, promise);
    }

    @ReactMethod
    public void completeTrip(final Promise promise) {
        radarModuleImpl.completeTrip(promise);
    }

    @ReactMethod
    public void cancelTrip(final Promise promise) {
        radarModuleImpl.cancelTrip(promise);
    }

    @ReactMethod
    public void updateTrip(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.updateTrip(optionsMap, promise);
    }

    @ReactMethod
    public void getContext(@Nullable ReadableMap locationMap, final Promise promise) {
        radarModuleImpl.getContext(locationMap, promise);
    }

    @ReactMethod
    public void searchPlaces(ReadableMap optionsMap, final Promise promise) {
       radarModuleImpl.searchPlaces(optionsMap, promise);
    }

    @ReactMethod
    public void searchGeofences(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.searchGeofences(optionsMap, promise);
    }

    @ReactMethod
    public void autocomplete(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.autocomplete(optionsMap, promise);
    }

    @ReactMethod
    public void geocode(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.geocode(optionsMap, promise);
    }

    @ReactMethod
    public void reverseGeocode(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.reverseGeocode(optionsMap, promise);
    }

    @ReactMethod
    public void ipGeocode(final Promise promise) {
        radarModuleImpl.ipGeocode(promise);
    }

    @ReactMethod
    public void validateAddress(ReadableMap addressMap, final Promise promise) {
        radarModuleImpl.validateAddress(addressMap, promise);
    }

    @ReactMethod
    public void getDistance(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.getDistance(optionsMap, promise);
    }

    @ReactMethod
    public void getMatrix(ReadableMap optionsMap, final Promise promise) {
        radarModuleImpl.getMatrix(optionsMap, promise);
    }

    @ReactMethod
    public void logConversion(ReadableMap optionsMap, final Promise promise) throws JSONException  {
        radarModuleImpl.logConversion(optionsMap, promise);
    }

    @ReactMethod
    public void getHost(final Promise promise) {
        radarModuleImpl.getHost(promise);
    }

    @ReactMethod
    public void getPublishableKey(final Promise promise) {
        radarModuleImpl.getPublishableKey(promise);
    }

    @ReactMethod
    public void showInAppMessage(ReadableMap inAppMessageMap) {
        radarModuleImpl.showInAppMessage(inAppMessageMap);
    }

}
