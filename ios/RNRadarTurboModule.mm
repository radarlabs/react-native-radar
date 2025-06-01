#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTEventDispatcher.h>

#import <RadarSDK/RadarSDK.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRadarTurboModule.h"

@implementation RNRadarTurboModule {
    bool hasListeners;
    NSMutableSet<NSString *> *_activeListeners;
}

RCT_EXPORT_MODULE(RadarTurboModuleSpec)

- (instancetype)init {
    self = [super init];
    if (self) {
        _activeListeners = [NSMutableSet new];
        [Radar setDelegate:self];
    }
    return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRadarTurboModuleSpecJSI>(params);
}

#pragma mark - Lifecycle Methods

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
    [_activeListeners removeAllObjects];
}

#pragma mark - Configuration Methods

RCT_EXPORT_METHOD(initialize:(NSString *)publishableKey)
{
    [Radar initializeWithPublishableKey:publishableKey];
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userId)
{
    [Radar setUserId:userId];
}

RCT_EXPORT_METHOD(setDescription:(NSString *)description)
{
    [Radar setDescription:description];
}

RCT_EXPORT_METHOD(setMetadata:(NSDictionary *)metadata)
{
    [Radar setMetadata:metadata];
}

#pragma mark - Location Methods

RCT_EXPORT_METHOD(getLocation:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject)
{
    [Radar getLocationWithCompletionHandler:^(RadarStatus status, CLLocation * _Nullable location, BOOL stopped) {
        if (status == RadarStatusSuccess && location) {
            resolve(@{
                @"latitude": @(location.coordinate.latitude),
                @"longitude": @(location.coordinate.longitude),
                @"accuracy": @(location.horizontalAccuracy)
            });
        } else {
            reject(@"error", @"Failed to get location", nil);
        }
    }];
}

RCT_EXPORT_METHOD(trackOnce:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [Radar trackOnceWithCompletionHandler:^(RadarStatus status, CLLocation * _Nullable location, NSArray<RadarEvent *> * _Nullable events, RadarUser * _Nullable user) {
        if (status == RadarStatusSuccess) {
            resolve(@{
                @"location": @{
                    @"latitude": @(location.coordinate.latitude),
                    @"longitude": @(location.coordinate.longitude),
                    @"accuracy": @(location.horizontalAccuracy)
                }
            });
        } else {
            reject(@"error", @"Failed to track location", nil);
        }
    }];
}

RCT_EXPORT_METHOD(startTracking)
{
    [Radar startTracking];
}

RCT_EXPORT_METHOD(stopTracking)
{
    [Radar stopTracking];
}

RCT_EXPORT_METHOD(mockTracking:(NSDictionary *)options)
{
    // Implementation for mock tracking
    if (options[@"origin"] && options[@"destination"]) {
        // Mock tracking implementation
    }
}

#pragma mark - Places and Geofences Methods

RCT_EXPORT_METHOD(searchPlaces:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // Implementation for searching places
    [Radar searchPlacesWithRadius:options[@"radius"] 
                         chains:options[@"chains"]
                    categories:options[@"categories"]
                    groups:options[@"groups"]
                    limit:options[@"limit"]
                    completionHandler:^(RadarStatus status, NSArray<RadarPlace *> * _Nullable places) {
        if (status == RadarStatusSuccess) {
            // Convert places to dictionary and resolve
            resolve(@{@"places": @[]});  // Replace with actual places conversion
        } else {
            reject(@"error", @"Failed to search places", nil);
        }
    }];
}

RCT_EXPORT_METHOD(searchGeofences:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // Implementation for searching geofences
    [Radar searchGeofencesWithRadius:options[@"radius"]
                             tags:options[@"tags"]
                         metadata:options[@"metadata"]
                            limit:options[@"limit"]
                completionHandler:^(RadarStatus status, NSArray<RadarGeofence *> * _Nullable geofences) {
        if (status == RadarStatusSuccess) {
            // Convert geofences to dictionary and resolve
            resolve(@{@"geofences": @[]});  // Replace with actual geofences conversion
        } else {
            reject(@"error", @"Failed to search geofences", nil);
        }
    }];
}

#pragma mark - Trip Tracking Methods

RCT_EXPORT_METHOD(startTrip:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // Implementation for starting a trip
    RadarTripOptions *tripOptions = [[RadarTripOptions alloc] init];
    // Configure trip options
    [Radar startTripWithOptions:tripOptions
              completionHandler:^(RadarStatus status, RadarTrip * _Nullable trip) {
        if (status == RadarStatusSuccess) {
            resolve(nil);
        } else {
            reject(@"error", @"Failed to start trip", nil);
        }
    }];
}

RCT_EXPORT_METHOD(completeTrip:(RCTPromiseResolveBlock)resolve
                     rejecter:(RCTPromiseRejectBlock)reject)
{
    [Radar completeTripWithCompletionHandler:^(RadarStatus status, RadarTrip * _Nullable trip) {
        if (status == RadarStatusSuccess) {
            resolve(nil);
        } else {
            reject(@"error", @"Failed to complete trip", nil);
        }
    }];
}

RCT_EXPORT_METHOD(cancelTrip:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject)
{
    [Radar cancelTripWithCompletionHandler:^(RadarStatus status, RadarTrip * _Nullable trip) {
        if (status == RadarStatusSuccess) {
            resolve(nil);
        } else {
            reject(@"error", @"Failed to cancel trip", nil);
        }
    }];
}

#pragma mark - Event Listener Methods

RCT_EXPORT_METHOD(addListener:(NSString *)eventName)
{
    [_activeListeners addObject:eventName];
}

RCT_EXPORT_METHOD(removeListener:(NSString *)eventName)
{
    [_activeListeners removeObject:eventName];
}

