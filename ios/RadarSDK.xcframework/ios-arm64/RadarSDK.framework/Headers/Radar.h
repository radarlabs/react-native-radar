//
//  Radar.h
//  RadarSDK
//
//  Copyright © 2019 Radar Labs, Inc. All rights reserved.
//

#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>

#import "RadarAddress.h"
#import "RadarContext.h"
#import "RadarEvent.h"
#import "RadarRegion.h"
#import "RadarRouteMatrix.h"
#import "RadarRouteMode.h"
#import "RadarRoutes.h"
#import "RadarTrackingOptions.h"
#import "RadarVerifiedLocationToken.h"
#import "RadarUser.h"
#import "RadarInitializeOptions.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RadarDelegate;
@protocol RadarVerifiedDelegate;
@protocol RadarMotionProtocol;
@protocol RadarInAppMessageProtocol;
@protocol RadarIndoorsProtocol;

@class RadarTripOptions;
@class RadarInAppMessage;

#pragma mark - Enums

/**
 The status types for a request.

 @see https://radar.com/documentation/sdk/ios#foreground-tracking
 */
typedef NS_ENUM(NSInteger, RadarStatus) {
    /// Success
    RadarStatusSuccess,
    /// SDK not initialized
    RadarStatusErrorPublishableKey,
    /// Location permissions not granted
    RadarStatusErrorPermissions,
    /// Location services error or timeout (20 seconds)
    RadarStatusErrorLocation,
    /// Beacon ranging error or timeout (5 seconds)
    RadarStatusErrorBluetooth,
    /// Network error or timeout (10 seconds)
    RadarStatusErrorNetwork,
    /// Bad request (missing or invalid params)
    RadarStatusErrorBadRequest,
    /// Unauthorized (invalid API key)
    RadarStatusErrorUnauthorized,
    /// Payment required (organization disabled or usage exceeded)
    RadarStatusErrorPaymentRequired,
    /// Forbidden (insufficient permissions or no beta access)
    RadarStatusErrorForbidden,
    /// Not found
    RadarStatusErrorNotFound,
    /// Too many requests (rate limit exceeded)
    RadarStatusErrorRateLimit,
    /// Internal server error
    RadarStatusErrorServer,
    /// Unknown error
    RadarStatusErrorUnknown
};

/**
 The sources for location updates.
 */
typedef NS_ENUM(NSInteger, RadarLocationSource) {
    /// Foreground
    RadarLocationSourceForegroundLocation,
    /// Background
    RadarLocationSourceBackgroundLocation,
    /// Manual
    RadarLocationSourceManualLocation,
    /// Visit arrival
    RadarLocationSourceVisitArrival,
    /// Visit departure
    RadarLocationSourceVisitDeparture,
    /// Geofence enter
    RadarLocationSourceGeofenceEnter,
    /// Geofence exit
    RadarLocationSourceGeofenceExit,
    /// Mock
    RadarLocationSourceMockLocation,
    /// Beacon enter
    RadarLocationSourceBeaconEnter,
    /// Beacon exit
    RadarLocationSourceBeaconExit,
    /// Unknown
    RadarLocationSourceUnknown
};

/**
 The levels for debug logs.
 */
typedef NS_ENUM(NSInteger, RadarLogLevel) {
    /// None
    RadarLogLevelNone = 0,
    /// Error
    RadarLogLevelError = 1,
    /// Warning
    RadarLogLevelWarning = 2,
    /// Info
    RadarLogLevelInfo = 3,
    /// Debug
    RadarLogLevelDebug = 4
};

/**
 The classification type for debug logs.
 */
typedef NS_ENUM(NSInteger, RadarLogType) {
    /// None
    RadarLogTypeNone = 0,
    /// SDK Call
    RadarLogTypeSDKCall = 1,
    /// SDK Error
    RadarLogTypeSDKError = 2,
    /// SDK Exception
    RadarLogTypeSDKException = 3,
    /// App Lifecycle Event
    RadarLogTypeAppLifecycleEvent = 4,
    /// Permission Event
    RadarLogTypePermissionEvent = 5,
};

/**
 The distance units for routes.

 @see https://radar.com/documentation/api#routing
 */
typedef NS_ENUM(NSInteger, RadarRouteUnits) {
    /// Imperial (feet)
    RadarRouteUnitsImperial NS_SWIFT_NAME(imperial),
    /// Metric (meters)
    RadarRouteUnitsMetric NS_SWIFT_NAME(metric)
};

/**
Verification status enum for RadarAddress with values 'V', 'P', 'A', 'R', and 'U'

@see https://radar.com/documentation/api#address-verification
*/
typedef NS_ENUM(NSInteger, RadarAddressVerificationStatus) {
    /// Unknown
    RadarAddressVerificationStatusNone NS_SWIFT_NAME(none) = 0,
    /// Verified: complete match was made between the input data and a single record from the available reference data
    RadarAddressVerificationStatusVerified NS_SWIFT_NAME(verified) = 1,
    /// Partially verified: a partial match was made between the input data and a single record from the available reference data
    RadarAddressVerificationStatusPartiallyVerified NS_SWIFT_NAME(partiallyVerified) = 2,
    /// Ambiguous: more than one close reference data match
    RadarAddressVerificationStatusAmbiguous NS_SWIFT_NAME(ambiguous) = 3,
    /// Unverified: unable to verify. The output fields will contain the input data
    RadarAddressVerificationStatusUnverified NS_SWIFT_NAME(unverified) = 4
};

 typedef NS_ENUM(NSInteger, RadarActivityType) {
     /// Unknown
     RadarActivityTypeUnknown NS_SWIFT_NAME(unknown) = 0,
     /// Stationary
     RadarActivityTypeStationary NS_SWIFT_NAME(stationary) = 1,
     /// Walking
     RadarActivityTypeFoot NS_SWIFT_NAME(foot) = 2,
     /// Running
     RadarActivityTypeRun NS_SWIFT_NAME(run) = 3,
     /// Biking
     RadarActivityTypeBike NS_SWIFT_NAME(bike) = 4,
     /// Driving
     RadarActivityTypeCar NS_SWIFT_NAME(car) = 5,
 };

