package com.radar

import android.content.Context
import android.content.SharedPreferences
import android.location.Location
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule

private const val KEY_PUBLISHABLE_KEY = "publishableKey"
private const val KEY_FRAUD_ENABLED = "fraudEnabled"

@ReactModule(name = RadarModule.NAME)
class RadarModule(reactContext: ReactApplicationContext) :
  NativeRadarSpec(reactContext) {

  private val sharedPreferences: SharedPreferences
  private var trackOncePromise: Promise? = null

  init {
    sharedPreferences = reactContext.getSharedPreferences("RCTRadarKey", Context.MODE_PRIVATE)
  }

  override fun getName(): String {
    return NAME
  }

  override fun initialize(publishableKey: String, fraud: Boolean) {
      sharedPreferences.edit().apply {
          putString(KEY_PUBLISHABLE_KEY, publishableKey)
          putBoolean(KEY_FRAUD_ENABLED, fraud)
          apply()
      }
      Log.d(NAME, "Radar initialized with key: $publishableKey and fraud: $fraud")
  }

  override fun trackOnce(options: ReadableMap?, promise: Promise) {
      trackOncePromise = promise

      if (options != null && options.hasKey("location")) {
          val locationMap = options.getMap("location")
          if (locationMap != null && locationMap.hasKey("latitude") && locationMap.hasKey("longitude")) {
              val location = Location("manual").apply {
                  latitude = locationMap.getDouble("latitude")
                  longitude = locationMap.getDouble("longitude")
                  if (locationMap.hasKey("accuracy")) {
                      accuracy = locationMap.getDouble("accuracy").toFloat()
                  }
              }
              handleLocation(location)
          } else {
              promise.reject("INVALID_LOCATION", "Missing latitude/longitude in location map")
          }
      } else {
          requestLocationUpdate()
      }
  }

  private fun handleLocation(location: Location) {
      Log.d(NAME, "Handling location: lat=${location.latitude}, lng=${location.longitude}")
      // Simulate a response (replace with actual Radar SDK usage)
      val result = Arguments.createMap().apply {
          putDouble("latitude", location.latitude)
          putDouble("longitude", location.longitude)
          putString("source", "mock")
      }
      trackOncePromise?.resolve(result)
      trackOncePromise = null
  }

  private fun requestLocationUpdate() {
      // You should implement actual location fetching here
      Log.d(NAME, "Requesting device location update...")
      // Simulated fallback
      val fallbackLocation = Location("fallback").apply {
          latitude = 37.7749
          longitude = -122.4194
          accuracy = 10.0f
      }
      handleLocation(fallbackLocation)
  }

  override fun addListener(eventName: String) {
      // No-op: required for RN's NativeEventEmitter
      Log.d(NAME, "addListener called for $eventName")
  }

  override fun removeListeners(count: Int) {
      // No-op: required for RN's NativeEventEmitter
      Log.d(NAME, "removeListeners called for $count")
  }

  companion object {
    const val NAME = "Radar"
  }
}
