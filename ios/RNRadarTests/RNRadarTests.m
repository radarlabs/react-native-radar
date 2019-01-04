//
//  RNRadarTests.m
//  RNRadarTests
//
//  Created by Russell Cullen on 1/4/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <OCMock/OCMock.h>
#import <XCTest/XCTest.h>

#import "RNRadarUtils.h"

@interface RNRadarTests : XCTestCase
    
@end

@implementation RNRadarTests

- (void)testStringForPermissionsStatus {
    NSString* granted = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusAuthorizedAlways];
    XCTAssertEqual(@"GRANTED", granted);
    
    granted = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusAuthorizedWhenInUse];
    XCTAssertEqual(@"GRANTED", granted);
    
    NSString* denied = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusDenied];
    XCTAssertEqual(@"DENIED", denied);
    
    denied = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusRestricted];
    XCTAssertEqual(@"DENIED", denied);
    
    NSString* unknown = [RNRadarUtils stringForPermissionsStatus:kCLAuthorizationStatusNotDetermined];
    XCTAssertEqual(@"UNKNOWN", unknown);
}


@end
