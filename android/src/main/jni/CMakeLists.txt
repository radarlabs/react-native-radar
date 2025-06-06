cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE ON)

# Define the library name
project(react-native-radar)

# This file includes all the necessary to let you build your application with the New Architecture.
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# Add the codegen target directory
add_subdirectory(${PROJECT_BUILD_DIR}/generated/source/codegen/jni)

# Library name should match the project name
add_library(${PROJECT_NAME} SHARED
            # Source files
            ${REACT_ANDROID_DIR}/src/main/jni/react/turbomodule/ReactCommon/react_native_radar.cpp)

# Include directories
target_include_directories(${PROJECT_NAME} PRIVATE
            "${REACT_ANDROID_DIR}/src/main/jni/react/turbomodule"
            "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/react/turbomodule"
            "${NODE_MODULES_DIR}/react-native/ReactCommon"
            "${NODE_MODULES_DIR}/react-native/ReactCommon/callinvoker"
            "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
            "${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core"
            "${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core/platform/android"
            "${PROJECT_BUILD_DIR}/generated/source/codegen/jni")

target_link_libraries(${PROJECT_NAME}
            android
            fbjni
            folly_runtime
            glog
            jsi
            react_codegen_rncore
            react_debug
            react_nativemodule_core
            react_render_core
            react_render_debug
            react_render_graphics
            reactnativejni
            react_codegen_RNRadarSpec
            turbomodulejsijni
            yoga) 