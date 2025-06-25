#import "RNRadar.h"
#include <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert.h>

@implementation RNRadar {
    CLLocationManager *locationManager;
    RCTPromiseResolveBlock permissionsRequestResolver;
    bool hasListeners;
}

RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        locationManager = [CLLocationManager new];
        locationManager.delegate = self;
        [Radar setDelegate:self];
    }
    return self;
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    if (permissionsRequestResolver) {
        [self getPermissionsStatus:permissionsRequestResolver reject:nil];
        permissionsRequestResolver = nil;
    }
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"events", @"location", @"clientLocation", @"error", @"log", @"token"];
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

- (void)didReceiveEvents:(NSArray<RadarEvent *> *)events user:(RadarUser * _Nullable )user {
    NSMutableDictionary *body = [NSMutableDictionary new];
    [body setValue:[RadarEvent arrayForEvents:events] forKey:@"events"];
    if (user) {
        [body setValue:[user dictionaryValue] forKey:@"user"];
    }
    #ifdef RCT_NEW_ARCH_ENABLED
    [self emitEventsEmitter:body];
    #else
    if (hasListeners) {
        [self sendEventWithName:@"events" body:body];
    }
    #endif
}

- (void)didUpdateLocation:(CLLocation *)location user:(RadarUser *)user {
    #ifdef RCT_NEW_ARCH_ENABLED
    [self emitLocationEmitter:@{
        @"location": [Radar dictionaryForLocation:location],
        @"user": [user dictionaryValue]
    }];
    #else
    if (hasListeners) {
        [self sendEventWithName:@"location" body:@{
            @"location": [Radar dictionaryForLocation:location],
            @"user": [user dictionaryValue]
        }];
    }
    #endif
}

- (void)didUpdateClientLocation:(CLLocation *)location stopped:(BOOL)stopped source:(RadarLocationSource)source {
    #ifdef RCT_NEW_ARCH_ENABLED
    [self emitClientLocationEmitter:@{
        @"location": [Radar dictionaryForLocation:location],
        @"stopped": @(stopped),
        @"source": [Radar stringForLocationSource:source]
    }];
    #else
    if (hasListeners) {
        [self sendEventWithName:@"clientLocation" body:@{
            @"location": [Radar dictionaryForLocation:location],
            @"stopped": @(stopped),
            @"source": [Radar stringForLocationSource:source]
        }];
    }
    #endif
}

- (void)didFailWithStatus:(RadarStatus)status {
    NSDictionary *body = @{
        @"status": [Radar stringForStatus:status]
    };
    #ifdef RCT_NEW_ARCH_ENABLED
    [self emitErrorEmitter:body];
    #else
    if (hasListeners) {
        [self sendEventWithName:@"error" body:body];
    }
    #endif
}

- (void)didLogMessage:(NSString *)message {
    NSDictionary *body = @{
        @"message": message
    };
    #ifdef RCT_NEW_ARCH_ENABLED
    [self emitLogEmitter:body];
    #else
    if (hasListeners) {
        [self sendEventWithName:@"log" body:body];
    }
    #endif
}

- (void)didUpdateToken:(RadarVerifiedLocationToken *)token {
    NSDictionary *body = @{
        @"token": [token dictionaryValue]
    };
    #ifdef RCT_NEW_ARCH_ENABLED
    [self emitTokenEmitter:body];
    #else
    if (hasListeners) {
        [self sendEventWithName:@"token" body:body];
    }
    #endif
}

RCT_EXPORT_METHOD(initialize:(NSString *)publishableKey fraud:(BOOL)fraud) {
    [[NSUserDefaults standardUserDefaults] setObject:@"ReactNative" forKey:@"radar-xPlatformSDKType"];
    [[NSUserDefaults standardUserDefaults] setObject:@"3.20.3" forKey:@"radar-xPlatformSDKVersion"];
    [Radar initializeWithPublishableKey:publishableKey];
}

