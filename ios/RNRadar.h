#ifdef RCT_NEW_ARCH_ENABLED
#import <RadarSpec/RadarSpec.h>
#else
#import <React/RCTEventEmitter.h>
#endif

#import <RadarSDK/RadarSDK.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTInvalidating.h>

#ifdef RCT_NEW_ARCH_ENABLED
@interface RNRadar : NativeRadarSpecBase <NativeRadarSpec, RadarDelegate, CLLocationManagerDelegate, RadarVerifiedDelegate, RadarInAppMessageProtocol, RCTInvalidating>
#else
@interface RNRadar : RCTEventEmitter <RCTBridgeModule, RadarDelegate, CLLocationManagerDelegate, RadarVerifiedDelegate, RadarInAppMessageProtocol, RCTInvalidating>
#endif

@end
