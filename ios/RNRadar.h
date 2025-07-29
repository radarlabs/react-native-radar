#ifdef RCT_NEW_ARCH_ENABLED
#import <RadarSpec/RadarSpec.h>
#else
#import <React/RCTEventEmitter.h>
#endif

#import <RadarSDK/RadarSDK.h>
#import <RadarSDK/RadarSettings.h>
#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
@interface RNRadar : NativeRadarSpecBase <NativeRadarSpec, RadarDelegate, CLLocationManagerDelegate, RadarVerifiedDelegate>
#else
@interface RNRadar : RCTEventEmitter <RCTBridgeModule, RadarDelegate, CLLocationManagerDelegate, RadarVerifiedDelegate>
#endif

@end
