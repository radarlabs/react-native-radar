export interface RadarPluginProps {
    iosFraud?: boolean;
    androidFraud?: boolean;
    iosNSLocationWhenInUseUsageDescription?: string;
    iosNSLocationAlwaysAndWhenInUseUsageDescription?: string;
    iosBackgroundMode?: boolean;
    androidBackgroundPermission?: boolean;
    androidFineLocationPermission?: boolean;
  }