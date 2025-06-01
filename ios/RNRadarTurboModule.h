#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTTurboModule.h>
#import <RadarSDK/RadarSDK.h>

@interface RNRadarTurboModule : NSObject <RCTTurboModule, RadarDelegate>

- (void)startObserving;
- (void)stopObserving;

// RadarDelegate methods
- (void)didReceiveEvents:(NSArray<RadarEvent *> *_Nonnull)events user:(RadarUser *_Nonnull)user;
- (void)didUpdateLocation:(CLLocation *_Nonnull)location user:(RadarUser *_Nonnull)user;
- (void)didUpdateClientLocation:(CLLocation *_Nonnull)location stopped:(BOOL)stopped source:(RadarLocationSource)source;
- (void)didFailWithStatus:(RadarStatus)status;

@end

#endif 