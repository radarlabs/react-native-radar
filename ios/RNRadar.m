#import "RNRadar.h"

#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

#import "RNRadarUtils.h"

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
        [self sendEventWithName:@"events" body:@{@"events": [RNRadarUtils arrayForEvents:events], @"user": [RNRadarUtils dictionaryForUser:user]}];
    }
}

- (void)didUpdateLocation:(CLLocation *)location user:(RadarUser *)user {
    if (hasListeners) {
        [self sendEventWithName:@"location" body:@{@"location": [RNRadarUtils dictionaryForLocation:location], @"user": [RNRadarUtils dictionaryForUser:user]}];
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

RCT_EXPORT_METHOD(setPlacesProvider:(NSString *)providerStr) {
    [Radar setPlacesProvider:[RNRadarUtils placesProviderForString:providerStr]];
}

RCT_REMAP_METHOD(getPermissionsStatus, getPermissionsStatusWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([RNRadarUtils stringForPermissionsStatus:[CLLocationManager authorizationStatus]]);
}

RCT_EXPORT_METHOD(requestPermissions:(BOOL)background) {
    if (background) {
        [locationManager requestAlwaysAuthorization];
    } else {
        [locationManager requestWhenInUseAuthorization];
    }
}

RCT_EXPORT_METHOD(startTracking:(NSDictionary *)optionsDict) {
    [Radar startTrackingWithOptions:[RNRadarUtils optionsForDictionary:optionsDict]];
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
            [dict setObject:[RNRadarUtils stringForStatus:status] forKey:@"status"];
            if (location) {
                [dict setObject:[RNRadarUtils dictionaryForLocation:location] forKey:@"location"];
            }
            if (events) {
                [dict setObject:[RNRadarUtils arrayForEvents:events] forKey:@"events"];
            }
            if (user) {
                [dict setObject:[RNRadarUtils dictionaryForUser:user] forKey:@"user"];
            }
            resolver(dict);
            resolver = nil;
            rejecter = nil;
        } else if (rejecter) {
            rejecter([RNRadarUtils stringForStatus:status], [RNRadarUtils stringForStatus:status], nil);
            resolver = nil;
            rejecter = nil;
        }
    }];
}

RCT_EXPORT_METHOD(updateLocation:(NSDictionary *)locationDict resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    double latitude = [RCTConvert double:locationDict[@"latitude"]];
    double longitude = [RCTConvert double:locationDict[@"longitude"]];
    double accuracy = [RCTConvert double:locationDict[@"accuracy"]];
    NSDate *timestamp = [NSDate date];
    CLLocation *location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:accuracy verticalAccuracy:-1 timestamp:timestamp];
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    [Radar updateLocation:location withCompletionHandler:^(RadarStatus status, CLLocation *location, NSArray<RadarEvent *> *events, RadarUser *user) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[RNRadarUtils stringForStatus:status] forKey:@"status"];
            if (location) {
                [dict setObject:[RNRadarUtils dictionaryForLocation:location] forKey:@"location"];
            }
            if (events) {
                [dict setObject:[RNRadarUtils arrayForEvents:events] forKey:@"events"];
            }
            if (user) {
                [dict setObject:[RNRadarUtils dictionaryForUser:user] forKey:@"user"];
            }
            resolver(dict);
            resolver = nil;
            rejecter = nil;
        } else if (rejecter) {
            rejecter([RNRadarUtils stringForStatus:status], [RNRadarUtils stringForStatus:status], nil);
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
