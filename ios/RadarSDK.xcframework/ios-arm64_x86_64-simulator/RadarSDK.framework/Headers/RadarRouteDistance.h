//
//  RadarRouteDistance.h
//  RadarSDK
//
//  Copyright © 2020 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Represents the distance of a route.
 */
@interface RadarRouteDistance : NSObject

/**
 The distance in feet (for imperial units) or meters (for metric units).
 */
@property (assign, nonatomic, readonly) double value;

/**
 A display string for the distance.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *text;

- (NSDictionary *_Nonnull)dictionaryValue;

@end

NS_ASSUME_NONNULL_END
