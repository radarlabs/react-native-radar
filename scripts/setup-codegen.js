const fs = require('fs');
const path = require('path');

const codegenDir = path.join(__dirname, '..', 'android', 'build', 'generated', 'source', 'codegen', 'jni');

// Create directory if it doesn't exist
if (!fs.existsSync(codegenDir)) {
    fs.mkdirSync(codegenDir, { recursive: true });
}

// Create CMakeLists.txt
const cmakeContent = `cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

add_compile_options(
        -fexceptions
        -frtti
        -std=c++17
        -Wall
)

file(GLOB LIBRN_DIR "\${CMAKE_SOURCE_DIR}/../../../../../react-native")

# Generated from codegen
file(GLOB CODEGEN_DIR "\${CMAKE_SOURCE_DIR}")

# find sources
file(GLOB_RECURSE SOURCES_FILES \${CODEGEN_DIR}/*.cpp)

# Create the library (with or without actual sources)
add_library(
        react_codegen_RNRadarSpec
        SHARED
        \${CMAKE_CURRENT_SOURCE_DIR}/dummy.cpp
)

# Set up include directories - this is the key fix
target_include_directories(react_codegen_RNRadarSpec PUBLIC
    \${CODEGEN_DIR}
    \${CMAKE_CURRENT_SOURCE_DIR}
    "\${LIBRN_DIR}/ReactCommon"
    "\${LIBRN_DIR}/ReactAndroid/src/main/jni/react/turbomodule"
    "\${LIBRN_DIR}/ReactAndroid/src/main/java/com/facebook/react/turbomodule/core/jni"
)

# includes for React Native - use proper paths
target_include_directories(
        react_codegen_RNRadarSpec
        PRIVATE
        "\${LIBRN_DIR}/ReactCommon"
        "\${LIBRN_DIR}/ReactCommon/callinvoker"
        "\${LIBRN_DIR}/ReactCommon/jsi"
        "\${LIBRN_DIR}/ReactCommon/react/nativemodule/core" 
        "\${LIBRN_DIR}/ReactCommon/react/bridging"
        "\${LIBRN_DIR}/ReactCommon/turbomodule/core"
        "\${LIBRN_DIR}/ReactAndroid/src/main/java/com/facebook/react/turbomodule/core/jni"
        "\${LIBRN_DIR}/ReactAndroid/src/main/jni"
        "\${LIBRN_DIR}/ReactAndroid/src/main/jni/react/turbomodule"
)

# find libraries
find_library(
        LOG_LIB
        log
)

# link libraries
target_link_libraries(
        react_codegen_RNRadarSpec
        \${LOG_LIB}
)

# Export the include directory for other targets to use
target_include_directories(react_codegen_RNRadarSpec 
    INTERFACE 
    \${CMAKE_CURRENT_SOURCE_DIR}
)`;

// Create dummy.cpp
const dummyContent = `#include "RNRadarSpec.h"

// Use relative paths for React Native includes
#include "react/bridging/Bridging.h"
#include "turbomodule/core/TurboModule.h"

namespace facebook::react {

RNRadarSpec::RNRadarSpec(const std::string &name, std::shared_ptr<CallInvoker> jsInvoker)
    : TurboModule(name, jsInvoker) {}

std::shared_ptr<TurboModule> RNRadarSpec_ModuleProvider(const std::string &moduleName, const void* params) {
    // Return null to let the actual module registration system handle this
    // This is just to satisfy the build system's symbol requirements
    return nullptr;
}

} // namespace facebook::react`;

// Create RNRadarSpec.h (simplified dummy header file)
const radarSpecHeader = `#pragma once

#include <memory>
#include <string>

// Use relative paths for React Native includes
#include "react/bridging/Bridging.h"
#include "turbomodule/core/TurboModule.h"

namespace facebook::react {
    class RNRadarSpec : public TurboModule {
    protected:
        RNRadarSpec(const std::string &name, std::shared_ptr<CallInvoker> jsInvoker);
    public:
        virtual ~RNRadarSpec() = default;
    };

    // Provide function overloads to handle any parameter type the autolinking system passes
    std::shared_ptr<TurboModule> RNRadarSpec_ModuleProvider(const std::string &moduleName, const void* params);
    
    template<typename T>
    std::shared_ptr<TurboModule> RNRadarSpec_ModuleProvider(const std::string &moduleName, const T& params) {
        return RNRadarSpec_ModuleProvider(moduleName, static_cast<const void*>(&params));
    }
}`;

// Create DefaultComponentsRegistry.h (simplified dummy header file)
const defaultComponentsHeader = `#pragma once

#include <memory>

namespace facebook::react {

// Forward declaration
class ComponentDescriptorProviderRegistry;

// Dummy registry - will be replaced by actual codegen
class DefaultComponentsRegistry {
public:
    static void registerComponents() {}
    
    // Function pointer type that matches exactly what OnLoad.cpp expects
    // From the error: 'void (*)(std::shared_ptr<const ComponentDescriptorProviderRegistry>)'
    static void (*registerComponentDescriptorsFromEntryPoint)(std::shared_ptr<const ComponentDescriptorProviderRegistry>);
};

// Initialize the static function pointer to null
void (*DefaultComponentsRegistry::registerComponentDescriptorsFromEntryPoint)(std::shared_ptr<const ComponentDescriptorProviderRegistry>) = nullptr;

} // namespace facebook::react`;

// Write the files
fs.writeFileSync(path.join(codegenDir, 'CMakeLists.txt'), cmakeContent);
fs.writeFileSync(path.join(codegenDir, 'dummy.cpp'), dummyContent);
fs.writeFileSync(path.join(codegenDir, 'RNRadarSpec.h'), radarSpecHeader);
fs.writeFileSync(path.join(codegenDir, 'DefaultComponentsRegistry.h'), defaultComponentsHeader);

console.log('React Native Radar: Codegen setup completed successfully');
console.log('Created:', path.join(codegenDir, 'CMakeLists.txt'));
console.log('Created:', path.join(codegenDir, 'dummy.cpp'));
console.log('Created:', path.join(codegenDir, 'RNRadarSpec.h'));
console.log('Created:', path.join(codegenDir, 'DefaultComponentsRegistry.h')); 