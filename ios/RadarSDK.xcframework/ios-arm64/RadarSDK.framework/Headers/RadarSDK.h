//
//  RadarSDK.h
//  RadarSDK
//
//  Copyright © 2021 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

//! Project version number for RadarSDK.
FOUNDATION_EXPORT double RadarSDKVersionNumber;

//! Project version string for RadarSDK.
FOUNDATION_EXPORT const unsigned char RadarSDKVersionString[];

#import "Radar.h"
#import "RadarAddress.h"
#import "RadarDelegate.h"
#import "RadarEvent.h"
#import "RadarGeofence.h"
#import "RadarGeofenceGeometry.h"
#import "RadarPlace.h"
#import "RadarRegion.h"
#import "RadarRouteMode.h"
#import "RadarRoutes.h"
#import "RadarTrackingOptions.h"
#import "RadarTrip.h"
#import "RadarTripLeg.h"
#import "RadarTripOrder.h"
#import "RadarUser.h"
#import "RadarVerifiedDelegate.h"
#import "RadarMotionProtocol.h"
#import "RadarInAppMessage.h"
#import "RadarInAppMessageDelegate.h"
#import "RadarIndoorsProtocol.h"
#import "RadarSwizzleHelper.h"

#if __has_include(<RadarSDK/RadarSDK-Swift.h>)
#import <RadarSDK/RadarSDK-Swift.h>
#elif __has_include("RadarSDK-Swift.h")
#import "RadarSDK-Swift.h"
#endif

// Compatibility headers for classes now declared in RadarSDK-Swift.h. Listed here so the
// umbrella covers every public header; each one only re-imports this file.
#import "RadarChain.h"
#import "RadarCircleGeometry.h"
#import "RadarCoordinate.h"
#import "RadarFraud.h"
#import "RadarInitializeOptions.h"
#import "RadarOperatingHours.h"
#import "RadarPolygonGeometry.h"
#import "RadarRevealRiskToken.h"
#import "RadarRoute.h"
#import "RadarRouteDistance.h"
#import "RadarRouteDuration.h"
#import "RadarRouteGeometry.h"
#import "RadarTimeZone.h"
#import "RadarTripOptions.h"
