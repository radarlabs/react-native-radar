//
//  RadarInitializeOptions.h
//  RadarSDK
//
//  Created by Kenny Hu on 9/10/24.
//  Copyright © 2024 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface RadarInitializeOptions : NSObject

@property (assign, nonatomic) BOOL autoLogNotificationConversions;
@property (assign, nonatomic) BOOL autoHandleNotificationDeepLinks;
@property (assign, nonatomic) BOOL silentPush;
@property (assign, nonatomic) BOOL trackVerifiedAutoFailover;

/// Request and resource timeout in seconds for standard API calls. Default 10 seconds.
/// Invalid values (non-finite or ≤ 0) fall back to the default; values are
/// clamped to the range 1…300.
@property (assign, nonatomic) NSTimeInterval networkTimeoutInterval;

/// Minimum interval in seconds between deliveries of `RadarVerifiedDelegate.didChangeIP()`.
/// Default 10 seconds. Set to 0 to disable throttling (deliver every detected change).
/// Negative or non-finite values fall back to the default.
@property (assign, nonatomic) NSTimeInterval ipChangeDebounceInterval;

- (NSDictionary *_Nonnull)dictionaryValue;
- (instancetype _Nonnull)initWithDict:(NSDictionary *_Nullable)dict;

@end
