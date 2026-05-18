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

    /**
    * iOS only. When true, injects `[Radar nativeSetup:options]` into AppDelegate
    * with autoHandleNotificationDeepLinks = YES so cold-start notification taps
    * route to the URL in the notification payload.
    */
    iosAutoHandleNotificationDeepLinks?: boolean;

    /**
    * iOS only. When true, injects `[Radar nativeSetup:options]` into AppDelegate
    * with autoLogNotificationConversions = YES so opened_app conversions are
    * automatically associated with the notification that opened the app.
    */
    iosAutoLogNotificationConversions?: boolean;
  }