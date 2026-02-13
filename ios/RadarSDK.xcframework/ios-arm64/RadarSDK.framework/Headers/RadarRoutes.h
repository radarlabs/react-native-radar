//
//  RadarRoutes.h
//  RadarSDK
//
//  Copyright © 2020 Radar Labs, Inc. All rights reserved.
//

#import "RadarRoute.h"
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Represents routes from an origin to a destination.

 @see https://radar.com/documentation/api#distance
*/
@interface RadarRoutes : NSObject

/**
 The geodesic distance between the origin and destination.
 */
@property (nullable, strong, nonatomic, readonly) RadarRouteDistance *geodesic;

/**
 The route by foot between the origin and destination. May be `nil` if mode not specified or route unavailable.
 */
@property (nullable, strong, nonatomic, readonly) RadarRoute *foot;

/**
 The route by bike between the origin and destination. May be `nil` if mode not specified or route unavailable.
 */
@property (nullable, strong, nonatomic, readonly) RadarRoute *bike;

/**
 The route by car between the origin and destination. May be `nil` if mode not specified or route unavailable.
 */
@property (nullable, strong, nonatomic, readonly) RadarRoute *car;

/**
 The route by truck between the origin and destination. May be `nil` if mode not specified or route unavailable.
 */
@property (nullable, strong, nonatomic, readonly) RadarRoute *truck;

/**
 The route by motorbike between the origin and destination. May be `nil` if mode not specified or route unavailable.
 */
@property (nullable, strong, nonatomic, readonly) RadarRoute *motorbike;

- (NSDictionary *_Nonnull)dictionaryValue;

@end

NS_ASSUME_NONNULL_END
