import RadarJS from 'radar-sdk-js';
import { version } from "../package.json";

let throws = false;
const throwOnUnimplemented = (value) => {
  throws = value
}

const initialize = (publishableKey) => {
  RadarJS.initialize(publishableKey);
}

const setLogLevel = (level) => {
  if (throws) throw new Error("setLogLevel() is not implemented on web");
};

const setUserId = (userId) => {
  RadarJS.setUserId(userId);
};

const getUserId = () => {
  if (throws) throw new Error("getUserId() is not implemented on web");
  return new Promise((resolve, reject) => { reject("getUserId() is not implemented on web") });
}

const setDeviceId = (deviceId, installId) => {
  RadarJS.setDeviceId(deviceId, installId);
}
const setDeviceType = (deviceType) => {
  RadarJS.setDeviceType(deviceType);
}

const setRequestHeaders = (headers) => {
  RadarJS.setRequestHeaders(headers);
}

const setDescription = (description) => {
  RadarJS.setDescription(description);
};

const getDescription = () => {
  if (throws) throw new Error("getDescription() is not implemented on web");
  return new Promise((resolve, reject) => { reject("getDescription() is not implemented on web") });
}

const setMetadata = (metadata) => {
  RadarJS.setMetadata(metadata);
};

const getMetadata = () => {
  if (throws) throw new Error("getMetadata() is not implemented on web");
  return new Promise((resolve, reject) => { reject("getMetadata() is not implemented on web") });
}

const setAnonymousTrackingEnabled = () => {
  if (throws) throw new Error("setAnonymousTrackingEnabled() is not implemented on web");
}

const getPermissionsStatus = () => {
  return new Promise(resolve => {
    const navigator = window.navigator;

    if (!navigator.permissions) {
      resolve({
        status: 'UNKNOWN'
      });
    } else {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        resolve({
          status: result.state === 'granted' ? 'GRANTED_FOREGROUND' : 'DENIED',
        });
      });
    }
  });
};

const requestPermissions = (background) => {
  if (throws) throw new Error("requestPermissions() is not implemented on web");
  return new Promise((resolve, reject) => { reject("requestPermissions() is not implemented on web") });
};

const getLocation = () => {
  return new Promise((resolve, reject) => {    
    RadarJS.getLocation((err, result) => {
      if (err)
        reject(err);
      else
        resolve(result);
    })
  });
};

const trackOnce = (options) => {
  return new Promise((resolve, reject) => {
    const callback = (err, { status, location, user, events }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          location,
          user,
          events,
        });
      }
    };

    if (options) {
      RadarJS.trackOnce(options.location ? options.location : options, callback);
    } else {
      RadarJS.trackOnce(callback);
    }
  });
};

const trackVerified = () => {
  if (throws) throw new Error("trackVerified() is not implemented on web");
  return new Promise((resolve, reject) => { reject("trackVerified() is not implemented on web") });
};

const getVerifiedLocationToken = () => {
  if (throws) throw new Error("getVerifiedLocationToken() is not implemented on web");
  return new Promise((resolve, reject) => { reject("getVerifiedLocationToken() is not implemented on web") });
};

const startVerifyServer = () => {  
  if (throws) throw new Error("startVerifyServer() is not implemented on web");
};

const stopVerifyServer = () => {  
  if (throws) throw new Error("stopVerifyServer() is not implemented on web");
};

const startTrackingEfficient = () => {  
  if (throws) throw new Error("startTrackingEfficient() is not implemented on web");
};

const startTrackingResponsive = () => {
  if (throws) throw new Error("startTrackingResponsive() is not implemented on web");
};

const startTrackingContinuous = () => {
  if (throws) throw new Error("startTrackingContinuous() is not implemented on web");
};

const startTrackingCustom = (options) => {
  if (throws) throw new Error("startTrackingCustom() is not implemented on web");
};

const startTrackingVerified = (options) => {
  if (throws) throw new Error("startTrackingVerified() is not implemented on web");
}

const mockTracking = (options) => {
  if (throws) throw new Error("mockTracking() is not implemented on web");
};

const stopTracking = () => {
  if (throws) throw new Error("stopTracking() is not implemented on web");
};

const stopTrackingVerified = () => {
  if (throws) throw new Error("stopTrackingVerified() is not implemented on web");
}

const isTracking = () => {
  if (throws) throw new Error("isTracking() is not implemented on web");
  return new Promise((resolve, reject) => { reject("isTracking() is not implemented on web") });
}

const getTrackingOptions = () => {
  if (throws) throw new Error("getTrackingOptions() is not implemented on web");
  return new Promise((resolve, reject) => { reject("getTrackingOptions() is not implemented on web") });
}

const isUsingRemoteTrackingOptions = () => {
  if (throws) throw new Error("isUsingRemoteTrackingOptions() is not implemented on web");
  return new Promise((resolve, reject) => { reject("isUsingRemoteTrackingOptions() is not implemented on web") });
}

const setForegroundServiceOptions = (options) => {
  if (throws) throw new Error("setForegroundServiceOptions() is not implemented on web");
};

const setNotificationOptions = (options) => {
  if (throws) throw new Error("setNotificationOptions() is not implemented on web");
}

const getTripOptions = () => {
  if (throws) throw new Error("getTripOptions() is not implemented on web");
  return new Promise((resolve, reject) => { reject("getTripOptions() is not implemented on web") });
}

