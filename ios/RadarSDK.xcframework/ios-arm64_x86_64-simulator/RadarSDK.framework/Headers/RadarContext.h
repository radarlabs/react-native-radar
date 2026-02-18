//
//  RadarContext.h
//  RadarSDK
//
//  Copyright © 2020 Radar Labs, Inc. All rights reserved.
//

#import "RadarGeofence.h"
#import "RadarPlace.h"
#import "RadarRegion.h"
#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>

/**
 Represents the context for a location.

 @see https://radar.com/documentation/api#context
 */
@interface RadarContext : NSObject

/**
 An array of the geofences for the location. May be empty if the location is not in any geofences.

 @see https://radar.com/documentation/geofences
 */
@property (nonnull, copy, nonatomic, readonly) NSArray<RadarGeofence *> *geofences;

/**
 The place for the location. May be `nil` if the location is not at a place or if Places is not enabled.

 @see https://radar.com/documentation/places
 */
@property (nullable, copy, nonatomic, readonly) RadarPlace *place;

/**
 The country of the location. May be `nil` if country is not available or if Regions is not enabled.

 @see https://radar.com/documentation/regions
 */
@property (nullable, strong, nonatomic, readonly) RadarRegion *country;

/**
 The state of the location. May be `nil` if state is not available or if Regions is not enabled.

 @see https://radar.com/documentation/regions
 */
@property (nullable, strong, nonatomic, readonly) RadarRegion *state;

/**
 The designated market area (DMA) of the location. May be `nil` if DMA is not available or if Regions is not enabled.

 @see https://radar.com/documentation/regions
 */
@property (nullable, strong, nonatomic, readonly) RadarRegion *dma;

/**
 The postal code of the location. May be `nil` if postal code is not available or if Regions is not enabled.

 @see https://radar.com/documentation/regions
 */
@property (nullable, strong, nonatomic, readonly) RadarRegion *postalCode;

- (NSDictionary *_Nonnull)dictionaryValue;

@end
