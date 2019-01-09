#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>
#import <RadarSDK/RadarSDK.h>

@interface RNRadarUtils : NSObject

+ (NSString *)stringForPermissionsStatus:(CLAuthorizationStatus)status;
+ (NSString *)stringForStatus:(RadarStatus)status;
+ (NSDictionary *)dictionaryForUser:(RadarUser *)user;
+ (NSArray *)arrayForEvents:(NSArray<RadarEvent *> *)events;
+ (NSDictionary *)dictionaryForLocation:(CLLocation *)location;
+ (RadarPlacesProvider)placesProviderForString:(NSString *)providerStr;
+ (RadarTrackingOptions *)optionsForDictionary:(NSDictionary *)optionsDict;

@end
