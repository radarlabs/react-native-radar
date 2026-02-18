//
//  RadarIndoorsProtocol.h
//  RadarSDK
//
//  Copyright © 2025 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import "Radar.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RadarIndoorsProtocol<NSObject>

+ (void)startIndoorScan:(NSString *)geofenceId
                forLength:(int)scanLengthSeconds
        withKnownLocation:(CLLocation *_Nullable)knownLocation
        completionHandler:(RadarIndoorsScanCompletionHandler)completionHandler;

@end

NS_ASSUME_NONNULL_END