#pragma mark - Callbacks

/**
 Called when a location request succeeds, fails, or times out.

 Receives the request status and, if successful, the location.

 @see https://radar.com/documentation/sdk/ios#get-location
 */
typedef void (^_Nullable RadarLocationCompletionHandler)(RadarStatus status, CLLocation *_Nullable location, BOOL stopped);

/**
 Called when a beacon ranging request succeeds, fails, or times out.

 Receives the request status and, if successful, the nearby beacons.

 @see https://radar.com/documentation/beacons
 */
typedef void (^_Nullable RadarBeaconCompletionHandler)(RadarStatus status, NSArray<RadarBeacon *> *_Nullable beacons);

/**
 Called when a track request succeeds, fails, or times out.

 Receives the request status and, if successful, the user's location, an array of the events generated, and the user.

 @see https://radar.com/documentation/sdk/ios
 */
typedef void (^_Nullable RadarTrackCompletionHandler)(RadarStatus status, CLLocation *_Nullable location, NSArray<RadarEvent *> *_Nullable events, RadarUser *_Nullable user);

typedef void (^_Nullable RadarFlushReplaysCompletionHandler)(RadarStatus status, NSDictionary *_Nullable res);

/**
 Called when a track verified request succeeds, fails, or times out.

 Receives the request status and, if successful, the user's verified location. Verify the token server-side using your secret key.

 @see https://radar.com/documentation/sdk/fraud
 */
typedef void (^_Nullable RadarTrackVerifiedCompletionHandler)(RadarStatus status, RadarVerifiedLocationToken *_Nullable token);

/**
 Called when a trip update succeeds, fails, or times out.

 Receives the request status and, if successful, the trip and an array of the events generated.

 @see https://radar.com/documentation/sdk/ios
 */
typedef void (^_Nullable RadarTripCompletionHandler)(RadarStatus status, RadarTrip *_Nullable trip, NSArray<RadarEvent *> *_Nullable events);

/**
 Called when a context request succeeds, fails, or times out.

 Receives the request status and, if successful, the location and the context.

 @see https://radar.com/documentation/api#context
 */
typedef void (^_Nonnull RadarContextCompletionHandler)(RadarStatus status, CLLocation *_Nullable location, RadarContext *_Nullable context);

/**
 Called when a place search request succeeds, fails, or times out.

 Receives the request status and, if successful, the location and an array of places sorted by distance.

 @see https://radar.com/documentation/api#search-places
 */
typedef void (^_Nonnull RadarSearchPlacesCompletionHandler)(RadarStatus status, CLLocation *_Nullable location, NSArray<RadarPlace *> *_Nullable places);

/**
 Called when a geofence search request succeeds, fails, or times out.

 Receives the request status and, if successful, the location and an array of geofences sorted by distance.

 @see https://radar.com/documentation/api#search-geofences
 */
typedef void (^_Nonnull RadarSearchGeofencesCompletionHandler)(RadarStatus status, CLLocation *_Nullable location, NSArray<RadarGeofence *> *_Nullable geofences);

/**
 Called when a geocoding request succeeds, fails, or times out.

 Receives the request status and, if successful, the geocoding results (an array of addresses).

 @see https://radar.com/documentation/api#forward-geocode
 */
typedef void (^_Nonnull RadarGeocodeCompletionHandler)(RadarStatus status, NSArray<RadarAddress *> *_Nullable addresses);

/**
 Called when an IP geocoding request succeeds, fails, or times out.

 Receives the request status and, if successful, the geocoding result (a partial address) and a boolean indicating whether the IP address is a known proxy.

 @see https://radar.com/documentation/api#ip-geocode
 */
typedef void (^_Nonnull RadarIPGeocodeCompletionHandler)(RadarStatus status, RadarAddress *_Nullable address, BOOL proxy);

/**
 Called when an address validation request succeeds, fails, or times out.

 Receives the request status and, if successful, the address and a verification status.

 @see https://radar.com/documentation/api#validate-an-address
*/
typedef void (^_Nonnull RadarValidateAddressCompletionHandler)(RadarStatus status, RadarAddress *_Nullable address, RadarAddressVerificationStatus verificationStatus);

/**
 Called when a distance request succeeds, fails, or times out.

 Receives the request status and, if successful, the routes.

 @see https://radar.com/documentation/api#distance
 */
typedef void (^_Nonnull RadarRouteCompletionHandler)(RadarStatus status, RadarRoutes *_Nullable routes);

/**
 Called when a matrix request succeeds, fails, or times out.

 Receives the request status and, if successful, the matrix.

 @see https://radar.com/documentation/api#matrix
 */
typedef void (^_Nonnull RadarRouteMatrixCompletionHandler)(RadarStatus status, RadarRouteMatrix *_Nullable matrix);

/**
 Called when a request to log a conversion succeeds, fails, or times out.

 Receives the request status and, if successful, the conversion event generated.

 @see https://radar.com/documentation/api#send-a-custom-event
 */
typedef void (^_Nullable RadarLogConversionCompletionHandler)(RadarStatus status, RadarEvent *_Nullable event);

typedef void (^_Nonnull RadarIndoorsScanCompletionHandler)(NSString *_Nullable result, CLLocation *_Nullable locationAtStartOfScan);

/**
 The main class used to interact with the Radar SDK.

 @see https://radar.com/documentation/sdk
 */
@interface Radar : NSObject

#pragma mark - Initialization

@property (readonly, class) BOOL isInitialized;

/**
 Initializes the Radar SDK.

 @warning Call this method from the main thread in your `AppDelegate` class before calling any other Radar methods.

 @param publishableKey Your publishable API key.

 @see https://radar.com/documentation/sdk/ios#initialize-sdk
 */
+ (void)initializeWithPublishableKey:(NSString *_Nonnull)publishableKey NS_SWIFT_NAME(initialize(publishableKey:));

