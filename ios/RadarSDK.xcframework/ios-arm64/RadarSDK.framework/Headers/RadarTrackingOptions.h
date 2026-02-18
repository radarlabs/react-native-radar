//
//  RadarTrackingOptions.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 The location accuracy options.
 */
typedef NS_ENUM(NSInteger, RadarTrackingOptionsDesiredAccuracy) {
    /// Uses `kCLLocationAccuracyBest`
    RadarTrackingOptionsDesiredAccuracyHigh,
    /// Uses `kCLLocationAccuracyHundredMeters`, the default
    RadarTrackingOptionsDesiredAccuracyMedium,
    /// Uses `kCLLocationAccuracyKilometer`
    RadarTrackingOptionsDesiredAccuracyLow
};

/**
 The replay options for failed location updates.
 */
typedef NS_ENUM(NSInteger, RadarTrackingOptionsReplay) {
    /// Replays failed stops
    RadarTrackingOptionsReplayStops,
    /// Replays no failed location updates
    RadarTrackingOptionsReplayNone,
    /// Replays all failed location updates
    RadarTrackingOptionsReplayAll
};

/**
 The sync options for location updates.
 */
typedef NS_ENUM(NSInteger, RadarTrackingOptionsSyncLocations) {
    /// Syncs all location updates to the server
    RadarTrackingOptionsSyncAll,
    /// Syncs only stops and exits to the server
    RadarTrackingOptionsSyncStopsAndExits,
    /// Syncs no location updates to the server
    RadarTrackingOptionsSyncNone
};

/**
 An options class used to configure background tracking.
 @see https://radar.com/documentation/sdk/ios
 */
@interface RadarTrackingOptions : NSObject

/**
 Determines the desired location update interval in seconds when stopped. Use 0 to shut down when stopped.
 @warning Note that location updates may be delayed significantly by Low Power Mode, or if the device has connectivity issues, low battery, or wi-fi disabled.
 */
@property (nonatomic, assign) int desiredStoppedUpdateInterval;

/**
 Determines the desired location update interval in seconds when moving.
 @warning Note that location updates may be delayed significantly by Low Power Mode, or if the device has connectivity issues, low battery, or wi-fi disabled.
 */
@property (nonatomic, assign) int desiredMovingUpdateInterval;

/**
 Determines the desired sync interval in seconds.
 */
@property (nonatomic, assign) int desiredSyncInterval;

/**
 Determines the desired accuracy of location updates.
 */
@property (nonatomic, assign) RadarTrackingOptionsDesiredAccuracy desiredAccuracy;

/**
 With `stopDistance`, determines the duration in seconds after which the device is considered stopped.
 */
@property (nonatomic, assign) int stopDuration;

/**
 With `stopDuration`, determines the distance in meters within which the device is considered stopped.
 */
@property (nonatomic, assign) int stopDistance;

/**
 Determines when to start tracking. Use `nil` to start tracking when `startTracking` is called.
 */
@property (nullable, nonatomic, copy) NSDate *startTrackingAfter;

/**
 Determines when to stop tracking. Use `nil` to track until `stopTracking` is called.
 */
@property (nullable, nonatomic, copy) NSDate *stopTrackingAfter;

/**
 Determines which failed location updates to replay to the server.
 */
@property (nonatomic, assign) RadarTrackingOptionsReplay replay;

/**
 Determines which location updates to sync to the server.
 */
@property (nonatomic, assign) RadarTrackingOptionsSyncLocations syncLocations;

/**
 Determines whether the flashing blue status bar is shown when tracking.
 @see https://developer.apple.com/documentation/corelocation/cllocationmanager/2923541-showsbackgroundlocationindicator
 */
@property (nonatomic, assign) BOOL showBlueBar;

/**
 Determines whether to use the iOS region monitoring service (geofencing) to create a client geofence around the device's current location when stopped.
 @see https://developer.apple.com/documentation/corelocation/monitoring_the_user_s_proximity_to_geographic_regions
 */
