//
//  RadarVerifiedDelegate.h
//  RadarSDK
//
//  Copyright © 2023 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "Radar.h"
#import "RadarVerifiedLocationToken.h"

NS_ASSUME_NONNULL_BEGIN

/**
 A delegate for client-side delivery of verified location tokens. For more information, see https://radar.com/documentation/fraud

 @see https://radar.com/documentation/fraud
 */
@protocol RadarVerifiedDelegate<NSObject>
@optional
/**
 Tells the delegate that the current user's verified location was updated. Verify the token server-side using your secret key.

 @param token The token.
 */
- (void)didUpdateToken:(RadarVerifiedLocationToken *_Nonnull)token NS_SWIFT_NAME(didUpdateToken(_:));

@end

NS_ASSUME_NONNULL_END
