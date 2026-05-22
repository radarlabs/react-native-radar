@import Foundation;

// Forward-declare so we can reference RadarSDKFraud's class symbol without
// importing the framework's headers (which would require module map plumbing
// that the static-linkage build doesn't always provide).
@interface RadarSDKFraud : NSObject
@end

// Anchor the link: the iOS Radar SDK only references RadarSDKFraud via runtime
// NSClassFromString, so without an explicit compile-time symbol reference the
// linker dead-strips the LC_LOAD_DYLIB. This forces the load command to stick.
__attribute__((used))
static Class _Nullable __radar_keep_fraud_linked(void) {
    return [RadarSDKFraud class];
}