package com.radar

import android.content.Context
import android.content.SharedPreferences
import android.location.Location
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import io.radar.sdk.Radar
import io.radar.sdk.RadarReceiver
import io.radar.sdk.RadarVerifiedReceiver
import io.radar.sdk.model.RadarEvent
import io.radar.sdk.model.RadarUser

@ReactModule(name = RadarModule.NAME)
class RadarModule(reactContext: ReactApplicationContext) :
  NativeRadarSpec(reactContext) {

  private val sharedPreferences: SharedPreferences

  init {
    sharedPreferences = reactContext.getSharedPreferences("RCTRadarKey", Context.MODE_PRIVATE)
  }

  override fun getName(): String {
    return NAME
  }

  override fun initialize(publishableKey: String, fraud: Boolean?) {
    sharedPreferences.edit()
      .putString("x_platform_sdk_type", "ReactNative")
      .putString("x_platform_sdk_version", "3.20.3")
      .apply()

    if (fraud === true) {
    } else {
      Radar.initialize(reactApplicationContext, publishableKey)
    }
  }

  override fun trackOnce(optionsMap: ReadableMap?, promise: Promise?) {
    if (promise == null) {
      return
    }

    var location: Location? = null
    var beacons = false

    if (optionsMap != null) {
      if (optionsMap.hasKey("location")) {
        val locationMap = optionsMap.getMap("location")
        if (locationMap != null) {
          // Create location from ReadableMap
          location = Location("RNRadarModule")
          location.latitude = locationMap.getDouble("latitude")
          location.longitude = locationMap.getDouble("longitude")
          if (locationMap.hasKey("accuracy")) {
            location.accuracy = locationMap.getDouble("accuracy").toFloat()
          }
        }
      }
      if (optionsMap.hasKey("beacons")) {
        beacons = optionsMap.getBoolean("beacons")
      }
    }

    val trackCallback = object : Radar.RadarTrackCallback {
      override fun onComplete(
        status: Radar.RadarStatus,
        location: Location?,
        events: Array<RadarEvent>?,
        user: RadarUser?
      ) {
        try {
          val map = Arguments.createMap()
          map.putString("status", status.toString())

          if (location != null) {
            // Convert location to map manually
            val locationMap = Arguments.createMap()
            locationMap.putDouble("latitude", location.latitude)
            locationMap.putDouble("longitude", location.longitude)
            locationMap.putDouble("accuracy", location.accuracy.toDouble())
            map.putMap("location", locationMap)
          }

          if (events != null) {
            // Convert events array - assuming RNRadarUtils exists or we'll create a simple conversion
            val eventsArray = Arguments.createArray()
            for (event in events) {
              val eventMap = Arguments.createMap()
              eventMap.putString("type", event.type.toString())
              eventMap.putString("_id", event._id)
              eventsArray.pushMap(eventMap)
            }
            map.putArray("events", eventsArray)
          }

          if (user != null) {
            // Convert user - basic conversion
            val userMap = Arguments.createMap()
            userMap.putString("_id", user._id)
            userMap.putString("userId", user.userId)
            map.putMap("user", userMap)
          }

          promise.resolve(map)
        } catch (e: Exception) {
          Log.e(TAG, "trackOnce error", e)
          promise.reject("ERROR", e.message)
        }
      }
    }

    // Use the correct Radar.trackOnce API
    if (location != null) {
      Radar.trackOnce(location, trackCallback)
    } else {
      Radar.trackOnce(trackCallback)
    }
  }

  override fun getItem(key: String): String? {
    return sharedPreferences.getString(key, null)
  }

  override fun setItem(value: String, key: String) {
    sharedPreferences.edit().putString(key, value).apply()
  }

  override fun removeItem(key: String) {
    sharedPreferences.edit().remove(key).apply()
  }

  override fun clear() {
    sharedPreferences.edit().clear().apply()
  }

  companion object {
    const val NAME = "Radar"
    private const val TAG = "RadarModule"
  }
}
