//
//  RadarChain.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 Represents the chain of a place.

 @see https://radar.com/documentation/places
 */
@interface RadarChain : NSObject

/**
 The unique ID of the chain. For a full list of chains, see https://radar.com/documentation/places/chains.

 @see https://radar.com/documentation/places/chains
 */
@property (nonnull, copy, nonatomic, readonly) NSString *slug;

/**
 The name of the chain. For a full list of chains, see https://radar.com/documentation/places/chains.

 @see https://radar.com/documentation/places/chains
 */
@property (nonnull, copy, nonatomic, readonly) NSString *name;

/**
 The external ID of the chain.
 */
@property (nullable, copy, nonatomic, readonly) NSString *externalId;

/**
 The optional set of custom key-value pairs for the chain.
 */
@property (nullable, copy, nonatomic, readonly) NSDictionary *metadata;

+ (NSArray<NSDictionary *> *_Nullable)arrayForChains:(NSArray<RadarChain *> *_Nullable)chains;
- (NSDictionary *_Nonnull)dictionaryValue;

@end
