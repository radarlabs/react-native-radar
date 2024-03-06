import { ConfigPlugin, withInfoPlist } from "expo/config-plugins";
import type { RadarPluginProps } from "./types";

export const withRadarIOS: ConfigPlugin<RadarPluginProps> = (config, args) => {
  return withInfoPlist(config, (config) => {
    config.modResults.NSLocationWhenInUseUsageDescription =
      args.iosNSLocationWhenInUseUsageDescription ??
      "This app uses the location service to provide location-based services.";
    if (args.iosNSLocationAlwaysAndWhenInUseUsageDescription) {
      config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
      args.iosNSLocationAlwaysAndWhenInUseUsageDescription; 
    }
    if(args.iosBackgroundMode) {
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
};
