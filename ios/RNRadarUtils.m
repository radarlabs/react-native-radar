#import "RNRadarUtils.h"

@implementation RNRadarUtils

+ (NSString *)stringForPermissionsStatus:(CLAuthorizationStatus)status {
    switch (status) {
        case kCLAuthorizationStatusDenied:
            return @"DENIED";
        case kCLAuthorizationStatusRestricted:
            return @"DENIED";
        case kCLAuthorizationStatusAuthorizedAlways:
            return @"GRANTED";
        case kCLAuthorizationStatusAuthorizedWhenInUse:
            return @"GRANTED";
        default:
            return @"UNKNOWN";
    }
}

+ (NSString *)stringForStatus:(RadarStatus)status {
    switch (status) {
        case RadarStatusSuccess:
            return @"SUCCESS";
        case RadarStatusErrorPublishableKey:
            return @"ERROR_PUBLISHABLE_KEY";
        case RadarStatusErrorUserId:
            return @"ERROR_USER_ID";
        case RadarStatusErrorPermissions:
            return @"ERROR_PERMISSIONS";
        case RadarStatusErrorLocation:
            return @"ERROR_LOCATION";
        case RadarStatusErrorNetwork:
            return @"ERROR_NETWORK";
        case RadarStatusErrorUnauthorized:
            return @"ERROR_UNAUTHORIZED";
        case RadarStatusErrorServer:
            return @"ERROR_SERVER";
        default:
            return @"ERROR_UNKNOWN";
    }
}

+ (NSString *)stringForEventType:(RadarEventType)type {
    switch (type) {
        case RadarEventTypeUserEnteredGeofence:
            return @"user.entered_geofence";
        case RadarEventTypeUserExitedGeofence:
            return @"user.exited_geofence";
        case RadarEventTypeUserEnteredHome:
            return @"user.entered_home";
        case RadarEventTypeUserExitedHome:
            return @"user.exited_home";
        case RadarEventTypeUserEnteredOffice:
            return @"user.entered_office";
        case RadarEventTypeUserExitedOffice:
            return @"user.exited_office";
        case RadarEventTypeUserStartedTraveling:
            return @"user.started_traveling";
        case RadarEventTypeUserStoppedTraveling:
            return @"user.stopped_traveling";
        case RadarEventTypeUserEnteredPlace:
            return @"user.entered_place";
        case RadarEventTypeUserExitedPlace:
            return @"user.exited_place";
        default:
            return nil;

    }
}

+ (NSNumber *)numberForEventConfidence:(RadarEventConfidence)confidence {
    switch (confidence) {
        case RadarEventConfidenceHigh:
            return @(3);
        case RadarEventConfidenceMedium:
            return @(2);
        case RadarEventConfidenceLow:
            return @(1);
        default:
            return @(0);
    }
}

+ (NSString *)stringForUserInsightsLocationType:(RadarUserInsightsLocationType)type {
    switch (type) {
        case RadarUserInsightsLocationTypeHome:
            return @"home";
        case RadarUserInsightsLocationTypeOffice:
            return @"office";
        default:
            return nil;
    }
}

+ (NSNumber *)numberForUserInsightsLocationConfidence:(RadarUserInsightsLocationConfidence)confidence {
    switch (confidence) {
        case RadarUserInsightsLocationConfidenceHigh:
            return @(3);
        case RadarUserInsightsLocationConfidenceMedium:
            return @(2);
        case RadarUserInsightsLocationConfidenceLow:
            return @(1);
        default:
            return @(0);
    }
}

+ (RadarPlacesProvider)placesProviderForString:(NSString *)providerStr {
    if ([providerStr isEqualToString:"facebook"])
        return RadarPlacesProviderFacebook;
    return RadarPlacesProviderNone;
}

+ (NSDictionary *)dictionaryForUser:(RadarUser *)user {
    if (!user)
        return nil;

    NSMutableDictionary *dict = [NSMutableDictionary new];
    [dict setValue:user._id forKey:@"_id"];
    [dict setValue:user.userId forKey:@"userId"];
    NSString *description = user._description;
    if (description)
        [dict setValue:description forKey:@"description"];
    NSMutableArray *geofencesArr = [[NSMutableArray alloc] initWithCapacity:user.geofences.count];
    for (RadarGeofence *geofence in user.geofences) {
        NSDictionary *geofenceDict = [RNRadarUtils dictionaryForGeofence:geofence];
        [geofencesArr addObject:geofenceDict];
    }
    [dict setValue:geofencesArr forKey:@"geofences"];
    NSDictionary *insightsDict = [RNRadarUtils dictionaryForUserInsights:user.insights];
    [dict setValue:insightsDict forKey:@"insights"];
    return dict;
}

