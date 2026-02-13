//
//  RadarTrip.h
//  RadarSDK
//
//  Copyright © 2020 Radar Labs, Inc. All rights reserved.
//

#import "RadarCoordinate.h"
#import "RadarRouteMode.h"
#import "RadarTripOrder.h"
#import <Foundation/Foundation.h>

/**
 Represents a trip.

 @see https://radar.com/documentation/trip-tracking
 */
@interface RadarTrip : NSObject

/**
 The statuses for trips.
 */
typedef NS_ENUM(NSInteger, RadarTripStatus) {
    /// Unknown
    RadarTripStatusUnknown NS_SWIFT_NAME(unknown),
    /// `started`
    RadarTripStatusStarted NS_SWIFT_NAME(started),
    /// `approaching`
    RadarTripStatusApproaching NS_SWIFT_NAME(approaching),
    /// `arrived`
    RadarTripStatusArrived NS_SWIFT_NAME(arrived),
    /// `expired`
    RadarTripStatusExpired NS_SWIFT_NAME(expired),
    /// `completed`
    RadarTripStatusCompleted NS_SWIFT_NAME(completed),
    /// `canceled`
    RadarTripStatusCanceled NS_SWIFT_NAME(canceled)
};

/**
 The Radar ID of the trip.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *_id;

/**
 The external ID of the trip.
 */
@property (nullable, copy, nonatomic, readonly) NSString *externalId;

/**
 The optional set of custom key-value pairs for the trip.
 */
@property (nullable, copy, nonatomic, readonly) NSDictionary *metadata;

/**
 For trips with a destination, the tag of the destination geofence.
 */
@property (nullable, copy, nonatomic, readonly) NSString *destinationGeofenceTag;

/**
 For trips with a destination, the external ID of the destination geofence.
 */
@property (nullable, copy, nonatomic, readonly) NSString *destinationGeofenceExternalId;

/**
 For trips with a destination, the location of the destination geofence.
 */
@property (nullable, strong, nonatomic, readonly) RadarCoordinate *destinationLocation;

/**
 The travel mode for the trip.
 */
@property (assign, nonatomic, readonly) RadarRouteMode mode;

/**
 For trips with a destination, the distance to the destination geofence in meters based on the travel mode for the trip.
 */
@property (assign, nonatomic, readonly) float etaDistance;

/**
 For trips with a destination, the ETA to the destination geofence in minutes based on the travel mode for the trip.
 */
@property (assign, nonatomic, readonly) float etaDuration;

/**
 The status of the trip.
 */
@property (assign, nonatomic, readonly) RadarTripStatus status;

/**
 The optional array of trip orders associated with this trip.
 */
@property (nullable, copy, nonatomic, readonly) NSArray<RadarTripOrder *> *orders;

- (NSDictionary *_Nonnull)dictionaryValue;

@end
