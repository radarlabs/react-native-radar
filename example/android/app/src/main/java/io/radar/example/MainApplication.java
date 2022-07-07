package io.radar.example;

import android.app.Application;

import com.example.ReactNativeFlipper;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;

import java.util.List;

import javax.annotation.Nullable;

import expo.modules.updates.UpdatesController;
import io.radar.example.generated.BasePackageList;

/**
 * Main entrance point for starting the Android application.
 */
public class MainApplication extends Application implements ReactApplication {

    private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
            new BasePackageList().getPackageList()
    );

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            List<ReactPackage> packages = new PackageList(this).getPackages();
            packages.add(new ModuleRegistryAdapter(mModuleRegistryProvider));
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Override
        protected @Nullable
        String getJSBundleFile() {
            if (BuildConfig.DEBUG) {
                return super.getJSBundleFile();
            } else {
                return UpdatesController.getInstance().getLaunchAssetFile();
            }
        }

        @Override
        protected @Nullable
        String getBundleAssetName() {
            if (BuildConfig.DEBUG) {
                return super.getBundleAssetName();
            } else {
                return UpdatesController.getInstance().getBundleAssetName();
            }
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

        if (!BuildConfig.DEBUG) {
            UpdatesController.initialize(this);
        }

        // Loads Flipper in React Native templates. Call this in the onCreate method.
        ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    }
}
