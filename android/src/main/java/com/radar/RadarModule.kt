package com.radar

import android.content.Context
import android.content.SharedPreferences
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

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
  }
}
