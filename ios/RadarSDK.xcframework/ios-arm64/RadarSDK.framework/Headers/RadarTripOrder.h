//
//  RadarTripOrder.h
//  RadarSDK
//
//  Copyright © 2024 Radar Labs, Inc. All rights reserved.
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

/**
 Represents a trip order.
 */
@interface RadarTripOrder : NSObject

/**
 The ID of the trip order.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *_id;

/**
 The optional GUID of the trip order.
 */
@property (nullable, copy, nonatomic, readonly) NSString *guid;

/**
 The optional handoff mode of the trip order.
 */
@property (nullable, copy, nonatomic, readonly) NSString *handoffMode;

/**
 The status of the trip order.
 */
@property (assign, nonatomic, readonly) RadarTripOrderStatus status;

/**
 The optional date when the order was fired.
 */
@property (nullable, strong, nonatomic, readonly) NSDate *firedAt;

/**
 The optional number of fired attempts.
 */
@property (nullable, strong, nonatomic, readonly) NSNumber *firedAttempts;

/**
 The optional reason why the order was fired.
 */
@property (nullable, copy, nonatomic, readonly) NSString *firedReason;

/**
 The date when the order was last updated.
 */
@property (nonnull, strong, nonatomic, readonly) NSDate *updatedAt;

- (NSDictionary *_Nonnull)dictionaryValue;

@end

@interface RadarTripOrder ()

- (instancetype _Nullable)initWithId:(NSString *_Nonnull)_id
                                guid:(NSString *_Nullable)guid
                        handoffMode:(NSString *_Nullable)handoffMode
                              status:(RadarTripOrderStatus)status
                             firedAt:(NSDate *_Nullable)firedAt
                       firedAttempts:(NSNumber *_Nullable)firedAttempts
                         firedReason:(NSString *_Nullable)firedReason
                           updatedAt:(NSDate *_Nonnull)updatedAt;

- (instancetype _Nullable)initWithObject:(id _Nonnull)object;

+ (NSArray<RadarTripOrder *> *_Nullable)ordersFromObject:(id _Nonnull)object;
+ (NSArray<NSDictionary *> *_Nullable)arrayForOrders:(NSArray<RadarTripOrder *> *_Nullable)orders;

@end 