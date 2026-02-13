//
//  RadarSegment.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Represents a user segment.
 */
@interface RadarSegment : NSObject

/**
 The description of the segment.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *__description;

/**
 The external ID of the segment.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *externalId;

+ (NSArray<NSDictionary *> *_Nullable)arrayForSegments:(NSArray<RadarSegment *> *_Nullable)segments;
- (NSDictionary *_Nonnull)dictionaryValue;

@end

NS_ASSUME_NONNULL_END
