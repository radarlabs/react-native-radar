#import "Radar.h"

@implementation Radar {
  NSUserDefaults *radar;
}
RCT_EXPORT_MODULE()

- (instancetype)init {
  self = [super init];
  if (self) {
    radar = [[NSUserDefaults alloc] initWithSuiteName:@"RCTRadarKey"];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRadarSpecJSI>(params);
}

- (NSString * _Nullable)getItem:(NSString *)key {
  return [radar stringForKey:key];
}

- (void)setItem:(NSString *)value
          key:(NSString *)key {
  [radar setObject:value forKey:key];
}

- (void)removeItem:(NSString *)key {
  [radar removeObjectForKey:key];
}

- (void)clear {
  NSDictionary *keys = [radar dictionaryRepresentation];
  for (NSString *key in keys) {
    [self removeItem:key];
  }
}

+ (NSString *)moduleName
{
  return @"Radar";
}

@end
