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

const getLocation = () => {
  NativeModules.RNRadar.getLocation();
};

const trackOnce = (location) => {
  if (location) {
    NativeModules.RNRadar.trackOnce(location);
  } else {
    NativeModules.RNRadar.trackOnce();
  }
};

const startTracking = (options) => {
  NativeModules.RNRadar.startTracking(options);
};

const stopTracking = () => {
  NativeModules.RNRadar.stopTracking();
};

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

const getContext = (location) => {
  NativeModules.RNRadar.getContext(location);
};

const searchPlaces = (near, radius, chains, categories, groups, limit) => {
  NativeModules.RNRadar.searchPlaces(radius, chains, categories, groups, limit, near);
};

const searchGeofences = (near, radius, tags, limit) => {
  NativeModules.RNRadar.searchGeofences(radius, tags, limit, near);
};

const searchPoints = (near, radius, tags, limit) => {
  NativeModules.RNRadar.searchGeofences(radius, tags, limit, near);
};

const autocomplete = (query, near, limit) => {
  NativeModules.RNRadar.searchGeofences(query, near, limit);
};

const geocode = (address) => {
  NativeModules.RNRadar.geocode(address);
};

const reverseGeocode = (location) => {
  NativeModules.RNRadar.reverseGeocode(location);
};

const ipGeocode = () => {
  NativeModules.RNRadar.ipGeocode();
};

const getDistance = (origin, destination) => {
  NativeModules.RNRadar.getDistance(origin, destination);
};

const Radar = {
  setUserId,
  setDescription,
  setMetadata,
  getPermissionsStatus,
  requestPermissions,
  getLocation,
  trackOnce,
  startTracking,
  stopTracking,
  acceptEvent,
  rejectEvent,
  on,
  off,
  getContext,
  searchPlaces,
  searchGeofences,
  searchPoints,
  autocomplete,
  geocode,
  reverseGeocode,
  ipGeocode,
  getDistance,
};

export default Radar;
