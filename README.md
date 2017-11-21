![Radar](https://raw.githubusercontent.com/radarlabs/react-native-radar/master/logo.png)

[![npm version](https://badge.fury.io/js/react-native-radar.svg)](https://badge.fury.io/js/react-native-radar)

[Radar](https://www.onradar.com) is the location platform for mobile apps.

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

Finally, before writing any JavaScript, you must integrate the Radar SDK with your iOS and Android apps by following the *Configure project* and *Add SDK to project* steps in the [SDK documentation](https://www.onradar.com/documentation/sdk).

On iOS, you must add location usage descriptions and background modes to your `Info.plist`, then add the SDK to your project, preferably using CocoaPods. Finally, initialize the SDK in `application:didFinishLaunchingWithOptions:` in `AppDelegate.m`, passing in your publishable API key.

```objc
#import <RadarSDK/RadarSDK.h>

// ...

[Radar initializeWithPublishableKey:publishableKey];
```

On Android, you must add the Google Play Services library to your project, then add the SDK to your project, preferably using Gradle. Finally, initialize the SDK in `onCreate()` in `MainApplication.java`, passing in your publishable API key:

```java
import com.onradar.sdk.Radar;

// ...

Radar.initialize(getApplicationContext(), publishableKey);
```

## Usage

### Import module

First, import the module:

```js
import Radar from 'react-native-radar';
```

### Identify user

Before tracking the user's location, you must identify the user to Radar. To identify the user, call:

```js
Radar.setUserId(userId);
```

where `userId` is a stable unique ID string for the user.

To set an optional description for the user, displayed in the dashboard, call:

```js
Radar.setDescription(description);
```

where `description` is a string.

You only need to call these methods once, as these settings will be persisted across app sessions.

### Request permissions

Before tracking the user's location, the user must have granted location permissions for the app.

To determine the whether user has granted location permissions for the app, call:

```js
Radar.getPermissionsStatus().then((status) => {
  // do something with status
});
```

`status` will be a string, one of:

- `GRANTED`
- `DENIED`
- `UNKNOWN`

To request location permissions for the app, call:

```js
Radar.requestPermissions(background);
```

where `background` is a boolean indicating whether to request background location permissions or foreground location permissions. On Android, `background` will be ignored.

### Foreground tracking

Once you have initialized the SDK, you have identified the user, and the user has granted permissions, you can track the user's location.

To track the user's location in the foreground, call:

```js
Radar.trackOnce().then((result) => {
  // do something with result.location, result.events, result.user.geofences
}).catch((err) => {
  // optionally, do something with err
});
```

`err` will be a string, one of:

- `ERROR_PUBLISHABLE_KEY`: the SDK was not initialized
- `ERROR_USER_ID`: the user was not identified
- `ERROR_PERMISSIONS`: the user has not granted location permissions for the app
- `ERROR_LOCATION`: location services were unavailable, or the location request timed out
- `ERROR_NETWORK`: the network was unavailable, or the network connection timed out
- `ERROR_UNAUTHORIZED`: the publishable API key is invalid
- `ERROR_SERVER`: an internal server error occurred
- `ERROR_UNKNOWN`: an unknown error occurred

### Background tracking

Once you have initialized the SDK, you have identified the user, and the user has granted permissions, you can start tracking the user's location in the background.

To start tracking the user's location in the background, call:

```js
Radar.startTracking();
```

To stop tracking the user's location in the background (e.g., when the user logs out), call:

```js
Radar.stopTracking();
```

You only need to call these methods once, as these settings will be persisted across app sessions.

To listen for events, location updates, and errors, you can add event listeners:

```js
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

```js
Radar.off('events');

Radar.off('location');

Radar.off('error');
```

### Manual tracking

You can manually update the user's location by calling:

```js
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

## Support

Have questions? We're here to help! Email us at [support@onradar.com](mailto:support@onradar.com).
