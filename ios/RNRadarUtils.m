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

+ (NSDictionary *)dictionaryForUser:(RadarUser *)user {
    if (!user)
        return nil;
    
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
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
    return dict;
}

+ (NSDictionary *)dictionaryForGeofence:(RadarGeofence *)geofence {
    if (!geofence)
        return nil;
    
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
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
    
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setValue:event._id forKey:@"_id"];
    [dict setValue:@(event.live) forKey:@"live"];
    NSString *type = event.type == UserEnteredGeofence ? @"user.entered_geofence": @"user.exited_geofence";
    [dict setValue:type forKey:@"type"];
    NSDictionary *geofenceDict = [RNRadarUtils dictionaryForGeofence:event.geofence];
    [dict setValue:geofenceDict forKey:@"geofence"];
    NSNumber *confidence;
    if (event.confidence == High)
        confidence = @(3);
    else if (event.confidence == Medium)
        confidence = @(2);
    else if (event.confidence == Low)
        confidence = @(1);
    else
        confidence = @(0);
    [dict setValue:confidence forKey:@"confidence"];
    [dict setValue:@(event.duration) forKey:@"duration"];
    return dict;
}

+ (NSDictionary *)dictionaryForLocation:(CLLocation *)location {
    if (!location)
        return nil;
    
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    [dict setValue:@(location.coordinate.latitude) forKey:@"latitude"];
    [dict setValue:@(location.coordinate.longitude) forKey:@"longitude"];
    [dict setValue:@(location.horizontalAccuracy) forKey:@"accuracy"];
    return dict;
}

@end
