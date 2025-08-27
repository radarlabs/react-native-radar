#!/bin/sh

if [ $# -eq 3 ]; then
    echo "\033[1;33mUpdating react-native-radar to $1, using iOS SDK $2 and Android SDK $3\033[0m"
    npm_version=$1
    ios_version=$2
    android_version=$3
elif [ $# -eq 1 ]; then
    echo "\033[0;33mOnly one argument provided, assuming all versions match $1\033[0m"
    npm_version=$1
    ios_version=$1
    android_version=$1
else
    echo "Usage: $0 <RN version> <iOS version> <Android version>"
    exit 1
fi

########################################################
# sed has slightly different syntax on linux vs mac
if [ $(uname -s) = "Darwin" ]; then
    alias sed_inplace="sed -E -i ''"
else
    alias sed_inplace="sed -E -i"
fi


########################################################
echo "\033[0;32mUpdating package version to $npm_version\033[0m"
# update version in package.json and package-lock.json
npm version $npm_version --no-git-tag-version --silent > /dev/null
echo " - NPM complete"

# update x_platform_sdk_version for android
sed_inplace 's/editor.putString\("x_platform_sdk_version", "(.+)"\);/editor.putString\("x_platform_sdk_version", "'$npm_version'"\);/' android/src/oldarch/java/com/radar/RadarModule.java
sed_inplace 's/editor.putString\("x_platform_sdk_version", "(.+)"\)/editor.putString\("x_platform_sdk_version", "'$npm_version'"\)/' android/src/newarch/java/com/radar/RadarModule.kt
echo " - Android complete"

# update x_platform_sdk_version for iOS
sed_inplace 's/\[\[NSUserDefaults standardUserDefaults\] setObject:\@"(.+)" forKey:\@"radar-xPlatformSDKVersion"\];/\[\[NSUserDefaults standardUserDefaults\] setObject:\@"'$npm_version'" forKey:\@"radar-xPlatformSDKVersion"\];/' ios/RNRadar.mm
echo " - iOS complete"

########################################################
echo "\033[0;32mUpdating SDK versions, iOS: $ios_version, Android: $android_version\033[0m"
# update Android RadarSDK version
sed_inplace "s/def radar_sdk_version = '(.+)'/def radar_sdk_version = '$android_version'/" android/build.gradle
echo " - Android complete"

# update iOS RadarSDK version
sed_inplace 's/s.dependency "RadarSDK", "(.+)"/s.dependency "RadarSDK", "'$ios_version'"/' Radar.podspec
echo " - iOS complete"

########################################################
# test build
echo "\033[0;32mBuilding react-native-radar\033[0m"
npm run build-all

echo "\033[0;32mBuilding example app\033[0m"
(cd example && npm run install-radar-rebuild)
