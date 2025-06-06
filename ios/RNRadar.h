#import <RadarSDK/RadarSDK.h>
#import <RadarSDK/RadarSettings.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRadarSpec.h"

@interface RNRadar : RCTEventEmitter <RadarDelegate, RadarVerifiedDelegate, NativeRNRadarSpec, CLLocationManagerDelegate>
#else
@interface RNRadar : RCTEventEmitter <RadarDelegate, RadarVerifiedDelegate, RCTBridgeModule, CLLocationManagerDelegate>
#endif

@end
