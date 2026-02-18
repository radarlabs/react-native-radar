#!/bin/bash
set -e

VERSION="${1:-3.25.2}"
SDK_REPO="https://github.com/radarlabs/radar-sdk-ios.git"
BUILD_DIR="/tmp/radar-static-build"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Building static xcframeworks from radar-sdk-ios v${VERSION}..."

# Clone the SDK source at the specified version
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
git clone --depth 1 --branch "$VERSION" "$SDK_REPO" "$BUILD_DIR/radar-sdk-ios"

# --- RadarSDK ---
echo ""
echo "=== Building RadarSDK.xcframework (static) ==="

echo "Archiving RadarSDK for iOS Simulator..."
xcodebuild archive \
  -project "$BUILD_DIR/radar-sdk-ios/RadarSDK.xcodeproj" \
  -scheme RadarSDK \
  -destination "generic/platform=iOS Simulator" \
  -archivePath "$BUILD_DIR/RadarSDK-simulator" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
  MACH_O_TYPE=staticlib \
  -quiet

echo "Archiving RadarSDK for iOS device..."
xcodebuild archive \
  -project "$BUILD_DIR/radar-sdk-ios/RadarSDK.xcodeproj" \
  -scheme RadarSDK \
  -destination "generic/platform=iOS" \
  -archivePath "$BUILD_DIR/RadarSDK-device" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
  MACH_O_TYPE=staticlib \
  -quiet

echo "Creating RadarSDK.xcframework..."
rm -rf "$PROJECT_ROOT/ios/RadarSDK.xcframework"
xcodebuild -create-xcframework \
  -framework "$BUILD_DIR/RadarSDK-simulator.xcarchive/Products/Library/Frameworks/RadarSDK.framework" \
  -framework "$BUILD_DIR/RadarSDK-device.xcarchive/Products/Library/Frameworks/RadarSDK.framework" \
  -output "$PROJECT_ROOT/ios/RadarSDK.xcframework"

# --- RadarSDKMotion ---
echo ""
echo "=== Building RadarSDKMotion.xcframework (static) ==="

echo "Archiving RadarSDKMotion for iOS Simulator..."
xcodebuild archive \
  -project "$BUILD_DIR/radar-sdk-ios/RadarSDKMotion/RadarSDKMotion.xcodeproj" \
  -scheme RadarSDKMotion \
  -destination "generic/platform=iOS Simulator" \
  -archivePath "$BUILD_DIR/RadarSDKMotion-simulator" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
  MACH_O_TYPE=staticlib \
  -quiet

echo "Archiving RadarSDKMotion for iOS device..."
xcodebuild archive \
  -project "$BUILD_DIR/radar-sdk-ios/RadarSDKMotion/RadarSDKMotion.xcodeproj" \
  -scheme RadarSDKMotion \
  -destination "generic/platform=iOS" \
  -archivePath "$BUILD_DIR/RadarSDKMotion-device" \
  SKIP_INSTALL=NO \
  BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
  MACH_O_TYPE=staticlib \
  -quiet

echo "Creating RadarSDKMotion.xcframework..."
rm -rf "$PROJECT_ROOT/ios/RadarSDKMotion.xcframework"
xcodebuild -create-xcframework \
  -framework "$BUILD_DIR/RadarSDKMotion-simulator.xcarchive/Products/Library/Frameworks/RadarSDKMotion.framework" \
  -framework "$BUILD_DIR/RadarSDKMotion-device.xcarchive/Products/Library/Frameworks/RadarSDKMotion.framework" \
  -output "$PROJECT_ROOT/ios/RadarSDKMotion.xcframework"

# Cleanup
rm -rf "$BUILD_DIR"

echo ""
echo "Done! Static xcframeworks built and placed in ios/"
