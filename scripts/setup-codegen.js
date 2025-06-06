const fs = require('fs');
const path = require('path');
const os = require('os');

console.log(`Platform: ${os.platform()}`);
console.log(`Architecture: ${os.arch()}`);
console.log(`Node version: ${process.version}`);

function findProjectRoot() {
    // Try to find package.json in parent directories
    let currentDir = __dirname;
    console.log(`Starting search from: ${currentDir}`);

    while (currentDir !== path.parse(currentDir).root) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        console.log(`Checking: ${packageJsonPath}`);

        if (fs.existsSync(packageJsonPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                console.log(`Found package: ${pkg.name}`);
                if (pkg.name === 'react-native-radar') {
                    console.log(`Found project root: ${currentDir}`);
                    return currentDir;
                }
            } catch (e) {
                console.log(`Invalid package.json: ${e.message}`);
                // Continue searching if package.json is invalid
            }
        }
        currentDir = path.dirname(currentDir);
    }
    return null;
}

function ensureDirectoryExists(dir) {
    console.log(`Ensuring directory exists: ${dir}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    } else {
        console.log(`Directory already exists: ${dir}`);
    }
}

try {
    const projectRoot = findProjectRoot();
    if (!projectRoot) {
        throw new Error('Could not find project root directory');
    }

    // Define paths for both library and example app
    const paths = [
        // Library path
        path.join(projectRoot, 'android', 'build', 'generated', 'source', 'codegen', 'jni'),
        // Example app path (relative to node_modules)
        path.join(projectRoot, 'example', 'node_modules', 'react-native-radar', 'android', 'build', 'generated', 'source', 'codegen', 'jni')
    ];

    console.log(`Target paths:`);
    paths.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));

    // Create CMakeLists.txt content
    const cmakeContent = `cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

string(APPEND CMAKE_CXX_FLAGS " -std=c++17")

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

add_compile_options(
  -fexceptions
  -frtti
  -std=c++17
  -Wall
  -Wpedantic
  -Wno-gnu-zero-variadic-macro-arguments
)

# Export a native module library for the Radar module
set(PACKAGE_NAME "react_codegen_RNRadarSpec")
set(BUILD_DIR \${CMAKE_SOURCE_DIR}/build)
set(CMAKE_VERBOSE_MAKEFILE ON)

add_library(
  \${PACKAGE_NAME}
  SHARED
  \${CMAKE_CURRENT_SOURCE_DIR}/dummy.cpp
)

target_include_directories(
  \${PACKAGE_NAME}
  PUBLIC
  "\${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/react/turbomodule"
  "\${NODE_MODULES_DIR}/react-native/ReactCommon"
  "\${NODE_MODULES_DIR}/react-native/ReactCommon/callinvoker"
  "\${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
  "\${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core"
  "\${NODE_MODULES_DIR}/react-native/ReactCommon/react/bridging"
  "\${CMAKE_CURRENT_SOURCE_DIR}"
)

target_link_libraries(
  \${PACKAGE_NAME}
  android
  fbjni
  jsi
  react_nativemodule_core
  ReactAndroid::turbomodulejsijni
)`;

    // Create RNRadarSpec.h content
    const radarSpecHeader = `#pragma once

#include <ReactCommon/TurboModule.h>
#include <jsi/jsi.h>

namespace facebook::react {

class RNRadarSpec : public TurboModule {
public:
    RNRadarSpec(std::shared_ptr<CallInvoker> jsInvoker);

    virtual ~RNRadarSpec() = default;
};

std::shared_ptr<TurboModule> RNRadarSpec_ModuleProvider(const std::string &moduleName, const std::shared_ptr<CallInvoker> &jsInvoker);

} // namespace facebook::react`;

    // Create dummy.cpp content
    const dummyContent = `#include "RNRadarSpec.h"

namespace facebook::react {

RNRadarSpec::RNRadarSpec(std::shared_ptr<CallInvoker> jsInvoker)
    : TurboModule("RNRadar", jsInvoker) {}

std::shared_ptr<TurboModule> RNRadarSpec_ModuleProvider(const std::string &moduleName, const std::shared_ptr<CallInvoker> &jsInvoker) {
    if (moduleName == "RNRadar") {
        return std::make_shared<RNRadarSpec>(jsInvoker);
    }
    return nullptr;
}

} // namespace facebook::react`;

    // Create DefaultComponentsRegistry.h content
    const defaultComponentsHeader = `#pragma once

#include <ComponentFactory.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <react/renderer/componentregistry/ComponentDescriptorRegistry.h>

namespace facebook {
namespace react {

class DefaultComponentsRegistry : public facebook::jni::HybridClass<DefaultComponentsRegistry> {
public:
    constexpr static auto kJavaDescriptor = "Lcom/facebook/react/defaults/DefaultComponentsRegistry;";

    static void registerNatives();

    DefaultComponentsRegistry(ComponentFactory *delegate);

    static std::shared_ptr<ComponentDescriptorProviderRegistry const> sharedProviderRegistry();

    static jni::local_ref<jhybriddata> initHybrid(jni::alias_ref<jclass>);
};

} // namespace react
} // namespace facebook`;

    // Write files to both locations
    let successCount = 0;
    for (const codegenDir of paths) {
        try {
            console.log(`\nProcessing: ${codegenDir}`);
            ensureDirectoryExists(codegenDir);

            const filesToCreate = [
                { name: 'CMakeLists.txt', content: cmakeContent },
                { name: 'dummy.cpp', content: dummyContent },
                { name: 'RNRadarSpec.h', content: radarSpecHeader },
                { name: 'DefaultComponentsRegistry.h', content: defaultComponentsHeader }
            ];

            for (const file of filesToCreate) {
                const filePath = path.join(codegenDir, file.name);
                fs.writeFileSync(filePath, file.content);
                console.log(`✓ Created: ${file.name}`);

                // Verify file was created
                if (fs.existsSync(filePath)) {
                    const stats = fs.statSync(filePath);
                    console.log(`  Size: ${stats.size} bytes`);
                } else {
                    console.error(`✗ Failed to create: ${file.name}`);
                }
            }

            successCount++;
            console.log(`✓ Successfully created files in: ${codegenDir}`);

        } catch (err) {
            console.error(`✗ Error creating files in ${codegenDir}:`);
            console.error(`  ${err.message}`);
            console.error(`  Stack: ${err.stack}`);
        }
    }

    if (successCount > 0) {
        console.log(`\n🎉 React Native Radar: Codegen setup completed successfully!`);
        console.log(`📁 Created files in ${successCount} out of ${paths.length} locations`);
    } else {
        throw new Error('Failed to create files in any location');
    }

} catch (error) {
    console.error('\n❌ Error during codegen setup:');
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    process.exit(1);
} 