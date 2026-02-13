//
//  RadarUser.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import "RadarBeacon.h"
#import "RadarChain.h"
#import "RadarFraud.h"
#import "RadarGeofence.h"
#import "RadarPlace.h"
#import "RadarRegion.h"
#import "RadarSegment.h"
#import "RadarTrip.h"
#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RadarLocationSource);
typedef NS_ENUM(NSInteger, RadarActivityType);

/**
 Represents the current user state.
 */
@interface RadarUser : NSObject

/**
 The Radar ID of the user.
 */
@property (nonnull, copy, nonatomic, readonly) NSString *_id;

/**
 The unique ID of the user, provided when you identified the user. May be `nil` if the user has not been identified.
 */
@property (nullable, copy, nonatomic, readonly) NSString *userId;

/**
 The device ID of the user.
 */
@property (nullable, copy, nonatomic, readonly) NSString *deviceId;

/**
 The optional description of the user. Not to be confused with the `NSObject` `description` property.
 */
@property (nullable, copy, nonatomic, readonly) NSString *__description;

/**
 The optional set of custom key-value pairs for the user.
 */
@property (nullable, copy, nonatomic, readonly) NSDictionary *metadata;

/**
 The user's current location.
 */
@property (nonnull, strong, nonatomic, readonly) CLLocation *location;

/**
 The user's current activity type.
 */
@property (assign, nonatomic, readonly) RadarActivityType activityType;

/**
 An array of the user's current geofences. May be `nil` or empty if the user is not in any geofences.

 @see https://radar.com/documentation/geofences
 */
@property (nullable, copy, nonatomic, readonly) NSArray<RadarGeofence *> *geofences;

/**
 The user's current place. May be `nil` if the user is not at a place or if Places is not enabled.

 @see https://radar.com/documentation/places
 */
@property (nullable, copy, nonatomic, readonly) RadarPlace *place;

/**
 An array of the user's nearby beacons. May be `nil` or empty if the user is not near any beacons or if Beacons is not enabled.

 @see https://radar.com/documentation/beacons
 */
@property (nullable, copy, nonatomic, readonly) NSArray<RadarBeacon *> *beacons;

/**
 A boolean indicating whether the user is stopped.
 */
@property (assign, nonatomic, readonly) BOOL stopped;

/**
 A boolean indicating whether the user was last updated in the foreground.
 */
@property (assign, nonatomic, readonly) BOOL foreground;

/**
 The user's current country. May be `nil` if country is not available or if Regions is not enabled.

 @see https://radar.com/documentation/regions
 */
@property (nullable, strong, nonatomic, readonly) RadarRegion *country;

/**
 The user's current state. May be `nil` if state is not available or if Regions is not enabled.

 @see https://radar.com/documentation/regions
 */
@property (nullable, strong, nonatomic, readonly) RadarRegion *state;

/**
 The user's current designated market area (DMA). May be `nil` if DMA is not available or if Regions is not enabled.

 @see https://radar.com/documentation/regions
 */
@property (nullable, strong, nonatomic, readonly) RadarRegion *dma;

/**
 The user's current postal code. May be `nil` if postal code is not available or if Regions is not enabled.

 @see https://radar.com/documentation/regions
 */
@property (nullable, strong, nonatomic, readonly) RadarRegion *postalCode;

/**
 The user's nearby chains. May be `nil` if no chains are nearby or if nearby chains are not enabled.
 */
@property (nullable, copy, nonatomic, readonly) NSArray<RadarChain *> *nearbyPlaceChains;

/**
 The user's segments. May be `nil` if segments are not enabled.
 */
@property (nullable, copy, nonatomic, readonly) NSArray<RadarSegment *> *segments;

/**
 The user's nearby chains. May be `nil` if segments are not enabled.
 */
@property (nullable, copy, nonatomic, readonly) NSArray<RadarChain *> *topChains;

- (NSDictionary *_Nonnull)dictionaryValue;

/**
 The source of the user's current location.
 */
@property (assign, nonatomic, readonly) RadarLocationSource source;

/**
 The user's current trip. May be `nil` if the user is not currently on a trip.

 @see https://radar.com/documentation/trip-tracking
 */
@property (nullable, strong, nonatomic, readonly) RadarTrip *trip;

/**
 A boolean indicating whether the user is marked as debug
*/
@property (assign, nonatomic, readonly) BOOL debug;

/**
 The user's current fraud state. May be `nil` if Fraud is not enabled.

 @see https://radar.com/documentation/fraud
 */
@property (nullable, copy, nonatomic, readonly) RadarFraud *fraud;


@property (assign, nonatomic, readonly) double altitude;

@end
