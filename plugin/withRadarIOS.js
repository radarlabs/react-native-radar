import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';

// Pass `<string>` to specify that this plugin requires a string property.
export const withRadarIOS = (config) => {
  return withInfoPlist(config, config => {
    config.modResults.NSLocationWhenInUseUsageDescription = 'This app uses the location service to provide location-based services.';
    config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription = 'This app uses the location service to provide location-based services.';
    config.modResults.UIBackgroundModes = ['location', 'fetch'];
    config.modResults.NSAppTransportSecurity = {
      "NSAllowsArbitraryLoads": false,
      "NSPinnedDomains": {
        "api-verified.radar.io": {
          "NSIncludesSubdomains": true,
          "NSPinnedLeafIdentities": [
            {
              "SPKI-SHA256-BASE64": "15ktYXSSU2llpy7YyCgeqUKDBkjcimK/weUcec960sI="
            },
            {
              "SPKI-SHA256-BASE64": "15ktYXSSU2llpy7YyCgeqUKDBkjcimK/weUcec960sI="
            }
          ]
        }
      }
    }
    return config;
  });
};


