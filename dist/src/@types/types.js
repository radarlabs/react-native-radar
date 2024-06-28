"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarEventVerification = exports.RadarEventConfidence = exports.presetEfficient = exports.presetEfficientAndroid = exports.presetEfficientIOS = exports.presetResponsive = exports.presetResponsiveAndroid = exports.presetResponsiveIOS = exports.presetContinuous = exports.presetContinuousAndroid = exports.presetContinuousIOS = void 0;
const react_native_1 = require("react-native");
exports.presetContinuousIOS = {
    desiredStoppedUpdateInterval: 30,
    desiredMovingUpdateInterval: 30,
    desiredSyncInterval: 20,
    desiredAccuracy: 'high',
    stopDuration: 140,
    stopDistance: 70,
    replay: 'none',
    useStoppedGeofence: false,
    showBlueBar: true,
    startTrackingAfter: undefined,
    stopTrackingAfter: undefined,
    stoppedGeofenceRadius: 0,
    useMovingGeofence: false,
    movingGeofenceRadius: 0,
    syncGeofences: true,
    useVisits: false,
    useSignificantLocationChanges: false,
    beacons: false,
    sync: 'all',
};
exports.presetContinuousAndroid = {
    desiredStoppedUpdateInterval: 30,
    fastestStoppedUpdateInterval: 30,
    desiredMovingUpdateInterval: 30,
    fastestMovingUpdateInterval: 30,
    desiredSyncInterval: 20,
    desiredAccuracy: 'high',
    stopDuration: 140,
    stopDistance: 70,
    replay: 'none',
    sync: 'all',
    useStoppedGeofence: false,
    stoppedGeofenceRadius: 0,
    useMovingGeofence: false,
    movingGeofenceRadius: 0,
    syncGeofences: true,
    syncGeofencesLimit: 0,
    foregroundServiceEnabled: true,
    beacons: false,
    startTrackingAfter: undefined,
    stopTrackingAfter: undefined,
};
exports.presetContinuous = react_native_1.Platform.OS === 'ios' ? exports.presetContinuousIOS : exports.presetContinuousAndroid;
exports.presetResponsiveIOS = {
    desiredStoppedUpdateInterval: 0,
    desiredMovingUpdateInterval: 150,
    desiredSyncInterval: 20,
    desiredAccuracy: 'medium',
    stopDuration: 140,
    stopDistance: 70,
    replay: 'stops',
    useStoppedGeofence: true,
    showBlueBar: false,
    startTrackingAfter: undefined,
    stopTrackingAfter: undefined,
    stoppedGeofenceRadius: 100,
    useMovingGeofence: true,
    movingGeofenceRadius: 100,
    syncGeofences: true,
    useVisits: true,
    useSignificantLocationChanges: true,
    beacons: false,
    sync: 'all',
};
exports.presetResponsiveAndroid = {
    desiredStoppedUpdateInterval: 0,
    fastestStoppedUpdateInterval: 0,
    desiredMovingUpdateInterval: 150,
    fastestMovingUpdateInterval: 30,
    desiredSyncInterval: 20,
    desiredAccuracy: "medium",
    stopDuration: 140,
    stopDistance: 70,
    replay: 'stops',
    sync: 'all',
    useStoppedGeofence: true,
    stoppedGeofenceRadius: 100,
    useMovingGeofence: true,
    movingGeofenceRadius: 100,
    syncGeofences: true,
    syncGeofencesLimit: 10,
    foregroundServiceEnabled: false,
    beacons: false,
    startTrackingAfter: undefined,
    stopTrackingAfter: undefined,
};
exports.presetResponsive = react_native_1.Platform.OS === 'ios' ? exports.presetResponsiveIOS : exports.presetResponsiveAndroid;
exports.presetEfficientIOS = {
    desiredStoppedUpdateInterval: 0,
    desiredMovingUpdateInterval: 0,
    desiredSyncInterval: 0,
    desiredAccuracy: "medium",
    stopDuration: 0,
    stopDistance: 0,
    replay: 'stops',
    useStoppedGeofence: false,
    showBlueBar: false,
    startTrackingAfter: undefined,
    stopTrackingAfter: undefined,
    stoppedGeofenceRadius: 0,
    useMovingGeofence: false,
    movingGeofenceRadius: 0,
    syncGeofences: true,
    useVisits: true,
    useSignificantLocationChanges: false,
    beacons: false,
    sync: 'all',
};
exports.presetEfficientAndroid = {
    desiredStoppedUpdateInterval: 3600,
    fastestStoppedUpdateInterval: 1200,
    desiredMovingUpdateInterval: 1200,
    fastestMovingUpdateInterval: 360,
    desiredSyncInterval: 140,
    desiredAccuracy: 'medium',
    stopDuration: 140,
    stopDistance: 70,
    replay: 'stops',
    sync: 'all',
    useStoppedGeofence: false,
    stoppedGeofenceRadius: 0,
    useMovingGeofence: false,
    movingGeofenceRadius: 0,
    syncGeofences: true,
    syncGeofencesLimit: 10,
    foregroundServiceEnabled: false,
    beacons: false,
    startTrackingAfter: undefined,
    stopTrackingAfter: undefined,
};
exports.presetEfficient = react_native_1.Platform.OS === 'ios' ? exports.presetEfficientIOS : exports.presetEfficientAndroid;
var RadarEventConfidence;
(function (RadarEventConfidence) {
    RadarEventConfidence[RadarEventConfidence["none"] = 0] = "none";
    RadarEventConfidence[RadarEventConfidence["low"] = 1] = "low";
    RadarEventConfidence[RadarEventConfidence["medium"] = 2] = "medium";
    RadarEventConfidence[RadarEventConfidence["high"] = 3] = "high";
})(RadarEventConfidence || (exports.RadarEventConfidence = RadarEventConfidence = {}));
var RadarEventVerification;
(function (RadarEventVerification) {
    RadarEventVerification[RadarEventVerification["accept"] = 1] = "accept";
    RadarEventVerification[RadarEventVerification["unverify"] = 0] = "unverify";
    RadarEventVerification[RadarEventVerification["reject"] = -1] = "reject";
})(RadarEventVerification || (exports.RadarEventVerification = RadarEventVerification = {}));
