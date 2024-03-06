import { ExpoConfig } from "expo/config";

import {
  withAndroidManifest,
  withAppBuildGradle,
  AndroidConfig,
  WarningAggregator,
  withDangerousMod
}  from "expo/config-plugins";
import fs from 'fs';
import path from 'path';

const { addPermission } = AndroidConfig.Permissions;


export const withRadarAndroid = (config: ExpoConfig) => {
  config = withAndroidManifest(config, async (config) => {
    config.modResults = await setCustomConfigAsync(config, config.modResults);
    return config;
  });

  config = withDangerousMod(config, [
    'android',
    async (config) => {
      // Get the path to the Android folder
      const androidPath = path.join(config.modRequest.projectRoot, 'android', 'app', 'src', 'main', 'res', 'xml');

          // Check if the directory exists, if not, create it
    if (!fs.existsSync(androidPath)){
      fs.mkdirSync(androidPath, { recursive: true });
    }

      // Create the path to the new file
      const newFilePath = path.join(androidPath, 'network_security_config.xml');

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


  return withAppBuildGradle(
    config,
    config => {

      if (config.modResults.language === "groovy") {
        config.modResults.contents = modifyAppBuildGradle(
          config.modResults.contents
        );
      } else {
        throw new Error(
          "Cannot configure Sentry in the app gradle because the build.gradle is not groovy"
        );
      }
      return config;
    }
  );
};

async function setCustomConfigAsync(
  config: any,
  androidManifest: AndroidConfig.Manifest.AndroidManifest
): Promise<AndroidConfig.Manifest.AndroidManifest> {
  if(!androidManifest.manifest['uses-permission']) {
    androidManifest.manifest['uses-permission'] = [];
  }
  // Add permissions
  if (!androidManifest.manifest["uses-permission"].some(e => e['$']['android:name'] === 'android.permission.ACCESS_FINE_LOCATION')) {
    addPermission(androidManifest, 'android.permission.ACCESS_FINE_LOCATION');
  }
  if (!androidManifest.manifest["uses-permission"].some(e => e['$']['android:name'] === 'android.permission.ACCESS_BACKGROUND_LOCATION')) {
    addPermission(androidManifest, 'android.permission.ACCESS_BACKGROUND_LOCATION');
  }

  return androidManifest;
}

export function modifyAppBuildGradle(buildGradle: string) {
  if (
    buildGradle.includes(
      'com.google.android.gms:play-services-location:21.0.1"'
    )
  ) {
    return buildGradle;
  }

  const pattern = /^dependencies {/m;

  if (!buildGradle.match(pattern)) {
    WarningAggregator.addWarningAndroid(
      "react-native-radar",
      "Could not find react.gradle script in android/app/build.gradle."
    );
  }

  return buildGradle.replace(
    pattern,
    (match: string) =>
      match +
      "\n\n" +
      '    implementation "com.google.android.gms:play-services-location:21.0.1"' +
      "\n\n" +
      '    implementation "com.google.android.play:integrity:1.2.0"' 
  );
}
