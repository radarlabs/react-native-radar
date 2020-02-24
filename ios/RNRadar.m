#import "RNRadar.h"

#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

@implementation RNRadar {
    BOOL hasListeners;
    CLLocationManager *locationManager;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        [Radar setDelegate:self];
        locationManager = [CLLocationManager new];
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"events", @"location", @"error"];
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

- (void)didReceiveEvents:(NSArray<RadarEvent *> *)events user:(RadarUser *)user {
    if (hasListeners) {
        [self sendEventWithName:@"events" body:@{@"events": [RadarEvent arrayForEvents:events], @"user": [user dictionaryValue]}];
    }
}

- (void)didUpdateLocation:(CLLocation *)location user:(RadarUser *)user {
    if (hasListeners) {
        [self sendEventWithName:@"location" body:@{@"location": [Radar dictionaryForLocation:location], @"user": [user dictionaryValue]}];
    }
}

- (void)didUpdateClientLocation:(CLLocation *)location stopped:(BOOL)stopped source:(RadarLocationSource)source {
    if (hasListeners) {
        [self sendEventWithName:@"location" body:@{@"location": [Radar dictionaryForLocation:location], @"stopped": @(stopped), @"source": [Radar stringForSource:source]}];
    }
}

- (void)didFailWithStatus:(RadarStatus)status {
    if (hasListeners) {
        [self sendEventWithName:@"error" body:[Radar stringForStatus:status]];
    }
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userId) {
    [Radar setUserId:userId];
}

RCT_EXPORT_METHOD(setDescription:(NSString *)description) {
    [Radar setDescription:description];
}

RCT_EXPORT_METHOD(setMetadata:(NSDictionary *)metadataDict) {
    [Radar setMetadata:metadataDict];
}

RCT_REMAP_METHOD(getPermissionsStatus, getPermissionsStatusWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
    NSString *statusStr;
    switch (status) {
        case kCLAuthorizationStatusDenied:
            statusStr = @"DENIED";
        case kCLAuthorizationStatusRestricted:
            statusStr = @"DENIED";
        case kCLAuthorizationStatusAuthorizedAlways:
            statusStr = @"GRANTED_BACKGROUND";
        case kCLAuthorizationStatusAuthorizedWhenInUse:
            statusStr = @"GRANTED_FOREGROUND";
        default:
            statusStr = @"DENIED";
    }
    resolve(statusStr);
}

RCT_EXPORT_METHOD(requestPermissions:(BOOL)background) {
    if (background) {
        [locationManager requestAlwaysAuthorization];
    } else {
        [locationManager requestWhenInUseAuthorization];
    }
}

RCT_EXPORT_METHOD(startTracking:(NSDictionary *)optionsDict) {
    RadarTrackingOptions *options = [RadarTrackingOptions optionsFromDictionary:optionsDict];
    [Radar startTrackingWithOptions:options];
}

RCT_EXPORT_METHOD(stopTracking) {
    [Radar stopTracking];
}

RCT_REMAP_METHOD(trackOnce, trackOnceWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    [Radar trackOnceWithCompletionHandler:^(RadarStatus status, CLLocation *location, NSArray<RadarEvent *> *events, RadarUser *user) {
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
            resolver = nil;
            rejecter = nil;
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
            resolver = nil;
            rejecter = nil;
        }
    }];
}

RCT_EXPORT_METHOD(trackOnce:(NSDictionary *)locationDict resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    double latitude = [RCTConvert double:locationDict[@"latitude"]];
    double longitude = [RCTConvert double:locationDict[@"longitude"]];
    double accuracy = [RCTConvert double:locationDict[@"accuracy"]];
    NSDate *timestamp = ;
    CLLocation *location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:accuracy verticalAccuracy:-1 timestamp:timestamp];
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    [Radar trackOnceWithLocation:location withCompletionHandler:^(RadarStatus status, CLLocation *location, NSArray<RadarEvent *> *events, RadarUser *user) {
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
            resolver = nil;
            rejecter = nil;
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
            resolver = nil;
            rejecter = nil;
        }
    }];
}

RCT_EXPORT_METHOD(acceptEvent:(NSString *)eventId withVerifiedPlaceId:(NSString *)verifiedPlaceId) {
    [Radar acceptEventId:eventId withVerifiedPlaceId:verifiedPlaceId];
}

RCT_EXPORT_METHOD(rejectEvent:(NSString *)eventId) {
    [Radar rejectEventId:eventId];
}

@end
