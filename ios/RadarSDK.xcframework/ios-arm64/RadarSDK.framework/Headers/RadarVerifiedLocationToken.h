//
//  RadarVerifiedLocationToken.h
//  RadarSDK
//
//  Copyright © 2024 Radar Labs, Inc. All rights reserved.
//

#import "RadarEvent.h"
#import "RadarUser.h"
#import <Foundation/Foundation.h>

/**
 Represents a user's verified location.

 @see https://radar.com/documentation/fraud
 */
@interface RadarVerifiedLocationToken : NSObject

/**
 The user.
 */
@property (nullable, strong, nonatomic, readonly) RadarUser *user;

/**
 An array of events.
 */
@property (nullable, strong, nonatomic, readonly) NSArray<RadarEvent *> *events;

/**
 A signed JSON Web Token (JWT) containing the user and array of events. Verify the token server-side using your secret key.
 */
@property (nullable, copy, nonatomic, readonly) NSString *token;

/**
 The datetime when the token expires.
 */
@property (nullable, copy, nonatomic, readonly) NSDate *expiresAt;

/**
 The number of seconds until the token expires.
 */
@property (assign, nonatomic, readonly) NSTimeInterval expiresIn;

/**
 A boolean indicating whether the user passed all jurisdiction and fraud detection checks.
 */
@property (assign, nonatomic, readonly) bool passed;

/**
 An array of failure reasons for jurisdiction and fraud detection checks.
 */
@property (nullable, copy, nonatomic, readonly) NSArray<NSString *> *failureReasons;

/**
 The Radar ID of the location check.
 */
@property (nullable, copy, nonatomic, readonly) NSString *_id;

/**
 The full dictionary value of the token.
 */
@property (nullable, copy, nonatomic, readonly) NSDictionary *fullDict;

- (NSDictionary *_Nonnull)dictionaryValue;

@end