#pragma mark - RadarDelegate Methods

- (void)didReceiveEvents:(NSArray<RadarEvent *> *)events user:(RadarUser *)user {
    if (!hasListeners || ![_activeListeners containsObject:@"events"]) return;
    
    NSMutableArray *mappedEvents = [NSMutableArray new];
    for (RadarEvent *event in events) {
        [mappedEvents addObject:[self eventToDictionary:event]];
    }
    
    [self sendEventWithName:@"events" body:@{
        @"events": mappedEvents,
        @"user": [self userToDictionary:user]
    }];
}

- (void)didUpdateLocation:(CLLocation *)location user:(RadarUser *)user {
    if (!hasListeners || ![_activeListeners containsObject:@"location"]) return;
    
    [self sendEventWithName:@"location" body:@{
        @"location": [self locationToDictionary:location],
        @"user": [self userToDictionary:user]
    }];
}

- (void)didUpdateClientLocation:(CLLocation *)location stopped:(BOOL)stopped source:(RadarLocationSource)source {
    if (!hasListeners || ![_activeListeners containsObject:@"clientLocation"]) return;
    
    [self sendEventWithName:@"clientLocation" body:@{
        @"location": [self locationToDictionary:location],
        @"stopped": @(stopped),
        @"source": [self stringForLocationSource:source]
    }];
}

- (void)didFailWithStatus:(RadarStatus)status {
    if (!hasListeners || ![_activeListeners containsObject:@"error"]) return;
    
    [self sendEventWithName:@"error" body:@{
        @"status": [self stringForStatus:status]
    }];
}

#pragma mark - Helper Methods

- (NSDictionary *)locationToDictionary:(CLLocation *)location {
    if (!location) return nil;
    return @{
        @"latitude": @(location.coordinate.latitude),
        @"longitude": @(location.coordinate.longitude),
        @"accuracy": @(location.horizontalAccuracy)
    };
}

- (NSDictionary *)userToDictionary:(RadarUser *)user {
    if (!user) return nil;
    NSMutableDictionary *dict = [NSMutableDictionary new];
    dict[@"_id"] = user._id;
    dict[@"userId"] = user.userId;
    if (user.description) dict[@"description"] = user.description;
    if (user.metadata) dict[@"metadata"] = user.metadata;
    return dict;
}

- (NSDictionary *)eventToDictionary:(RadarEvent *)event {
    if (!event) return nil;
    NSMutableDictionary *dict = [NSMutableDictionary new];
    dict[@"_id"] = event._id;
    dict[@"type"] = [self stringForEventType:event.type];
    if (event.metadata) dict[@"metadata"] = event.metadata;
    return dict;
}

- (NSString *)stringForLocationSource:(RadarLocationSource)source {
    switch (source) {
        case RadarLocationSourceForegroundLocation:
            return @"FOREGROUND_LOCATION";
        case RadarLocationSourceBackgroundLocation:
            return @"BACKGROUND_LOCATION";
        case RadarLocationSourceManual:
            return @"MANUAL";
        case RadarLocationSourceVisit:
            return @"VISIT";
        case RadarLocationSourceGeofenceEnter:
            return @"GEOFENCE_ENTER";
        case RadarLocationSourceGeofenceExit:
            return @"GEOFENCE_EXIT";
        default:
            return @"UNKNOWN";
    }
}

- (NSString *)stringForEventType:(RadarEventType)type {
    switch (type) {
        case RadarEventTypeUserEnteredGeofence:
            return @"user.entered_geofence";
        case RadarEventTypeUserExitedGeofence:
            return @"user.exited_geofence";
        case RadarEventTypeUserEnteredPlace:
            return @"user.entered_place";
        case RadarEventTypeUserExitedPlace:
            return @"user.exited_place";
        case RadarEventTypeUserNearbyPlaceChain:
            return @"user.nearby_place_chain";
        case RadarEventTypeUserEnteredRegionCountry:
            return @"user.entered_region_country";
        case RadarEventTypeUserExitedRegionCountry:
            return @"user.exited_region_country";
        case RadarEventTypeUserEnteredRegionState:
            return @"user.entered_region_state";
        case RadarEventTypeUserExitedRegionState:
            return @"user.exited_region_state";
        case RadarEventTypeUserEnteredRegionDMA:
            return @"user.entered_region_dma";
        case RadarEventTypeUserExitedRegionDMA:
            return @"user.exited_region_dma";
        default:
            return @"unknown";
    }
}

- (NSString *)stringForStatus:(RadarStatus)status {
    switch (status) {
        case RadarStatusSuccess:
            return @"SUCCESS";
        case RadarStatusErrorPublishableKey:
            return @"ERROR_PUBLISHABLE_KEY";
        case RadarStatusErrorPermissions:
            return @"ERROR_PERMISSIONS";
        case RadarStatusErrorLocation:
            return @"ERROR_LOCATION";
        case RadarStatusErrorNetwork:
            return @"ERROR_NETWORK";
        case RadarStatusErrorBadRequest:
            return @"ERROR_BAD_REQUEST";
        case RadarStatusErrorUnauthorized:
            return @"ERROR_UNAUTHORIZED";
        case RadarStatusErrorPaymentRequired:
            return @"ERROR_PAYMENT_REQUIRED";
        case RadarStatusErrorForbidden:
            return @"ERROR_FORBIDDEN";
        case RadarStatusErrorNotFound:
            return @"ERROR_NOT_FOUND";
        case RadarStatusErrorRateLimit:
            return @"ERROR_RATE_LIMIT";
        case RadarStatusErrorServer:
            return @"ERROR_SERVER";
        default:
            return @"ERROR_UNKNOWN";
    }
}

@end
#endif 