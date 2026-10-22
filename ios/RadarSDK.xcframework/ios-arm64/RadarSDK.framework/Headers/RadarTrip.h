//
//  RadarTrip.h
//  RadarSDK
//
//  Copyright © 2020 Radar Labs, Inc. All rights reserved.
//

#import "RadarRouteMode.h"
#import <Foundation/Foundation.h>

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
