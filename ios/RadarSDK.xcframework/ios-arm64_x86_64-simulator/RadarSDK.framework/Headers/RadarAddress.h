//
//  RadarAddress.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import "RadarCoordinate.h"
#import "RadarTimeZone.h"
#import <Foundation/Foundation.h>

/**
  The confidence levels for geocoding results.
 */
typedef NS_ENUM(NSInteger, RadarAddressConfidence) {
    /// Unknown
    RadarAddressConfidenceNone NS_SWIFT_NAME(none) = 0,
    /// Exact
    RadarAddressConfidenceExact NS_SWIFT_NAME(exact) = 1,
    /// Interpolated
    RadarAddressConfidenceInterpolated NS_SWIFT_NAME(interpolated) = 2,
    /// Fallback
    RadarAddressConfidenceFallback NS_SWIFT_NAME(fallback) = 3
};


NS_ASSUME_NONNULL_BEGIN

/**
 Represents an address.

 @see https://radar.com/documentation/api#geocoding
 */
@interface RadarAddress : NSObject

/**
 The location coordinate of the address.
 */
@property (assign, nonatomic, readonly) CLLocationCoordinate2D coordinate;

/**
 The formatted string representation of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *formattedAddress;

/**
 The name of the country of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *country;

/**
 The unique code of the country of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *countryCode;

/**
 The flag of the country of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *countryFlag;

/**
 The name of the DMA of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *dma;

/**
 The unique code of the DMA of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *dmaCode;

/**
 The name of the state of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *state;

/**
 The unique code of the state of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *stateCode;

/**
 The postal code of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *postalCode;

/**
 The city of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *city;

/**
 The borough of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *borough;

/**
 The county of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *county;

/**
 The neighborhood of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *neighborhood;

/**
 The street number of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *number;

/**
 The street name of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *street;

/**
 The label of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSString *addressLabel;

/**
 The label of the place.
 */
@property (nullable, copy, nonatomic, readonly) NSString *placeLabel;

/**
The unit of the address.
*/
@property (nullable, copy, nonatomic, readonly) NSString *unit;

/**
The plus4 value for the zip of the address.
*/
@property (nullable, copy, nonatomic, readonly) NSString *plus4;

/**
The distance to the search anchor in meters.
*/
@property (nullable, copy, nonatomic, readonly) NSNumber *distance; 

/**
The layer of the address, e.g. 'place', 'address', 'intersection', 'street', 'state', etc.
*/
@property (nullable, copy, nonatomic, readonly) NSString *layer;

/**
The metadata of the address.
*/
@property (nullable, copy, nonatomic, readonly) NSDictionary *metadata;

/**
  The confidence level of the geocoding result.
 */
@property (nonatomic, assign) enum RadarAddressConfidence confidence;

/**
The time zone information of the address.
 */
@property (nullable, copy, nonatomic, readonly) RadarTimeZone *timeZone;

/**
The categories of the address.
 */
@property (nullable, copy, nonatomic, readonly) NSArray<NSString *> *categories;

+ (RadarAddress *_Nullable)addressFromObject:(id _Nonnull)object;
+ (NSArray<NSDictionary *> *_Nullable)arrayForAddresses:(NSArray<RadarAddress *> *_Nullable)addresses;
- (NSDictionary *_Nonnull)dictionaryValue;

@end

NS_ASSUME_NONNULL_END
