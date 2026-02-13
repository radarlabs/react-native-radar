//
//  RadarSdkConfiguration.h
//  RadarSDK
//
//  Copyright © 2023 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Radar.h"

NS_ASSUME_NONNULL_BEGIN

/**
 Represents server-side sdk configuration.
 
 @see https://radar.com/documentation/sdk/ios
 */
@interface RadarSdkConfiguration : NSObject

@property (nonatomic, assign) RadarLogLevel logLevel;

@property (nonatomic, assign) BOOL startTrackingOnInitialize;

@property (nonatomic, assign) BOOL trackOnceOnAppOpen;

@property (nonatomic, assign) BOOL usePersistence;

@property (nonatomic, assign) BOOL extendFlushReplays;

@property (nonatomic, assign) BOOL useLogPersistence;

@property (nonatomic, assign) BOOL useRadarModifiedBeacon;

@property (nonatomic, assign) BOOL useOpenedAppConversion;

@property (nonatomic, assign) BOOL useForegroundLocationUpdatedAtMsDiff;

@property (nonatomic, assign) BOOL useNotificationDiff;

@property (nonatomic, assign) BOOL syncAfterSetUser;

/**
 Initializes a new RadarSdkConfiguration object with given value.
 */
- (instancetype)initWithDict:(NSDictionary *_Nullable)dict;

/**
 Returns a dictionary representation of the object.
 */
- (NSDictionary *)dictionaryValue;

+ (void)updateSdkConfigurationFromServer;

@end

NS_ASSUME_NONNULL_END
