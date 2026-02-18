const { withInfoPlist, withDangerousMod } = require("expo/config-plugins");
import type { RadarPluginProps } from "./types";
const fs = require('fs/promises');
const path = require('path');
const pkg = require("../../package.json");

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

  if (args.addRadarSDKMotion) {
    config = withDangerousMod(config, [
      'ios',
      async (config: { modRequest: { platformProjectRoot: any; }; }) => {
        const filePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
        const contents = await fs.readFile(filePath, 'utf-8');

        // Check if the pod declaration already exists
        if (contents.indexOf(`pod 'RadarSDKMotion'`) === -1) {
          // Find the target block
          const targetRegex = /target '(\w+)' do/g;
          const match = targetRegex.exec(contents);
          if (match) {
            const targetStartIndex = match.index;
            const targetEndIndex = contents.indexOf('end', targetStartIndex) + 3;

            // Insert the pod declaration within the target block
            const targetBlock = contents.substring(targetStartIndex, targetEndIndex);
            const updatedTargetBlock = targetBlock.replace(
              /(target '(\w+)' do)/,
              `$1\n  pod 'RadarSDKMotion', :path => '../node_modules/react-native-radar'`
            );
            const newContents = contents.replace(targetBlock, updatedTargetBlock);

            // Write the updated contents back to the Podfile
            await fs.writeFile(filePath, newContents);
          }
        }

        return config;
      },
    ]);
  }

  return config;
};