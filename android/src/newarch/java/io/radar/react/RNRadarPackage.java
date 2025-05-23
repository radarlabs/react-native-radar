package io.radar.react;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

/**
 * New Architecture Package for Radar React Native SDK
 * This package is used when the new architecture (TurboModules) is enabled
 */
public class RNRadarPackage extends TurboReactPackage {

    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactContext) {
        if (name.equals(RNRadarTurboModule.NAME)) {
            return new RNRadarTurboModule(reactContext);
        }
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            moduleInfos.put(
                    RNRadarTurboModule.NAME,
                    new ReactModuleInfo(
                            RNRadarTurboModule.NAME,
                            RNRadarTurboModule.NAME,
                            false, // canOverrideExistingModule
                            false, // needsEagerInit
                            true, // hasConstants
                            false, // isCxxModule
                            true // isTurboModule
            ));
            return moduleInfos;
        };
    }
}