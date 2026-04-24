//
//  RadarSdkConfiguration.h
//  RadarSDK
//
//  Copyright © 2023 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Radar.h"
@class RadarRemoteTrackingOptions;

NS_ASSUME_NONNULL_BEGIN

/**
 Represents server-side sdk configuration.
 
 @see https://radar.com/documentation/sdk/ios
 */
@interface RadarSdkConfiguration : NSObject
- (RadarLogLevel)logLevel;
- (BOOL)startTrackingOnInitialize;
- (BOOL)trackOnceOnAppOpen;
- (BOOL)usePersistence;
- (BOOL)extendFlushReplays;
- (BOOL)useLogPersistence;
- (BOOL)useRadarModifiedBeacon;
- (BOOL)useOpenedAppConversion;
- (BOOL)useForegroundLocationUpdatedAtMsDiff;
- (BOOL)useNotificationDiff;
- (BOOL)syncAfterSetUser;
- (BOOL)useNotificationDiffV2;
- (BOOL)useSyncRegion;
- (NSInteger)defaultGeofenceDwellThreshold;
- (BOOL)bufferGeofenceEntries;
- (BOOL)bufferGeofenceExits;
- (BOOL)stopDetection;
- (BOOL)skipForegroundCheck;
- (BOOL)useOfflineRTOUpdates;
- (BOOL)offlineEventGenerationEnabled;
- (NSArray<RadarRemoteTrackingOptions *> *_Nullable)remoteTrackingOptions;
- (instancetype)initWithDict:(NSDictionary *_Nullable)dict;
- (NSDictionary *)dictionaryValue;
@end

/**
 Represents server-side sdk configuration.
 
 @see https://radar.com/documentation/sdk/ios
 */
@interface RadarSdkConfiguration_ObjC : NSObject

+ (void)updateSdkConfigurationFromServer;

@end

NS_ASSUME_NONNULL_END
