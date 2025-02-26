"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRadar = void 0;
const config_plugins_1 = require("expo/config-plugins");
const withRadarAndroid_1 = require("./withRadarAndroid");
const withRadarIOS_1 = require("./withRadarIOS");
const pkg = require("../../package.json");
const withRadarPlugin = (config, args = {}) => {
    try {
        config = (0, withRadarAndroid_1.withRadarAndroid)(config, args);
    }
    catch (e) {
        config_plugins_1.WarningAggregator.addWarningAndroid("react-native-radar", "There was a problem configuring react-native-radar in your native Android project: " +
            e);
    }
    try {
        config = (0, withRadarIOS_1.withRadarIOS)(config, args);
    }
    catch (e) {
        config_plugins_1.WarningAggregator.addWarningIOS("react-native-radar", "There was a problem configuring react-native-radar in your native iOS project: " +
            e);
    }
    return config;
};
const withRadar = (0, config_plugins_1.createRunOncePlugin)(withRadarPlugin, pkg.name, pkg.version);
exports.withRadar = withRadar;
