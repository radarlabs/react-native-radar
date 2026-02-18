//
//  RadarInAppMessageDelegate.h
//  RadarSDK
//
//  Created by ShiCheng Lu on 7/23/25.
//  Copyright © 2025 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIkit.h>
#import "RadarInAppMessage.h"

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RadarInAppMessageOperation) {
    RadarInAppMessageDisplay,
    RadarInAppMessageDiscard,
};

NS_SWIFT_UI_ACTOR
@protocol RadarInAppMessageProtocol <NSObject>


- (void) onNewInAppMessage:(RadarInAppMessage * _Nonnull)message
    NS_SWIFT_NAME(onNewInAppMessage(_:));

- (void) onInAppMessageDismissed:(RadarInAppMessage * _Nonnull)message
    NS_SWIFT_NAME(onInAppMessageDismissed(_:));

- (void) onInAppMessageButtonClicked:(RadarInAppMessage * _Nonnull)message
    NS_SWIFT_NAME(onInAppMessageButtonClicked(_:));

- (void) createInAppMessageView:(RadarInAppMessage * _Nonnull)message
                      onDismiss:(void (^)(void))onDismiss
          onInAppMessageClicked:(void (^)(void))onInAppMessageClicked
              completionHandler:(void (^)(UIViewController *))completionHandler
    NS_SWIFT_NAME(createInAppMessageView(_:onDismiss:onInAppMessageClicked:completionHandler:));

@end

// This is the default implementation class
// you can override specific methods of this class instead of having to implement every method
// of the protocol
NS_SWIFT_NAME(RadarInAppMessageDelegate)
API_AVAILABLE(ios(13.0))
NS_SWIFT_UI_ACTOR
@interface RadarInAppMessageDelegate : NSObject <RadarInAppMessageProtocol>

- (instancetype) init;

@end

NS_ASSUME_NONNULL_END
