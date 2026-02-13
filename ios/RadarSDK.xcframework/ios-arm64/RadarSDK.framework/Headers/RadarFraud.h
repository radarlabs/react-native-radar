//
//  RadarFraud.h
//  RadarSDK
//
//  Copyright © 2021 Radar Labs, Inc. All rights reserved.

#import <Foundation/Foundation.h>

/**
 Represents fraud detection signals for location verification.

 @warning Note that these values should not be trusted unless you called `trackVerified()` instead of `trackOnce()`.

 @see https://radar.com/documentation/fraud
 */
@interface RadarFraud : NSObject

/**
 A boolean indicating whether the user passed fraud detection checks. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) bool passed;

/**
 A boolean indicating whether fraud detection checks were bypassed for the user for testing. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) bool bypassed;

/**
 A boolean indicating whether the request was made with SSL pinning configured successfully. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) bool verified;

/**
 A boolean indicating whether the user's IP address is a known proxy. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) bool proxy;

/**
 A boolean indicating whether the user's location is being mocked, such as in the simulator or using a location spoofing app. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) bool mocked;

/**
 A boolean indicating whether the user's device or app has been compromised according to `DeviceCheck`. May be `false` if Fraud is not enabled.

 @see https://developer.apple.com/documentation/devicecheck
 */
@property (assign, nonatomic, readonly) bool compromised;

/**
 A boolean indicating whether the user moved too far too fast. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) bool jumped;

/**
 A boolean indicating whether the user's location is not accurate enough. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) bool inaccurate;

/**
 A boolean indicating whether the user's location is not accurate enough. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) bool sharing;

/**
 A boolean indicating whether the user has been manually blocked. May be `false` if Fraud is not enabled.
 */
@property (assign, nonatomic, readonly) bool blocked;


- (NSDictionary *_Nonnull)dictionaryValue;

@end
