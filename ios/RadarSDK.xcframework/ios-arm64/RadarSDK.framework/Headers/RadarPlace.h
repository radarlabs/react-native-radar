//
//  RadarPlace.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import "RadarChain.h"
#import "RadarCoordinate.h"
#import "RadarAddress.h"
#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>

/**
 Represents a place.

 @see https://radar.com/documentation/places
 */
@interface RadarPlace : NSObject

/**
 The Radar ID of the place.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *_id;

/**
 The name of the place.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *name;

/**
 The categories of the place. For a full list of categories, see https://radar.com/documentation/places/categories.

 @see https://radar.com/documentation/places/categories
 */
@property (nonnull, copy, nonatomic, readonly) NSArray<NSString *> *categories;

/**
 The chain of the place, if known. May be `nil` for places without a chain. For a full list of chains, see https://radar.com/documentation/places/chains.

 @see https://radar.com/documentation/places/chains
 */
@property (nullable, strong, nonatomic, readonly) RadarChain *chain;

/**
 The location of the place.
 */
@property (nonnull, strong, nonatomic, readonly) RadarCoordinate *location;

/**
 The group for the place, if any. For a full list of groups, see https://radar.com/documentation/places/groups.

 @see https://radar.com/documentation/places/groups
 */
@property (nullable, strong, nonatomic, readonly) NSString *group;

/**
 The metadata for the place, if part of a group. For details of metadata fields see https://radar.com/documentation/places/groups.

 @see https://radar.com/documentation/places/groups
 */
@property (nullable, strong, nonatomic, readonly) NSDictionary *metadata;

/**
The address of the place.
*/
@property (nullable, strong, nonatomic, readonly) RadarAddress *address;
/**
 Returns a boolean indicating whether the place is part of the specified chain.

 @return A boolean indicating whether the place is part of the specified chain.
 **/
- (BOOL)isChain:(NSString *_Nullable)slug;

/**
 Returns a boolean indicating whether the place has the specified category.

 @return A boolean indicating whether the place has the specified category.
 **/
- (BOOL)hasCategory:(NSString *_Nullable)category;

+ (NSArray<NSDictionary *> *_Nullable)arrayForPlaces:(NSArray<RadarPlace *> *_Nullable)places;
- (NSDictionary *_Nonnull)dictionaryValue;

@end
