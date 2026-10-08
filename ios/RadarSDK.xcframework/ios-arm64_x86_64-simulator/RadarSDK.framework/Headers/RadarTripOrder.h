//
//  RadarTripOrder.h
//  RadarSDK
//
//  Copyright © 2026 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 The statuses for trip orders.
 */
typedef NS_ENUM(NSInteger, RadarTripOrderStatus) {
    /// Unknown
    RadarTripOrderStatusUnknown NS_SWIFT_NAME(unknown),
    /// Pending
    RadarTripOrderStatusPending NS_SWIFT_NAME(pending),
    /// Fired
    RadarTripOrderStatusFired NS_SWIFT_NAME(fired),
    /// Canceled
    RadarTripOrderStatusCanceled NS_SWIFT_NAME(canceled),
    /// Completed
    RadarTripOrderStatusCompleted NS_SWIFT_NAME(completed)
};
