//
//  RadarOperatingHour.h
//  RadarSDK
//
//  Created by Kenny Hu on 10/7/24.
//  Copyright © 2024 Radar Labs, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RadarOperatingHours : NSObject

@property (nonatomic, strong, readonly) NSDictionary<NSString *, NSArray<NSArray<NSString *> *> *> *hours;

@end
