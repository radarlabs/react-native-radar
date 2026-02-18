//
//  RadarMotion.h
//  RadarMotion
//
//  Copyright © 2024 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreMotion/CoreMotion.h>

@interface RadarSDKMotion : NSObject
- (void)startActivityUpdatesToQueue:(NSOperationQueue *)queue withHandler:(CMMotionActivityHandler)handler;
- (void)stopActivityUpdates;
- (void)startRelativeAltitudeUpdatesToQueue:(NSOperationQueue *) queue
                                 withHandler:(CMAltitudeHandler) handler;
- (void)stopRelativeAltitudeUpdates;
- (void)startAbsoluteAltitudeUpdatesToQueue:(NSOperationQueue *) queue
                                withHandler:(CMAbsoluteAltitudeHandler) handler API_AVAILABLE(ios(15.0));
- (void)stopAbsoluteAltitudeUpdates;

/**
 Returns a string representation of the current motion authorization status.
 Possible return values are:
 - `NOT_DETERMINED` – The user has not yet been prompted for motion authorization.
 - `RESTRICTED` – Motion access is restricted and cannot be granted by the user.
 - `USER_DENIED` – The user has explicitly denied motion authorization.
 - `USER_GRANTED` – The user has granted motion authorization.
 - `UNKNOWN` – The motion authorization status could not be determined.
 Use this method when you need a human-readable representation of the motion
 authorization state, for example for logging, diagnostics, or displaying
 status information in your UI.
 */

+ (NSString *)stringForMotionAuthorization;

@end


