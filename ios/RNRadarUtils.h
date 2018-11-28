#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>
#import <RadarSDK/RadarSDK.h>

@interface RNRadarUtils : NSObject

+ (NSString *)stringForPermissionsStatus:(CLAuthorizationStatus)status;
+ (NSString *)stringForStatus:(RadarStatus)status;
+ (NSDictionary *)dictionaryForUser:(RadarUser *)user;
+ (NSDictionary *)dictionaryForUserInsights:(RadarUserInsights *)insights;
+ (NSDictionary *)dictionaryForUserInsightsLocation:(RadarUserInsightsLocation *)location;
+ (NSDictionary *)dictionaryForUserInsightsState:(RadarUserInsightsState *)state;
+ (NSDictionary *)dictionaryForGeofence:(RadarGeofence *)geofence;
+ (NSDictionary *)dictionaryForPlace:(RadarPlace *)place;
+ (NSArray *)arrayForEvents:(NSArray<RadarEvent *> *)events;
+ (NSDictionary *)dictionaryForEvent:(RadarEvent *)event;
+ (NSDictionary *)dictionaryForLocation:(CLLocation *)location;
+ (RadarPlacesProvider)placesProviderForString:(NSString *)providerStr;
+ (NSArray *)arrayForAlternatePlaces:(NSArray<RadarPlace *> *)places;
+ (RadarTrackingOptions *)optionsForDictionary:(NSDictionary *)optionsDict;

@end
