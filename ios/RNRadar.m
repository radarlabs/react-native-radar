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
    return @[@"events", @"location", @"clientLocation", @"error"];
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
        [self sendEventWithName:@"clientLocation" body:@{@"location": [Radar dictionaryForLocation:location], @"stopped": @(stopped), @"source": [Radar stringForSource:source]}];
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

RCT_REMAP_METHOD(getLocation, getLocationWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
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

RCT_REMAP_METHOD(trackOnce, trackOnceWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    CLLocation *location;
    if (locationDict != nil && [[locationDict class] isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:locationDict[@"latitude"]];
        double longitude = [RCTConvert double:locationDict[@"longitude"]];
        double accuracy = [RCTConvert double:locationDict[@"accuracy"]];
        NSDate *timestamp = [NSDate new];
        location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:accuracy verticalAccuracy:-1 timestamp:timestamp];
    }
    
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    
    __block RadarTrackCompletionHandler completionHandler = ^(RadarStatus status, CLLocation *location, NSArray<RadarEvent *> *events, RadarUser *user) {
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

RCT_EXPORT_METHOD(startTracking:(NSDictionary *)optionsDict) {
    RadarTrackingOptions *options = [RadarTrackingOptions optionsFromDictionary:optionsDict];
    [Radar startTrackingWithOptions:options];
}

RCT_EXPORT_METHOD(stopTracking) {
    [Radar stopTracking];
}

RCT_EXPORT_METHOD(acceptEvent:(NSString *)eventId withVerifiedPlaceId:(NSString *)verifiedPlaceId) {
    [Radar acceptEventId:eventId withVerifiedPlaceId:verifiedPlaceId];
}

RCT_EXPORT_METHOD(rejectEvent:(NSString *)eventId) {
    [Radar rejectEventId:eventId];
}

RCT_REMAP_METHOD(getContext:(NSDictionary *)locationDict, getContextWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    CLLocation *location;
    if (locationDict != nil && [[locationDict class] isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:locationDict[@"latitude"]];
        double longitude = [RCTConvert double:locationDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    
    __block RadarContextCompletionHandler completionHandler = ^(RadarStatus status, CLLocation * _Nullable location, RadarContext * _Nullable context) {
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

RCT_REMAP_METHOD(searchPlaces:(NSDictionary *)optionsDict, searchPlacesWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        
        return;
    }
    
    NSDictionary *nearDict = [optionsDict valueForKey:@"near"];
    CLLocation *near;
    if (nearDict != nil && [[nearDict class] isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:nearDict[@"latitude"]];
        double longitude = [RCTConvert double:nearDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        near = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    NSNumber *radiusNumber = [optionsDict valueForKey:@"radius"];
    int radius;
    if (radiusNumber != nil && [[radiusNumber class] isKindOfClass:[NSNumber class]]) {
        radius = [radiusNumber intValue];
    } else {
        radius = 1000;
    }
    NSArray *chains = [optionsDict valueForKey:@"chains"];
    NSArray *categories = [optionsDict valueForKey:@"categories"];
    NSArray *groups = [optionsDict valueForKey:@"groups"];
    NSNumber *limitNumber = [optionsDict valueForKey:@"limit"];
    int limit;
    if (limitNumber != nil && [[limitNumber class] isKindOfClass:[NSNumber class]]) {
        limit = [limitNumber intValue];
    } else {
        limit = 10;
    }
    
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    
    __block RadarSearchPlacesCompletionHandler completionHandler = ^(RadarStatus status, CLLocation * _Nullable location, NSArray<RadarPlace *> * _Nullable places) {
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

RCT_REMAP_METHOD(searchGeofences:(NSDictionary *)optionsDict, searchGeofencesWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        
        return;
    }
    
    NSDictionary *nearDict = [optionsDict valueForKey:@"near"];
    CLLocation *near;
    if (nearDict != nil && [[nearDict class] isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:nearDict[@"latitude"]];
        double longitude = [RCTConvert double:nearDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        near = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    NSNumber *radiusNumber = [optionsDict valueForKey:@"radius"];
    int radius;
    if (radiusNumber != nil && [[radiusNumber class] isKindOfClass:[NSNumber class]]) {
        radius = [radiusNumber intValue];
    } else {
        radius = 1000;
    }
    NSArray *tags = [optionsDict valueForKey:@"tags"];
    NSNumber *limitNumber = [optionsDict valueForKey:@"limit"];
    int limit;
    if (limitNumber != nil && [[limitNumber class] isKindOfClass:[NSNumber class]]) {
        limit = [limitNumber intValue];
    } else {
        limit = 10;
    }
    
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    
    __block RadarSearchGeofencesCompletionHandler completionHandler = ^(RadarStatus status, CLLocation * _Nullable location, NSArray<RadarGeofence *> * _Nullable geofences) {
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
        [Radar searchGeofencesNear:near radius:radius tags:tags limit:limit completionHandler:completionHandler];
    } else {
        [Radar searchGeofencesWithRadius:radius tags:tags limit:limit completionHandler:completionHandler];
    }
}

RCT_REMAP_METHOD(searchPoints:(NSDictionary *)optionsDict, searchPointsWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
    }
    
    NSDictionary *nearDict = [optionsDict valueForKey:@"near"];
    CLLocation *near;
    if (nearDict != nil && [[nearDict class] isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:nearDict[@"latitude"]];
        double longitude = [RCTConvert double:nearDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        near = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    NSNumber *radiusNumber = [optionsDict valueForKey:@"radius"];
    int radius;
    if (radiusNumber != nil && [[radiusNumber class] isKindOfClass:[NSNumber class]]) {
        radius = [radiusNumber intValue];
    } else {
        radius = 1000;
    }
    NSArray *tags = [optionsDict valueForKey:@"tags"];
    NSNumber *limitNumber = [optionsDict valueForKey:@"limit"];
    int limit;
    if (limitNumber != nil && [[limitNumber class] isKindOfClass:[NSNumber class]]) {
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

RCT_REMAP_METHOD(autocomplete:(NSDictionary *)optionsDict, autocompleteWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        
        return;
    }
    
    NSDictionary *nearDict = [optionsDict valueForKey:@"near"];
    if (nearDict == nil || ![[nearDict class] isKindOfClass:[NSDictionary class]]) {
        reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        
        return;
    }
    
    NSString *query = [optionsDict valueForKey:@"query"];
    double latitude = [RCTConvert double:nearDict[@"latitude"]];
    double longitude = [RCTConvert double:nearDict[@"longitude"]];
    NSDate *timestamp = [NSDate new];
    CLLocation *near = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    NSNumber *limitNumber = [optionsDict valueForKey:@"limit"];
    int limit;
    if (limitNumber != nil && [[limitNumber class] isKindOfClass:[NSNumber class]]) {
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

RCT_REMAP_METHOD(geocode:(NSString *)query, geocodeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
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

RCT_REMAP_METHOD(reverseGeocode:(NSDictionary *)locationDict, reverseGeocodeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    CLLocation *location;
    if (locationDict != nil && [[locationDict class] isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:locationDict[@"latitude"]];
        double longitude = [RCTConvert double:locationDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        location = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    
    __block RadarGeocodeCompletionHandler completionHandler = ^(RadarStatus status, NSArray<RadarAddress *> * _Nullable addresses) {
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

RCT_REMAP_METHOD(ipGeocode, ipGeocodeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    
    [Radar ipGeocodeWithCompletionHandler:^(RadarStatus status, RadarAddress * _Nullable address) {
        if (status == RadarStatusSuccess && resolver) {
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setObject:[Radar stringForStatus:status] forKey:@"status"];
            if (address) {
                [dict setObject:[address dictionaryValue] forKey:@"address"];
            }
            resolver(dict);
        } else if (rejecter) {
            rejecter([Radar stringForStatus:status], [Radar stringForStatus:status], nil);
        }
        resolver = nil;
        rejecter = nil;
    }];
}

RCT_REMAP_METHOD(getDistance:(NSDictionary *)optionsDict, getDistanceWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    if (optionsDict == nil) {
        reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        
        return;
    }
    
    NSDictionary *destinationDict = [optionsDict valueForKey:@"destination"];
    if (destinationDict == nil || ![[destinationDict class] isKindOfClass:[NSDictionary class]]) {
        reject([Radar stringForStatus:RadarStatusErrorBadRequest], [Radar stringForStatus:RadarStatusErrorBadRequest], nil);
        
        return;
    }
    
    NSDictionary *originDict = [optionsDict valueForKey:@"origin"];
    CLLocation *origin;
    if (originDict != nil && [[originDict class] isKindOfClass:[NSDictionary class]]) {
        double latitude = [RCTConvert double:originDict[@"latitude"]];
        double longitude = [RCTConvert double:originDict[@"longitude"]];
        NSDate *timestamp = [NSDate new];
        origin = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    }
    double latitude = [RCTConvert double:destinationDict[@"latitude"]];
    double longitude = [RCTConvert double:destinationDict[@"longitude"]];
    NSDate *timestamp = [NSDate new];
    CLLocation *destination = [[CLLocation alloc] initWithCoordinate:CLLocationCoordinate2DMake(latitude, longitude) altitude:-1 horizontalAccuracy:5 verticalAccuracy:-1 timestamp:timestamp];
    NSArray *modesArr = [optionsDict valueForKey:"modes"];
    RadarRouteMode modes;
    if (modesArr != nil && [[modesArr class] isKindOfClass:[NSArray class]]) {
        if ([modesArr containsObject: @"foot"]) {
            modes = modes | RadarRouteModeFoot;
        }
        if ([modesArr containsObject: @"bike"]) {
            modes = modes | RadarRouteModeBike;
        }
        if ([modesArr containsObject: @"car"]) {
            modes = modes | RadarRouteModeCar;
        }
        if ([modesArr containsObject: @"transit"]) {
            modes = modes | RadarRouteModeTransit;
        }
    } else {
        modes = RadarRouteModeCar;
    }
    NSString *unitsStr = [optionsDict valueForKey:"units"];
    RadarRouteUnits units;
    if (unitsStr != nil && [[unitsStr class] isKindOfClass:[NSString class]]) {
        units = [unitsStr isEqualToString:@"imperial"] ? RadarRouteUnitsImperial : RadarRouteUnitsMetric;
    } else {
        units = RadarRouteUnitsImperial;
    }
    
    __block RCTPromiseResolveBlock resolver = resolve;
    __block RCTPromiseRejectBlock rejecter = reject;
    
    __block RadarRouteCompletionHandler completionHandler = ^(RadarStatus status, RadarRoutes * _Nullable routes) {
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
