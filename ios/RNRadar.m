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
    return @[@"events", @"location", @"clientLocation", @"error", @"log"];
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

- (void)didReceiveEvents:(NSArray<RadarEvent *> *)events user:(RadarUser *)user {
    if (hasListeners) {
        [self sendEventWithName:@"events" body:@{
            @"events": [RadarEvent arrayForEvents:events],
            @"user": [user dictionaryValue]

        }];
    }
}

- (void)didUpdateLocation:(CLLocation *)location user:(RadarUser *)user {
    if (hasListeners) {
        [self sendEventWithName:@"location" body:@{
            @"location": [Radar dictionaryForLocation:location],
            @"user": [user dictionaryValue]
        }];
    }
}

- (void)didUpdateClientLocation:(CLLocation *)location stopped:(BOOL)stopped source:(RadarLocationSource)source {
    if (hasListeners) {
        [self sendEventWithName:@"clientLocation" body:@{
            @"location": [Radar dictionaryForLocation:location],
            @"stopped": @(stopped),
            @"source": [Radar stringForSource:source]
        }];
    }
}

- (void)didFailWithStatus:(RadarStatus)status {
    if (hasListeners) {
        [self sendEventWithName:@"error" body:[Radar stringForStatus:status]];
    }
}

- (void)didLogMessage:(NSString *)message {
    if (hasListeners) {
        [self sendEventWithName:@"log" body:message];
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
        default:
            statusStr = @"DENIED";
            break;
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

RCT_EXPORT_METHOD(getLocation:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar getLocationWithCompletionHandler:^(RadarStatus status, CLLocation * _Nullable location, BOOL stopped) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (location) {
                [dict setObject:[Radar dictionaryForLocation:location] forKey:@"location"];
            }
            [dict setObject:@(stopped) forKey:@"stopped"];
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
}

RCT_EXPORT_METHOD(trackOnce:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar trackOnceWithCompletionHandler:^(RadarStatus status, CLLocation * _Nullable location, NSArray<RadarEvent *> * _Nullable events, RadarUser * _Nullable user) {
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
    }];
}

RCT_EXPORT_METHOD(trackOnce:(NSDictionary *)locationDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    CLLocation *location;
    if (locationDict != nil && [locationDict isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:locationDict[@"latitude"]];
        double longitude = [RCTConvert double:locationDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

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
        [Radar trackOnceWithCompletionHandler:completionHandler];
    }
}

RCT_EXPORT_METHOD(startTrackingEfficient) {
    [Radar startTrackingWithOptions:RadarTrackingOptions.efficient];
}

RCT_EXPORT_METHOD(startTrackingResponsive) {
    [Radar startTrackingWithOptions:RadarTrackingOptions.responsive];
}

RCT_EXPORT_METHOD(startTrackingContinuous) {
    [Radar startTrackingWithOptions:RadarTrackingOptions.continuous];
}

RCT_EXPORT_METHOD(startTrackingCustom:(NSDictionary *)optionsDict) {
    RadarTrackingOptions *options = [RadarTrackingOptions trackingOptionsFromDictionary:optionsDict];
    [Radar startTrackingWithOptions:options];
}

RCT_EXPORT_METHOD(mockTracking:(NSDictionary *)optionsDict) {
    if (optionsDict == nil) {
        return;
    }

    NSDictionary *originDict = optionsDict[@"origin"];
    double originLatitude = [RCTConvert double:originDict[@"latitude"]];
    double originLongitude = [RCTConvert double:originDict[@"longitude"]];
    CLLocation *origin = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(originLatitude, originLongitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:[NSDate new]];
    NSDictionary *destinationDict = optionsDict[@"destination"];
    double destinationLatitude = [RCTConvert double:destinationDict[@"latitude"]];
    double destinationLongitude = [RCTConvert double:destinationDict[@"longitude"]];
    CLLocation *destination = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(destinationLatitude, destinationLongitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:[NSDate new]];
    NSString *modeStr = optionsDict[@"mode"];
    RadarRouteMode mode = RadarRouteModeCar;
    if ([modeStr isEqualToString:@"FOOT"] || [modeStr isEqualToString:@"foot"]) {
        mode = RadarRouteModeFoot;
    } else if ([modeStr isEqualToString:@"BIKE"] || [modeStr isEqualToString:@"bike"]) {
        mode = RadarRouteModeBike;
    } else if ([modeStr isEqualToString:@"CAR"] || [modeStr isEqualToString:@"car"]) {
        mode = RadarRouteModeCar;
    }
    NSNumber *stepsNumber = optionsDict[@"steps"];
    __block int steps;
    if (stepsNumber != nil && [stepsNumber isKindOfClass:[NSNumber class]]) {
        steps = [stepsNumber intValue];
    } else {
        steps = 10;
    }
    NSNumber *intervalNumber = optionsDict[@"interval"];
    double interval;
    if (intervalNumber != nil && [intervalNumber isKindOfClass:[NSNumber class]]) {
        interval = [intervalNumber doubleValue];
    } else {
        interval = 1;
    }

    [Radar mockTrackingWithOrigin:origin destination:destination mode:mode steps:steps interval:interval completionHandler:nil];
}

RCT_EXPORT_METHOD(stopTracking) {
    [Radar stopTracking];
}

RCT_EXPORT_METHOD(acceptEvent:(NSString *)eventId verifiedPlaceId:(NSString *)verifiedPlaceId) {
    [Radar acceptEventId:eventId verifiedPlaceId:verifiedPlaceId];
}

RCT_EXPORT_METHOD(rejectEvent:(NSString *)eventId) {
    [Radar rejectEventId:eventId];
}

RCT_EXPORT_METHOD(startTrip:(NSDictionary *)optionsDict) {
    RadarTripOptions *options = [RadarTripOptions tripOptionsFromDictionary:optionsDict];
    [Radar startTripWithOptions:options];
}

RCT_EXPORT_METHOD(stopTrip) {
    [Radar stopTrip];
}

RCT_EXPORT_METHOD(getContext:(NSDictionary *)locationDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    CLLocation *location;
    if (locationDict != nil && [locationDict isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:locationDict[@"latitude"]];
        double longitude = [RCTConvert double:locationDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    RadarContextCompletionHandler completionHandler = ^(RadarStatus status, CLLocation * _Nullable location, RadarContext * _Nullable context) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (location) {
                [dict setObject:[Radar dictionaryForLocation:location] forKey:@"location"];
            }
            if (context) {
                [dict setObject:[context dictionaryValue] forKey:@"context"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    };

    if (location) {
        [Radar getContextForLocation:location completionHandler:completionHandler];
    } else {
        [Radar getContextWithCompletionHandler:completionHandler];
    }
}

RCT_EXPORT_METHOD(searchPlaces:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSDictionary *nearDict = optionsDict[@"near"];
    CLLocation *near;
    if (nearDict != nil && [nearDict isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:nearDict[@"latitude"]];
        double longitude = [RCTConvert double:nearDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        near = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    NSNumber *radiusNumber = optionsDict[@"radius"];
    int radius;
    if (radiusNumber != nil && [radiusNumber isKindOfClass:[NSNumber class]]) {
        radius = [radiusNumber intValue];
    } else {
        radius = 1000;
    }
    NSArray *chains = optionsDict[@"chains"];
    NSArray *categories = optionsDict[@"categories"];
    NSArray *groups = optionsDict[@"groups"];
    NSNumber *limitNumber = optionsDict[@"limit"];
    int limit;
    if (limitNumber != nil && [limitNumber isKindOfClass:[NSNumber class]]) {
        limit = [limitNumber intValue];
    } else {
        limit = 10;
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    RadarSearchPlacesCompletionHandler completionHandler = ^(RadarStatus status, CLLocation * _Nullable location, NSArray<RadarPlace *> * _Nullable places) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (location) {
                [dict setObject:[Radar dictionaryForLocation:location] forKey:@"location"];
            }
            if (places) {
                [dict setObject:[RadarPlace arrayForPlaces:places] forKey:@"places"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    };

    if (near) {
        [Radar searchPlacesNear:near radius:radius chains:chains categories:categories groups:groups limit:limit completionHandler:completionHandler];
    } else {
        [Radar searchPlacesWithRadius:radius chains:chains categories:categories groups:groups limit:limit completionHandler:completionHandler];
    }
}

RCT_EXPORT_METHOD(searchGeofences:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSDictionary *nearDict = optionsDict[@"near"];
    CLLocation *near;
    if (nearDict != nil && [nearDict isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:nearDict[@"latitude"]];
        double longitude = [RCTConvert double:nearDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        near = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    NSNumber *radiusNumber = optionsDict[@"radius"];
    int radius;
    if (radiusNumber != nil && [radiusNumber isKindOfClass:[NSNumber class]]) {
        radius = [radiusNumber intValue];
    } else {
        radius = 1000;
    }
    NSArray *tags = optionsDict[@"tags"];
    NSDictionary *metadata = optionsDict[@"metadata"];
    NSNumber *limitNumber = optionsDict[@"limit"];
    int limit;
    if (limitNumber != nil && [limitNumber isKindOfClass:[NSNumber class]]) {
        limit = [limitNumber intValue];
    } else {
        limit = 10;
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    RadarSearchGeofencesCompletionHandler completionHandler = ^(RadarStatus status, CLLocation * _Nullable location, NSArray<RadarGeofence *> * _Nullable geofences) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (location) {
                [dict setObject:[Radar dictionaryForLocation:location] forKey:@"location"];
            }
            if (geofences) {
                [dict setObject:[RadarGeofence arrayForGeofences:geofences] forKey:@"geofences"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    };

    if (near) {
        [Radar searchGeofencesNear:near radius:radius tags:tags metadata:metadata limit:limit completionHandler:completionHandler];
    } else {
        [Radar searchGeofencesWithRadius:radius tags:tags metadata:metadata limit:limit completionHandler:completionHandler];
    }
}

RCT_EXPORT_METHOD(searchPoints:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSDictionary *nearDict = optionsDict[@"near"];
    CLLocation *near;
    if (nearDict != nil && [nearDict isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:nearDict[@"latitude"]];
        double longitude = [RCTConvert double:nearDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        near = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    NSNumber *radiusNumber = optionsDict[@"radius"];
    int radius;
    if (radiusNumber != nil && [radiusNumber isKindOfClass:[NSNumber class]]) {
        radius = [radiusNumber intValue];
    } else {
        radius = 1000;
    }
    NSArray *tags = optionsDict[@"tags"];
    NSNumber *limitNumber = optionsDict[@"limit"];
    int limit;
    if (limitNumber != nil && [limitNumber isKindOfClass:[NSNumber class]]) {
        limit = [limitNumber intValue];
    } else {
        limit = 10;
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    RadarSearchPointsCompletionHandler completionHandler = ^(RadarStatus status, CLLocation * _Nullable location, NSArray<RadarPoint *> * _Nullable points) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (location) {
                [dict setObject:[Radar dictionaryForLocation:location] forKey:@"location"];
            }
            if (points) {
                [dict setObject:[RadarPoint arrayForPoints:points] forKey:@"points"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    };

    if (near) {
        [Radar searchPointsNear:near radius:radius tags:tags limit:limit completionHandler:completionHandler];
    } else {
        [Radar searchPointsWithRadius:radius tags:tags limit:limit completionHandler:completionHandler];
    }
}

RCT_EXPORT_METHOD(autocomplete:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSDictionary *nearDict = optionsDict[@"near"];
    if (nearDict == nil || ![nearDict isKindOfClass:[NSDictionary class]]) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSString *query = optionsDict[@"query"];
    double latitude = [RCTConvert double:nearDict[@"latitude"]];
    double longitude = [RCTConvert double:nearDict[@"longitude"]];
    NSDate *timestamp = [NSDate new];
    CLLocation *near = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    NSNumber *limitNumber = optionsDict[@"limit"];
    int limit;
    if (limitNumber != nil && [limitNumber isKindOfClass:[NSNumber class]]) {
        limit = [limitNumber intValue];
    } else {
        limit = 10;
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar autocompleteQuery:query near:near limit:limit completionHandler:^(RadarStatus status, NSArray<RadarAddress *> * _Nullable addresses) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (addresses) {
                [dict setObject:[RadarAddress arrayForAddresses:addresses] forKey:@"addresses"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
}

RCT_EXPORT_METHOD(geocode:(NSString *)query resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar geocodeAddress:query completionHandler:^(RadarStatus status, NSArray<RadarAddress *> * _Nullable addresses) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (addresses) {
                [dict setObject:[RadarAddress arrayForAddresses:addresses] forKey:@"addresses"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
}

RCT_EXPORT_METHOD(reverseGeocode:(NSDictionary *)locationDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    CLLocation *location;
    if (locationDict != nil && [locationDict isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:locationDict[@"latitude"]];
        double longitude = [RCTConvert double:locationDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    RadarGeocodeCompletionHandler completionHandler = ^(RadarStatus status, NSArray<RadarAddress *> * _Nullable addresses) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (addresses) {
                [dict setObject:[RadarAddress arrayForAddresses:addresses] forKey:@"addresses"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    };

    if (location) {
        [Radar reverseGeocodeLocation:location completionHandler:completionHandler];
    } else {
        [Radar reverseGeocodeWithCompletionHandler:completionHandler];
    }
}

RCT_EXPORT_METHOD(ipGeocode:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar ipGeocodeWithCompletionHandler:^(RadarStatus status, RadarAddress * _Nullable address, BOOL proxy) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (address) {
                [dict setObject:[address dictionaryValue] forKey:@"address"];
                [dict setValue:@(proxy) forKey:@"proxy"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
}

RCT_EXPORT_METHOD(getDistance:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSDictionary *destinationDict = optionsDict[@"destination"];
    if (destinationDict == nil || ![destinationDict isKindOfClass:[NSDictionary class]]) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSDictionary *originDict = optionsDict[@"origin"];
    CLLocation *origin;
    if (originDict != nil && [originDict isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:originDict[@"latitude"]];
        double longitude = [RCTConvert double:originDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        origin = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    double latitude = [RCTConvert double:destinationDict[@"latitude"]];
    double longitude = [RCTConvert double:destinationDict[@"longitude"]];
    NSDate *timestamp = [NSDate new];
    CLLocation *destination = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    NSArray *modesArr = optionsDict[@"modes"];
    RadarRouteMode modes = 0;
    if (modesArr != nil && [modesArr isKindOfClass:[NSArray class]]) {
        if ([modesArr containsObject:@"FOOT"] || [modesArr containsObject:@"foot"]) {
            modes = modes | RadarRouteModeFoot;
        }
        if ([modesArr containsObject:@"BIKE"] || [modesArr containsObject:@"bike"]) {
            modes = modes | RadarRouteModeBike;
        }
        if ([modesArr containsObject:@"CAR"] || [modesArr containsObject:@"car"]) {
            modes = modes | RadarRouteModeCar;
        }
    } else {
        modes = RadarRouteModeCar;
    }
    NSString *unitsStr = optionsDict[@"units"];
    RadarRouteUnits units;
    if (unitsStr != nil && [unitsStr isKindOfClass:[NSString class]]) {
        units = [unitsStr isEqualToString:@"METRIC"] || [unitsStr isEqualToString:@"metric"] ? RadarRouteUnitsMetric : RadarRouteUnitsImperial;
    } else {
        units = RadarRouteUnitsImperial;
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    RadarRouteCompletionHandler completionHandler = ^(RadarStatus status, RadarRoutes * _Nullable routes) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (routes) {
                [dict setObject:[routes dictionaryValue] forKey:@"routes"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    };

    if (origin) {
        [Radar getDistanceFromOrigin:origin destination:destination modes:modes units:units completionHandler:completionHandler];
    } else {
        [Radar getDistanceToDestination:destination modes:modes units:units completionHandler:completionHandler];
    }
}

@end