RCT_EXPORT_METHOD(getPermissionsStatus:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
    NSString *statusStr;
    switch (status) {
        case kCLAuthorizationStatusDenied:
            statusStr = @"DENIED";
            break;
        case kCLAuthorizationStatusRestricted:
            statusStr = @"DENIED";
            break;
        case kCLAuthorizationStatusAuthorizedAlways:
            statusStr = @"GRANTED_BACKGROUND";
            break;
        case kCLAuthorizationStatusAuthorizedWhenInUse:
            statusStr = @"GRANTED_FOREGROUND";
            break;
        case kCLAuthorizationStatusNotDetermined:
            statusStr = @"NOT_DETERMINED";
            break;
        default:
            statusStr = @"DENIED";
            break;
    }
    resolve(statusStr);
}

RCT_EXPORT_METHOD(requestPermissions:(BOOL)background resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
    if (background && status == kCLAuthorizationStatusAuthorizedWhenInUse) {
        permissionsRequestResolver = resolve;
        [locationManager requestAlwaysAuthorization];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleAppBecomingActive)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];
    } else if (status == kCLAuthorizationStatusNotDetermined) {
        permissionsRequestResolver = resolve;
        [locationManager requestWhenInUseAuthorization];
    } else {
        [self getPermissionsStatus:resolve reject:reject];
        permissionsRequestResolver = nil;
    }
}

- (void)handleAppBecomingActive
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
     if (permissionsRequestResolver) {
        [self getPermissionsStatus:permissionsRequestResolver reject:nil];
        permissionsRequestResolver = nil;
    }
}

RCT_EXPORT_METHOD(trackOnce:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    RadarTrackingOptionsDesiredAccuracy desiredAccuracy;
    BOOL beacons = NO;
    desiredAccuracy = RadarTrackingOptionsDesiredAccuracyMedium;

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    NSDictionary *locationDict = optionsDict[@"location"];

    CLLocation *location;
    if (locationDict != nil && [locationDict isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:locationDict[@"latitude"]];
        double longitude = [RCTConvert double:locationDict[@"longitude"]];
        double accuracy = [RCTConvert double:locationDict[@"accuracy"]];
        NSDate *timestamp = [NSDate new];
        location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:accuracy verticalAccuracy:-1 timestamp:timestamp];
    }

    RadarTrackCompletionHandler completionHandler = ^(RadarStatus status, CLLocation * _Nullable location, NSArray<RadarEvent *> * _Nullable events, RadarUser * _Nullable user) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (location) {
                [dict setObject:[Radar dictionaryForLocation:location] forKey:@"location"];
            }
            if (events) {
                [dict setObject:[RadarEvent arrayForEvents:events] forKey:@"events"];
            }
            if (user) {
                [dict setObject:[user dictionaryValue] forKey:@"user"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    };

    if (location) {
        [Radar trackOnceWithLocation:location completionHandler:completionHandler];
    } else {
        NSString *accuracy = optionsDict[@"desiredAccuracy"];

        if (accuracy != nil && [accuracy isKindOfClass:[NSString class]]) {
            NSString *lowerAccuracy = [accuracy lowercaseString];
            if ([lowerAccuracy isEqualToString:@"high"]) {
                desiredAccuracy = RadarTrackingOptionsDesiredAccuracyHigh;
            } else if ([lowerAccuracy isEqualToString:@"medium"]) {
                desiredAccuracy = RadarTrackingOptionsDesiredAccuracyMedium;
            } else if ([lowerAccuracy isEqualToString:@"low"]) {
                desiredAccuracy = RadarTrackingOptionsDesiredAccuracyLow;
            }
        }
        
        NSNumber *beaconsNumber = optionsDict[@"beacons"];
        if (beaconsNumber != nil && [beaconsNumber isKindOfClass:[NSNumber class]]) {
            beacons = [beaconsNumber boolValue]; 
        }
        
        [Radar trackOnceWithDesiredAccuracy:desiredAccuracy beacons:beacons completionHandler:completionHandler];
    }
}


#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRadarSpecJSI>(params);
}
#endif

@end
