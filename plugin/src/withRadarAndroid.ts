
const {
  withAppBuildGradle,
  AndroidConfig,
  withDangerousMod,
} = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

import type { RadarPluginProps } from "./types";

export const withRadarAndroid = (
  config: any,
  args: RadarPluginProps
) => {
  config = withAndroidPermissions(config, args);

  config = withDangerousMod(config, [
    "android",
    async (config: { modRequest: { projectRoot: any; }; }) => {
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

  return withAppBuildGradle(config, (config: { modResults: { language: string; contents: string; }; }) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = modifyAppBuildGradle(
        config.modResults.contents,
        args.androidFraud ?? false
      );
      config.modResults.contents = addCoreLibraryDesugaring(
        config.modResults.contents
      );
    } else {
      throw new Error(
        "Cannot configure Sentry in the app gradle because the build.gradle is not groovy"
      );
    }
    return config;
  });
};

function withAndroidPermissions(
  config: any,
  args: RadarPluginProps
): any {
  const isAndroidBackgroundLocationEnabled = !!args.androidBackgroundPermission;
  const enableAndroidForegroundService = !!args.androidForegroundService;
  const enableAndroidActivityRecognition = !!args.androidActivityRecognition;
  return AndroidConfig.Permissions.withPermissions(
    config,
    [
      isAndroidBackgroundLocationEnabled &&
        "android.permission.ACCESS_BACKGROUND_LOCATION",
      enableAndroidForegroundService && "android.permission.FOREGROUND_SERVICE",
      enableAndroidForegroundService &&
        "android.permission.FOREGROUND_SERVICE_LOCATION",
      enableAndroidActivityRecognition &&
        "android.permission.ACTIVITY_RECOGNITION",
    ].filter(Boolean) as string[]
  );
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
    throw new Error(
      `Failed to find react.gradle script in android/app/build.gradle.
      This is required for react-native-radar to function properly.
      Please ensure your android/app/build.gradle includes the react.gradle script.
      Current build.gradle content: ${buildGradle}`
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

  buildGradle = buildGradle.replace(
    pattern,
    (match: string) => match + replacementString
  );

  return buildGradle;
}

function addCoreLibraryDesugaring(buildGradle: string) {
  if (buildGradle.includes('coreLibraryDesugaringEnabled true')) {
    return buildGradle;
  }
  
  const androidBlockRegex = /android\s*\{([\s\S]*?)^\}/m;
  const compileOptionsRegex = /compileOptions\s*\{([\s\S]*?)^\s*\}/m;
  
  const androidMatch = buildGradle.match(androidBlockRegex);
  if (androidMatch) {
    const androidBlock = androidMatch[0];
    const androidBlockContent = androidMatch[1];
    
    const compileOptionsMatch = androidBlockContent.match(compileOptionsRegex);
    if (compileOptionsMatch) {
      if (!/coreLibraryDesugaringEnabled\s+true/.test(compileOptionsMatch[0])) {
        const updatedCompileOptions = compileOptionsMatch[0].replace(
          /^\s*\}/m,
          '        coreLibraryDesugaringEnabled true\n    }'
        );
        const updatedAndroidBlock = androidBlock.replace(compileOptionsMatch[0], updatedCompileOptions);
        buildGradle = buildGradle.replace(androidBlock, updatedAndroidBlock);
      }
    } else {
      const insertIndex = buildGradle.indexOf(androidMatch[0]) + androidMatch[0].indexOf('{') + 1;
      buildGradle =
        buildGradle.slice(0, insertIndex) +
        '\n    compileOptions {\n        coreLibraryDesugaringEnabled true\n    }\n' +
        buildGradle.slice(insertIndex);
    }
  }
  
  if (!buildGradle.includes('coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:2.1.5"')) {
    const dependenciesPattern = '\ndependencies {\n';
    const dependenciesIndex = buildGradle.indexOf(dependenciesPattern);
    if (dependenciesIndex !== -1) {
      const dependenciesPivot = dependenciesIndex + dependenciesPattern.length;
      buildGradle =
        buildGradle.slice(0, dependenciesPivot) +
        '    coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:2.1.5"\n\n' +
        buildGradle.slice(dependenciesPivot);
    }
  }

  return buildGradle;
}
