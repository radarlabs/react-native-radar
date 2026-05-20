# Migration guides

## 3.x to <4.0>

### Breaking: Minimum dependency versions raised

| Dependency | Previous | New |
|---|---|---|
| `react` | `>= 16.8.6` | `>= 19.1.0` |
| `react-native` | `>= 0.60.0` | `>= 0.80.0` |
| `@maplibre/maplibre-react-native` | `>= 10.2.1` | `^11.0.0` |

### Recommended: `react-native-safe-area-context`

- `react-native-safe-area-context` `^5.6.2` is now an optional peer dependency. If installed, the `RadarAutocomplete` component will use it automatically. If not installed, it falls back to the deprecated `SafeAreaView` from `react-native`.

### Steps to upgrade

1. Upgrade React and React Native:
```bash
npm install react@^19.1.0 react-native@^0.80.0
```

2. Upgrade MapLibre React Native:
```bash
npm install @maplibre/maplibre-react-native@^11.0.0
```

3. (Recommended) Install `react-native-safe-area-context` if not already present:
```bash
npm install react-native-safe-area-context@^5.6.2
```

### New: `mapRef` option

You can now pass a ref to the underlying MapLibre Map component via `mapOptions.mapRef` to access imperative map methods like `getCenter()`, `getZoom()`, `getBounds()`, etc.

```tsx
import { useRef } from 'react';
import type { MapRef } from '@maplibre/maplibre-react-native';

const mapRef = useRef<MapRef>(null);
<RadarMap mapOptions={{ mapRef }} />
```

### Breaking: `Radar.trackVerified()` now requires opting in to the fraud module 

*iOS** 

In 3.x, the iOS Radar SDK shipped attestation/fraud detection inline within the main `RadarSDK`. In 4.x, `react-native-radar` vendors `RadarSDK.xcframework` and `RadarSDKMotion.xcframework` directly, and fraud detection lives in a separate `RadarSDKFraud.xcframework` that you must opt into. If you call `Radar.trackVerified()` without opting in, it will reject with `ERROR_PLUGIN`.

**Expo users**: set `iosFraud: true` in your `react-native-radar` config plugin, then re-run prebuild and pod install:

```bash
npx expo prebuild --clean
cd ios && pod install
```

This also configures SSL pinning to `api-verified.radar.io` in `Info.plist` (existing behavior in 3.x).

**Bare React Native users**: add the following to your `ios/Podfile` inside the target block, then run `pod install`:

```ruby
pod 'RadarSDKFraud', :path => '../node_modules/react-native-radar'
```

**Android** 

set `androidFraud: true` in your `react-native-radar` config plugin, then re-run prebuild and a clean Android build:
```bash
npx expo prebuild --clean
```
This adds `io.radar:sdk-fraud` (and `com.google.android.play:integrity`) to your `android/app/build.gradle`, plus `network_security_config.xml` for SSL pinning.
**Bare React Native users**: add the following to your `android/app/build.gradle` `dependencies` block:
```groovy
implementation "io.radar:sdk-fraud:1.1.0"
implementation "com.google.android.play:integrity:1.2.0"
```

## 3.20.x to 3.21.x

- `Radar.on()` and `Radar.off()` calls are deprecated, the new interfaces are
```
  onLocationUpdate: (callback: RadarLocationUpdateCallback) => void;
  clearLocationUpdate: () => void;
  onClientLocationUpdate: (callback: RadarClientLocationUpdateCallback) => void;
  clearClientLocationUpdate: () => void;
  onError: (callback: RadarErrorCallback) => void;
  clearError: () => void;
  onLog: (callback: RadarLogUpdateCallback) => void;
  clearLog: () => void;
  onEventUpdate: (callback: RadarEventUpdateCallback) => void;
  clearEventUpdate: () => void;
  onTokenUpdate: (callback: RadarTokenUpdateCallback) => void;
  clearTokenUpdate: () => void;
```

## 3.9.x to 3.10.0

- Web support is no longer included in default export and is now a separate export `RadarRNWeb`. Call `import Radar, { RadarRNWeb } from 'react-native-radar'`

## 3.9.x to 3.9.2
- On `options` for `autocompleteUI`, `threshold` is now `minCharacters`.
