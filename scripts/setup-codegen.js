const fs = require('fs');
const path = require('path');
const os = require('os');

// Log system info
console.log(`Platform: ${os.platform()}`);
console.log(`Architecture: ${os.arch()}`);
console.log(`Node version: ${process.version}`);

// Function to find the root directory containing package.json with name 'react-native-radar'
function findProjectRoot() {
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
            }
        }
        currentDir = path.dirname(currentDir);
    }
    return null;
}

// Utility to ensure directory exists
function ensureDirectoryExists(dir) {
    console.log(`Ensuring directory exists: ${dir}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    } else {
        console.log(`Directory already exists: ${dir}`);
    }
}

// Main execution
try {
    const projectRoot = findProjectRoot();
    if (!projectRoot) {
        throw new Error('Could not find project root directory');
    }

    // Paths to generate files in both lib and example app (inside node_modules)
    const paths = [
        path.join(projectRoot, 'android', 'build', 'generated', 'source', 'codegen', 'jni'),
        path.join(projectRoot, 'example', 'node_modules', 'react-native-radar', 'android', 'build', 'generated', 'source', 'codegen', 'jni')
    ];

    console.log(`Target paths:`);
    paths.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));

    // File contents
    const cmakeContent = `cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

# Java-only TurboModule with minimal C++ stubs
# This creates a stub library to satisfy React Native's autolinking requirements
# The actual TurboModule implementation is in Java

set(PACKAGE_NAME "react_codegen_RNRadarSpec")

# Find the required packages for React Native headers
find_package(ReactAndroid REQUIRED CONFIG)

add_library(
  \${PACKAGE_NAME}
  SHARED
  \${CMAKE_CURRENT_SOURCE_DIR}/dummy.cpp
)

# Use the same include strategy as autolinking
target_include_directories(
  \${PACKAGE_NAME}
  PUBLIC
  "\${CMAKE_CURRENT_SOURCE_DIR}"
)

# Link to ReactAndroid::reactnative to get the headers
target_link_libraries(
  \${PACKAGE_NAME}
  ReactAndroid::reactnative
  ReactAndroid::jsi
  fbjni::fbjni
  android
  log
)`;

    const dummyContent = `#include "RNRadarSpec.h"
#include <string>

namespace facebook {
namespace react {

// Stub implementation for Java-only TurboModule
// Returns nullptr to indicate no C++ module is available
// The actual TurboModule implementation is in Java
std::shared_ptr<TurboModule> RNRadarSpec_ModuleProvider(const std::string &moduleName, const JavaTurboModule::InitParams &params) {
    return nullptr;
}

} // namespace react
} // namespace facebook`;

    const radarSpecHeader = `#pragma once

#include <ReactCommon/TurboModule.h>
#include <ReactCommon/JavaTurboModule.h>

namespace facebook {
namespace react {

// Stub function for Java-only TurboModule
// Returns nullptr to indicate no C++ module is available
std::shared_ptr<TurboModule> RNRadarSpec_ModuleProvider(const std::string &moduleName, const JavaTurboModule::InitParams &params);

} // namespace react
} // namespace facebook`;

    const defaultComponentsHeader = `#pragma once

#include <memory>

// Forward declaration to avoid header dependencies
namespace facebook {
namespace react {
    class ComponentDescriptorProviderRegistry;
}
}

namespace facebook {
namespace react {

// Empty stub for Java-only TurboModule
class DefaultComponentsRegistry {
public:
    // Function pointer that OnLoad.cpp expects to assign to
    static void (*registerComponentDescriptorsFromEntryPoint)(std::shared_ptr<const ComponentDescriptorProviderRegistry>);
    
    // Static method for initialization
    static void init() {
        registerComponentDescriptorsFromEntryPoint = [](std::shared_ptr<const ComponentDescriptorProviderRegistry>) {
            // No-op for Java-only TurboModule
        };
    }
};

// Initialize the function pointer
void (*DefaultComponentsRegistry::registerComponentDescriptorsFromEntryPoint)(std::shared_ptr<const ComponentDescriptorProviderRegistry>) = [](std::shared_ptr<const ComponentDescriptorProviderRegistry>) {
    // No-op for Java-only TurboModule
};

} // namespace react
} // namespace facebook`;

    // Write all files to each target path
    let successCount = 0;
    for (const codegenDir of paths) {
        try {
            console.log(`\nProcessing: ${codegenDir}`);
            ensureDirectoryExists(codegenDir);

            const files = [
                { name: 'CMakeLists.txt', content: cmakeContent },
                { name: 'dummy.cpp', content: dummyContent },
                { name: 'RNRadarSpec.h', content: radarSpecHeader },
                { name: 'DefaultComponentsRegistry.h', content: defaultComponentsHeader }
            ];

            for (const file of files) {
                const filePath = path.join(codegenDir, file.name);
                fs.writeFileSync(filePath, file.content);
                console.log(`✓ Created: ${file.name} (${fs.statSync(filePath).size} bytes)`);
            }

            successCount++;
            console.log(`✓ Successfully created files in: ${codegenDir}`);
        } catch (err) {
            console.error(`✗ Error in ${codegenDir}: ${err.message}`);
        }
    }

    if (successCount > 0) {
        console.log(`\n🎉 Codegen setup complete!`);
        console.log(`📁 Files created in ${successCount}/${paths.length} locations.`);
    } else {
        throw new Error('Failed to create codegen files in all locations.');
    }

} catch (error) {
    console.error('\n❌ Error during codegen setup:');
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    process.exit(1);
}
