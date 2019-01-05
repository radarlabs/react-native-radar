//
//  RNRadarTests.m
//  RNRadarTests
//
//  Created by Russell Cullen on 1/4/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <OCMock/OCMock.h>
#import <XCTest/XCTest.h>

#import "RNRadar.h"
#import "RNRadarUtils.h"

@interface RNRadarTests : XCTestCase

@end

@interface RNRadar (Test)

- (void)getPermissionsStatusWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)startTracking:(NSDictionary *)optionsDict;
- (void)acceptEvent:(NSString *)eventId withVerifiedPlaceId:(NSString *)verifiedPlaceId;
- (void)rejectEvent:(NSString *)eventId;
- (void)trackOnceWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;
- (void)updateLocation:(NSDictionary *)locationDict resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

@end

@implementation RNRadarTests {
    id radar;
    id radarUtils;
    
    id module;
}

- (void)setUp {
    [super setUp];
    radar = OCMClassMock([Radar class]);
    OCMStub([radar setDelegate:[OCMArg any]]).andDo(nil);
    radarUtils = OCMClassMock([RNRadarUtils class]);
    
    module = [RNRadar new];
}

- (void)tearDown {
    [radarUtils stopMocking];
    [radar stopMocking];
    [super tearDown];
}

- (void)testSetUserId {
    OCMStub([radar setUserId:[OCMArg any]]).andDo(nil);
    
    NSString* userId = @"someUserId123";
    [module setUserId:userId];
    
    OCMVerify([radar setUserId:userId]);
}

- (void)testSetDescription {
    OCMStub([radar setDescription:[OCMArg any]]).andDo(nil);
    
    NSString* description = @"some random user description";
    [module setDescription:description];
    
    OCMVerify([radar setDescription:description]);
}

- (void)testSetPlacesProvider {
    NSString* providerStr = @"facebook";
    RadarPlacesProvider provider = RadarPlacesProviderFacebook;
    OCMStub([radarUtils placesProviderForString:providerStr]).andReturn(provider);
    OCMStub([radar setPlacesProvider:provider]).andDo(nil);
    
    [module setPlacesProvider:providerStr];
    
    OCMVerify([radar setPlacesProvider:provider]);
}

- (void)testGetPermissionsStatus {
    NSString* permissionSatus = @"Granted";
    OCMStub([[radarUtils ignoringNonObjectArgs] stringForPermissionsStatus:0]).andReturn(permissionSatus);

    id handlerExpectation = [self expectationWithDescription:@"Resolver called"];
    [module getPermissionsStatusWithResolver:^(id result){
        XCTAssertEqual(permissionSatus, result);
        [handlerExpectation fulfill];
    } rejecter:^(NSString* code, NSString* message, NSError* error){}];
    
    [self waitForExpectations:@[handlerExpectation] timeout:0];
}

- (void)testStartTracking {
    NSDictionary* optionsDict = @{};
    RadarTrackingOptions* options = [RadarTrackingOptions new];
    OCMStub([radarUtils optionsForDictionary:optionsDict]).andReturn(options);
    OCMStub([radar startTrackingWithOptions:[OCMArg any]]).andDo(nil);
    
    [module startTracking:optionsDict];
    
    OCMVerify([radar startTrackingWithOptions:options]);
}

- (void)testStopTracking {
    OCMStub([radar stopTracking]).andDo(nil);
    
    [module stopTracking];
    
    OCMVerify([radar stopTracking]);
}

- (void)testTrackOnce {
    RadarStatus status = RadarStatusSuccess;
    NSString* statusStr = @"SUCCESS";
    OCMStub([radarUtils stringForStatus:status]).andReturn(statusStr);
    OCMStub([radar trackOnceWithCompletionHandler:([OCMArg invokeBlockWithArgs:@(status), [NSNull null], [NSNull null], [NSNull null], nil])]);
    
    id handlerExpectation = [self expectationWithDescription:@"Resolver called"];
    [module trackOnceWithResolver:^(id result){
        XCTAssertEqual(statusStr, result[@"status"]);
        [handlerExpectation fulfill];
    } rejecter:^(NSString* code, NSString* message, NSError* error){}];
    
    [self waitForExpectations:@[handlerExpectation] timeout:0];
}

- (void)testTrackOnce_fail {
    RadarStatus status = RadarStatusErrorServer;
    NSString* statusStr = @"ERROR_SERVER";
    OCMStub([radarUtils stringForStatus:status]).andReturn(statusStr);
    OCMStub([radar trackOnceWithCompletionHandler:([OCMArg invokeBlockWithArgs:@(status), [NSNull null], [NSNull null], [NSNull null], nil])]);
    
    id handlerExpectation = [self expectationWithDescription:@"Rejecter called"];
    [module trackOnceWithResolver:^(id result){}
                         rejecter:^(NSString* code, NSString* message, NSError* error){
        XCTAssertEqual(statusStr, code);
        XCTAssertEqual(statusStr, message);
        XCTAssertNil(error);
        [handlerExpectation fulfill];
    }];
    
    [self waitForExpectations:@[handlerExpectation] timeout:0];
}

- (void)testUpdateLocation {
    RadarStatus status = RadarStatusSuccess;
    NSString* statusStr = @"SUCCESS";
    NSDictionary* locationDict = @{@"latitude" : @10.0, @"longitude" : @20.0, @"accuracy" : @10.0};
    OCMStub([radarUtils stringForStatus:status]).andReturn(statusStr);
    OCMStub([radar updateLocation:[OCMArg any] withCompletionHandler:([OCMArg invokeBlockWithArgs:@(status), [NSNull null], [NSNull null], [NSNull null], nil])]);
    
    id handlerExpectation = [self expectationWithDescription:@"Resolver called"];
    [module updateLocation:(NSDictionary *)locationDict resolve:^(id result){
        XCTAssertEqual(statusStr, result[@"status"]);
        [handlerExpectation fulfill];
    } rejecter:^(NSString* code, NSString* message, NSError* error){}];
    
    [self waitForExpectations:@[handlerExpectation] timeout:0];
    OCMVerify([radar updateLocation:[OCMArg checkWithBlock:^BOOL(id arg) {
        CLLocation *location = (CLLocation *)arg;
        XCTAssertEqual([locationDict[@"latitude"] doubleValue], location.coordinate.latitude);
        XCTAssertEqual([locationDict[@"longitude"] doubleValue], location.coordinate.longitude);
        XCTAssertEqual([locationDict[@"accuracy"] doubleValue], location.horizontalAccuracy);
        return YES;
    }] withCompletionHandler:[OCMArg any]]);
}

- (void)testAcceptEvent {
    NSString* eventId = @"eventId";
    NSString* verifiedId = @"verifiedId";
    OCMStub([radar acceptEventId:[OCMArg any] withVerifiedPlaceId:[OCMArg any]]).andDo(nil);
    
    [module acceptEvent:eventId withVerifiedPlaceId:verifiedId];
    
    OCMVerify([radar acceptEventId:eventId withVerifiedPlaceId:verifiedId]);
}

- (void)testRejectEvent {
    NSString* eventId = @"eventId";
    OCMStub([radar rejectEventId:[OCMArg any]]).andDo(nil);
    
    [module rejectEvent:eventId];
    
    OCMVerify([radar rejectEventId:eventId]);
}

@end
