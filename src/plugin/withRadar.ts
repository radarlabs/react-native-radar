import {
  ConfigPlugin,
  createRunOncePlugin,
  WarningAggregator,
} from "expo/config-plugins";


import { withRadarAndroid } from "./withRadarAndroid";
import { withRadarIOS } from "./withRadarIOS";
const pkg = require("../../../package.json");

import type { RadarPluginProps } from "./types";

const withRadarPlugin: ConfigPlugin<RadarPluginProps> = (config, args = {}) => {
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
