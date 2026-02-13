//
//  RadarGeofence.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import "RadarGeofenceGeometry.h"
#import <Foundation/Foundation.h>
#import "RadarOperatingHours.h"

/**
 Represents a geofence.

 @see https://radar.com/documentation/geofences
 */
@interface RadarGeofence : NSObject

/**
 The Radar ID of the geofence.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *_id;

/**
 The description of the geofence. Not to be confused with the `NSObject` `description` property.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *__description;

/**
 The tag of the geofence.
 */
@property (nullable, copy, nonatomic, readonly) NSString *tag;

/**
 The external ID of the geofence.
 */
@property (nullable, copy, nonatomic, readonly) NSString *externalId;

/**
 The optional set of custom key-value pairs for the geofence.
 */
@property (nullable, copy, nonatomic, readonly) NSDictionary *metadata;

/**
 The geometry of the geofence, which can be cast to either `RadarCircleGeometry` or `RadarPolygonGeometry`.
 */
@property (nonnull, strong, nonatomic, readonly) RadarGeofenceGeometry *geometry;

/**
 The optional operating hours for the geofence.
 */
@property (nullable, copy, nonatomic, readonly) RadarOperatingHours *operatingHours;

+ (NSArray<NSDictionary *> *_Nullable)arrayForGeofences:(NSArray<RadarGeofence *> *_Nullable)geofences;
- (NSDictionary *_Nonnull)dictionaryValue;

@end
