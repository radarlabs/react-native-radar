#import "RNRadar.h"
#include <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
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

- (void)trackOnce {
    [Radar trackOnceWithCompletionHandler:nil];
}

@end
