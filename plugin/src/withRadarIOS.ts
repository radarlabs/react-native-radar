import { ConfigPlugin, withInfoPlist, withDangerousMod } from "expo/config-plugins";
import type { RadarPluginProps } from "./types";
import fs from 'fs/promises';
import path from 'path';

export const withRadarIOS: ConfigPlugin<RadarPluginProps> = (config, args) => {
  config = withInfoPlist(config, (config) => {
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

    return config;
  });

  if (args.addRadarSDKMotion) {
    config = withDangerousMod(config, [
      'ios',
      async config => {
        const filePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
        const contents = await fs.readFile(filePath, 'utf-8');

        // Check if the pod declaration already exists
        if (contents.indexOf("pod 'RadarSDKMotion', '3.17.0'") === -1) {
          // Find the target block
          const targetRegex = /target '(\w+)' do/g;
          const match = targetRegex.exec(contents);
          if (match) {
            const targetStartIndex = match.index;
            const targetEndIndex = contents.indexOf('end', targetStartIndex) + 3;

            // Insert the pod declaration within the target block
            const targetBlock = contents.substring(targetStartIndex, targetEndIndex);
            const updatedTargetBlock = targetBlock.replace(/(target '(\w+)' do)/, `$1\n  pod 'RadarSDKMotion', '3.17.0'`);
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