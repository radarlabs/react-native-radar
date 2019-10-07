#import <OCMock/OCMock.h>
#import <XCTest/XCTest.h>

#import "RNRadarUtils.h"

@interface RNRadarUtilsTests : XCTestCase
    
@end

@implementation RNRadarUtilsTests

- (void)testStringForPermissionsStatus {
    NSString *granted = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusAuthorizedAlways];
    XCTAssertEqual(@"GRANTED", granted);
    
    granted = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusAuthorizedWhenInUse];
    XCTAssertEqual(@"GRANTED", granted);
    
    NSString *denied = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusDenied];
    XCTAssertEqual(@"DENIED", denied);
    
    denied = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusRestricted];
    XCTAssertEqual(@"DENIED", denied);
    
    NSString *unknown = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusNotDetermined];
    XCTAssertEqual(@"UNKNOWN", unknown);
}

- (void)testStringForStatus {
    for (RadarStatus status = RadarStatusSuccess; status < RadarStatusErrorUnknown; status++) {
        NSString *statusStr = [RNRadarUtils stringForStatus:status];
        XCTAssertTrue(![statusStr isEqualToString:@"ERROR_UNKNOWN"], "Status %ld not handled", (long)status);
    }
    
    NSString *unknown = [RNRadarUtils stringForStatus:RadarStatusErrorUnknown];
    XCTAssertEqual(@"ERROR_UNKNOWN", unknown);
}

- (void)testDictionaryForUser {
    RadarUser *user = [RadarUser new];
    
    NSDictionary *userDict = [RNRadarUtils dictionaryForUser:user];
    
    XCTAssertNotNil(userDict);
}

- (void)testArrayForEvents {
    NSArray<RadarEvent *> *events = @[[RadarEvent new], [RadarEvent new]];
    
    NSArray *array = [RNRadarUtils arrayForEvents:events];
    
    XCTAssertEqual([events count], [array count]);
}

- (void)testDictionaryForLocation {
    CLLocation *location = [[CLLocation alloc] initWithLatitude:10.0 longitude:20.0];
    
    NSDictionary *locationDict = [RNRadarUtils dictionaryForLocation:location];
    
    XCTAssertEqual(location.coordinate.latitude, [locationDict[@"latitude"] doubleValue]);
    XCTAssertEqual(location.coordinate.longitude, [locationDict[@"longitude"] doubleValue]);
}

- (void)testPlacesProviderForString {
    RadarPlacesProvider provider = [RNRadarUtils placesProviderForString:@"facebook"];
    XCTAssertEqual(RadarPlacesProviderFacebook, provider);
    
    provider = [RNRadarUtils placesProviderForString:@"none"];
    XCTAssertEqual(RadarPlacesProviderNone, provider);
    
    provider = [RNRadarUtils placesProviderForString:@"invalid provider"];
    XCTAssertEqual(RadarPlacesProviderNone, provider);
}

- (void)testOptionsForDictionary {
    NSDictionary *optionsDict = @{@"sync": @"all", @"offline": @"replayOff", @"invalid": @"ingore me", @"priority":"responsiveness"};
    
    RadarTrackingOptions *options = [RNRadarUtils optionsForDictionary:optionsDict];
    
    XCTAssertEqual(RadarTrackingSyncAll, options.sync);
    XCTAssertEqual(RadarTrackingOfflineReplayOff, options.offline);
    XCTAssertEqual(RadarTrackingPriorityResponsiveness, options.responsiveness);
}

@end
