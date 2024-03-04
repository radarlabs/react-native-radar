// withMyPlugin.js
const { ConfigPlugin, withAndroidManifest, withGradleProperties, withAppBuildGradle, AndroidConfig, WarningAggregator } = require('@expo/config-plugins');
const { Document } = require('xmlbuilder2');
import type { ExpoConfig } from 'expo/config';

export const withRadarAndroid: ConfigPlugin = (config) => {
  config = withAndroidManifest(config, (config: { modResults: any; }) => {
    config.modResults = addPermission(config.modResults, 'android.permission.ACCESS_BACKGROUND_LOCATION');
    return config;
  });

  return withAppBuildGradle(config, (config: { modResults: { language: string; contents: any; }; }) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = modifyAppBuildGradle(config.modResults.contents);
    } else {
      throw new Error(
        'Cannot configure Sentry in the app gradle because the build.gradle is not groovy'
      );
    }
    return config;
  });

};

function addPermission(androidManifest: any, permission: string) {
  const app = AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);
  AndroidConfig.Permissions.addPermission(app, permission);
  return androidManifest;
}

export function modifyAppBuildGradle(buildGradle: string) {
  if (buildGradle.includes('com.google.android.gms:play-services-location:21.0.1"')) {
    return buildGradle;
  }

  // Use the same location that sentry-wizard uses
  // See: https://github.com/getsentry/sentry-wizard/blob/e9b4522f27a852069c862bd458bdf9b07cab6e33/lib/Steps/Integrations/ReactNative.ts#L232
  const pattern = /^dependencies {/m;

  if (!buildGradle.match(pattern)) {
    WarningAggregator.addWarningAndroid(
      'react-native-radar',
      'Could not find react.gradle script in android/app/build.gradle.'
    );
  }
  
  return buildGradle.replace(
    pattern,
    (match: string) => match + '\n\n' + 'implementation "com.google.android.gms:play-services-location:21.0.1"'
  );
}