const startTrip = (options) => {
  if (options.tripOptions) {
    options = options.tripOptions;
  }
  console.log(options)
  return new Promise((resolve, reject) => {
    const callback = (err, { trip, events, status }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          trip,
          events,
          status
        });
      }
    };

    RadarJS.startTrip(options, callback);
  });
};

const completeTrip = () => {
  return new Promise((resolve, reject) => {
    const callback = (err, { trip, events, status }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          trip,
          events,
          status
        });
      }
    };
    
    RadarJS.completeTrip(callback);
  });
};

const cancelTrip = () => {
  return new Promise((resolve, reject) => {
    const callback = (err, { trip, events, status }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          trip,
          events,
          status
        });
      }
    };
    
    RadarJS.cancelTrip(callback);
  });
};

const updateTrip = (tripOptions) => {  
  return new Promise((resolve, reject) => {
    const callback = (err, { trip, events, status }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          trip,
          events,
          status
        });
      }
    };
    
    RadarJS.updateTrip(tripOptions.options, tripOptions.status, callback);
  });
};

const acceptEvent = (eventId, verifiedPlaceId) => {
  if (throws) throw new Error("acceptEvent() is not implemented on web");
};

const rejectEvent = (eventId) => {
  if (throws) throw new Error("rejectEvent() is not implemented on web");
};

const getContext = (options) => {
  return new Promise((resolve, reject) => {
    const callback = (err, { status, location, context }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          location,
          context,
        });
      }
    };

    if (options) {
      RadarJS.getContext(options, callback);
    } else {
      RadarJS.getContext(callback);
    }
  });
};

const searchPlaces = (options) => {
  return new Promise((resolve, reject) => {
    RadarJS.searchPlaces(options, (err, { status, location, places }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          location,
          places,
        });
      }
    });
  });
};

const searchGeofences = (options) => {
  return new Promise((resolve, reject) => {
    RadarJS.searchGeofences(options, (err, { status, location, geofences }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          location,
          geofences,
        });
      }
    });
  });
};

const autocomplete = (options) => {
  return new Promise((resolve, reject) => {
    RadarJS.autocomplete(options, (err, { status, addresses }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          addresses,
        });
      }
    });
  });
};

const geocode = (options) => {
  return new Promise((resolve, reject) => {
    let newOptions = options;
    if (typeof options === 'string') {
      newOptions = {
        query: options
      };
    } else if (options.address) {
      newOptions.query = options.address;
    }
    RadarJS.geocode(newOptions, (err, { status, addresses }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          addresses,
        });
      }
    });
  });
};

const reverseGeocode = (options) => {
  return new Promise((resolve, reject) => {
    const callback = (err, { status, addresses }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          addresses,
        });
      }
    };

    if (options) {
      RadarJS.reverseGeocode(options, callback);
    } else {
      RadarJS.reverseGeocode(callback);
    }
  });
};

const ipGeocode = () => {
  return new Promise((resolve, reject) => {
    RadarJS.ipGeocode((err, { status, address }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          address,
        });
      }
    });
  });
};

const validateAddress = (options) => {
  return new Promise((resolve, reject) => {
    RadarJS.validateAddress(options, (err, { status, address }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          address
        })
      }
    });
  })
};

const getDistance = (options) => {
  return new Promise((resolve, reject) => {
    RadarJS.getDistance(options, (err, { status, routes }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          status,
          routes,
        });
      }
    });
  });
};

const getMatrix = (options) => {
  return new Promise((resolve, reject) => {
    RadarJS.getMatrix(options, (err, { origins, destinations, matrix, status }) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          origins,
          destinations,
          matrix,
          status,
        });
      }
    });
  });
};

const logConversion = (options) => {
  if (throws) throw new Error("logConversion() is not implemented on web");
  return new Promise((resolve, reject) => { reject("logConversion() is not implemented on web") });
}

const sendEvent = (name, metadata) => {
  if (throws) throw new Error("sendEvent() is not implemented on web");
}

const on = (event, callback) => {
  if (throws) throw new Error("on() is not implemented on web");
};

const off = (event, callback) => {
  if (throws) throw new Error("off() is not implemented on web");
};

const nativeSdkVersion = () => {
  return new Promise((resolve, reject) => { resolve(RadarJS.VERSION) });
}

const rnSdkVersion = () => version;

const Radar = {
  initialize,
  setLogLevel,
  setUserId,
  getUserId,
  setDescription,
  getDescription,
  setMetadata,
  getMetadata,
  setAnonymousTrackingEnabled,
  getPermissionsStatus,
  requestPermissions,
  getLocation,
  trackOnce,
  trackVerified,
  getVerifiedLocationToken,
  startTrackingEfficient,
  startTrackingResponsive,
  startTrackingContinuous,
  startTrackingCustom,
  startTrackingVerified,
  mockTracking,
  stopTracking,
  stopTrackingVerified,
  isTracking,
  getTrackingOptions,
  isUsingRemoteTrackingOptions,
  setForegroundServiceOptions,
  setNotificationOptions,
  getTripOptions,
  startTrip,
  completeTrip,
  cancelTrip,
  updateTrip,
  acceptEvent,
  rejectEvent,
  getContext,
  searchPlaces,
  searchGeofences,
  autocomplete,
  geocode,
  reverseGeocode,
  ipGeocode,
  validateAddress,
  getDistance,
  getMatrix,
  logConversion,
  sendEvent,
  on,
  off,
  nativeSdkVersion,
  rnSdkVersion,

  // only for web, these should be called via RadarRNWeb instead of Radar for typing
  throwOnUnimplemented,
  setDeviceId,
  setDeviceType,
  setRequestHeaders,
};

export default Radar;