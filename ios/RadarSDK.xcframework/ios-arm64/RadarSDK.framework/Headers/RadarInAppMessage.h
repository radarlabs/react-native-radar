//
//  RadarInAppMessage.h
//  RadarSDK
//
//  Copyright © 2025 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RadarInAppMessage : NSObject

+ (RadarInAppMessage * _Nullable)fromDictionary:(NSDictionary<NSString *, id> * _Nonnull)dict;

+ (NSArray<RadarInAppMessage *> * _Nonnull)fromArray:(id _Nonnull)array;

- (NSDictionary<NSString *, id> * _Nonnull)toDictionary;

@end
