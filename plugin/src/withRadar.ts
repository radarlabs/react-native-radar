const {
  createRunOncePlugin,
  WarningAggregator,
} = require("expo/config-plugins");

const { withRadarAndroid } = require("./withRadarAndroid");
const { withRadarIOS } = require("./withRadarIOS");
const pkg = require("../../package.json");

// Import types separately
import type { RadarPluginProps } from "./types";

const withRadarPlugin = (config: any, args: RadarPluginProps = {}) => {
  try {
    config = withRadarAndroid(config, args);
  } catch (e) {
    WarningAggregator.addWarningAndroid(
      "react-native-radar",
      "There was a problem configuring react-native-radar in your native Android project: " +
        e
    );
  }
  try {
    config = withRadarIOS(config, args);
  } catch (e) {
    WarningAggregator.addWarningIOS(
      "react-native-radar",
      "There was a problem configuring react-native-radar in your native iOS project: " +
        e
    );
  }

  return config;
};

const withRadar = createRunOncePlugin(withRadarPlugin, pkg.name, pkg.version);

export default withRadar;
