package com.radar

import android.Manifest
import android.os.Build
import android.util.Log
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import io.radar.sdk.Radar
import io.radar.sdk.RadarReceiver
import io.radar.sdk.model.RadarEvent
import io.radar.sdk.model.RadarUser
import io.radar.sdk.RadarTrackingOptions
import io.radar.sdk.RadarTripOptions
import io.radar.sdk.RadarVerifiedReceiver
import io.radar.sdk.model.RadarAddress
import io.radar.sdk.model.RadarContext
import io.radar.sdk.model.RadarGeofence
import io.radar.sdk.model.RadarPlace
import io.radar.sdk.model.RadarRouteMatrix
import io.radar.sdk.model.RadarRoutes
import io.radar.sdk.model.RadarTrip
import io.radar.sdk.model.RadarVerifiedLocationToken
import io.radar.sdk.model.RadarInAppMessage
import io.radar.sdk.RadarNotificationOptions
import io.radar.sdk.RadarInAppMessageReceiver
import android.content.Context
import android.location.Location
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableArray
import org.json.JSONException
import org.json.JSONObject

@ReactModule(name = RadarModule.NAME)
class RadarModule(reactContext: ReactApplicationContext) :
    NativeRadarSpec(reactContext), PermissionListener {

    private val radarReceiver = object : RadarReceiver() {
        override fun onEventsReceived(context: Context, events: Array<RadarEvent>, user: RadarUser?) {
            val eventBlob = Arguments.createMap().apply {
                var eventsArray = Arguments.createArray()
                for (event in events) {
                    eventsArray.pushMap(RadarUtils.mapForJson(event.toJson()))
                }
                putArray("events", eventsArray)
                if (user != null) {
                    putMap("user", RadarUtils.mapForJson(user.toJson()))
                }
            }
            emitEventsEmitter(eventBlob)
        }

        override fun onLocationUpdated(context: Context, location: Location, user: RadarUser) {
            val eventBlob = Arguments.createMap().apply {
                putString("location", Radar.jsonForLocation(location).toString())
                putString("user", user.toJson().toString())
            }
            emitLocationEmitter(eventBlob)
        }

        override fun onClientLocationUpdated(context: Context, location: Location, stopped: Boolean, source: Radar.RadarLocationSource) {
            val eventBlob = Arguments.createMap().apply {
                putString("location", Radar.jsonForLocation(location).toString())
                putBoolean("stopped", stopped)
                putString("source", source.toString())
            }
            emitClientLocationEmitter(eventBlob)
        }

        override fun onError(context: Context, status: Radar.RadarStatus) {
            val eventBlob = Arguments.createMap().apply {
                putString("status", status.toString())
            }
            emitErrorEmitter(eventBlob)
        }

        override fun onLog(context: Context, message: String) {
            val eventBlob = Arguments.createMap().apply {
                putString("message", message)
            }
            emitLogEmitter(eventBlob)
        }
    }

    private val radarInAppMessageReceiver = object : RadarInAppMessageReceiver {
        override fun onNewInAppMessage(message: RadarInAppMessage) {
            try {
            val eventBlob = Arguments.createMap().apply {
                putMap("inAppMessage", RadarUtils.mapForJson(JSONObject(message.toJson())))
            }
                emitNewInAppMessageEmitter(eventBlob)
            } catch (e: Exception) {
                Log.e(TAG, "Exception", e)
            }
        }

        override fun onInAppMessageDismissed(message: RadarInAppMessage) {
            try {
                val eventBlob = Arguments.createMap().apply {
                    putMap("inAppMessage", RadarUtils.mapForJson(JSONObject(message.toJson())))
                }
                emitInAppMessageDismissedEmitter(eventBlob)
            } catch (e: Exception) {
                Log.e(TAG, "Exception", e)
            }
        }

        override fun onInAppMessageButtonClicked(message: RadarInAppMessage) {
            try {
                val eventBlob = Arguments.createMap().apply {
                    putMap("inAppMessage", RadarUtils.mapForJson(JSONObject(message.toJson())))
                }
                emitInAppMessageClickedEmitter(eventBlob)
            } catch (e: Exception) {
                Log.e(TAG, "Exception", e)
            }
        }
    }

    private val radarVerifiedReceiver = object : RadarVerifiedReceiver() {
        override fun onTokenUpdated(context: Context, token: RadarVerifiedLocationToken) {
            val eventBlob = Arguments.createMap().apply {
                putString("token", token.toJson().toString())
            }
            emitTokenEmitter(eventBlob)
        }
    }

    private val radarModuleImpl = RadarModuleImpl()

    private var mPermissionsRequestPromise: Promise? = null

    override fun getName(): String {
        return NAME
    }

    override fun initialize(publishableKey: String, fraud: Boolean): Unit {
        val editor = reactApplicationContext.getSharedPreferences("RadarSDK", Context.MODE_PRIVATE).edit()
        editor.putString("x_platform_sdk_type", "ReactNative")
        editor.putString("x_platform_sdk_version", "3.23.0-beta.3")
        editor.apply()

        Radar.initialize(reactApplicationContext, publishableKey, null, Radar.RadarLocationServicesProvider.GOOGLE, fraud, null, null, currentActivity)
        Radar.setInAppMessageReceiver(radarInAppMessageReceiver)
        if (fraud) {
            Radar.setVerifiedReceiver(radarVerifiedReceiver)
        } 
    }

    override fun setLogLevel(level: String): Unit {
        radarModuleImpl.setLogLevel(level)
    }

    override fun setUserId(userId: String): Unit {
        radarModuleImpl.setUserId(userId)
    }

    override fun getUserId(promise: Promise): Unit {
        radarModuleImpl.getUserId(promise)
    }

    override fun setDescription(description: String): Unit {
        radarModuleImpl.setDescription(description)
    }

    override fun getDescription(promise: Promise): Unit {
        radarModuleImpl.getDescription(promise)
    }

    override fun setMetadata(metadata: ReadableMap): Unit {
        radarModuleImpl.setMetadata(metadata)
    }

    override fun getMetadata(promise: Promise): Unit {
        radarModuleImpl.getMetadata(promise)
    }

    override fun setTags(tags: ReadableArray): Unit {
        radarModuleImpl.setTags(tags)
    }

    override fun getTags(promise: Promise): Unit {
        radarModuleImpl.getTags(promise)
    }

    override fun addTags(tags: ReadableArray): Unit {
        radarModuleImpl.addTags(tags)
    }

    override fun removeTags(tags: ReadableArray): Unit {
        radarModuleImpl.removeTags(tags)
    }

    override fun setProduct(product: String): Unit {
        radarModuleImpl.setProduct(product)
    }

    override fun getProduct(promise: Promise): Unit {
        radarModuleImpl.getProduct(promise)
    }

    override fun setAnonymousTrackingEnabled(enabled: Boolean): Unit {
        radarModuleImpl.setAnonymousTrackingEnabled(enabled)
    }

    override fun requestPermissions(background: Boolean, promise: Promise): Unit {
        mPermissionsRequestPromise = promise
        val activity = currentActivity as? PermissionAwareActivity
        if (activity != null && Build.VERSION.SDK_INT >= 23) {
            if (background && Build.VERSION.SDK_INT >= 29) {
                activity.requestPermissions(
                    arrayOf(Manifest.permission.ACCESS_BACKGROUND_LOCATION),
                    PERMISSIONS_REQUEST_CODE,
                    this
                )
            } else {
                activity.requestPermissions(
                    arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                    PERMISSIONS_REQUEST_CODE,
                    this
                )
            }
        }
    }

    override fun getPermissionsStatus(promise: Promise): Unit {
        if (promise == null) {
            return
        }

        val activity = currentActivity

        if (activity == null) {
            promise.resolve("UNKNOWN")
            return
        }

        val foreground = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
        var background = foreground
        val denied = ActivityCompat.shouldShowRequestPermissionRationale(activity, Manifest.permission.ACCESS_FINE_LOCATION)

        if (Build.VERSION.SDK_INT >= 29) {
            background = ActivityCompat.checkSelfPermission(activity, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED
        }

        when {
            background -> promise.resolve("GRANTED_BACKGROUND")
            foreground -> promise.resolve("GRANTED_FOREGROUND")
            denied -> promise.resolve("DENIED")
            else -> promise.resolve("NOT_DETERMINED")
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray): Boolean {
        if (requestCode == PERMISSIONS_REQUEST_CODE && mPermissionsRequestPromise != null) {
            // Handle permission result here
            val promise = mPermissionsRequestPromise
            mPermissionsRequestPromise = null
            getPermissionsStatus(promise!!)
            return true
        }
        return false
    }

    override fun trackOnce(trackOnceOptions: ReadableMap?, promise: Promise): Unit {
        radarModuleImpl.trackOnce(trackOnceOptions, promise)
    }

    override fun getLocation(desiredAccuracy: String?, promise: Promise): Unit {
        radarModuleImpl.getLocation(desiredAccuracy, promise)
    }

    override fun trackVerified(trackVerifiedOptions: ReadableMap?, promise: Promise): Unit {
        radarModuleImpl.trackVerified(trackVerifiedOptions, promise)
    }

    override fun getVerifiedLocationToken(promise: Promise): Unit {
        radarModuleImpl.getVerifiedLocationToken(promise)
    }

    override fun clearVerifiedLocationToken(): Unit {
        radarModuleImpl.clearVerifiedLocationToken()
    }

    override fun startTrackingEfficient(): Unit {
        radarModuleImpl.startTrackingEfficient()
    }

    override fun startTrackingResponsive(): Unit {
        radarModuleImpl.startTrackingResponsive()
    }

    override fun startTrackingContinuous(): Unit {
        radarModuleImpl.startTrackingContinuous()
    }

    override fun startTrackingCustom(options: ReadableMap): Unit {
        radarModuleImpl.startTrackingCustom(options)
    }

    override fun startTrackingVerified(options: ReadableMap?): Unit {
        radarModuleImpl.startTrackingVerified(options)
    }

    override fun isTrackingVerified(promise: Promise): Unit {
        radarModuleImpl.isTrackingVerified(promise)
    }

    override fun mockTracking(options: ReadableMap): Unit {
        radarModuleImpl.mockTracking(options)
    }

    override fun stopTracking(): Unit {
        radarModuleImpl.stopTracking()
    }

    override fun stopTrackingVerified(): Unit {
        radarModuleImpl.stopTrackingVerified()
    }

    override fun getTrackingOptions(promise: Promise): Unit {
        radarModuleImpl.getTrackingOptions(promise)
    }

    override fun isUsingRemoteTrackingOptions(promise: Promise): Unit {
        radarModuleImpl.isUsingRemoteTrackingOptions(promise)
    }

    override fun isTracking(promise: Promise): Unit {
        radarModuleImpl.isTracking(promise)
    }

    override fun setForegroundServiceOptions(options: ReadableMap): Unit {
        radarModuleImpl.setForegroundServiceOptions(options)
    }

    override fun setNotificationOptions(options: ReadableMap): Unit {
        radarModuleImpl.setNotificationOptions(options)
    }

    override fun getTripOptions(promise: Promise): Unit {
        radarModuleImpl.getTripOptions(promise)
    }

    override fun startTrip(options: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.startTrip(options, promise)
    }

    override fun completeTrip(promise: Promise): Unit {
        radarModuleImpl.completeTrip(promise)
    }

    override fun cancelTrip(promise: Promise): Unit {
        radarModuleImpl.cancelTrip(promise)
    }

    override fun updateTrip(options: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.updateTrip(options, promise)
    }

    override fun acceptEvent(eventId: String, verifiedPlaceId: String): Unit {
        radarModuleImpl.acceptEvent(eventId, verifiedPlaceId)
    }

    override fun rejectEvent(eventId: String): Unit {
        radarModuleImpl.rejectEvent(eventId)
    }

    override fun getContext(location: ReadableMap?, promise: Promise): Unit {
        radarModuleImpl.getContext(location, promise)
    }

    override fun searchPlaces(options: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.searchPlaces(options, promise)
    }

    override fun searchGeofences(options: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.searchGeofences(options, promise)
    }

    override fun autocomplete(options: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.autocomplete(options, promise)
    }

    override fun geocode(options: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.geocode(options, promise)
    }

    override fun reverseGeocode(options: ReadableMap?, promise: Promise): Unit {
        radarModuleImpl.reverseGeocode(options, promise)
    }

    override fun ipGeocode(promise: Promise): Unit {
        radarModuleImpl.ipGeocode(promise)
    }

    override fun validateAddress(address: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.validateAddress(address, promise)
    }

    override fun getDistance(options: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.getDistance(options, promise)
    }

    override fun getMatrix(options: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.getMatrix(options, promise)
    }

    override fun logConversion(options: ReadableMap, promise: Promise): Unit {
        radarModuleImpl.logConversion(options, promise)
    }

    override fun nativeSdkVersion(promise: Promise): Unit {
        radarModuleImpl.nativeSdkVersion(promise)
    }

    override fun getHost(promise: Promise): Unit {
        radarModuleImpl.getHost(promise)
    }

    override fun getPublishableKey(promise: Promise): Unit {
        radarModuleImpl.getPublishableKey(promise)
    }

    override fun showInAppMessage(inAppMessage: ReadableMap): Unit {
        radarModuleImpl.showInAppMessage(inAppMessage)
    }


    companion object {
        const val NAME = "RNRadar"
        private const val PERMISSIONS_REQUEST_CODE = 1
        private const val TAG = "RadarModule"
    }
}
