#include <fbjni/fbjni.h>
#include <jsi/jsi.h>
#include <ReactCommon/TurboModuleManagerDelegate.h>
#include <ReactCommon/TurboModule.h>
#include <react/bridging/CallbackWrapper.h>

#include "RNRadarSpec.h"

using namespace facebook;

struct RNRadar : jni::HybridClass<RNRadar> {
    static auto constexpr kJavaDescriptor = "Lio/radar/react/RNRadarModule;";

    static void registerNatives() {
        registerHybrid({
            makeNativeMethod("initHybrid", RNRadar::initHybrid),
        });
    }

private:
    friend HybridBase;
    jni::global_ref<javaobject> javaPart_;

    explicit RNRadar(jni::alias_ref<javaobject> jThis)
        : javaPart_(jni::make_global(jThis)) {}
};

extern "C" JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
    return facebook::jni::initialize(vm, [] {
        RNRadar::registerNatives();
    });
} 