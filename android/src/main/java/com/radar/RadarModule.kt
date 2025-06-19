package com.radar

import android.Manifest
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import io.radar.sdk.Radar
import io.radar.sdk.RadarReceiver
import io.radar.sdk.model.RadarEvent
import io.radar.sdk.model.RadarUser
import android.content.Context
import android.location.Location
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
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

  override fun requestPermissions(background: Boolean): Unit {
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

  override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray): Boolean {
    if (requestCode == PERMISSIONS_REQUEST_CODE) {
      // Handle permission result here
      return true
    }
    return false
  }

  override fun trackOnce(): Unit {
    Radar.trackOnce()
  }


  companion object {
    const val NAME = "RNRadar"
    private const val PERMISSIONS_REQUEST_CODE = 1
  }
}
