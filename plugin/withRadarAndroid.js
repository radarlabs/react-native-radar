// withMyPlugin.js
const { withAndroidManifest, withGradleProperties, withProjectBuildGradle, AndroidConfig, createRunOncePlugin } = require('@expo/config-plugins');
const { Document } = require('xmlbuilder2');

export const withRadarAndroid = (config, { locationVersion = '21.0.1' } = {}) => {
  config = withAndroidManifest(config, (config) => {
    config.modResults = addPermission(config.modResults, 'android.permission.ACCESS_BACKGROUND_LOCATION');
    return config;
  });

  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = modifyAppBuildGradle(config.modResults.contents);
    } else {
      throw new Error(
        'Cannot configure Sentry in the app gradle because the build.gradle is not groovy'
      );
    }
    return config;
  });

  return config;
};

function addPermission(androidManifest, permission) {
  const app = AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);
  AndroidConfig.Permissions.addPermission(app, permission);
  return androidManifest;
}

export function modifyAppBuildGradle(buildGradle) {
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
    match => dependencies + '\n\n' + 'implementation "com.google.android.gms:play-services-location:21.0.1"'
  );
}
