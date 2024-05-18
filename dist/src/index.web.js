"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const radar_sdk_js_1 = __importDefault(require("radar-sdk-js"));
const initialize = (publishableKey) => {
    radar_sdk_js_1.default.initialize(publishableKey);
};
const setLogLevel = (level) => {
    // not implemented
};
const setUserId = (userId) => {
    radar_sdk_js_1.default.setUserId(userId);
};
const setDeviceId = (deviceId, installId) => {
    radar_sdk_js_1.default.setDeviceId(deviceId, installId);
};
const setDeviceType = (deviceType) => {
    radar_sdk_js_1.default.setDeviceType(deviceType);
};
const setRequestHeaders = (headers) => {
    radar_sdk_js_1.default.setRequestHeaders(headers);
};
const setDescription = (description) => {
    radar_sdk_js_1.default.setDescription(description);
};
const setMetadata = (metadata) => {
    radar_sdk_js_1.default.setMetadata(metadata);
};
const getPermissionsStatus = () => {
    return new Promise(resolve => {
        const navigator = window.navigator;
        if (!navigator.permissions) {
            resolve({
                status: 'UNKNOWN'
            });
        }
        else {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                resolve({
                    status: result.state === 'granted' ? 'GRANTED_FOREGROUND' : 'DENIED',
                });
            });
        }
    });
};
const requestPermissions = background => {
    // not implemented
};
const getLocation = () => {
    return new Promise((resolve, reject) => {
        radar_sdk_js_1.default.getLocation((err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
};
const trackOnce = options => {
    return new Promise((resolve, reject) => {
        const callback = (err, { status, location, user, events }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    status,
                    location,
                    user,
                    events,
                });
            }
        };
        if (options) {
            radar_sdk_js_1.default.trackOnce(options.location ? options.location : options, callback);
        }
        else {
            radar_sdk_js_1.default.trackOnce(callback);
        }
    });
};
const trackVerified = () => {
    // not implemented
};
const trackVerifiedToken = () => {
    // not implemented
};
const startTrackingEfficient = () => {
    // not implemented
};
const startTrackingResponsive = () => {
    // not implemented
};
const startTrackingContinuous = () => {
    // not implemented
};
const startTrackingCustom = options => {
    // not implemented
};
const mockTracking = options => {
    // not implemented
};
const stopTracking = () => {
    // not implemented
};
const setForegroundServiceOptions = options => {
    // not implemented
};
const startTrip = options => {
    return new Promise((resolve, reject) => {
        const callback = (err, { trip, events, status }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    trip,
                    events,
                    status
                });
            }
        };
        radar_sdk_js_1.default.startTrip(options, callback);
    });
};
const completeTrip = () => {
    return new Promise((resolve, reject) => {
        const callback = (err, { trip, events, status }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    trip,
                    events,
                    status
                });
            }
        };
        radar_sdk_js_1.default.completeTrip(callback);
    });
};
const cancelTrip = () => {
    return new Promise((resolve, reject) => {
        const callback = (err, { trip, events, status }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    trip,
                    events,
                    status
                });
            }
        };
        radar_sdk_js_1.default.cancelTrip(callback);
    });
};
const updateTrip = (tripOptions) => {
    return new Promise((resolve, reject) => {
        const callback = (err, { trip, events, status }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    trip,
                    events,
                    status
                });
            }
        };
        radar_sdk_js_1.default.updateTrip(tripOptions.options, tripOptions.status, callback);
    });
};
const acceptEvent = (eventId, verifiedPlaceId) => {
    // not implemented
};
const rejectEvent = eventId => {
    // not implemented
};
const getContext = options => {
    return new Promise((resolve, reject) => {
        const callback = (err, { status, location, context }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    status,
                    location,
                    context,
                });
            }
        };
        if (options) {
            radar_sdk_js_1.default.getContext(options, callback);
        }
        else {
            radar_sdk_js_1.default.getContext(callback);
        }
    });
};
const searchPlaces = options => {
    return new Promise((resolve, reject) => {
        radar_sdk_js_1.default.searchPlaces(options, (err, { status, location, places }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    status,
                    location,
                    places,
                });
            }
        });
    });
};
const searchGeofences = options => {
    return new Promise((resolve, reject) => {
        radar_sdk_js_1.default.searchGeofences(options, (err, { status, location, geofences }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    status,
                    location,
                    geofences,
                });
            }
        });
    });
};
const autocomplete = options => {
    return new Promise((resolve, reject) => {
        radar_sdk_js_1.default.autocomplete(options, (err, { status, addresses }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    status,
                    addresses,
                });
            }
        });
    });
};
const geocode = options => {
    return new Promise((resolve, reject) => {
        let newOptions = options;
        if (typeof options === 'string')
            newOptions = {
                query: options
            };
        radar_sdk_js_1.default.geocode(newOptions, (err, { status, addresses }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    status,
                    addresses,
                });
            }
        });
    });
};
const reverseGeocode = options => {
    return new Promise((resolve, reject) => {
        const callback = (err, { status, addresses }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    status,
                    addresses,
                });
            }
        };
        if (options) {
            radar_sdk_js_1.default.reverseGeocode(options, callback);
        }
        else {
            radar_sdk_js_1.default.reverseGeocode(callback);
        }
    });
};
const ipGeocode = () => {
    return new Promise((resolve, reject) => {
        radar_sdk_js_1.default.ipGeocode((err, { status, address }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    status,
                    address,
                });
            }
        });
    });
};
const getDistance = options => {
    return new Promise((resolve, reject) => {
        radar_sdk_js_1.default.getDistance(options, (err, { status, routes }) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    status,
                    routes,
                });
            }
        });
    });
};
const getMatrix = options => {
    return new Promise((resolve, reject) => {
        radar_sdk_js_1.default.getMatrix(options, (err, { origins, destinations, matrix, status }) => {
            if (err) {
                reject(err);
            }
            else {
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
const on = (event, callback) => {
    // not implemented
};
const off = (event, callback) => {
    // not implemented
};
const Radar = {
    initialize,
    setLogLevel,
    setUserId,
    setDescription,
    setMetadata,
    getPermissionsStatus,
    requestPermissions,
    getLocation,
    trackOnce,
    trackVerified,
    trackVerifiedToken,
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
exports.default = Radar;
