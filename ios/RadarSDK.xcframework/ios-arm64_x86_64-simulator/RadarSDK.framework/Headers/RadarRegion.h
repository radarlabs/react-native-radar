//
//  RadarRegion.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Represents a region.

 @see https://radar.com/documentation/regions
 */
@interface RadarRegion : NSObject

/**
 The Radar ID of the region.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *_id;

/**
 The name of the region.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *name;

/**
 The unique code for the region.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *code;

/**
 The type of the region.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *type;

/**
 The optional flag of the region.
 */
@property (nullable, copy, nonatomic, readonly) NSString *flag;

/**
 A boolean indicating whether the jurisdiction is allowed. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) BOOL allowed;

/**
 A boolean indicating whether all jurisdiction checks for the region have passed. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) BOOL passed;

/**
 A boolean indicating whether the user is in an exclusion zone for the jurisdiction. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) BOOL inExclusionZone;

/**
 A boolean indicating whether the user is too close to the border for the jurisdiction. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) BOOL inBufferZone;

/**
 The distance in meters to the border of the jurisdiction. May be 0 if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) double distanceToBorder;

/**
 A boolean indicating whether the jurisdiction is expected based on the values passed to `setExpectedJurisdiction()`.
 */
@property (assign, nonatomic, readonly) BOOL expected;

/**
 
 */

- (NSDictionary *_Nonnull)dictionaryValue;

@end

NS_ASSUME_NONNULL_END
