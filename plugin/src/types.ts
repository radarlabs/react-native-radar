export interface RadarPluginProps {
  iosFraud?: boolean;
  androidFraud?: boolean;
  iosNSLocationWhenInUseUsageDescription?: string;
  iosNSLocationAlwaysAndWhenInUseUsageDescription?: string;
  iosBackgroundMode?: boolean;
  androidBackgroundPermission?: boolean;
  androidForegroundService?: boolean;
  androidActivityRecognition?: boolean;
  addRadarSDKMotion?: boolean;
  iosNSMotionUsageDescription?: string;
  iosLocalRadarSdkPath?: string;
  androidLocalRadarSdkPath?: string;
}