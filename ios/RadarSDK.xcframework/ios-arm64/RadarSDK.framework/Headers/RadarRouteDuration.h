//
//  RadarRouteDuration.h
//  RadarSDK
//
//  Copyright © 2020 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Represents the duration of a route.
 */
@interface RadarRouteDuration : NSObject

/**
 The duration in minutes.
 */
@property (assign, nonatomic, readonly) double value;

/**
 A display string for the duration.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *text;

- (NSDictionary *_Nonnull)dictionaryValue;

@end

NS_ASSUME_NONNULL_END
