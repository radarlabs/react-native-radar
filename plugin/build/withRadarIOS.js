"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRadarIOS = void 0;
const config_plugins_1 = require("expo/config-plugins");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const withRadarIOS = (config, args) => {
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
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
                                "SPKI-SHA256-BASE64": "15ktYXSSU2llpy7YyCgeqUKDBkjcimK/weUcec960sI=",
                            },
                            {
                                "SPKI-SHA256-BASE64": "15ktYXSSU2llpy7YyCgeqUKDBkjcimK/weUcec960sI=",
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
        config = (0, config_plugins_1.withDangerousMod)(config, [
            'ios',
            async (config) => {
                const filePath = path_1.default.join(config.modRequest.platformProjectRoot, 'Podfile');
                const contents = await promises_1.default.readFile(filePath, 'utf-8');
                // Check if the pod declaration already exists
                if (contents.indexOf("pod 'RadarSDKMotion', '3.21.1'") === -1) {
                    // Find the target block
                    const targetRegex = /target '(\w+)' do/g;
                    const match = targetRegex.exec(contents);
                    if (match) {
                        const targetStartIndex = match.index;
                        const targetEndIndex = contents.indexOf('end', targetStartIndex) + 3;
                        // Insert the pod declaration within the target block
                        const targetBlock = contents.substring(targetStartIndex, targetEndIndex);
                        const updatedTargetBlock = targetBlock.replace(/(target '(\w+)' do)/, `$1\n  pod 'RadarSDKMotion', '3.21.1'`);
                        const newContents = contents.replace(targetBlock, updatedTargetBlock);
                        // Write the updated contents back to the Podfile
                        await promises_1.default.writeFile(filePath, newContents);
                    }
                }
                return config;
            },
        ]);
    }
    return config;
};
exports.withRadarIOS = withRadarIOS;
