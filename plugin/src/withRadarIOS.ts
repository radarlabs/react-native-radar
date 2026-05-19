const { 
  withInfoPlist, 
  withDangerousMod,
  withAppDelegate,
  WarningAggregator,
} = require("expo/config-plugins");
import type { RadarPluginProps } from "./types";
const fs = require('fs/promises');
const path = require('path');
const pkg = require("../../package.json");

const NATIVE_SETUP_SENTINEL = "@generated react-native-radar nativeSetup";

function buildObjcSnippet(args: RadarPluginProps, indent: string = "  "): string {
  const lines: string[] = [
    `${indent}// ${NATIVE_SETUP_SENTINEL}`,
    `${indent}RadarInitializeOptions *radarInitializeOptions = [[RadarInitializeOptions alloc] init];`,
  ];
  if (args.iosAutoHandleNotificationDeepLinks) {
    lines.push(`${indent}radarInitializeOptions.autoHandleNotificationDeepLinks = YES;`);
  }
  if (args.iosAutoLogNotificationConversions) {
    lines.push(`${indent}radarInitializeOptions.autoLogNotificationConversions = YES;`);
  }
  lines.push(`${indent}[Radar nativeSetup:radarInitializeOptions];`);
  return lines.join("\n");
}

function buildSwiftSnippet(args: RadarPluginProps, indent: string = "    "): string {
  const lines: string[] = [
    `${indent}// ${NATIVE_SETUP_SENTINEL}`,
    `${indent}let radarInitializeOptions = RadarInitializeOptions()`,
  ];
  if (args.iosAutoHandleNotificationDeepLinks) {
    lines.push(`${indent}radarInitializeOptions.autoHandleNotificationDeepLinks = true`);
  }
  if (args.iosAutoLogNotificationConversions) {
    lines.push(`${indent}radarInitializeOptions.autoLogNotificationConversions = true`);
  }
  lines.push(`${indent}Radar.nativeSetup(radarInitializeOptions)`);
  return lines.join("\n");
}

