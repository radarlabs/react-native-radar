# Migration guides

## 3.x to <4.0>

### Breaking: Minimum dependency versions raised

| Dependency | Previous | New |
|---|---|---|
| `react` | `>= 16.8.6` | `>= 19.1.0` |
| `react-native` | `>= 0.60.0` | `>= 0.80.0` |
| `@maplibre/maplibre-react-native` | `>= 10.2.1` | `>= 11.0.0-beta.10` |

### Breaking: New required peer dependency

- `react-native-safe-area-context` `^5.6.2`

### Steps to upgrade

1. Upgrade React and React Native:
```bash
npm install react@^19.1.0 react-native@^0.80.0
```

2. Upgrade MapLibre React Native:
```bash
npm install @maplibre/maplibre-react-native@^11.0.0-beta.6
```

3. Install `react-native-safe-area-context` if not already present:
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
