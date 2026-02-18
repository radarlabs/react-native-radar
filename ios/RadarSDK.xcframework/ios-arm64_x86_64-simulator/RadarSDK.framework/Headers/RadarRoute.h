//
//  RadarRoute.h
//  RadarSDK
//
//  Copyright © 2020 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "RadarRouteDistance.h"
#import "RadarRouteDuration.h"
#import "RadarRouteGeometry.h"

NS_ASSUME_NONNULL_BEGIN

/**
 Represents a route between an origin and a destination.

 @see https://radar.com/documentation/api#routing
 */
@interface RadarRoute : NSObject

/**
 The distance of the route.
 */
@property (nonnull, strong, nonatomic, readonly) RadarRouteDistance *distance;

/**
 The duration of the route.
 */
@property (nonnull, strong, nonatomic, readonly) RadarRouteDuration *duration;

/**
 The geometry of the route.
 */
@property (nonnull, strong, nonatomic, readonly) RadarRouteGeometry *geometry;

- (NSDictionary *_Nonnull)dictionaryValue;

@end

NS_ASSUME_NONNULL_END
