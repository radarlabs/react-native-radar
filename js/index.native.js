import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

if (!NativeModules.RNRadar && (Platform.OS === 'ios' || Platform.OS === 'android')) {
  throw new Error('NativeModules.RNRadar is undefined');
}

const eventEmitter = new NativeEventEmitter(NativeModules.RNRadar);

const setLogLevel = (level) => {
  NativeModules.RNRadar.setLogLevel(level);
};

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

const requestPermissions = background => (
  NativeModules.RNRadar.requestPermissions(background)
);

const getLocation = () => (
  NativeModules.RNRadar.getLocation()
);

const trackOnce = options => {
  let backCompatibleOptions = options;
  if (options && options.latitude) {
    backCompatibleOptions = {
      location: {
        ...options
      }
    }
  }
  return NativeModules.RNRadar.trackOnce(backCompatibleOptions)
};

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

const setForegroundServiceOptions = options => (
  NativeModules.RNRadar.setForegroundServiceOptions(options)
);

const startTrip = options => (
  NativeModules.RNRadar.startTrip(options)
);

const completeTrip = () => (
  NativeModules.RNRadar.completeTrip()
);

const cancelTrip = () => (
  NativeModules.RNRadar.cancelTrip()
);

const updateTrip = options => (
  NativeModules.RNRadar.updateTrip(options)
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

const getMatrix = options => (
  NativeModules.RNRadar.getMatrix(options)
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
  setLogLevel,
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
  setForegroundServiceOptions,
  acceptEvent,
  rejectEvent,
  startTrip,
  updateTrip,
  completeTrip,
  cancelTrip,
  getContext,
  searchPlaces,
  searchGeofences,
  autocomplete,
  geocode,
  reverseGeocode,
  ipGeocode,
  getDistance,
  getMatrix,
  on,
  off,
};

export default Radar;
