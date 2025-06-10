package io.radar.react;

import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;
import com.facebook.react.uimanager.ViewManager;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RNRadarPackage extends TurboReactPackage {

    private static final String TAG = "RNRadarPackage";

    public RNRadarPackage() {
        Log.d(TAG, "RNRadarPackage constructor called");
    }

    @Override
    @NonNull
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        Log.d(TAG, "createViewManagers called");
        return Collections.emptyList();
    }

    @Override
    @Nullable
    public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext reactContext) {
        Log.d(TAG, "getModule called with name: " + name + ", expected: " + RNRadarModule.NAME);
        if (name.equals(RNRadarModule.NAME)) {
            Log.d(TAG, "Creating RNRadarModule instance");
            return new RNRadarModule(reactContext);
        } else {
            Log.d(TAG, "Module name doesn't match, returning null");
            return null;
        }
    }

    @Override
    @NonNull
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        Log.d(TAG, "getReactModuleInfoProvider called");
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            boolean isTurboModule = true; // Always enable TurboModule for new architecture
            Log.d(TAG, "Registering module info for: " + RNRadarModule.NAME + " as TurboModule: " + isTurboModule);
            moduleInfos.put(
                    RNRadarModule.NAME,
                    new ReactModuleInfo(
                            RNRadarModule.NAME,
                            RNRadarModule.NAME,
                            false, // canOverrideExistingModule
                            false, // needsEagerInit
                            true, // hasConstants
                            false, // isCxxModule
                            isTurboModule // isTurboModule
            ));
            return moduleInfos;
        };
    }
}
