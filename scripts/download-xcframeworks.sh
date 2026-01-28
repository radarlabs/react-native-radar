#!/bin/bash
set -e

VERSION="${1:-3.25.0}"
BASE_URL="https://github.com/radarlabs/radar-sdk-ios/releases/download/${VERSION}"

echo "Downloading RadarSDK.xcframework v${VERSION}..."
curl -L -o /tmp/RadarSDK.xcframework.zip "${BASE_URL}/RadarSDK.xcframework.zip"
rm -rf ios/RadarSDK.xcframework
unzip -o /tmp/RadarSDK.xcframework.zip -d ios/
rm /tmp/RadarSDK.xcframework.zip

echo "Downloading RadarSDKMotion.xcframework v${VERSION}..."
curl -L -o /tmp/RadarSDKMotion.xcframework.zip "${BASE_URL}/RadarSDKMotion.xcframework.zip"
rm -rf ios/RadarSDKMotion.xcframework
unzip -o /tmp/RadarSDKMotion.xcframework.zip -d ios/
rm /tmp/RadarSDKMotion.xcframework.zip

echo "Done! XCFrameworks downloaded to ios/"