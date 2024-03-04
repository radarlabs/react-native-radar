import {
  ConfigPlugin,
  createRunOncePlugin,
  WarningAggregator,
} from "expo/config-plugins";

import { withRadarAndroid } from "./withRadarAndroid";
import { withRadarIOS } from "./withRadarIOS";


const withRadar = (config) => {
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

export default createRunOncePlugin(withRadar, 'react-native-radar', undefined);