+ (NSDictionary *)dictionaryForUserInsights:(RadarUserInsights *)insights {
    if (!insights)
        return nil;

    NSMutableDictionary *dict = [NSMutableDictionary new];
    NSDictionary *homeLocationDict = [RNRadarUtils dictionaryForUserInsightsLocation:insights.homeLocation];
    if (homeLocationDict)
        [dict setObject:homeLocationDict forKey:@"homeLocation"];
    NSDictionary *officeLocationDict = [RNRadarUtils dictionaryForUserInsightsLocation:insights.officeLocation];
    if (officeLocationDict)
        [dict setObject:officeLocationDict forKey:@"officeLocation"];
    NSDictionary *stateDict = [RNRadarUtils dictionaryForUserInsightsState:insights.state];
    if (stateDict)
        [dict setObject:stateDict forKey:@"state"];
    return dict;
}

+ (NSDictionary *)dictionaryForUserInsightsLocation:(RadarUserInsightsLocation *)location {
    if (!location)
        return nil;

    NSMutableDictionary *dict = [NSMutableDictionary new];
    NSString *type = [RNRadarUtils stringForUserInsightsLocationType:location.type];
    if (type)
        [dict setValue:type forKey:@"type"];
    NSDictionary *locationDict = [RNRadarUtils dictionaryForLocation:location.location];
    if (locationDict)
        [dict setValue:locationDict forKey:@"location"];
    NSNumber *confidence = [RNRadarUtils numberForUserInsightsLocationConfidence:location.confidence];
    [dict setValue:confidence forKey:@"confidence"];
    return dict;
}

+ (NSDictionary *)dictionaryForUserInsightsState:(RadarUserInsightsState *)state {
    if (!state)
        return nil;

    NSMutableDictionary *dict = [NSMutableDictionary new];
    [dict setValue:@(state.home) forKey:@"home"];
    [dict setValue:@(state.office) forKey:@"office"];
    [dict setValue:@(state.traveling) forKey:@"traveling"];
    return dict;
}

+ (NSDictionary *)dictionaryForGeofence:(RadarGeofence *)geofence {
    if (!geofence)
        return nil;

    NSMutableDictionary *dict = [NSMutableDictionary new];
    [dict setValue:geofence._id forKey:@"_id"];
    NSString *tag = geofence.tag;
    if (tag)
        [dict setValue:tag forKey:@"tag"];
    NSString *externalId = geofence.externalId;
    if (externalId)
        [dict setValue:externalId forKey:@"externalId"];
    [dict setValue:geofence._description forKey:@"description"];
    return dict;
}

+ (NSDictionary *)dictionaryForPlace:(RadarPlace *)place {
    if (!geofence)
        return nil;

    NSMutableDictionary *dict = [NSMutableDictionary new];
    [dict setValue:place._id forKey:@"_id"];
    NSString *facebookId = place.facebookId;
    if (facebookId)
        [dict setValue:facebookId forKey:@"facebookId"];
    [dict setValue:place.name forKey:@"name"];
    if (place.categories && place.categories.count) {
        NSMutableArray *categories = [[NSMutableArray alloc] initWithCapacity:place.categories.count];
        for (NSString *category in place.categories) {
            [categories addObject:category];
        }
        [dict setValue:categories forKey:@"categories"];
    }
    if (place.chain) {
      NSDictionary *chain = @{@"slug": place.chain.slug, @"name": place.chain.name};
      [dict setValue:chain forKey:@"chain"];
    }
    return dict;
}

+ (NSArray *)arrayForEvents:(NSArray<RadarEvent *> *)events {
    if (!events)
        return nil;

    NSMutableArray *arr = [[NSMutableArray alloc] initWithCapacity:events.count];
    for (RadarEvent *event in events) {
        NSDictionary *dict = [RNRadarUtils dictionaryForEvent:event];
        [arr addObject:dict];
    }
    return arr;
}

+ (NSDictionary *)dictionaryForEvent:(RadarEvent *)event {
    if (!event)
        return nil;

    NSMutableDictionary *dict = [NSMutableDictionary new];
    [dict setValue:event._id forKey:@"_id"];
    [dict setValue:@(event.live) forKey:@"live"];
    NSString *type = [RNRadarUtils stringForEventType:event.type];
    if (type)
        [dict setValue:type forKey:@"type"];
    NSDictionary *geofenceDict = [RNRadarUtils dictionaryForGeofence:event.geofence];
    if (geofenceDict)
        [dict setValue:geofenceDict forKey:@"geofence"];
    NSDictionary *placeDict = [RNRadarUtils dictionaryForPlace:event.place];
    if (placeDict)
        [dict setValue:placeDict forKey:@"place"];
    NSNumber *confidence = [RNRadarUtils numberForEventConfidence:event.confidence];
    [dict setValue:confidence forKey:@"confidence"];
    if (event.duration)
        [dict setValue:@(event.duration) forKey:@"duration"];
    return dict;
}

+ (NSDictionary *)dictionaryForLocation:(CLLocation *)location {
    if (!location)
        return nil;

    NSMutableDictionary *dict = [NSMutableDictionary new];
    [dict setValue:@(location.coordinate.latitude) forKey:@"latitude"];
    [dict setValue:@(location.coordinate.longitude) forKey:@"longitude"];
    if (location.horizontalAccuracy)
        [dict setValue:@(location.horizontalAccuracy) forKey:@"accuracy"];
    return dict;
}

@end
