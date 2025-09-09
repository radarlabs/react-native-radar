package com.radar;

import android.content.Context;
import android.view.View;
import android.util.Log;

import kotlin.Unit;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.functions.Function1;

import org.json.JSONObject;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import io.radar.sdk.Radar;
import io.radar.sdk.model.RadarInAppMessage;
import io.radar.sdk.RadarInAppMessageReceiver;

public class RadarOldArchInAppMessageReceiver implements RadarInAppMessageReceiver {
    private ReactNativeHost reactNativeHost;
    private static final String TAG = "RadarOldArchInAppMessageReceiver";
    protected boolean hasListeners = false;
    
    public RadarOldArchInAppMessageReceiver(Context context) {
        try {
            ReactApplication reactApplication = ((ReactApplication)context.getApplicationContext());
            this.reactNativeHost = reactApplication.getReactNativeHost();
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize ReactNativeHost", e);
        }
    }

    private void sendEvent(final String eventName, final Object data) {
        if (reactNativeHost == null) {
            Log.w(TAG, "ReactNativeHost not initialized, cannot send event: " + eventName);
            return;
        }
        
        final ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext != null && hasListeners) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
        }
    }

    @Override
    public void onNewInAppMessage(RadarInAppMessage message) {
        try {
            WritableMap map = Arguments.createMap();
            map.putMap("inAppMessage", RadarUtils.mapForJson(new JSONObject(message.toJson())));
            sendEvent("newInAppMessageEmitter", map);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onInAppMessageDismissed(RadarInAppMessage message) {
        try {
            WritableMap map = Arguments.createMap();
            map.putMap("inAppMessage", RadarUtils.mapForJson(new JSONObject(message.toJson())));
            sendEvent("inAppMessageDismissedEmitter", map);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void onInAppMessageButtonClicked(RadarInAppMessage message) {
        try {
            WritableMap map = Arguments.createMap();
            map.putMap("inAppMessage", RadarUtils.mapForJson(new JSONObject(message.toJson())));
            sendEvent("inAppMessageClickedEmitter", map);
        } catch (Exception e) {
            Log.e(TAG, "Exception", e);
        }
    }

    @Override
    public void createInAppMessageView(
        Context context, 
        RadarInAppMessage inAppMessage, 
        Function0<Unit> onDismissListener, 
        Function0<Unit> onInAppMessageButtonClicked,
        Function1<? super View, Unit> onViewReady
    ) {
        RadarInAppMessageReceiver.DefaultImpls.createInAppMessageView(
            this, context, inAppMessage, onDismissListener, onInAppMessageButtonClicked, onViewReady
        );
    }
}
