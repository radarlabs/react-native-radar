#import <RadarSpec/RadarSpec.h>
#import <RadarSDK/RadarSDK.h>
#import <React/RCTBridgeModule.h>

@interface RNRadar : NativeRadarSpecBase <NativeRadarSpec, RadarDelegate, CLLocationManagerDelegate>

@end
