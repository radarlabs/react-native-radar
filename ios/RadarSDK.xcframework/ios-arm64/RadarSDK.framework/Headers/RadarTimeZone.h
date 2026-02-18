//
//  RadarTimeZone.h
//  RadarSDK
//
//  Copyright © 2024 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Represents a time zone.
 @see https://radar.com/documentation/api#geocoding
 */
@interface RadarTimeZone : NSObject

/**
 The ID of the time zone.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *_id;

/**
 The name of of the time zone.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *name;

/**
 The time zone abbreviation.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *code;

/**
 The current time for the time zone.
 */
@property (nonnull, copy, nonatomic, readonly) NSDate *currentTime;

/**
 The UTC offset for the time zone.
 */
@property (assign, nonatomic, readonly) int utcOffset;

/**
 The DST offset for the time zone.
 */
@property (assign, nonatomic, readonly) int dstOffset;

- (NSDictionary *_Nonnull)dictionaryValue;

@end

NS_ASSUME_NONNULL_END
