//
//  RadarCircleGeometry.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import "RadarCoordinate.h"
#import "RadarGeofenceGeometry.h"
#import <UIKit/UIKit.h>

/**
 Represents the geometry of a circle geofence.
 */
@interface RadarCircleGeometry : RadarGeofenceGeometry

/**
 The center of the circle geofence.
 */
@property (nonnull, strong, nonatomic, readonly) RadarCoordinate *center;

/**
 The radius of the circle geofence in meters.
 */
@property (assign, nonatomic, readonly) double radius;

@end
