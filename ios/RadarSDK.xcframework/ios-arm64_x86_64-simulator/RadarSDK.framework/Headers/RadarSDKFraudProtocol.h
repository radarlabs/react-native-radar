//
//  RadarSDKFraudProtocol.h
//  RadarSDK
//
//  Copyright © 2025 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import "Radar.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^RadarFraudPayloadCallback)(NSDictionary<NSString *, id> *_Nullable result);

@protocol RadarSDKFraudProtocol<NSObject>

+ (instancetype)sharedInstance;

- (void)initializeWithOptions:(NSDictionary<NSString *, id> *)options;

- (void)getFraudPayloadWithOptions:(NSDictionary<NSString *, id> *)options completionHandler:(RadarFraudPayloadCallback)completionHandler;

@end

NS_ASSUME_NONNULL_END
