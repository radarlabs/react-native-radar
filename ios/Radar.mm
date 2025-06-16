#import "Radar.h"
@import RadarSDK;

@interface Radar ()
@property (nonatomic, strong) NSUserDefaults *localStorage;
@end

@implementation Radar

- (instancetype)init {
  if (self = [super init]) {
    _localStorage = [[NSUserDefaults alloc] initWithSuiteName:@"RCTRadarKey"];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeRadarSpecJSI>(params);
}

- (void)initialize:(NSString *)publishableKey fraud:(NSNumber *)fraud {
    [[NSUserDefaults standardUserDefaults] setObject:@"ReactNative" forKey:@"radar-xPlatformSDKType"];
    [[NSUserDefaults standardUserDefaults] setObject:@"3.20.3" forKey:@"radar-xPlatformSDKVersion"];
    // Use the RadarSDK's Radar class - we need to be explicit about which Radar class we want
    Class RadarSDKClass = NSClassFromString(@"Radar");
    if (RadarSDKClass && RadarSDKClass != [self class]) {
        // Call the RadarSDK's Radar class initialize method
        [RadarSDKClass initializeWithPublishableKey:publishableKey];
    }
}

- (NSString * _Nullable)getItem:(NSString *)key {
  return [self.localStorage stringForKey:key];
}

- (void)setItem:(NSString *)value key:(NSString *)key {
  [self.localStorage setObject:value forKey:key];
}

- (void)removeItem:(NSString *)key {
  [self.localStorage removeObjectForKey:key];
}

- (void)clear {
  NSDictionary *keys = [self.localStorage dictionaryRepresentation];
  for (NSString *key in keys) {
    [self removeItem:key];
  }
}

@end
