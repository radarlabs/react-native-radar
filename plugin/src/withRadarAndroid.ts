import { ExpoConfig } from "expo/config";

import {
  withAndroidManifest,
  withAppBuildGradle,
  AndroidConfig,
  WarningAggregator,
  withDangerousMod,
  withMainActivity,
} from "expo/config-plugins";
import {
  addImports,
  appendContentsInsideDeclarationBlock,
} from '@expo/config-plugins/build/android/codeMod';
import fs from "fs";
import path from "path";

const { addPermission } = AndroidConfig.Permissions;

import { RadarPluginProps } from "./types";

export const withRadarAndroid = (
  config: ExpoConfig,
  args: RadarPluginProps
) => {
  config = withAndroidManifest(config, async (config) => {
    config.modResults = await setCustomConfigAsync(
      config,
      config.modResults,
      args
    );
    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      if (!args.androidFraud) {
        return config;
      }
      // Get the path to the Android folder
      const androidPath = path.join(
        config.modRequest.projectRoot,
        "android",
        "app",
        "src",
        "main",
        "res",
        "xml"
      );

      // Check if the directory exists, if not, create it
      if (!fs.existsSync(androidPath)) {
        fs.mkdirSync(androidPath, { recursive: true });
      }

      // Create the path to the new file
      const newFilePath = path.join(androidPath, "network_security_config.xml");

      // Define xml content

      const xml = `<?xml version="1.0" encoding="utf-8"?>
      <network-security-config>
          <!-- for React Native -->
          <domain-config cleartextTrafficPermitted="true">
              <domain includeSubdomains="true">localhost</domain>
          </domain-config>
      
          <!-- for SSL pinning -->
          <domain-config cleartextTrafficPermitted="false">
              <domain includeSubdomains="true">api-verified.radar.io</domain>
              <pin-set>
                  <pin digest="SHA-256">15ktYXSSU2llpy7YyCgeqUKDBkjcimK/weUcec960sI=</pin>
                  <pin digest="SHA-256">15ktYXSSU2llpy7YyCgeqUKDBkjcimK/weUcec960sI=</pin>
              </pin-set>
          </domain-config>
      </network-security-config>`;

      // Write to the new file
      fs.writeFileSync(newFilePath, xml);

      return config;
    },
  ]);

  config = withMainActivity(config, (config) => {
    let mainActivity = config.modResults.contents;
    const isJava = config.modResults.language === 'java';
    // add RNRadar module import if it doesn't exist
    mainActivity = addImports(
      mainActivity,
      ['io.radar.react.RNRadarModule'],
      isJava
    );
    // add on create call to initialize RNRadar
    if (!mainActivity.match(/\s+RNRadarModule.onActivityCreate/m)) {
      mainActivity = appendContentsInsideDeclarationBlock(
        mainActivity,
        'onCreate',
        `  RNRadarModule.onActivityCreate(this, getApplicationContext())${isJava ? ';' : ''}\n`
      );
    }
    config.modResults.contents = mainActivity;
    return config;
  });

  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = modifyAppBuildGradle(
        config.modResults.contents,
        args.androidFraud ?? false
      );
    } else {
      throw new Error(
        "Cannot configure Sentry in the app gradle because the build.gradle is not groovy"
      );
    }
    return config;
  });
};

async function setCustomConfigAsync(
  config: any,
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  args: RadarPluginProps
): Promise<AndroidConfig.Manifest.AndroidManifest> {
  if (!androidManifest.manifest["uses-permission"]) {
    androidManifest.manifest["uses-permission"] = [];
  }
  // Add permissions
  if (
    args.androidFineLocationPermission &&
    !androidManifest.manifest["uses-permission"].some(
      (e) =>
        e["$"]["android:name"] === "android.permission.ACCESS_FINE_LOCATION"
    )
  ) {
    addPermission(androidManifest, "android.permission.ACCESS_FINE_LOCATION");
  }
  if (
    args.androidBackgroundPermission &&
    !androidManifest.manifest["uses-permission"].some(
      (e) =>
        e["$"]["android:name"] ===
        "android.permission.ACCESS_BACKGROUND_LOCATION"
    )
  ) {
    addPermission(
      androidManifest,
      "android.permission.ACCESS_BACKGROUND_LOCATION"
    );
  }
  if (
    !androidManifest.manifest["uses-permission"].some(
      (e) =>
        e["$"]["android:name"] === "android.permission.ACCESS_COARSE_LOCATION"
    )
  ) {
    addPermission(androidManifest, "android.permission.ACCESS_COARSE_LOCATION");
  }
  if (
    !androidManifest.manifest["uses-permission"].some(
      (e) => e["$"]["android:name"] === "android.permission.FOREGROUND_SERVICE"
    )
  ) {
    addPermission(androidManifest, "android.permission.FOREGROUND_SERVICE");
  }

  return androidManifest;
}

function modifyAppBuildGradle(buildGradle: string, androidFraud: boolean) {
  let hasLocationService = false;
  let hasPlayIntegrity = false;
  if (
    buildGradle.includes(
      'com.google.android.gms:play-services-location:21.0.1"'
    )
  ) {
    hasLocationService = true;
  }

  if (buildGradle.includes('com.google.android.play:integrity:1.2.0"')) {
    hasPlayIntegrity = true;
  }

  const pattern = /^dependencies {/m;

  if (!buildGradle.match(pattern)) {
    WarningAggregator.addWarningAndroid(
      "react-native-radar",
      "Could not find react.gradle script in android/app/build.gradle."
    );
  }

  let replacementString =
    "\n\n" +
    (!hasLocationService
      ? '    implementation "com.google.android.gms:play-services-location:21.0.1"'
      : "");

  if (androidFraud && !hasPlayIntegrity) {
    replacementString +=
      "\n\n" + '    implementation "com.google.android.play:integrity:1.2.0"';
  }

  return buildGradle.replace(
    pattern,
    (match: string) => match + replacementString
  );
}
