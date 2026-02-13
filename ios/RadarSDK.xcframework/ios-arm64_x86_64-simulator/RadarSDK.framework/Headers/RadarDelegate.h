//
//  RadarDelegate.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "Radar.h"
#import "RadarEvent.h"
#import "RadarUser.h"

NS_ASSUME_NONNULL_BEGIN

/**
 A delegate for client-side delivery of events, location updates, and debug logs. For more information, see https://radar.com/documentation/sdk/ios

 @see https://radar.com/documentation/sdk/ios
 */
@protocol RadarDelegate<NSObject>
@optional

/**
 Tells the delegate that events were received.

 @param events The events received.
 @param user The user, if any.
 */
- (void)didReceiveEvents:(NSArray<RadarEvent *> *_Nonnull)events user:(RadarUser *_Nullable)user NS_SWIFT_NAME(didReceiveEvents(_:user:));

/**
 Tells the delegate that the current user's location was updated and synced to the server.

 @param location The location.
 @param user The current user.
 */
- (void)didUpdateLocation:(CLLocation *_Nonnull)location user:(RadarUser *_Nonnull)user NS_SWIFT_NAME(didUpdateLocation(_:user:));

/**
 Tells the delegate that the client's location was updated but not necessarily synced to the server. To receive only server-synced location updates and user
 state, use `didUpdateLocation:user:` instead.

 @param location The location.
 @param stopped A boolean indicating whether the client is stopped.
 @param source The source of the location.
 */
- (void)didUpdateClientLocation:(CLLocation *_Nonnull)location stopped:(BOOL)stopped source:(RadarLocationSource)source NS_SWIFT_NAME(didUpdateClientLocation(_:stopped:source:));

/**
 Tells the delegate that a request failed.

 @param status The status.
 */
- (void)didFailWithStatus:(RadarStatus)status NS_SWIFT_NAME(didFail(status:));

/**
 Tells the delegate that a debug log message was received.

 @param message The message.
 */
- (void)didLogMessage:(NSString *_Nonnull)message NS_SWIFT_NAME(didLog(message:));


@end

NS_ASSUME_NONNULL_END
