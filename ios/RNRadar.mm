#import "RNRadar.h"
#include <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert.h>

@implementation RNRadar {
    CLLocationManager *locationManager;
    //RCTPromiseResolveBlock permissionsRequestResolver;
}
RCT_EXPORT_MODULE()

- (instancetype)init {
    self = [super init];
    if (self) {
        locationManager = [CLLocationManager new];
        [Radar setDelegate:self];
    }
    return self;
}

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (void)didReceiveEvents:(NSArray<RadarEvent *> *)events user:(RadarUser * _Nullable )user {
    // if (hasListeners) {
    //     NSMutableDictionary *body = [NSMutableDictionary new];
    //     [body setValue:[RadarEvent arrayForEvents:events] forKey:@"events"];
    //     if (user) {
    //         [body setValue:[user dictionaryValue] forKey:@"user"];
    //     }
    //     [self sendEventWithName:@"events" body:body];
    // }
}

- (void)didUpdateLocation:(CLLocation *)location user:(RadarUser *)user {
    [self emitLocationEmitter:@{
        @"location": [[Radar dictionaryForLocation:location] description],
        @"user": [[user dictionaryValue] description]
    }];
    // if (hasListeners) {
    //     [self sendEventWithName:@"location" body:@{
    //         @"location": [Radar dictionaryForLocation:location],
    //         @"user": [user dictionaryValue]
    //     }];
    // }
}

- (void)didUpdateClientLocation:(CLLocation *)location stopped:(BOOL)stopped source:(RadarLocationSource)source {
    // if (hasListeners) {
    //     [self sendEventWithName:@"clientLocation" body:@{
    //         @"location": [Radar dictionaryForLocation:location],
    //         @"stopped": @(stopped),
    //         @"source": [Radar stringForLocationSource:source]
    //     }];
    // }
}

- (void)didFailWithStatus:(RadarStatus)status {
    // if (hasListeners) {
    //     [self sendEventWithName:@"error" body:[Radar stringForStatus:status]];
    // }
}

- (void)didLogMessage:(NSString *)message {
    // if (hasListeners) {
    //     [self sendEventWithName:@"log" body:message];
    // }
}




- (void)initialize:(NSString *)publishableKey fraud:(BOOL)fraud {
    [Radar initializeWithPublishableKey:publishableKey];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRadarSpecJSI>(params);
}

- (void)requestPermissions:(BOOL)background {
    CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
    if (background && status == kCLAuthorizationStatusAuthorizedWhenInUse) {
        //permissionsRequestResolver = resolve;
        [locationManager requestAlwaysAuthorization];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleAppBecomingActive)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];
    } else if (status == kCLAuthorizationStatusNotDetermined) {
        //permissionsRequestResolver = resolve;
        [locationManager requestWhenInUseAuthorization];
    } else {
        //[self getPermissionsStatusWithResolver:resolve rejecter:reject];
        // permissionsRequestResolver = nil;
    }
}

- (void)handleAppBecomingActive
{
//   [[NSNotificationCenter defaultCenter] removeObserver:self];
//      if (permissionsRequestResolver) {
//         [self getPermissionsStatusWithResolver:permissionsRequestResolver rejecter:nil];
//         permissionsRequestResolver = nil;
//     }
}

- (void)trackOnce:(NSDictionary *)optionsDict
         resolve:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
    RadarTrackingOptionsDesiredAccuracy desiredAccuracy;
    BOOL beacons = NO;
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
        
        NSNumber *beaconsNumber = optionsDict[@"beacons"];
        if (beaconsNumber != nil && [beaconsNumber isKindOfClass:[NSNumber class]]) {
            beacons = [beaconsNumber boolValue]; 
        }
        
        [Radar trackOnceWithDesiredAccuracy:desiredAccuracy beacons:beacons completionHandler:completionHandler];
    }
}

- (void)isEven:(double)number
       resolve:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject {
    if ((int)number % 2 == 0) {
        resolve(@(number));
    } else {
        reject(@"ODD_NUMBER", @"Number is odd", nil);
    }
}

@end
