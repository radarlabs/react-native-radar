"use strict";

import Radar from "./NativeRadar.js";
export function multiply(a, b) {
  return Radar.multiply(a, b);
}
export function initialize(publishableKey, fraud) {
  return Radar.initialize(publishableKey, fraud);
}
export function requestPermissions(background) {
  return Radar.requestPermissions(background);
}
export function trackOnce() {
  return Radar.trackOnce();
}
export const locationEmitter = Radar.locationEmitter;
//# sourceMappingURL=index.js.map