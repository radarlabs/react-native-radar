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

const getLocation = () => (
  NativeModules.RNRadar.getLocation()
);

const trackOnce = location => (
  NativeModules.RNRadar.trackOnce(location)
);

const startTrackingEfficient = () => (
  NativeModules.RNRadar.startTrackingEfficient()
);

const startTrackingResponsive = () => (
  NativeModules.RNRadar.startTrackingResponsive()
);

const startTrackingContinuous = () => (
  NativeModules.RNRadar.startTrackingContinuous()
);

const startTrackingCustom = options => (
  NativeModules.RNRadar.startTrackingCustom(options)
);

const mockTracking = options => (
  NativeModules.RNRadar.mockTracking(options)
);

const stopTracking = () => (
  NativeModules.RNRadar.stopTracking()
);

const startTrip = options => (
  NativeModules.RNRadar.startTrip(options)
);

const stopTrip = () => (
  NativeModules.RNRadar.stopTrip()
);

const acceptEvent = (eventId, verifiedPlaceId) => (
  NativeModules.RNRadar.acceptEvent(eventId, verifiedPlaceId)
);

const rejectEvent = eventId => (
  NativeModules.RNRadar.rejectEvent(eventId)
);

const getContext = location => (
  NativeModules.RNRadar.getContext(location)
);

const searchPlaces = options => (
  NativeModules.RNRadar.searchPlaces(options)
);

const searchGeofences = options => (
  NativeModules.RNRadar.searchGeofences(options)
);

const searchPoints = options => (
  NativeModules.RNRadar.searchPoints(options)
);

const autocomplete = options => (
  NativeModules.RNRadar.autocomplete(options)
);

const geocode = address => (
  NativeModules.RNRadar.geocode(address)
);

const reverseGeocode = location => (
  NativeModules.RNRadar.reverseGeocode(location)
);

const ipGeocode = () => (
  NativeModules.RNRadar.ipGeocode()
);

const getDistance = options => (
  NativeModules.RNRadar.getDistance(options)
);

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
  getLocation,
  trackOnce,
  startTrackingEfficient,
  startTrackingResponsive,
  startTrackingContinuous,
  startTrackingCustom,
  mockTracking,
  stopTracking,
  acceptEvent,
  rejectEvent,
  startTrip,
  stopTrip,
  getContext,
  searchPlaces,
  searchGeofences,
  searchPoints,
  autocomplete,
  geocode,
  reverseGeocode,
  ipGeocode,
  getDistance,
  on,
  off,
};

export default Radar;