/**
 Initializes the Radar SDK.

 @warning Call this method from the main thread in your `AppDelegate` class before calling any other Radar methods.

 @param publishableKey Your publishable API key.
 @param options Radar SDK initialization options.

 @see https://radar.com/documentation/sdk/ios#initialize-sdk
 */

+ (void)initializeWithPublishableKey:(NSString *_Nonnull)publishableKey options:(RadarInitializeOptions *_Nullable)options NS_SWIFT_NAME(initialize(publishableKey:options:));

+ (void)initializeWithAppGroup:(NSString *_Nonnull)appGroup;

#pragma mark - Properties

/**
 Gets the version number of the Radar SDK, such as "3.5.1" or "3.5.1-beta.2".
 */
@property (readonly, class) NSString *sdkVersion;

/**
 Identifies the user.

 @note Until you identify the user, Radar will automatically identify the user by `deviceId` (IDFV).

 @param userId A stable unique ID for the user. If `nil`, the previous `userId` will be cleared.

 @see https://radar.com/documentation/sdk/ios#identify-user
 */
+ (void)setUserId:(NSString *_Nullable)userId;

/**
 Returns the current `userId`.

 @return The current `userId`.

 @see https://radar.com/documentation/sdk/ios#identify-user
 */
+ (NSString *_Nullable)getUserId;

/**
 Sets an optional description for the user, displayed in the dashboard.

 @param description A description for the user. If `nil`, the previous `description` will be cleared.

 @see https://radar.com/documentation/sdk/ios#identify-user
 */
+ (void)setDescription:(NSString *_Nullable)description;

/**
 Returns the current `description`.

 @return The current `description`.

 @see https://radar.com/documentation/sdk/ios#identify-user
 */
+ (NSString *_Nullable)getDescription;

/**
 Sets an optional set of custom key-value pairs for the user.

 @param metadata A set of custom key-value pairs for the user. Must have 16 or fewer keys and values of type string, boolean, or number. If `nil`, the previous
 `metadata` will be cleared.

 @see https://radar.com/documentation/sdk/ios#identify-user
 */
+ (void)setMetadata:(NSDictionary *_Nullable)metadata;

/**
 Returns the current `metadata`.

 @return The current `metadata`.

 @see https://radar.com/documentation/sdk/ios#identify-user
 */
+ (NSDictionary *_Nullable)getMetadata;

/**
 Returns the current `tags`.

 @return The current `tags`.
 */
+ (NSArray<NSString *> *_Nullable)getTags;

/**
 Sets tags, replacing any existing tags.

 @param tags An array of tags. If `nil`, all tags will be cleared.
 */
+ (void)setTags:(NSArray<NSString *> *_Nullable)tags;

/**
 Adds tags to the existing set.

 @param tags An array of tags to add.
 */
+ (void)addTags:(NSArray<NSString *> *_Nonnull)tags;

/**
 Removes tags from the existing set.

 @param tags An array of tags to remove.
 */
+ (void)removeTags:(NSArray<NSString *> *_Nonnull)tags;

/**
 Sets an optional product name, displayed in the dashboard and reports.

 @param product A product name. If `nil`, the previous `product` will be cleared.
 */
+ (void)setProduct:(NSString *_Nullable)product;

/**
 Returns the current `product`.

 @return The current `product`.
 */
+ (NSString *_Nullable)getProduct;

/**
 Enables anonymous tracking for privacy reasons. Avoids creating user records on the server and avoids sending any stable device IDs, user IDs, and user metadata
 to the server when calling `trackOnce()` or `startTracking()`. Disabled by default.

 @param enabled A boolean indicating whether anonymous tracking should be enabled.
 */
+ (void)setAnonymousTrackingEnabled:(BOOL)enabled;

#pragma mark - Location

/**
 Gets the device's current location.

 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/sdk/ios#get-location
 */
