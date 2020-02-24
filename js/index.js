import { NativeEventEmitter, NativeModules } from 'react-native';

if (!NativeModules.RNRadar) {
  throw new Error('NativeModules.RNRadar is undefined');
}

const eventEmitter = new NativeEventEmitter(NativeModules.RNRadar);

const setUserId = (userId) => {
  NativeModules.RNRadar.setUserId(userId);
};

const setDescription = (description) => {
  NativeModules.RNRadar.setDescription(description);
};

const setMetadata = (metadata) => {
  NativeModules.RNRadar.setMetadata(metadata);
};

const getPermissionsStatus = () => (
  NativeModules.RNRadar.getPermissionsStatus()
);

const requestPermissions = (background) => {
  NativeModules.RNRadar.requestPermissions(background);
};

const startTracking = (options) => {
  NativeModules.RNRadar.startTracking(options);
};

const stopTracking = () => {
  NativeModules.RNRadar.stopTracking();
};

const trackOnce = () => (
  NativeModules.RNRadar.trackOnce()
);

const trackOnce = location => (
  if (location) {
    NativeModules.RNRadar.trackOnce(location);
  } else {
    NativeModules.RNRadar.trackOnce();
  }
);

const acceptEvent = (eventId, verifiedPlaceId) => {
  NativeModules.RNRadar.acceptEvent(eventId, verifiedPlaceId);
};

const rejectEvent = (eventId) => {
  NativeModules.RNRadar.rejectEvent(eventId);
};

const on = (event, callback) => (
  eventEmitter.addListener(event, callback)
);

const off = (event, callback) => {
  if (callback) {
    eventEmitter.removeListener(event, callback);
  } else {
    eventEmitter.removeAllListeners(event);
  }
};

const Radar = {
  setUserId,
  setDescription,
  setMetadata,
  getPermissionsStatus,
  requestPermissions,
  startTracking,
  stopTracking,
  trackOnce,
  acceptEvent,
  rejectEvent,
  on,
  off,
};

export default Radar;
