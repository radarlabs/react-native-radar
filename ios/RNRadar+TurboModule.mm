#ifdef RCT_NEW_ARCH_ENABLED

#import "RNRadar+TurboModule.h"
#import <React/RCTTurboModule.h>

@implementation RNRadar (TurboModule)

// TurboModule implementation
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeRadarSpecJSI>(params);
}

// Required TurboModule methods - the existing methods from RNRadar.m will be used
// The new architecture will automatically bridge to the existing @ReactMethod implementations

// Event listener methods specifically for new architecture compatibility
RCT_EXPORT_METHOD(addListener:(NSString *)eventName) {
    // Call the existing startObserving logic
    [self startObserving];
}

RCT_EXPORT_METHOD(removeListeners:(double)count) {
    // For simplicity, always stop observing when any listeners are removed
    // In a production implementation, you might want to track the count more precisely
    [self stopObserving];
}

@end

#endif 