import {
  ConfigPlugin,
  createRunOncePlugin,
  WarningAggregator,
} from "expo/config-plugins";


import { withRadarAndroid } from "./withRadarAndroid";
import { withRadarIOS } from "./withRadarIOS";
const pkg = require("../../package.json");

const withRadarPlugin: ConfigPlugin = (config) => {
  try {
    config = withRadarAndroid(config);
  } catch (e) {
    WarningAggregator.addWarningAndroid(
      "react-native-radar",
      "There was a problem configuring react-native-radar in your native Android project: " +
        e
    );
  }
  try {
    config = withRadarIOS(config);
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

export { withRadar };
