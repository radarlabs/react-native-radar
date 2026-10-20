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
    RadarTrackingOptionsSyncNone,
    /// Syncs only on detected events (geofence, place, beacon changes)
    RadarTrackingOptionsSyncEvents
};

/**
 The type of tracking options.
 */
typedef NS_ENUM(NSInteger, RadarTrackingOptionsType) {
    RadarTrackingOptionsTypeDefault,
    RadarTrackingOptionsTypeOnTrip,
    RadarTrackingOptionsTypeInGeofence,
    RadarTrackingOptionsTypeIsUser
};

@class RadarTrackingOptions;

NS_ASSUME_NONNULL_END