+ (void)getLocationWithCompletionHandler:(RadarLocationCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(getLocation(completionHandler:));

/**
 Gets the device's current location with the desired accuracy.

 @param desiredAccuracy The desired accuracy.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/sdk/ios#get-location
 */
+ (void)getLocationWithDesiredAccuracy:(RadarTrackingOptionsDesiredAccuracy)desiredAccuracy
                     completionHandler:(RadarLocationCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(getLocation(desiredAccuracy:completionHandler:));

#pragma mark - Tracking

/**
 Tracks the user's location once in the foreground.

 @warning Note that these calls are subject to rate limits.

 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/sdk/ios#foreground-tracking
 */
+ (void)trackOnceWithCompletionHandler:(RadarTrackCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(trackOnce(completionHandler:));

/**
 Tracks the user's location once with the desired accuracy and optionally ranges beacons in the foreground.

 @warning Note that these calls are subject to rate limits.

 @param desiredAccuracy The desired accuracy.
 @param beacons A boolean indicating whether to range beacons.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/sdk/ios#foreground-tracking
 */
+ (void)trackOnceWithDesiredAccuracy:(RadarTrackingOptionsDesiredAccuracy)desiredAccuracy
                             beacons:(BOOL)beacons
                   completionHandler:(RadarTrackCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(trackOnce(desiredAccuracy:beacons:completionHandler:));

/**
 Manually updates the user's location.

 @warning Note that these calls are subject to rate limits.

 @param location A location for the user.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/sdk/ios#foreground-tracking
 */
+ (void)trackOnceWithLocation:(CLLocation *_Nonnull)location
            completionHandler:(RadarTrackCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(trackOnce(location:completionHandler:));

/**
 Tracks the user's location with device integrity information for location verification use cases.

 @warning Note that you must configure SSL pinning before calling this method.

 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/fraud
 */
+ (void)trackVerifiedWithCompletionHandler:(RadarTrackVerifiedCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(trackVerified(completionHandler:));

/**
 Tracks the user's location with device integrity information for location verification use cases.

 @warning Note that you must configure SSL pinning before calling this method.

 @param beacons A boolean indicating whether to range beacons.
 @param desiredAccuracy The desired accuracy.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/fraud
 */
+ (void)trackVerifiedWithBeacons:(BOOL)beacons desiredAccuracy:(RadarTrackingOptionsDesiredAccuracy)desiredAccuracy completionHandler:(RadarTrackVerifiedCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(trackVerified(beacons:desiredAccuracy:completionHandler:));

/**
 Tracks the user's location with device integrity information for location verification use cases.

 @warning Note that you must configure SSL pinning before calling this method.

 @param beacons A boolean indicating whether to range beacons.
 @param desiredAccuracy The desired accuracy.
 @param reason An optional reason, displayed in the dashboard and reports.
 @param transactionId An optional transaction ID, displayed in the dashboard and reports.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/fraud
 */
+ (void)trackVerifiedWithBeacons:(BOOL)beacons desiredAccuracy:(RadarTrackingOptionsDesiredAccuracy)desiredAccuracy reason:(NSString *_Nullable)reason transactionId:(NSString *_Nullable)transactionId completionHandler:(RadarTrackVerifiedCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(trackVerified(beacons:desiredAccuracy:reason:transactionId:completionHandler:));

/**
 Starts tracking the user's location with device integrity information for location verification use cases.
 
 @param interval The default interval in seconds between each location update.
 @param beacons A boolean indicating whether to range beacons.

 @warning Note that you must configure SSL pinning before calling this method.
 
 @see https://radar.com/documentation/fraud
 */
+ (void)startTrackingVerifiedWithInterval:(NSTimeInterval)interval beacons:(BOOL)beacons NS_SWIFT_NAME(startTrackingVerified(interval:beacons:));

/**
 Stops tracking the user's location with device integrity information for location verification use cases.
 
 @see https://radar.com/documentation/fraud
 */
+ (void)stopTrackingVerified NS_SWIFT_NAME(stopTrackingVerified());

/**
 Returns a boolean indicating whether verified tracking has been started.

 @return A boolean indicating whether verified tracking has been started.

 @see https://radar.com/documentation/sdk/fraud
 */
+ (BOOL)isTrackingVerified;

/**
 Returns the user's last verified location token if still valid, or requests a fresh token if not.

 @warning Note that you must configure SSL pinning before calling this method.

 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/fraud
 */
+ (void)getVerifiedLocationToken:(RadarTrackVerifiedCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(getVerifiedLocationToken(completionHandler:));

/**
 Returns the user's last verified location token if still valid, or requests a fresh token if not.

 @warning Note that you must configure SSL pinning before calling this method.
 
 @param beacons A boolean indicating whether to range beacons.
 @param desiredAccuracy The desired accuracy.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/fraud
 */
+ (void)getVerifiedLocationTokenWithBeacons:(BOOL)beacons desiredAccuracy:(RadarTrackingOptionsDesiredAccuracy)desiredAccuracy completionHandler:(RadarTrackVerifiedCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(getVerifiedLocationToken(beacons:desiredAccuracy:completionHandler:));

/**
 Clears the user's last verified location token.

 @see https://radar.com/documentation/fraud
 */
+ (void)clearVerifiedLocationToken;

/**
 Optionally sets the user's expected country and state for jurisdiction checks.
 
 @param countryCode The user's expected two-letter country code.
 @param stateCode The user's expected two-letter state code.
 */
+ (void)setExpectedJurisdictionWithCountryCode:(NSString *_Nullable)countryCode stateCode:(NSString *_Nullable)stateCode NS_SWIFT_NAME(setExpectedJurisdiction(countryCode:stateCode:));

/**
 Starts tracking the user's location in the background with configurable tracking options.

 @param options Configurable tracking options.

 @see https://radar.com/documentation/sdk/ios#background-tracking-for-geofencing
 */
+ (void)startTrackingWithOptions:(RadarTrackingOptions *)options NS_SWIFT_NAME(startTracking(trackingOptions:));

/**
 Mocks tracking the user's location from an origin to a destination.

 @param origin The origin.
 @param destination The destination.
 @param mode The travel mode.
 @param steps The number of mock location updates.
 @param interval The interval in seconds between each mock location update. A number between 1 and 60.

 @see https://radar.com/documentation/sdk/ios#mock-tracking-for-testing
 */
+ (void)mockTrackingWithOrigin:(CLLocation *_Nonnull)origin
                   destination:(CLLocation *_Nonnull)destination
                          mode:(RadarRouteMode)mode
                         steps:(int)steps
                      interval:(NSTimeInterval)interval
             completionHandler:(RadarTrackCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(mockTracking(origin:destination:mode:steps:interval:completionHandler:));

/**
 Stops tracking the user's location in the background.

 @see https://radar.com/documentation/sdk/ios#background-tracking-for-geofencing
 */
+ (void)stopTracking;

/**
 Returns a boolean indicating whether tracking has been started.

 @return A boolean indicating whether tracking has been started.

 @see https://radar.com/documentation/sdk/ios#background-tracking-for-geofencing
 */
+ (BOOL)isTracking;

/**
 Returns the current tracking options.

 @return The current tracking options.

 @see https://radar.com/documentation/sdk/tracking
 */
+ (RadarTrackingOptions *)getTrackingOptions;


/**
 Returns a boolean indicating whether local tracking options are being overridden by remote tracking options.

 @return A boolean indicating whether local tracking options are being overridden by remote tracking options.

 */
+ (BOOL)isUsingRemoteTrackingOptions;

#pragma mark - Delegate

/**
 Sets a delegate for client-side delivery of events, location updates, and debug logs.

 @param delegate A delegate for client-side delivery of events, location updates, and debug logs. If `nil`, the previous delegate will be cleared.

 @see https://radar.com/documentation/sdk/ios#listening-for-events-with-a-delegate
 */
+ (void)setDelegate:(nullable id<RadarDelegate>)delegate;

/**
 Sets a delegate for client-side delivery of verified location tokens.

 @param verifiedDelegate A delegate for client-side delivery of verified location tokens. If `nil`, the previous delegate will be cleared.

 @see https://radar.com/documentation/fraud
 */
+ (void)setVerifiedDelegate:(nullable id<RadarVerifiedDelegate>)verifiedDelegate;

#pragma mark - Events

/**
 Accepts an event. Events can be accepted after user check-ins or other forms of verification. Event verifications will be used to improve the accuracy and
 confidence level of future events.

 @param eventId The ID of the event to accept.
 @param verifiedPlaceId For place entry events, the ID of the verified place. May be `nil`.

 @see https://radar.com/documentation/places#verify-events
 */
+ (void)acceptEventId:(NSString *_Nonnull)eventId verifiedPlaceId:(NSString *_Nullable)verifiedPlaceId NS_SWIFT_NAME(acceptEventId(_:verifiedPlaceId:));

/**
 Rejects an event. Events can be accepted after user check-ins or other forms of verification. Event verifications will be used to improve the accuracy and
 confidence level of future events.

 @param eventId The ID of the event to reject.

 @see https://radar.com/documentation/places#verify-events
 */
+ (void)rejectEventId:(NSString *_Nonnull)eventId NS_SWIFT_NAME(rejectEventId(_:));

/**
 Logs a conversion.

 @param name The name of the conversion.
 @param metadata The metadata associated with the conversion.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#send-a-custom-event
 */
+ (void)logConversionWithName:(NSString *)name
                     metadata:(NSDictionary *_Nullable)metadata
            completionHandler:(RadarLogConversionCompletionHandler)completionHandler NS_SWIFT_NAME(logConversion(name:metadata:completionHandler:));

/**
 Logs a conversion with revenue.

 @param name The name of the conversion.
 @param revenue The revenue generated by the conversion.
 @param metadata The metadata associated with the conversion.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#send-a-custom-event
 */
+ (void)logConversionWithName:(NSString *)name
                      revenue:(NSNumber *)revenue
                     metadata:(NSDictionary *_Nullable)metadata
            completionHandler:(RadarLogConversionCompletionHandler)completionHandler NS_SWIFT_NAME(logConversion(name:revenue:metadata:completionHandler:));

/**
 Logs a conversion with a notification.
 @param request The request associated with the notification

 @see https://radar.com/documentation/api#send-a-custom-event
 */
+ (void)logConversionWithNotification:(UNNotificationRequest *_Nullable)request NS_SWIFT_NAME(logConversion(request:));

/**
 Logs a conversion with a notification. This should only be used to manually setup logging of notification conversions.
 @param response The response associated with user interaction with the notification. 

 @see https://radar.com/documentation/api#send-a-custom-event
 */

+ (void)logConversionWithNotificationResponse:(UNNotificationResponse *)response NS_SWIFT_NAME(logConversion(response:));

#pragma mark - Trips

/**
 Returns the current trip options.

 @return The current trip options.

 @see https://radar.com/documentation/trip-tracking
 */
+ (RadarTripOptions *_Nullable)getTripOptions;

/**
 Starts a trip.

 @param options Configurable trip options.

 @see https://radar.com/documentation/trip-tracking
 */
+ (void)startTripWithOptions:(RadarTripOptions *_Nonnull)options NS_SWIFT_NAME(startTrip(options:));

/**
 Starts a trip.

 @param options Configurable trip options.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/trip-tracking
 */
+ (void)startTripWithOptions:(RadarTripOptions *_Nonnull)options
           completionHandler:(RadarTripCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(startTrip(options:completionHandler:));

/**
 Starts a trip.

 @param tripOptions Configurable trip options.
 @param trackingOptions Tracking options to use during the trip.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/trip-tracking
 */
+ (void)startTripWithOptions:(RadarTripOptions *_Nonnull)tripOptions
             trackingOptions:(RadarTrackingOptions *_Nullable)trackingOptions
           completionHandler:(RadarTripCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(startTrip(options:trackingOptions:completionHandler:));

/**
 Manually updates a trip.

 @param options Configurable trip options.
 @param status The trip status. To avoid updating status, pass RadarTripStatusUnknown.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/trip-tracking
 */
+ (void)updateTripWithOptions:(RadarTripOptions *_Nonnull)options
                       status:(RadarTripStatus)status
            completionHandler:(RadarTripCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(updateTrip(options:status:completionHandler:));

/**
 Completes a trip.

 @see https://radar.com/documentation/trip-tracking
 */
+ (void)completeTrip;

/**
 Completes a trip.

 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/trip-tracking
 */
+ (void)completeTripWithCompletionHandler:(RadarTripCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(completeTrip(completionHandler:));

/**
 Cancels a trip.

 @see https://radar.com/documentation/trip-tracking
 */
+ (void)cancelTrip;

/**
 Cancels a trip.

 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/trip-tracking
 */
+ (void)cancelTripWithCompletionHandler:(RadarTripCompletionHandler _Nullable)completionHandler NS_SWIFT_NAME(cancelTrip(completionHandler:));

#pragma mark - Context

/**
 Gets the device's current location, then gets context for that location without sending device or user identifiers to the server.

 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/api#search-geofences
 */
+ (void)getContextWithCompletionHandler:(RadarContextCompletionHandler _Nonnull)completionHandler NS_SWIFT_NAME(getContext(completionHandler:));

/**
 Gets context for a location without sending device or user identifiers to the server.

 @param location The location.
 @param completionHandler An optional completion handler.

 @see https://radar.com/documentation/api#context
 */
+ (void)getContextForLocation:(CLLocation *_Nonnull)location
            completionHandler:(RadarContextCompletionHandler _Nonnull)completionHandler NS_SWIFT_NAME(getContext(location:completionHandler:));

#pragma mark - Search

/**
 Gets the device's current location, then searches for places near that location, sorted by distance.

 @warning You may specify only one of chains, categories, or groups.

 @param radius The radius to search, in meters. A number between 100 and 10000.
 @param chains An array of chain slugs to filter. See https://radar.com/documentation/places/chains
 @param categories An array of categories to filter. See https://radar.com/documentation/places/categories
 @param groups An array of groups to filter. See https://radar.com/documentation/places/groups
 @param limit The max number of places to return. A number between 1 and 100.
 @param countryCodes An array of country codes to filter. See https://radar.com/documentation/regions/countries
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#search-places
 */
+ (void)searchPlacesWithRadius:(int)radius
                        chains:(NSArray<NSString *> *_Nullable)chains
                    categories:(NSArray<NSString *> *_Nullable)categories
                        groups:(NSArray<NSString *> *_Nullable)groups
                 countryCodes:(NSArray<NSString *> *_Nullable)countryCodes
                         limit:(int)limit
             completionHandler:(RadarSearchPlacesCompletionHandler)completionHandler NS_SWIFT_NAME(searchPlaces(radius:chains:categories:groups:countryCodes:limit:completionHandler:));

/**
 Gets the device's current location, then searches for places near that location, sorted by distance.

 @warning You may specify only one of chains, categories, or groups; if chains are specified, `chainMetadata` can also be specified.

 @param radius The radius to search, in meters. A number between 100 and 10000.
 @param chains An array of chain slugs to filter. See https://radar.com/documentation/places/chains
 @param chainMetadata Optional chain metadata filters. Keys and values must be strings. See https://radar.com/documentation/places#metadata.
 @param categories An array of categories to filter. See https://radar.com/documentation/places/categories
 @param groups An array of groups to filter. See https://radar.com/documentation/places/groups
 @param countryCodes An array of country codes to filter. See https://radar.com/documentation/regions/countries
 @param limit The max number of places to return. A number between 1 and 100.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#search-places
 */
+ (void)searchPlacesWithRadius:(int)radius
                        chains:(NSArray<NSString *> *_Nullable)chains
                 chainMetadata:(NSDictionary<NSString *, NSString *> *_Nullable)chainMetadata
                    categories:(NSArray<NSString *> *_Nullable)categories
                        groups:(NSArray<NSString *> *_Nullable)groups
                  countryCodes:(NSArray<NSString *> *_Nullable)countryCodes
                         limit:(int)limit
             completionHandler:(RadarSearchPlacesCompletionHandler)completionHandler NS_SWIFT_NAME(searchPlaces(radius:chains:chainMetadata:categories:groups:countryCodes:limit:completionHandler:));

/**
 Searches for places near a location, sorted by distance.

 @warning You may specify only one of chains, categories, or groups.

 @param near The location to search.
 @param radius The radius to search, in meters. A number between 100 and 10000.
 @param chains An array of chain slugs to filter. See https://radar.com/documentation/places/chains
 @param categories An array of categories to filter. See https://radar.com/documentation/places/categories
 @param groups An array of groups to filter. See https://radar.com/documentation/places/groups
 @param countryCodes An array of country codes to filter. See https://radar.com/documentation/regions/countries
 @param limit The max number of places to return. A number between 1 and 100.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#search-places
 */
+ (void)searchPlacesNear:(CLLocation *)near
                  radius:(int)radius
                  chains:(NSArray<NSString *> *_Nullable)chains
              categories:(NSArray<NSString *> *_Nullable)categories
                  groups:(NSArray<NSString *> *_Nullable)groups
             countryCodes:(NSArray<NSString *> *_Nullable)countryCodes
                   limit:(int)limit
       completionHandler:(RadarSearchPlacesCompletionHandler)completionHandler NS_SWIFT_NAME(searchPlaces(near:radius:chains:categories:groups:countryCodes:limit:completionHandler:));

/**
 Searches for places near a location, sorted by distance.

 @warning You may specify only one of chains, categories, or groups.

 @param near The location to search.
 @param radius The radius to search, in meters. A number between 100 and 10000.
 @param chains An array of chain slugs to filter. See https://radar.com/documentation/places/chains
 @param chainMetadata Optional chain metadata filters. Keys and values must be strings. See https://radar.com/documentation/places#metadata.
 @param categories An array of categories to filter. See https://radar.com/documentation/places/categories
 @param groups An array of groups to filter. See https://radar.com/documentation/places/groups
 @param countryCodes An array of country codes to filter. See https://radar.com/documentation/regions/countries
 @param limit The max number of places to return. A number between 1 and 100.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#search-places
 */
+ (void)searchPlacesNear:(CLLocation *)near
                  radius:(int)radius
                  chains:(NSArray<NSString *> *_Nullable)chains
           chainMetadata:(NSDictionary<NSString *, NSString *> *_Nullable)chainMetadata
              categories:(NSArray<NSString *> *_Nullable)categories
                  groups:(NSArray<NSString *> *_Nullable)groups
            countryCodes:(NSArray<NSString *> *_Nullable)countryCodes
                   limit:(int)limit
       completionHandler:(RadarSearchPlacesCompletionHandler)completionHandler NS_SWIFT_NAME(searchPlaces(near:radius:chains:chainMetadata:categories:groups:countryCodes:limit:completionHandler:));

/**
 Gets the device's current location, then searches for geofences near that location, sorted by distance.
 
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#search-geofences
 */
+ (void)searchGeofences:(RadarSearchGeofencesCompletionHandler)completionHandler NS_SWIFT_NAME(searchGeofences(completionHandler:));

/**
 Searches for geofences near a location, sorted by distance.

 @param near The location to search. Use null to search near the device's current location.
 @param radius The radius to search, in meters. A number between 100 and 10000. If -1 is entered, the server defaults to using unlimited radius.
 @param tags An array of tags to filter. See https://radar.com/documentation/geofences
 @param metadata A dictionary of metadata to filter. See https://radar.com/documentation/geofences
 @param limit The max number of geofences to return. A number between 1 and 1000. Defaults to 100.
 @param includeGeometry Include geofence geometries in the response. Recommended to be set to false in less you specifically need the geometries. To retrieve more than 100 results, `includeGeometry` must be set to `false`.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#search-geofences
 */
 + (void)searchGeofencesNear:(CLLocation *_Nullable)near
                      radius:(int)radius
                        tags:(NSArray<NSString *> *_Nullable)tags
                    metadata:(NSDictionary *_Nullable)metadata
                       limit:(int)limit
             includeGeometry:(BOOL)includeGeometry
           completionHandler:(RadarSearchGeofencesCompletionHandler)completionHandler NS_SWIFT_NAME(searchGeofences(near:radius:tags:metadata:limit:includeGeometry:completionHandler:));

/**
 @deprecated Autocompletes partial addresses and place names, sorted by relevance.

 @param query The partial address or place name to autocomplete.
 @param near A location for the search.
 @param layers Optional layer filters.
 @param limit The max number of addresses to return. A number between 1 and 100.
 @param country An optional country filter. A string, the unique 2-letter country code.
 @param expandUnits Whether to expand units. Default behavior in other function signatures is false.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#autocomplete
 */
+ (void)autocompleteQuery:(NSString *_Nonnull)query
                     near:(CLLocation *_Nullable)near
                   layers:(NSArray<NSString *> *_Nullable)layers
                    limit:(int)limit
                  country:(NSString *_Nullable)country
              expandUnits:(BOOL)expandUnits
        completionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(autocomplete(query:near:layers:limit:country:expandUnits:completionHandler:)) __deprecated;

/**
 Autocompletes partial addresses and place names, sorted by relevance.

 @param query The partial address or place name to autocomplete.
 @param near A location for the search.
 @param layers Optional layer filters.
 @param limit The max number of addresses to return. A number between 1 and 100.
 @param country An optional country filter. A string, the unique 2-letter country code.
 @param mailable Whether to only include mailable addresses. Default behavior in other function signatures is false.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#autocomplete
 */
+ (void)autocompleteQuery:(NSString *_Nonnull)query
                     near:(CLLocation *_Nullable)near
                   layers:(NSArray<NSString *> *_Nullable)layers
                    limit:(int)limit
                  country:(NSString *_Nullable)country
                 mailable:(BOOL)mailable
        completionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(autocomplete(query:near:layers:limit:country:mailable:completionHandler:));

/**
 Autocompletes partial addresses and place names, sorted by relevance.

 @param query The partial address or place name to autocomplete.
 @param near A location for the search.
 @param layers Optional layer filters.
 @param limit The max number of addresses to return. A number between 1 and 100.
 @param country An optional country filter. A string, the unique 2-letter country code.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#autocomplete
 */
+ (void)autocompleteQuery:(NSString *_Nonnull)query
                     near:(CLLocation *_Nullable)near
                   layers:(NSArray<NSString *> *_Nullable)layers
                    limit:(int)limit
                  country:(NSString *_Nullable)country
        completionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(autocomplete(query:near:layers:limit:country:completionHandler:));

/**
 Autocompletes partial addresses and place names, sorted by relevance.

 @param query The partial address or place name to autocomplete.
 @param near A location for the search.
 @param limit The max number of addresses to return. A number between 1 and 100.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#autocomplete
 */
+ (void)autocompleteQuery:(NSString *_Nonnull)query
                     near:(CLLocation *_Nullable)near
                    limit:(int)limit
        completionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(autocomplete(query:near:limit:completionHandler:));

#pragma mark - Geocoding

/**
 Geocodes an address, converting address to coordinates.

 @param query The address to geocode.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#forward-geocode
 */
+ (void)geocodeAddress:(NSString *_Nonnull)query completionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(geocode(address:completionHandler:));

/**
 Geocodes an address, converting address to coordinates.

 @param query The address to geocode.
 @param layers Optional layer filters.
 @param countries Optional country filters. A string array of unique 2-letter country codes.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#forward-geocode
 */
+ (void)geocodeAddress:(NSString *)query 
                layers:(NSArray<NSString *> *_Nullable)layers
             countries:(NSArray<NSString *> *_Nullable)countries
     completionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(geocode(address:layers:countries:completionHandler:));

/**
 Gets the device's current location, then reverse geocodes that location, converting coordinates to address.

 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#reverse-geocode
 */
+ (void)reverseGeocodeWithCompletionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(reverseGeocode(completionHandler:));

/**
 Gets the device's current location, then reverse geocodes that location, converting coordinates to address.

 @param completionHandler A completion handler.
 @param layers Optional layer filters.

 @see https://radar.com/documentation/api#reverse-geocode
 */
+ (void)reverseGeocodeWithLayers:(NSArray<NSString *> *_Nullable)layers
               completionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(reverseGeocode(layers:completionHandler:));

/**
 Reverse geocodes a location, converting coordinates to address.

 @param location The location to reverse geocode.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#reverse-geocode
 */
+ (void)reverseGeocodeLocation:(CLLocation *_Nonnull)location
             completionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(reverseGeocode(location:completionHandler:));

/**
 Reverse geocodes a location, converting coordinates to address.

 @param location The location to reverse geocode.
 @param layers Optional layer filters.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#reverse-geocode
*/
+ (void)reverseGeocodeLocation:(CLLocation *)location
                        layers:(NSArray<NSString *> *_Nullable)layers
             completionHandler:(RadarGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(reverseGeocode(location:layers:completionHandler:));

/**
 Geocodes the device's current IP address, converting IP address to partial address.

 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#ip-geocode
 */
+ (void)ipGeocodeWithCompletionHandler:(RadarIPGeocodeCompletionHandler)completionHandler NS_SWIFT_NAME(ipGeocode(completionHandler:));


/**
 Validates an address, attaching a verification status, property type, and ZIP+4.

 @param address The address to validate.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#validate-an-address
 */

+ (void)validateAddress:(RadarAddress *_Nonnull)address completionHandler:(RadarValidateAddressCompletionHandler)completionHandler NS_SWIFT_NAME(validateAddress(address:completionHandler:));

#pragma mark - Distance

/**
 Gets the device's current location, then calculates the travel distance and duration to a destination.

 @param destination The destination.
 @param modes The travel modes.
 @param units The distance units.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#distance
 */
+ (void)getDistanceToDestination:(CLLocation *_Nonnull)destination
                           modes:(RadarRouteMode)modes
                           units:(RadarRouteUnits)units
               completionHandler:(RadarRouteCompletionHandler)completionHandler NS_SWIFT_NAME(getDistance(destination:modes:units:completionHandler:));

/**
 Calculates the travel distance and duration from an origin to a destination.

 @param origin The origin.
 @param destination The destination.
 @param modes The travel modes.
 @param units The distance units.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#distance
 */
+ (void)getDistanceFromOrigin:(CLLocation *_Nonnull)origin
                  destination:(CLLocation *_Nonnull)destination
                        modes:(RadarRouteMode)modes
                        units:(RadarRouteUnits)units
            completionHandler:(RadarRouteCompletionHandler)completionHandler NS_SWIFT_NAME(getDistance(origin:destination:modes:units:completionHandler:));

/**
 Calculates the travel distances and durations between multiple origins and destinations for up to 25 routes.

 @param origins The origins.
 @param destinations The destinations.
 @param mode The travel mode.
 @param units The distance units.
 @param completionHandler A completion handler.

 @see https://radar.com/documentation/api#matrix
 */
+ (void)getMatrixFromOrigins:(NSArray<CLLocation *> *_Nonnull)origins
                destinations:(NSArray<CLLocation *> *_Nonnull)destinations
                        mode:(RadarRouteMode)mode
                       units:(RadarRouteUnits)units
           completionHandler:(RadarRouteMatrixCompletionHandler)completionHandler NS_SWIFT_NAME(getMatrix(origins:destinations:mode:units:completionHandler:));

#pragma mark - Indoors

+ (void)startIndoorScan:(NSString *)geofenceId
                forLength:(int)scanLengthSeconds
        completionHandler:(RadarIndoorsScanCompletionHandler)completionHandler;

#pragma mark - Logging

/**
 Sets the preferred log level for debug logs. This can be overridden by the remote SDK configuration set in the dashboard.

 @param level The log level.
 */
+ (void)setLogLevel:(RadarLogLevel)level;

/**
 Log application terminating. Include this in your application delegate's applicationWillTerminate: method.

 */
+ (void)logTermination;

/**
 Log application entering background. Include this in your application delegate's applicationDidEnterBackground: method.
 */
+ (void)logBackgrounding;

/**
 Log application resigning active. Include this in your application delegate's applicationWillResignActive: method.

 */
+ (void)logResigningActive;


#pragma mark - Helpers

/**
 Returns a display string for a status value.

 @param status A status value.

 @return A display string for the status value.
 */
+ (NSString *)stringForStatus:(RadarStatus)status NS_SWIFT_NAME(stringForStatus(_:));

/**
 Returns a string for address validation status value.

 @param verificationStatus An address verification status value.

 @return A string for the address verification status value.
*/
+ (NSString *)stringForVerificationStatus:(RadarAddressVerificationStatus)verificationStatus NS_SWIFT_NAME(stringForVerificationStatus(_:));

/**
 Returns a display string for an activity type value.

    @param type An activity type value.

    @return A display string for the activity type value.
    */
+ (NSString *)stringForActivityType:(RadarActivityType)type NS_SWIFT_NAME(stringForActivityType(_:));


/**
 Returns a display string for a location source value.

 @param source A location source value.

 @return A display string for the location source value.
 */
+ (NSString *)stringForLocationSource:(RadarLocationSource)source NS_SWIFT_NAME(stringForLocationSource(_:));

/**
 Returns a display string for a travel mode value.
 @param mode A travel mode value.
 @return A display string for the travel mode value.
 */
+ (NSString *)stringForMode:(RadarRouteMode)mode NS_SWIFT_NAME(stringForMode(_:));

/**
 Returns a display string for a trip status value.

 @param status A trip status value.

 @return A display string for the trip status value.
 */
+ (NSString *)stringForTripStatus:(RadarTripStatus)status NS_SWIFT_NAME(stringForTripStatus(_:));

/**
 Returns a dictionary for a location.

 @param location A location.

 @return A dictionary for the location.
 */
+ (NSDictionary *)dictionaryForLocation:(CLLocation *)location NS_SWIFT_NAME(dictionaryForLocation(_:));

/**
 Returns a dictionary for an in-app message.

 @param message An in-app message.

 @return A dictionary for the in-app message.
 */
+ (NSDictionary *)dictionaryForInAppMessage:(RadarInAppMessage *)message NS_SWIFT_NAME(dictionaryForInAppMessage(_:));


/**
 Performs optional setup for Radar SDK within the AppDelegate. This method only needs to be called if Radar is initalized in cross-platform code.

 */
+ (void)nativeSetup:(RadarInitializeOptions *)options NS_SWIFT_NAME(nativeSetup(_:));

+ (void)openURLFromNotification:(UNNotification *)notification NS_SWIFT_NAME(openURLFromNotification(_:));

+ (void)setInAppMessageDelegate:(nullable id<RadarInAppMessageProtocol>)delegate NS_SWIFT_NAME(setInAppMessageDelegate(_:));

+ (void)showInAppMessage:(RadarInAppMessage *)message NS_SWIFT_NAME(showInAppMessage(_:));

/**
 Load image convenience function available for use with custom in-app message views
 */
+ (void) loadImage:(NSString*)url completionHandler:(void (^ _Nonnull)(UIImage * _Nullable))completionHandler NS_SWIFT_NAME(loadImage(_:completionHandler:));

+ (void)requestMotionActivityPermission NS_SWIFT_NAME(requestMotionActivityPermission());

+ (void)setAppGroup:(NSString*_Nullable)appGroup;

+ (void)setPushNotificationToken:(NSString*_Nullable)token;

+ (void)setLocationExtensionToken:(NSString*_Nullable)token;

+ (void)didReceivePushNotificationPayload:(NSDictionary*)payload completionHandler:(void (^ _Nonnull)(void))completionHandler;

@end

NS_ASSUME_NONNULL_END
