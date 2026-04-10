//
//  RadarTripLeg.h
//  RadarSDK
//
//  Created by Alan Charles on 2/23/26.
//  Copyright © 2026 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 The status values for trip legs.
 */
typedef NS_ENUM(NSInteger, RadarTripLegStatus) {
    /// Unknown
    RadarTripLegStatusUnknown NS_SWIFT_NAME(unknown),
    /// Pending
    RadarTripLegStatusPending NS_SWIFT_NAME(pending),
    /// Started
    RadarTripLegStatusStarted NS_SWIFT_NAME(started),
    /// Approaching
    RadarTripLegStatusApproaching NS_SWIFT_NAME(approaching),
    /// Arrived
    RadarTripLegStatusArrived NS_SWIFT_NAME(arrived),
    /// Completed
    RadarTripLegStatusCompleted NS_SWIFT_NAME(completed),
    /// Canceled
    RadarTripLegStatusCanceled NS_SWIFT_NAME(canceled),
    /// Expired
    RadarTripLegStatusExpired NS_SWIFT_NAME(expired)
};

/**
 The destination type values for trip legs.
 */
typedef NS_ENUM(NSInteger, RadarTripLegDestinationType) {
    /// Unknown
    RadarTripLegDestinationTypeUnknown NS_SWIFT_NAME(unknown),
    /// Geofence
    RadarTripLegDestinationTypeGeofence NS_SWIFT_NAME(geofence),
    /// Address
    RadarTripLegDestinationTypeAddress NS_SWIFT_NAME(address),
    /// Coordinates
    RadarTripLegDestinationTypeCoordinates NS_SWIFT_NAME(coordinates)
};

/**
 Represents a leg of a multi-destination trip.

 @see https://radar.com/documentation/trip-tracking
 */
@interface RadarTripLeg : NSObject

#pragma mark - Response Properties (populated from server response)

/**
 The Radar ID of the leg. Set from server response.
 Use this when calling updateTripLeg.
 */
@property (nullable, nonatomic, copy, readonly) NSString *_id;

/**
 The status of the leg. Set from server response.
 */
@property (nonatomic, assign, readonly) RadarTripLegStatus status;

/**
 The destination type for this leg.
 When parsed from a server response, reflects the server's `destination.type`.
 Otherwise, inferred from which properties are set (geofence > address > coordinates).
 */
@property (nonatomic, assign, readonly) RadarTripLegDestinationType destinationType;

/**
 The date when the leg was created. Set from server response.
 */
@property (nullable, nonatomic, copy, readonly) NSDate *createdAt;

/**
 The date when the leg was last updated. Set from server response.
 */
@property (nullable, nonatomic, copy, readonly) NSDate *updatedAt;

/**
 The ETA duration in minutes to this leg's destination. Set from server response.
 */
@property (nonatomic, assign, readonly) float etaDuration;

/**
 The ETA distance in meters to this leg's destination. Set from server response.
 */
@property (nonatomic, assign, readonly) float etaDistance;

#pragma mark - Geofence Destination Properties

/**
 The tag of the destination geofence for this leg.
 Use with destinationGeofenceExternalId for geofence-based destinations.
 */
@property (nullable, nonatomic, copy) NSString *destinationGeofenceTag;

/**
 The external ID of the destination geofence for this leg.
 Use with destinationGeofenceTag for geofence-based destinations.
 */
@property (nullable, nonatomic, copy) NSString *destinationGeofenceExternalId;

/**
 The Radar ID of the destination geofence for this leg.
 Alternative to using destinationGeofenceTag + destinationGeofenceExternalId.
 */
@property (nullable, nonatomic, copy) NSString *destinationGeofenceId;

#pragma mark - Address Destination Properties

/**
 The address string for the destination of this leg.
 Use for address-based destinations.
 */
@property (nullable, nonatomic, copy) NSString *address;

#pragma mark - Coordinate Destination Properties

