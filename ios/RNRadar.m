#import "RNRadar.h"

#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

@implementation RNRadar {
    BOOL hasListeners;
    CLLocationManager *locationManager;
    RCTPromiseResolveBlock permissionsRequestResolver;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        [Radar setDelegate:self];
        locationManager = [CLLocationManager new];
        locationManager.delegate = self;
    }
    return self;
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    if (permissionsRequestResolver) {
        [self getPermissionsStatusWithResolver:permissionsRequestResolver rejecter:nil];
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
    return @[@"events", @"location", @"clientLocation", @"error", @"log"];
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

- (void)didReceiveEvents:(NSArray<RadarEvent *> *)events user:(RadarUser * _Nullable )user {
    if (hasListeners) {
        NSMutableDictionary *body = [NSMutableDictionary new];
        [body setValue:[RadarEvent arrayForEvents:events] forKey:@"events"];
        if (user) {
            [body setValue:[user dictionaryValue] forKey:@"user"];
        }
        [self sendEventWithName:@"events" body:body];
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
            @"source": [Radar stringForLocationSource:source]
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

RCT_EXPORT_METHOD(initialize:(NSString *)publishableKey fraud:(BOOL)fraud) {
    [Radar initializeWithPublishableKey:publishableKey];
}

RCT_EXPORT_METHOD(setLogLevel:(NSString *)level) {
    RadarLogLevel logLevel = RadarLogLevelNone;
    if (level) {
        if ([level isEqualToString:@"error"] || [level isEqualToString:@"ERROR"]) {
            logLevel = RadarLogLevelError;
        } else if ([level isEqualToString:@"warning"] || [level isEqualToString:@"WARNING"]) {
            logLevel = RadarLogLevelWarning;
        } else if ([level isEqualToString:@"info"] || [level isEqualToString:@"INFO"]) {
            logLevel = RadarLogLevelInfo;
        } else if ([level isEqualToString:@"debug"] || [level isEqualToString:@"DEBUG"]) {
            logLevel = RadarLogLevelDebug;
        }
    }
    [Radar setLogLevel:logLevel];
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userId) {
    [Radar setUserId:userId];
}

RCT_EXPORT_METHOD(getUserId:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([Radar getUserId]);
}

RCT_EXPORT_METHOD(setDescription:(NSString *)description) {
    [Radar setDescription:description];
}

RCT_EXPORT_METHOD(getDescription:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([Radar getDescription]);
}

RCT_EXPORT_METHOD(setMetadata:(NSDictionary *)metadataDict) {
    [Radar setMetadata:metadataDict];
}

RCT_EXPORT_METHOD(getMetadata:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([Radar getMetadata]);
}

RCT_EXPORT_METHOD(setAnonymousTrackingEnabled:(BOOL)enabled) {
    [Radar setAnonymousTrackingEnabled:enabled];
}

RCT_EXPORT_METHOD(getHost:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([RadarSettings host]);
}

RCT_EXPORT_METHOD(getPublishableKey:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    resolve([RadarSettings publishableKey]);
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
    permissionsRequestResolver = resolve;

    CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
    if (background && status == kCLAuthorizationStatusAuthorizedWhenInUse) {
        [locationManager requestAlwaysAuthorization];
    } else if (status == kCLAuthorizationStatusNotDetermined) {
        [locationManager requestWhenInUseAuthorization];
    } else {
        [self getPermissionsStatusWithResolver:resolve rejecter:reject];
    }
}

RCT_EXPORT_METHOD(getLocation:(NSString *)desiredAccuracy resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    RadarTrackingOptionsDesiredAccuracy accuracy = RadarTrackingOptionsDesiredAccuracyMedium;
    
    if (desiredAccuracy) {
        NSString *lowerAccuracy = [desiredAccuracy lowercaseString];
        if ([lowerAccuracy isEqualToString:@"high"]) {
            accuracy = RadarTrackingOptionsDesiredAccuracyHigh;
        } else if ([lowerAccuracy isEqualToString:@"medium"]) {
            accuracy = RadarTrackingOptionsDesiredAccuracyMedium;
        } else if ([lowerAccuracy isEqualToString:@"low"]) {
            accuracy = RadarTrackingOptionsDesiredAccuracyLow;
        } else {
            if (reject) {
                reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
            }
            
            return;
        }
    }

    [Radar getLocationWithDesiredAccuracy:accuracy completionHandler:^(RadarStatus status, CLLocation * _Nullable location, BOOL stopped) {
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

RCT_EXPORT_METHOD(trackOnce:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    RadarTrackingOptionsDesiredAccuracy desiredAccuracy;
    BOOL beaconsTrackingOption = NO;
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
        
        BOOL beacons = optionsDict[@"beacons"];

        if (beacons) {
            beaconsTrackingOption = beacons;
        }
        
        [Radar trackOnceWithDesiredAccuracy:desiredAccuracy beacons:beaconsTrackingOption completionHandler:completionHandler];
    }
}

RCT_EXPORT_METHOD(trackVerified:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
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

    [Radar trackVerifiedWithCompletionHandler:completionHandler];
}

RCT_EXPORT_METHOD(trackVerifiedToken:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
        __block RCTPromiseResolveBlock resolver = resolve;
        __block RCTPromiseRejectBlock rejecter = reject;

       RadarTrackTokenCompletionHandler completionHandler = ^(RadarStatus status, NSString * _Nullable token) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (token) {
                [dict setObject:token forKey:@"token"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }; 

    [Radar trackVerifiedTokenWithCompletionHandler:completionHandler];
}

RCT_EXPORT_METHOD(startTrackingEfficient) {
    [Radar startTrackingWithOptions:RadarTrackingOptions.presetEfficient];
}

RCT_EXPORT_METHOD(startTrackingResponsive) {
    [Radar startTrackingWithOptions:RadarTrackingOptions.presetResponsive];
}

RCT_EXPORT_METHOD(startTrackingContinuous) {
    [Radar startTrackingWithOptions:RadarTrackingOptions.presetContinuous];
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

RCT_EXPORT_METHOD(isTracking:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    BOOL res = [Radar isTracking];
    resolve(@(res));
}

RCT_EXPORT_METHOD(isUsingRemoteTrackingOptions:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    BOOL res = [Radar isUsingRemoteTrackingOptions];
    resolve(@(res));
}

RCT_EXPORT_METHOD(getTrackingOptions:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (resolve == nil) {
        return;
    }
    
    RadarTrackingOptions* options = [Radar getTrackingOptions];
    resolve([options dictionaryValue]);
}

RCT_EXPORT_METHOD(setForegroundServiceOptions) {
    // not implemented
}

RCT_EXPORT_METHOD(acceptEvent:(NSString *)eventId verifiedPlaceId:(NSString *)verifiedPlaceId) {
    [Radar acceptEventId:eventId verifiedPlaceId:verifiedPlaceId];
}

RCT_EXPORT_METHOD(rejectEvent:(NSString *)eventId) {
    [Radar rejectEventId:eventId];
}

RCT_EXPORT_METHOD(getTripOptions:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (resolve == nil) {
        return;
    }
    
    RadarTripOptions* options = [Radar getTripOptions];
    resolve([options dictionaryValue]);
}

RCT_EXPORT_METHOD(startTrip:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    // { tripOptions, trackingOptions } is the new req format.
    // fallback to reading trip options from the top level options.
    NSDictionary *tripOptionsDict = optionsDict[@"tripOptions"];
    if (tripOptionsDict == nil) {
        tripOptionsDict = optionsDict;
    }

    RadarTripOptions *options = [RadarTripOptions tripOptionsFromDictionary:tripOptionsDict];
    
    RadarTrackingOptions *trackingOptions;
    NSDictionary *trackingOptionsDict = optionsDict[@"trackingOptions"];
    if (trackingOptionsDict != nil) {
      trackingOptions = [RadarTrackingOptions trackingOptionsFromDictionary:trackingOptionsDict];
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar startTripWithOptions:options trackingOptions:trackingOptions completionHandler:^(RadarStatus status, RadarTrip * _Nullable trip, NSArray<RadarEvent *> * _Nullable events) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (trip) {
                [dict setObject:[trip dictionaryValue] forKey:@"trip"];
            }
            if (events) {
                [dict setObject:[RadarEvent arrayForEvents:events] forKey:@"events"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
}

RCT_EXPORT_METHOD(completeTrip:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar completeTripWithCompletionHandler:^(RadarStatus status, RadarTrip * _Nullable trip, NSArray<RadarEvent *> * _Nullable events) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (trip) {
                [dict setObject:[trip dictionaryValue] forKey:@"trip"];
            }
            if (events) {
                [dict setObject:[RadarEvent arrayForEvents:events] forKey:@"events"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
}

RCT_EXPORT_METHOD(cancelTrip:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar cancelTripWithCompletionHandler:^(RadarStatus status, RadarTrip * _Nullable trip, NSArray<RadarEvent *> * _Nullable events) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (trip) {
                [dict setObject:[trip dictionaryValue] forKey:@"trip"];
            }
            if (events) {
                [dict setObject:[RadarEvent arrayForEvents:events] forKey:@"events"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
}

RCT_EXPORT_METHOD(updateTrip:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    RadarTripOptions *options = [RadarTripOptions tripOptionsFromDictionary:optionsDict[@"options"]];
    NSString *statusStr = optionsDict[@"status"];

    RadarTripStatus status = RadarTripStatusUnknown;
    if (statusStr) {
        if ([statusStr isEqualToString:@"started"]) {
            status = RadarTripStatusStarted;
        } else if ([statusStr isEqualToString:@"approaching"]) {
            status = RadarTripStatusApproaching;
        } else if ([statusStr isEqualToString:@"arrived"]) {
            status = RadarTripStatusArrived;
        } else if ([statusStr isEqualToString:@"completed"]) {
            status = RadarTripStatusCompleted;
        } else if ([statusStr isEqualToString:@"canceled"]) {
            status = RadarTripStatusCanceled;
        } else if ([statusStr isEqualToString:@"unknown"]) {
            status = RadarTripStatusUnknown;
        } else {
            if (reject) {
                reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
            }

            return;
        }
    } else {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar updateTripWithOptions:options status:status completionHandler:^(RadarStatus status, RadarTrip * _Nullable trip, NSArray<RadarEvent *> * _Nullable events) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (trip) {
                [dict setObject:[trip dictionaryValue] forKey:@"trip"];
            }
            if (events) {
                [dict setObject:[RadarEvent arrayForEvents:events] forKey:@"events"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
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
    NSDictionary *chainMetadata = optionsDict[@"chainMetadata"];
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
        [Radar searchPlacesNear:near radius:radius chains:chains chainMetadata:chainMetadata categories:categories groups:groups limit:limit completionHandler:completionHandler];
    } else {
        [Radar searchPlacesWithRadius:radius chains:chains chainMetadata:chainMetadata categories:categories groups:groups limit:limit completionHandler:completionHandler];
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

RCT_EXPORT_METHOD(autocomplete:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSDictionary *nearDict = optionsDict[@"near"];
    CLLocation *near = nil;
    if (nearDict && [nearDict isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:nearDict[@"latitude"]];
        double longitude = [RCTConvert double:nearDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        near = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }


    NSString *query = optionsDict[@"query"];
    NSNumber *limitNumber = optionsDict[@"limit"];
    int limit;
    if (limitNumber != nil && [limitNumber isKindOfClass:[NSNumber class]]) {
        limit = [limitNumber intValue];
    } else {
        limit = 10;
    }

    NSArray *layers = optionsDict[@"layers"];
    NSString *country = optionsDict[@"countryCode"];
    if (country == nil) {
        country = optionsDict[@"country"];
    }

    BOOL expandUnits = false;
    NSNumber *expandUnitsNumber = optionsDict[@"expandUnits"];
    if (expandUnitsNumber != nil && [expandUnitsNumber isKindOfClass:[NSNumber class]]) {
        expandUnits = [expandUnitsNumber boolValue]; 
    }

    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    [Radar autocompleteQuery:query near:near layers:layers limit:limit country:country expandUnits:expandUnits completionHandler:^(RadarStatus status, NSArray<RadarAddress *> * _Nullable addresses) {
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

RCT_EXPORT_METHOD(getMatrix:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSArray<NSDictionary *> *originsArr = optionsDict[@"origins"];
    NSMutableArray<CLLocation *> *origins = [NSMutableArray new];
    for (NSDictionary *originDict in originsArr) {
        double latitude = [RCTConvert double:originDict[@"latitude"]];
        double longitude = [RCTConvert double:originDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        CLLocation *origin = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
        [origins addObject:origin];
    }
    NSArray<NSDictionary *> *destinationsArr = optionsDict[@"destinations"];
    NSMutableArray<CLLocation *> *destinations = [NSMutableArray new];
    for (NSDictionary *destinationDict in destinationsArr) {
        double latitude = [RCTConvert double:destinationDict[@"latitude"]];
        double longitude = [RCTConvert double:destinationDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        CLLocation *destination = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
        [destinations addObject:destination];
    }
    NSString *modeStr = optionsDict[@"mode"];
    RadarRouteMode mode = RadarRouteModeCar;
    if ([modeStr isEqualToString:@"FOOT"] || [modeStr isEqualToString:@"foot"]) {
        mode = RadarRouteModeFoot;
    } else if ([modeStr isEqualToString:@"BIKE"] || [modeStr isEqualToString:@"bike"]) {
        mode = RadarRouteModeBike;
    } else if ([modeStr isEqualToString:@"CAR"] || [modeStr isEqualToString:@"car"]) {
        mode = RadarRouteModeCar;
    } else if ([modeStr isEqualToString:@"TRUCK"] || [modeStr isEqualToString:@"truck"]) {
        mode = RadarRouteModeTruck;
    } else if ([modeStr isEqualToString:@"MOTORBIKE"] || [modeStr isEqualToString:@"motorbike"]) {
        mode = RadarRouteModeMotorbike;
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

    [Radar getMatrixFromOrigins:origins destinations:destinations mode:mode units:units completionHandler:^(RadarStatus status, RadarRouteMatrix * _Nullable matrix) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (matrix) {
                [dict setObject:[matrix arrayValue] forKey:@"matrix"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
}

RCT_EXPORT_METHOD(logConversion:(NSDictionary *)optionsDict resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }

    NSString *name = optionsDict[@"name"];
    NSNumber *revenue = optionsDict[@"revenue"];
    NSDictionary *metadata = optionsDict[@"metadata"];
    if (name == nil) {
        if (reject) {
            reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        }

        return;
    }
    
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;

    RadarLogConversionCompletionHandler completionHandler = ^(RadarStatus status, RadarEvent * _Nullable event) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (event) {
                [dict setObject:[event dictionaryValue] forKey:@"event"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    };
    
    if (revenue) {
        [Radar logConversionWithName:name metadata:metadata completionHandler:completionHandler];
    } else {
        [Radar logConversionWithName:name revenue:revenue metadata:metadata completionHandler:completionHandler];
    }
}
@end
