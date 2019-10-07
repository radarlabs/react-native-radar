![Radar](https://raw.githubusercontent.com/radarlabs/react-native-radar/master/logo.png)

[![npm](https://img.shields.io/npm/v/react-native-radar.svg)](https://www.npmjs.com/package/react-native-radar)

[Radar](https://radar.io) is the location platform for mobile apps.

## Installation

Install the package from npm:

```bash
npm install --save react-native-radar
```

If you are using `create-react-app`, you must run `npm run eject` to [eject](https://github.com/facebookincubator/create-react-app#converting-to-a-custom-setup) and expose native code. Or, if you are using Expo, you must run `exp detach` to [detach](https://docs.expo.io/versions/latest/guides/detach.html) and expose native code.

Then, install the native dependencies:

```bash
react-native link react-native-radar
```

If you do not install the native dependencies, you will get an error at run time: `NativeModules.RNRadar is undefined`

Finally, before writing any JavaScript, you must integrate the Radar SDK with your iOS and Android apps by following the *Configure project* and *Add SDK to project* steps in the [SDK documentation](https://radar.io/documentation/sdk).

On iOS, you must add location usage descriptions and background modes to your `Info.plist`, then add the SDK to your project, preferably using CocoaPods. Finally, initialize the SDK in `application:didFinishLaunchingWithOptions:` in `AppDelegate.m`, passing in your Radar publishable API key.

```objc
#import <RadarSDK/RadarSDK.h>

// ...

[Radar initializeWithPublishableKey:publishableKey];
```

On Android, you must add the Google Play Services library to your project, then add the SDK to your project, preferably using Gradle. Finally, initialize the SDK in `onCreate()` in `MainApplication.java`, passing in your Radar publishable API key:

```java
import io.radar.sdk.Radar;

// ...

Radar.initialize(publishableKey);
```

To get a Radar publishable API key, [sign up for a Radar account](https://radar.io).

## Usage

### Import module

First, import the module:

```javascript
import Radar from 'react-native-radar';
```

### Enable Places

If you are using Places, you must set Facebook as your place data provider.

To set Facebook as your place data provider, call:

```javascript
Radar.setPlacesProvider('facebook');
```

To disable Places later, call:

```javascript
Radar.setPlacesProvider('none');
```

Learn more about [Places](https://radar.io/documentation/places).

### Identify user

Until you identify the user, Radar will automatically identify the user by device ID.

To identify the user when logged in, call:

```javascript
Radar.setUserId(userId);
```

where `userId` is a stable unique ID string for the user.

Do not send any PII, like names, email addresses, or publicly available IDs, for `userId`. See [privacy best practices](https://help.radar.io/privacy/what-are-privacy-best-practices-for-radar) for more information.

To set an optional dictionary of custom metadata for the user, call:

```javascript
Radar.setMetadata(metadata);
```

where `metadata` is a JSON object with up to 16 keys and values of type string, boolean, or number.

Finally, to set an optional description for the user, displayed in the dashboard, call:

```javascript
Radar.setDescription(description);
```

where `description` is a string.

You only need to call these functions once, as these settings will be persisted across app sessions.

### Request permissions

Before tracking the user's location, the user must have granted location permissions for the app.

To determine the whether user has granted location permissions for the app, call:

```javascript
Radar.getPermissionsStatus().then((status) => {
  // do something with status
});
```

`status` will be a string, one of:

- `GRANTED`
- `DENIED`
- `UNKNOWN`

To request location permissions for the app, call:

```javascript
Radar.requestPermissions(background);
```

where `background` is a boolean indicating whether to request background location permissions or foreground location permissions. On Android, `background` will be ignored.

### Foreground tracking

Once you have initialized the SDK, you have identified the user, and the user has granted permissions, you can track the user's location.

To track the user's location in the foreground, call:

```javascript
Radar.trackOnce().then((result) => {
  // do something with result.location, result.events, result.user.geofences
}).catch((err) => {
  // optionally, do something with err
});
```

`err` will be a string, one of:

- `ERROR_PUBLISHABLE_KEY`: the SDK was not initialized
- `ERROR_PERMISSIONS`: the user has not granted location permissions for the app
- `ERROR_LOCATION`: location services were unavailable, or the location request timed out
- `ERROR_NETWORK`: the network was unavailable, or the network connection timed out
- `ERROR_UNAUTHORIZED`: the publishable API key is invalid
- `ERROR_SERVER`: an internal server error occurred
- `ERROR_UNKNOWN`: an unknown error occurred

### Background tracking

Once you have initialized the SDK, you have identified the user, and the user has granted permissions, you can start tracking the user's location in the background.

To start tracking the user's location in the background, call:

```javascript
Radar.startTracking();
```

Assuming you have configured your project properly, the SDK will wake up while the user is moving (usually every 3-5 minutes), then shut down when the user stops (usually within 5-10 minutes). To save battery, the SDK will not wake up when stopped, and the user must move at least 100 meters from a stop (sometimes more) to wake up the SDK. **Note that location updates may be delayed significantly by iOS [Low Power Mode](https://support.apple.com/en-us/HT205234), by Android [Doze Mode and App Standby](https://developer.android.com/training/monitoring-device-state/doze-standby.html) and [Background Location Limits](https://developer.android.com/about/versions/oreo/background-location-limits.html), or if the device has connectivity issues, low battery, or wi-fi disabled. These constraints apply to all uses of background location services on iOS and Android, not just Radar. See more about [accuracy and reliability](https://radar.io/documentation/sdk#accuracy).**

Optionally, you can configure advanced tracking options. See the [iOS background tracking documentation](https://radar.io/documentation/sdk#ios-background) and [Android background tracking documentation](https://radar.io/documentation/sdk#android-background) for descriptions of these options.

```javascript
Radar.startTracking({
  priority: 'responsiveness', // // use 'efficiency' to avoid Android vitals bad behavior thresholds
  sync: 'possibleStateChanges', // use 'all' to sync all location updates ('possibleStateChanges' recommended)
  offline: 'replayStopped' // use 'replayOff' to disable offline replay ('replayStopped' recommended)
});
```

To stop tracking the user's location in the background (e.g., when the user logs out), call:

```javascript
Radar.stopTracking();
```

You only need to call these methods once, as these settings will be persisted across app sessions.

To listen for events, location updates, and errors, you can add event listeners:

```javascript
Radar.on('events', (result) => {
  // do something with result.events, result.user
});

Radar.on('location', (result) => {
  // do something with result.location, result.user
});

Radar.on('error', (err) => {
  // do something with err
});
```

Add event listeners outside of your component lifecycle (e.g., outside of `componentDidMount`) if you want them to work when the app is in the background.

You can also remove event listeners:

```javascript
Radar.off('events');

Radar.off('location');

Radar.off('error');
```

### Battery usage

For most users, background tracking with the native iOS and Android SDKs uses 1-2% battery per day. Learn more in the in the [SDK documentation](https://radar.io/documentation/sdk).

Because React Native loads and parses your JavaScript bundle on each app launch, and because background tracking may launch the app in the background, background tracking with the React Native module can increase battery usage.

On iOS, the app loads and parses the JavaScript bundle when the app is launched. If you do not want to receive events in JavaScript and you want to disable this in the background, check `launchOptions` for the `UIApplicationLaunchOptionsLocationKey` to conditionally parse and load the JavaScript bundle. Learn more about this key [here](https://developer.apple.com/documentation/uikit/uiapplicationlaunchoptionslocationkey).

On Android, a receiver in the React Native module loads and parses the JavaScript bundle when the app is launched in the background. If you do not want to receive events in JavaScript and you want to disable this, add an override to your manifest:

```xml
<receiver
  tools:replace="android:enabled"
  android:name="io.radar.react.RNRadarReceiver"
  android:enabled="false"
  android:exported="false" />
```

### Manual tracking

You can manually update the user's location by calling:

```javascript
const location = {
  latitude: 39.2904,
  longitude: -76.6122,
  accuracy: 65
};

Radar.updateLocation(location).then((result) => {
  // do something with result.events, result.user.geofences
}).catch((err) => {
  // optionally, do something with err
});
```
