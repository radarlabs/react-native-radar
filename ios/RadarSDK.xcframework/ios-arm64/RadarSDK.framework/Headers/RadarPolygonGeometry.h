//
//  RadarPolygonGeometry.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import "RadarCoordinate.h"
#import "RadarGeofenceGeometry.h"

/**
 Represents the geometry of polygon geofence.
 */
@interface RadarPolygonGeometry : RadarGeofenceGeometry

/**
 The geometry of the polygon geofence. A closed ring of coordinates.
 */
@property (nullable, copy, nonatomic, readonly) NSArray<RadarCoordinate *> *_coordinates;

/**
 The calculated centroid of the polygon geofence.
 */
@property (nonnull, strong, nonatomic, readonly) RadarCoordinate *center;

/**
 The calculated radius of the polygon geofence in meters.
 */
@property (assign, nonatomic, readonly) double radius;

@end