/**
 The coordinates for the destination of this leg.
 Use for coordinate-based destinations. Set latitude and longitude.
 */
@property (nonatomic, assign) CLLocationCoordinate2D coordinates;

/**
 Whether coordinates have been explicitly set.
 */
@property (nonatomic, assign, readonly) BOOL hasCoordinates;

/**
 The arrival radius in meters for coordinate-based destinations.
 Only used when coordinates are set.
 */
@property (nonatomic, assign) NSInteger arrivalRadius;

#pragma mark - Common Properties

/**
 The stop duration in minutes for this leg.
 */
@property (nonatomic, assign) NSInteger stopDuration;

/**
 An optional set of custom key-value pairs for this leg.
 */
@property (nullable, nonatomic, copy) NSDictionary *metadata;

#pragma mark - Initializers

/**
 Initializes a RadarTripLeg with the specified destination geofence tag and external ID.

 @param destinationGeofenceTag The tag of the destination geofence.
 @param destinationGeofenceExternalId The external ID of the destination geofence.

 @return A new RadarTripLeg instance.
 */
- (instancetype)initWithDestinationGeofenceTag:(NSString *_Nullable)destinationGeofenceTag
                 destinationGeofenceExternalId:(NSString *_Nullable)destinationGeofenceExternalId;

/**
 Initializes a RadarTripLeg with the specified destination geofence ID.

 @param destinationGeofenceId The Radar ID of the destination geofence.

 @return A new RadarTripLeg instance.
 */
- (instancetype)initWithDestinationGeofenceId:(NSString *_Nonnull)destinationGeofenceId;

/**
 Initializes a RadarTripLeg with the specified address.

 @param address The address string for the destination.

 @return A new RadarTripLeg instance.
 */
- (instancetype)initWithAddress:(NSString *_Nonnull)address;

/**
 Initializes a RadarTripLeg with the specified coordinates.

 @param coordinates The coordinates for the destination.

 @return A new RadarTripLeg instance.
 */
- (instancetype)initWithCoordinates:(CLLocationCoordinate2D)coordinates;

/**
 Creates a RadarTripLeg from a dictionary representation.

 @param dict The dictionary containing leg data.

 @return A new RadarTripLeg instance, or nil if the dictionary is invalid.
 */
+ (RadarTripLeg *_Nullable)legFromDictionary:(NSDictionary *_Nullable)dict;

/**
 Creates an array of RadarTripLeg objects from an array of dictionaries.

 @param array The array of dictionaries containing leg data.

 @return An array of RadarTripLeg instances, or nil if the array is invalid.
 */
+ (NSArray<RadarTripLeg *> *_Nullable)legsFromArray:(NSArray *_Nullable)array;

/**
 Converts the leg to a dictionary representation for API serialization.

 @return A dictionary representation of the leg.
 */
- (NSDictionary *)dictionaryValue;

/**
 Converts an array of legs to an array of dictionaries.

 @param legs The array of RadarTripLeg instances.

 @return An array of dictionary representations.
 */
+ (NSArray<NSDictionary *> *_Nullable)arrayForLegs:(NSArray<RadarTripLeg *> *_Nullable)legs;

/**
 Returns the string representation of a trip leg status.

 @param status The trip leg status.

 @return The string representation.
 */
+ (NSString *)stringForStatus:(RadarTripLegStatus)status;

/**
 Returns the trip leg status for a string representation.

 @param string The string representation.

 @return The trip leg status.
 */
+ (RadarTripLegStatus)statusForString:(NSString *)string;

/**
 Returns the string representation of a trip leg destination type.

 @param destinationType The trip leg destination type.

 @return The string representation.
 */
+ (NSString *)stringForDestinationType:(RadarTripLegDestinationType)destinationType;

/**
 Returns the trip leg destination type for a string representation.

 @param string The string representation.

 @return The trip leg destination type.
 */
+ (RadarTripLegDestinationType)destinationTypeForString:(NSString *)string;

@end

NS_ASSUME_NONNULL_END
