#import "RNRadar.h"

#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

#import "RNRadarUtils.h"

@implementation RNRadar {
    BOOL hasListeners;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        [Radar setDelegate:self];
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"events", @"error"];
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

- (void)didReceiveEvents:(NSArray<RadarEvent *> *)events user:(RadarUser *)user {
    if (hasListeners) {
        [self sendEventWithName:@"events" body:@{@"events": [RNRadarUtils arrayForEvents:events], @"user": [RNRadarUtils dictionaryForUser:user]}];
    }
}

- (void)didFailWithStatus:(RadarStatus)status {
    if (hasListeners) {
        [self sendEventWithName:@"error" body:[RNRadarUtils stringForStatus:status]];
    }
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userId) {
    [Radar setUserId:userId];
}

RCT_EXPORT_METHOD(setDescription:(NSString *)description) {
    [Radar setDescription:description];
}

RCT_REMAP_METHOD(getPermissionsStatus, getPermissionsStatusWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([RNRadarUtils stringForPermissionsStatus:[Radar authorizationStatus]]);
}

RCT_EXPORT_METHOD(requestPermissions:(BOOL)background) {
    if (background)
        [Radar requestAlwaysAuthorization];
    else
        [Radar requestWhenInUseAuthorization];
}

RCT_EXPORT_METHOD(startTracking) {
    [Radar startTracking];
}

RCT_EXPORT_METHOD(stopTracking) {
    [Radar stopTracking];
}

RCT_REMAP_METHOD(trackOnce, trackOnceWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [Radar trackOnceWithCompletionHandler:^(RadarStatus status, CLLocation *location, NSArray<RadarEvent *> *events, RadarUser *user) {
        if (status == RadarStatusSuccess && resolve) {
            resolve(@{@"status": [RNRadarUtils stringForStatus:status], @"location": [RNRadarUtils dictionaryForLocation:location], @"events": [RNRadarUtils arrayForEvents:events], @"user": [RNRadarUtils dictionaryForUser:user]});
        } else if (reject) {
            reject([RNRadarUtils stringForStatus:status], [RNRadarUtils stringForStatus:status], nil);
        }
    }];
}

RCT_EXPORT_METHOD(updateLocation:(NSDictionary *)locationDict resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    double latitude = [RCTConvert double:locationDict[@"latitude"]];
    double longitude = [RCTConvert double:locationDict[@"longitude"]];
    double accuracy = [RCTConvert double:locationDict[@"accuracy"]];
    CLLocation *location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:accuracy verticalAccuracy:-1 timestamp:nil];
    [Radar updateLocation:location withCompletionHandler:^(RadarStatus status, CLLocation *location, NSArray<RadarEvent *> *events, RadarUser *user) {
        if (status == RadarStatusSuccess && resolve) {
            resolve(@{@"status": [RNRadarUtils stringForStatus:status], @"location": [RNRadarUtils dictionaryForLocation:location], @"events": [RNRadarUtils arrayForEvents:events], @"user": [RNRadarUtils dictionaryForUser:user]});
        } else if (reject) {
            reject([RNRadarUtils stringForStatus:status], [RNRadarUtils stringForStatus:status], nil);
        }
    }];
}

@end
