package com.radar

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import java.util.HashMap

class RadarPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == RadarModule.NAME) {
      RadarModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isNewArchitectureEnabled = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      moduleInfos[RadarModule.NAME] = ReactModuleInfo(
        RadarModule.NAME,
        RadarModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        true, // hasConstants
        false,  // isCxxModule
        isNewArchitectureEnabled // isTurboModule
      )
      moduleInfos
    }
  }
}