function withRadarAppDelegate(config: any, args: RadarPluginProps) {
  const enabled =
    args.iosAutoHandleNotificationDeepLinks ||
    args.iosAutoLogNotificationConversions;
  if (!enabled) return config;

  return withAppDelegate(config, (config: any) => {
    let contents: string = config.modResults.contents;

    if (contents.includes(NATIVE_SETUP_SENTINEL)) {
      return config;
    }

    const language: string = config.modResults.language; // 'objc' | 'objcpp' | 'swift'

    if (language === "objc" || language === "objcpp") {
      if (!contents.includes("RadarSDK/RadarSDK.h")) {
        contents = contents.replace(
          /(#import\s+"AppDelegate\.h")/,
          `$1\n#import <RadarSDK/RadarSDK.h>`
        );
      }

      const anchorRegex =
        /^([ \t]*)(return\s+|BOOL\s+\w+\s*=\s*)?\[super\s+application:application\s+didFinishLaunchingWithOptions:launchOptions\]\s*;/m;
      
      const match = contents.match(anchorRegex);
      if (!match) {
        WarningAggregator.addWarningIOS(
          "react-native-radar",
          "Could not find didFinishLaunchingWithOptions super call in AppDelegate; skipping nativeSetup injection."
        );
        
        return config;
      }
      
      contents = contents.replace(
        anchorRegex,
        `${buildObjcSnippet(args, match[1])}\n${match[0]}`
      );

    } else if (language === "swift") {
      if (!/^import RadarSDK\b/m.test(contents)) {
        contents = contents.replace(
          /(import Expo\b.*)/,
          `$1\nimport RadarSDK`
        );
      }
      const anchorRegex =
        /^([ \t]*)(return\s+)?super\.application\(application,\s*didFinishLaunchingWithOptions:\s*launchOptions\)/m;
      
      const match = contents.match(anchorRegex);
      if (!match) {
        WarningAggregator.addWarningIOS(
          "react-native-radar",
          "Could not find didFinishLaunchingWithOptions super call in AppDelegate.swift; skipping nativeSetup injection."
        );

        return config;
      }
      contents = contents.replace(
        anchorRegex,
        `${buildSwiftSnippet(args, match[1])}\n${match[0]}`
      );
    } else {
      WarningAggregator.addWarningIOS(
        "react-native-radar",
        `Unsupported AppDelegate language "${language}"; skipping Radar nativeSetup injection.`
      );
      return config;
    }

    config.modResults.contents = contents;
    return config;
  });
}

function injectPodIfMissing(contents: string, podName: string): string {
  if (contents.indexOf(`pod '${podName}'`) !== -1) {
    return contents;
  }

  const targetMatch = /target '(\w+)' do/.exec(contents);
  if (!targetMatch) {
    return contents;
  }

  const targetStartIndex = targetMatch.index;
  const targetEndIndex = contents.indexOf('end', targetStartIndex) + 3;
  const targetBlock = contents.substring(targetStartIndex, targetEndIndex);

  const updatedTargetBlock = targetBlock.replace(
    /(target '(\w+)' do)/,
    `$1\n  pod '${podName}', :path => '../node_modules/react-native-radar'`
  );

  return contents.replace(targetBlock, updatedTargetBlock);
}

const FRAUD_LINK_SENTINEL = "# @generated react-native-radar fraud-link";

function injectFraudLinkPostInstall(contents: string): string {
  if (contents.indexOf(FRAUD_LINK_SENTINEL) !== -1) {
    return contents;
  }

  const body = `    ${FRAUD_LINK_SENTINEL}
    fraud_xcframework = File.expand_path(
      '../node_modules/react-native-radar/ios/RadarSDKFraud.xcframework',
      __dir__
    )
    if File.directory?(fraud_xcframework)
      installer.aggregate_targets.each do |aggregate_target|
        project = aggregate_target.user_project
        next if project.nil?

        project.native_targets.each do |native_target|
          next unless native_target.product_type == 'com.apple.product-type.application'

          link_phase = native_target.frameworks_build_phase
          already_linked = link_phase.files.any? { |f|
            f.display_name == 'RadarSDKFraud.xcframework' || f.display_name == 'RadarSDKFraud.framework'
          }
          next if already_linked

          ref = project.frameworks_group.new_reference(fraud_xcframework)
          link_phase.add_file_reference(ref)
        end

        project.save
      end
    end`;

  const postInstallRegex = /(post_install\s+do\s+\|[^|]+\|\s*\n)/;
  if (postInstallRegex.test(contents)) {
    return contents.replace(postInstallRegex, `$1${body}\n`);
  }

  return `${contents}\npost_install do |installer|\n${body}\nend\n`;
}

export const withRadarIOS = (config: any, args: RadarPluginProps) => {
  config = withInfoPlist(config, (config: { modResults: { NSLocationWhenInUseUsageDescription: string; NSLocationAlwaysAndWhenInUseUsageDescription: string; UIBackgroundModes: string[]; NSAppTransportSecurity: { NSAllowsArbitraryLoads: boolean; NSPinnedDomains: { "api-verified.radar.io": { NSIncludesSubdomains: boolean; NSPinnedLeafIdentities: { "SPKI-SHA256-BASE64": string; }[]; }; }; }; NSMotionUsageDescription: string; }; }) => {
    config.modResults.NSLocationWhenInUseUsageDescription =
      args.iosNSLocationWhenInUseUsageDescription ??
      "This app uses the location service to provide location-based services.";
    if (args.iosNSLocationAlwaysAndWhenInUseUsageDescription) {
      config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
        args.iosNSLocationAlwaysAndWhenInUseUsageDescription; 
    }
    if (args.iosBackgroundMode) {
      config.modResults.UIBackgroundModes = ["location", "fetch"];
    }
    if (args.iosFraud) {
      config.modResults.NSAppTransportSecurity = {
        NSAllowsArbitraryLoads: false,
        NSPinnedDomains: {
          "api-verified.radar.io": {
            NSIncludesSubdomains: true,
            NSPinnedLeafIdentities: [
              {
                "SPKI-SHA256-BASE64":
                  "15ktYXSSU2llpy7YyCgeqUKDBkjcimK/weUcec960sI=",
              },
              {
                "SPKI-SHA256-BASE64":
                  "15ktYXSSU2llpy7YyCgeqUKDBkjcimK/weUcec960sI=",
              },
            ],
          },
        },
      };
    }
    if (args.addRadarSDKMotion) {
      config.modResults.NSMotionUsageDescription =
        args.iosNSMotionUsageDescription ??
        "This app uses the motion service to provide motion-based services.";
    }

    return config;
  });

  config = withRadarAppDelegate(config, args);
  
  if (args.addRadarSDKMotion || args.iosFraud) {
    config = withDangerousMod(config, [
      'ios',
      async (config: { modRequest: { platformProjectRoot: any; }; }) => {
        const filePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
        const original = await fs.readFile(filePath, 'utf-8');
        let contents = original;

        if (args.addRadarSDKMotion) {
          contents = injectPodIfMissing(contents, 'RadarSDKMotion');
        }

        if (args.iosFraud) {
          contents = injectPodIfMissing(contents, 'RadarSDKFraud');
          contents = injectFraudLinkPostInstall(contents);
        }
        
        if (contents !== original) {
          await fs.writeFile(filePath, contents);
        }

        return config;
      },
    ]);
  }

  return config;
};