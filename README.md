![Radar](https://raw.githubusercontent.com/radarlabs/react-native-radar/master/logo.png)

[![npm](https://img.shields.io/npm/v/react-native-radar.svg)](https://www.npmjs.com/package/react-native-radar)

[Radar](https://radar.com) is the leading geofencing and location tracking platform.

The Radar SDK abstracts away cross-platform differences between location services, allowing you to add geofencing, location tracking, trip tracking, geocoding, and search to your apps with just a few lines of code.

## Documentation

See the Radar overview documentation [here](https://radar.com/documentation).

Then, see the Radar React Native module documentation [here](https://radar.com/documentation/sdk/react-native).

## Examples

See an example app in `example/`.

Setup Radar public key check pre-commit hook with `cp -r hooks .git` to prevent accidental key leak when working with the Example app.

To run example app with local `react-native-radar` dependency:

- install node dependencies with `npm ci` and typescript if needed with `npm install -g typescript`.
- build local `react-native-radar` with `npm run build-all`.
- navigate to the example dir with `cd example`.
- install node dependency of example with `npm ci`.
- build native app using expo pre-build and `react-native-plugin` with `npm run install-radar-rebuild`.
- run iOS and android example app with `npx expo run:ios` or `npx expo run:android`.

To run example app with local `RadarSDK` native dependencies:

- open `example/app.json`
- to use your local android sdk, set `androidLocalRadarSdkPath` to your local android sdk folder (e.g. `"../../radar-sdk-android"`).
- to use your local ios sdk, set `iosLocalRadarSdkPath` to your local ios sdk folder (e.g. `"../../radar-sdk-ios"`).
- follow the steps listed above to rebuild and reinstall your `react-native-radar` dependency.


## Support

Have questions? We're here to help! Email us at [support@radar.com](mailto:support@radar.com).