@property (nonatomic, assign) BOOL useStoppedGeofence;

/**
 Determines the radius in meters of the client geofence around the device's current location when stopped.
 */
@property (nonatomic, assign) int stoppedGeofenceRadius;

/**
 Determines whether to use the iOS region monitoring service (geofencing) to create a client geofence around the device's current location when moving.
 @see https://developer.apple.com/documentation/corelocation/monitoring_the_user_s_proximity_to_geographic_regions
 */
@property (nonatomic, assign) BOOL useMovingGeofence;

/**
 Determines the radius in meters of the client geofence around the device's current location when moving.
 */
@property (nonatomic, assign) int movingGeofenceRadius;

/**
 Determines whether to sync nearby geofences from the server to the client to improve responsiveness.
 */
@property (nonatomic, assign) BOOL syncGeofences;

/**
 Determines whether to use the iOS visit monitoring service.
 @see https://developer.apple.com/documentation/corelocation/getting_the_user_s_location/using_the_visits_location_service
 */
@property (nonatomic, assign) BOOL useVisits;

/**
 Determines whether to use the iOS significant location change service.
 @see https://developer.apple.com/documentation/corelocation/getting_the_user_s_location/using_the_significant-change_location_service
 */
@property (nonatomic, assign) BOOL useSignificantLocationChanges;

/**
 Determines whether to monitor beacons.
 */
@property (nonatomic, assign) BOOL beacons;

/**
 Determines whether to use indoor scanning
 */
@property (nonatomic, assign) BOOL useIndoorScan;

/**
 Determines whether to use the iOS motion activity service.
 */
@property (nonatomic, assign) BOOL useMotion;

/**
 Determines whether to use the iOS pressure service.
 */
@property (nonatomic, assign) BOOL usePressure;

/**
 Updates about every 30 seconds while moving or stopped. Moderate battery usage. Shows the flashing blue status bar during tracking.
 @see https://developer.apple.com/documentation/corelocation/cllocationmanager/2923541-showsbackgroundlocationindicator
 */
@property (class, copy, readonly) RadarTrackingOptions *presetContinuous;

/**
 Updates about every 2.5 minutes when moving and shuts down when stopped to save battery. Once stopped, the device will need to move more than 100 meters to wake up and start
 moving again. Low battery usage. Requires the `location` background mode.
 Note that location updates may be delayed significantly by Low Power Mode, or if the device has connectivity issues, low battery, or wi-fi disabled.
 */
@property (class, copy, readonly) RadarTrackingOptions *presetResponsive;

/**
 Uses the iOS visit monitoring service to update only on stops and exits. Once stopped, the device will need to move several hundred meters and trigger a visit departure to wake up
 and start moving again. Lowest battery usage.
 Note that location updates may be delayed significantly by Low Power Mode, or if the device has connectivity issues, low battery, or wi-fi disabled.
 @see https://developer.apple.com/documentation/corelocation/getting_the_user_s_location/using_the_visits_location_service
 */
@property (class, copy, readonly) RadarTrackingOptions *presetEfficient;

+ (NSString *)stringForDesiredAccuracy:(RadarTrackingOptionsDesiredAccuracy)desiredAccuracy;
+ (RadarTrackingOptionsDesiredAccuracy)desiredAccuracyForString:(NSString *)str;
+ (NSString *)stringForReplay:(RadarTrackingOptionsReplay)replay;
+ (RadarTrackingOptionsReplay)replayForString:(NSString *)str;
+ (NSString *)stringForSyncLocations:(RadarTrackingOptionsSyncLocations)syncLocations;
+ (RadarTrackingOptionsSyncLocations)syncLocationsForString:(NSString *)str;
+ (RadarTrackingOptions *_Nullable)trackingOptionsFromDictionary:(NSDictionary *_Nonnull)dictionary;
- (NSDictionary *)dictionaryValue;

@end

NS_ASSUME_NONNULL_END
