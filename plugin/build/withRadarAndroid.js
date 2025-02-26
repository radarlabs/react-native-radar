"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRadarAndroid = void 0;
const config_plugins_1 = require("expo/config-plugins");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const withRadarAndroid = (config, args) => {
    config = withAndroidPermissions(config, args);
    config = (0, config_plugins_1.withDangerousMod)(config, [
        "android",
        async (config) => {
            if (!args.androidFraud) {
                return config;
            }
            // Get the path to the Android folder
            const androidPath = path_1.default.join(config.modRequest.projectRoot, "android", "app", "src", "main", "res", "xml");
            // Check if the directory exists, if not, create it
            if (!fs_1.default.existsSync(androidPath)) {
                fs_1.default.mkdirSync(androidPath, { recursive: true });
            }
            // Create the path to the new file
            const newFilePath = path_1.default.join(androidPath, "network_security_config.xml");
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
            fs_1.default.writeFileSync(newFilePath, xml);
            return config;
        },
    ]);
    return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = modifyAppBuildGradle(config.modResults.contents, args.androidFraud ?? false);
        }
        else {
            throw new Error("Cannot configure Sentry in the app gradle because the build.gradle is not groovy");
        }
        return config;
    });
};
exports.withRadarAndroid = withRadarAndroid;
function withAndroidPermissions(config, args) {
    const isAndroidBackgroundLocationEnabled = !!args.androidBackgroundPermission;
    const enableAndroidForegroundService = !!args.androidForegroundService;
    const enableAndroidActivityRecognition = !!args.androidActivityRecognition;
    return config_plugins_1.AndroidConfig.Permissions.withPermissions(config, [
        isAndroidBackgroundLocationEnabled &&
            "android.permission.ACCESS_BACKGROUND_LOCATION",
        enableAndroidForegroundService && "android.permission.FOREGROUND_SERVICE",
        enableAndroidForegroundService &&
            "android.permission.FOREGROUND_SERVICE_LOCATION",
        enableAndroidActivityRecognition &&
            "android.permission.ACTIVITY_RECOGNITION",
    ].filter(Boolean));
}
function modifyAppBuildGradle(buildGradle, androidFraud) {
    let hasLocationService = false;
    let hasPlayIntegrity = false;
    if (buildGradle.includes('com.google.android.gms:play-services-location:21.0.1"')) {
        hasLocationService = true;
    }
    if (buildGradle.includes('com.google.android.play:integrity:1.2.0"')) {
        hasPlayIntegrity = true;
    }
    const pattern = /^dependencies {/m;
    if (!buildGradle.match(pattern)) {
        throw new Error(`Failed to find react.gradle script in android/app/build.gradle.
      This is required for react-native-radar to function properly.
      Please ensure your android/app/build.gradle includes the react.gradle script.
      Current build.gradle content: ${buildGradle}`);
    }
    let replacementString = "\n\n" +
        (!hasLocationService
            ? '    implementation "com.google.android.gms:play-services-location:21.0.1"'
            : "");
    if (androidFraud && !hasPlayIntegrity) {
        replacementString +=
            "\n\n" + '    implementation "com.google.android.play:integrity:1.2.0"';
    }
    return buildGradle.replace(pattern, (match) => match + replacementString);
}
