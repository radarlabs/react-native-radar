#import <RadarSDK/RadarSDK.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNRadar : RCTEventEmitter <RadarDelegate, RCTBridgeModule>

@end
