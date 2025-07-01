# Migration guides

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
