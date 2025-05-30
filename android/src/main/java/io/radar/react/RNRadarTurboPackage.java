package io.radar.react;

import androidx.annotation.Nullable;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class RNRadarTurboPackage extends TurboReactPackage {
    @Nullable
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
            final Map<String, ReactModuleInfo> moduleInfo = new HashMap<>();
            moduleInfo.put(
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
            return moduleInfo;
        };
    }
}