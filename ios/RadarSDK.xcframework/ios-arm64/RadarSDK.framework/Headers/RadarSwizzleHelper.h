#import <Foundation/Foundation.h>
#import <UserNotifications/UserNotifications.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RadarSwizzleHelper : NSObject

// Swizzled handlers — these are the methods that get exchanged onto the target class.
// They perform Radar logic then call through to the original via [self swizzled_...].
- (void)swizzled_userNotificationCenter:(UNUserNotificationCenter *)center
       didReceiveNotificationResponse:(UNNotificationResponse *)response
                withCompletionHandler:(void (^)(void))completionHandler;

- (void)swizzled_application:(UIApplication *)application
didReceiveRemoteNotification:(NSDictionary *)userInfo
      fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler;

- (void)swizzled_application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken;

@end

NS_ASSUME_NONNULL_END
