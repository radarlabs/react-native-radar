//
//  RadarTripLeg.h
//  RadarSDK
//
//  Copyright © 2026 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

/**
 The status values for trip legs.
 */
typedef NS_ENUM(NSInteger, RadarTripLegStatus) {
    /// Unknown
    RadarTripLegStatusUnknown NS_SWIFT_NAME(unknown),
    /// Pending
    RadarTripLegStatusPending NS_SWIFT_NAME(pending),
    /// Started
    RadarTripLegStatusStarted NS_SWIFT_NAME(started),
    /// Approaching
    RadarTripLegStatusApproaching NS_SWIFT_NAME(approaching),
    /// Arrived
    RadarTripLegStatusArrived NS_SWIFT_NAME(arrived),
    /// Completed
    RadarTripLegStatusCompleted NS_SWIFT_NAME(completed),
    /// Canceled
    RadarTripLegStatusCanceled NS_SWIFT_NAME(canceled),
    /// Expired
    RadarTripLegStatusExpired NS_SWIFT_NAME(expired)
};

/**
 The destination type values for trip legs.
 */
typedef NS_ENUM(NSInteger, RadarTripLegDestinationType) {
    /// Unknown
    RadarTripLegDestinationTypeUnknown NS_SWIFT_NAME(unknown),
    /// Geofence
    RadarTripLegDestinationTypeGeofence NS_SWIFT_NAME(geofence),
    /// Address
    RadarTripLegDestinationTypeAddress NS_SWIFT_NAME(address),
    /// Coordinates
    RadarTripLegDestinationTypeCoordinates NS_SWIFT_NAME(coordinates)
};
