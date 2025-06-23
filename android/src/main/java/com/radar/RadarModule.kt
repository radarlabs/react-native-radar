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
import io.radar.sdk.RadarNotificationOptions
import android.content.Context
import android.location.Location
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import org.json.JSONException

@ReactModule(name = RadarModule.NAME)
class RadarModule(reactContext: ReactApplicationContext) :
  NativeRadarSpec(reactContext), PermissionListener{

    private val radarReceiver = object : RadarReceiver() {
    override fun onEventsReceived(context: Context, events: Array<RadarEvent>, user: RadarUser?) {
      // Handle events received
    }

    override fun onLocationUpdated(context: Context, location: Location, user: RadarUser) {
      val eventBlob = Arguments.createMap().apply {
        putString("type", "locationUpdated")
        putString("location", Radar.jsonForLocation(location).toString())
        putString("user", user.toJson().toString())
      }
      emitLocationEmitter(eventBlob)
    }

    override fun onClientLocationUpdated(context: Context, location: Location, stopped: Boolean, source: Radar.RadarLocationSource) {
      // Handle client location updates
    }

    override fun onError(context: Context, status: Radar.RadarStatus) {
      // Handle errors
    }

    override fun onLog(context: Context, message: String) {
      // Handle log messages
    }
  }

  private var mPermissionsRequestPromise: Promise? = null

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  override fun initialize(publishableKey: String, fraud: Boolean): Unit {
    Radar.initialize(reactApplicationContext, publishableKey)
    Radar.setReceiver(radarReceiver)
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
    var location: Location? = null
    var accuracyLevel = RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM
    var beaconsTrackingOption = false

    if (trackOnceOptions != null) {
      if (trackOnceOptions.hasKey("location")) {
        val locationMap = trackOnceOptions.getMap("location")
        if (locationMap != null) {
          location = Location("RNRadarModule").apply {
            latitude = locationMap.getDouble("latitude")
            longitude = locationMap.getDouble("longitude")
            accuracy = locationMap.getDouble("accuracy").toFloat()
          }
        }
      }
      
      if (trackOnceOptions.hasKey("desiredAccuracy")) {
        val desiredAccuracy = trackOnceOptions.getString("desiredAccuracy")?.lowercase()
        accuracyLevel = when (desiredAccuracy) {
          "none" -> RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.NONE
          "low" -> RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.LOW
          "medium" -> RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM
          "high" -> RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.HIGH
          else -> RadarTrackingOptions.RadarTrackingOptionsDesiredAccuracy.MEDIUM
        }
      }
      
      if (trackOnceOptions.hasKey("beacons")) {
        beaconsTrackingOption = trackOnceOptions.getBoolean("beacons")
      }
    }

    val trackCallback = object : Radar.RadarTrackCallback {
      override fun onComplete(status: Radar.RadarStatus, location: Location?, events: Array<RadarEvent>?, user: RadarUser?) {
        if (promise == null) {
          return
        }

        try {
          if (status == Radar.RadarStatus.SUCCESS) {
            val map = Arguments.createMap().apply {
              putString("status", status.toString())
              if (location != null) {
                putMap("location", RadarUtils.mapForJson(Radar.jsonForLocation(location)))
              }
              if (events != null) {
                // TODO: Check if RadarEvent.toJson(events) visibility can be made public in the SDK
                // Currently using instance method due to internal companion object access restriction
                val eventsArray = Arguments.createArray()
                for (event in events) {
                  try {
                    val eventJson = event.toJson()
                    val eventMap = RadarUtils.mapForJson(eventJson)
                    if (eventMap != null) {
                      eventsArray.pushMap(eventMap)
                    }
                  } catch (e: Exception) {
                    Log.e(TAG, "Error converting event to JSON", e)
                  }
                }
                putArray("events", eventsArray)
              }
              if (user != null) {
                putMap("user", RadarUtils.mapForJson(user.toJson()))
              }
            }
            promise.resolve(map)
          } else {
            promise.reject(status.toString(), status.toString())
          }
        } catch (e: JSONException) {
          Log.e(TAG, "JSONException", e)
          promise.reject(Radar.RadarStatus.ERROR_SERVER.toString(), Radar.RadarStatus.ERROR_SERVER.toString())
        }
      }
    }

    if (location != null) {
      Radar.trackOnce(location, trackCallback)
    } else {
      Radar.trackOnce(accuracyLevel, beaconsTrackingOption, trackCallback)
    }
  }

  override fun isEven(number: Double, promise: Promise): Unit {
    if (number.toInt() % 2 == 0) {
      promise.resolve(number)
    } else {
      promise.reject("ODD_NUMBER", "Number is odd")
    }
  }


  companion object {
    const val NAME = "RNRadar"
    private const val PERMISSIONS_REQUEST_CODE = 1
    private const val TAG = "RadarModule"
  }
}
