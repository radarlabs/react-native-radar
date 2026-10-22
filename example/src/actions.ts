import { PermissionsAndroid, Platform } from "react-native";
import Radar from "react-native-radar";
import type { RadarEvent } from "react-native-radar";

const stringify = (obj: any) => JSON.stringify(obj, null, 2);

// Every Tests-tab action. Titles and result strings match PR test plans, so keep them stable.
export function createActions(
  populateText: (displayText: string) => void,
  writeEvents: (events: RadarEvent[]) => void
) {
  const getUserId = async () => {
    try {
      const result = await Radar.getUserId();
      populateText("getUserId: " + result);
    } catch (err) {
      populateText("getUserId error: " + err);
    }
  };

  const getDescription = async () => {
    try {
      const result = await Radar.getDescription();
      populateText("getDescription: " + result);
    } catch (err) {
      populateText("getDescription error: " + err);
    }
  };

  const getMetadata = async () => {
    try {
      const result = await Radar.getMetadata();
      populateText("getMetadata: " + stringify(result));
    } catch (err) {
      populateText("getMetadata error: " + err);
    }
  };

  const setTags = async () => {
    try {
      const result = await Radar.setTags(["tag1", "tag2"]);
      populateText("setTags: " + result);
    } catch (err) {
      populateText("setTags error: " + err);
    }
  };

  const getTags = async () => {
    try {
      const result = await Radar.getTags();
      populateText("getTags: " + result);
    } catch (err) {
      populateText("getTags error: " + err);
    }
  };

  const addTags = async () => {
    try {
      const result = await Radar.addTags(["tag3", "tag4"]);
      populateText("addTags: " + result);
    } catch (err) {
      populateText("addTags error: " + err);
    }
  };

  const removeTags = async () => {
    try {
      const result = await Radar.removeTags(["tag1", "tag2"]);
      populateText("removeTags: " + result);
    } catch (err) {
      populateText("removeTags error: " + err);
    }
  };

  const getProduct = async () => {
    try {
      const result = await Radar.getProduct();
      populateText("getProduct: " + result);
    } catch (err) {
      populateText("getProduct error: " + err);
    }
  };

  const setUserLanguage = () => {
    Radar.setUserLanguage("es-PR");
    populateText("setUserLanguage: set to 'es-PR'");
  };

  const getUserLanguage = async () => {
    try {
      const result = await Radar.getUserLanguage();
      populateText("getUserLanguage: " + result);
    } catch (err) {
      populateText("getUserLanguage error: " + err);
    }
  };

  const clearUserLanguage = () => {
    Radar.setUserLanguage(null);
    populateText("setUserLanguage: cleared (null)");
  };

  const isSharing = async () => {
    try {
      const result = await Radar.isSharing();
      populateText("isSharing: " + result);
    } catch (err) {
      populateText("isSharing error: " + err);
    }
  };

  const clearSharing = () => {
    Radar.clearSharing();
    populateText("clearSharing: done");
  };


  const getPermissionsStatus = async () => {
    try {
      const result = await Radar.getPermissionsStatus();
      populateText("getPermissionsStatus: " + result);
    } catch (err) {
      populateText("getPermissionsStatus error: " + err);
    }
  };

  const requestPermissionsForeground = async () => {
    try {
      const result = await Radar.requestPermissions(false);
      populateText("requestPermissions:" + result);
    } catch (err) {
      populateText("requestPermissions error:" + err);
    }
  };

  const requestPermissionsBackground = async () => {
    try {
      const result = await Radar.requestPermissions(true);
      populateText("requestPermissions:" + result);
    } catch (err) {
      populateText("requestPermissions error:" + err);
    }
  };

  const getLocation = async () => {
    try {
      const result = await Radar.getLocation("high");
      populateText("getLocation (desiredAccuracy=high): " + stringify(result));
    } catch (err) {
      populateText("getLocation error: " + err);
    }
  };

  const trackOnce = async () => {
    try {
      const result = await Radar.trackOnce();
      populateText("trackOnce: " + stringify(result));
    } catch (err) {
      populateText("trackOnce error: " + err);
    }
  };

  const trackOnceManual = async () => {
    try {
      const result = await Radar.trackOnce({
        location: { latitude: 39.2904, longitude: -76.6122, accuracy: 60 },
      });
      populateText(
        "trackOnce manual with location accuracy::" + stringify(result)
      );
    } catch (err) {
      populateText(
        "trackOnce manual with location accuracy error:" + err
      );
    }
  };

  const trackOnceManualWithBeacons = async () => {
    try {
      const result = await Radar.trackOnce({
        desiredAccuracy: "medium",
        beacons: true,
      });
      populateText(
        "trackOnce manual with beacons:" + stringify(result)
      );
    } catch (err) {
      populateText("trackOnce manual with beacons error:" + err);
    }
  };


  const trackVerified = async () => {
    try {
      const result = await Radar.trackVerified({
        beacons: true,
        desiredAccuracy: "high",
        reason: 'test',
        transactionId: '123',
      });
      populateText("trackVerified: " + stringify(result));
    } catch (err) {
      populateText("trackVerified error: " + err);
    }
  };

  const getVerifiedLocationToken = async () => {
    try {
      const result = await Radar.getVerifiedLocationToken();
      populateText("getVerifiedLocationToken: " + stringify(result));
    } catch (err) {
      populateText("getVerifiedLocationToken error: " + err);
    }
  };

  const revealRisk = async () => {
    try {
      const result = await Radar.revealRisk();
      populateText("revealRisk: " + stringify(result));
    } catch (err) {
      populateText("revealRisk error: " + err);
    }
  };

  const clearVerifiedLocationToken = () => {
    Radar.clearVerifiedLocationToken();
    populateText("clearVerifiedLocationToken called");
  };

  const setExpectedAddress = () => {
    Radar.setExpectedAddress("841 Broadway, New York, NY 10003");
    populateText("setExpectedAddress: set to '841 Broadway, New York, NY 10003'");
  };

  const clearExpectedAddress = () => {
    Radar.setExpectedAddress(null);
    populateText("clearExpectedAddress: cleared (null)");
  };

  const trackVerifiedExpectedAddress = async () => {
    try {
      const result = await Radar.trackVerified();
      populateText(
        "trackVerifiedExpectedAddress: " +
          stringify(result.token?.user?.expectedAddress)
      );
    } catch (err) {
      populateText("trackVerifiedExpectedAddress error: " + err);
    }
  };

  const trackOnceLocationInsights = async () => {
    try {
      const result = await Radar.trackOnce();
      populateText(
        "trackOnceLocationInsights: " + stringify(result.user?.locationInsights)
      );
    } catch (err) {
      populateText("trackOnceLocationInsights error: " + err);
    }
  };

  const requestBluetoothPermissions = async () => {
    if (Platform.OS !== "android") {
      populateText("requestBluetoothPermissions: Android only");
      return;
    }
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      );
      populateText("requestBluetoothPermissions: " + result);
    } catch (err) {
      populateText("requestBluetoothPermissions error: " + err);
    }
  };

  const startRangingBeacons = () => {
    Radar.startRangingBeacons();
    populateText("startRangingBeacons called");
  };

  const stopRangingBeacons = () => {
    Radar.stopRangingBeacons();
    populateText("stopRangingBeacons called");
  };

  const listenForEventTypes = () => {
    Radar.onEventsReceived(({ events }) => {
      // This replaces the console's onEventsReceived listener, so keep forwarding events to it.
      writeEvents(events);
      populateText(
        "listenForEventTypes: " + stringify(events.map((event) => event.type))
      );
    });
    populateText(
      "listenForEventTypes: listening for events. This replaces any existing onEventsReceived listener. Event types appear here as events arrive."
    );
  };

  const startTrackingEfficient = () => {
    Radar.startTrackingEfficient();
    populateText("startTrackingEfficient called");
  };

  const startTrackingResponsive = () => {
    Radar.startTrackingResponsive();
    populateText("startTrackingResponsive called");
  };

  const startTrackingContinuous = () => {
    Radar.startTrackingContinuous();
    populateText("startTrackingContinuous called");
  };

  const startTrackingCustom = () => {
    Radar.startTrackingCustom({
      desiredStoppedUpdateInterval: 30,
      fastestStoppedUpdateInterval: 30,
      desiredMovingUpdateInterval: 30,
      fastestMovingUpdateInterval: 30,
      desiredSyncInterval: 20,
      desiredAccuracy: "high",
      stopDuration: 0,
      stopDistance: 0,
      replay: "none",
      sync: "all",
      showBlueBar: true,
      useStoppedGeofence: false,
      stoppedGeofenceRadius: 0,
      useMovingGeofence: false,
      movingGeofenceRadius: 0,
      syncGeofences: false,
      syncGeofencesLimit: 0,
      beacons: false,
      foregroundServiceEnabled: false,
    });
    populateText("startTrackingCustom called");
  };

  const startTrackingVerified = () => {
    Radar.startTrackingVerified({
        beacons: true,
        interval: 1000,
    });
    populateText("startTrackingVerified called");
  };

  const isTrackingVerified = async () => {
    try {
      const result = await Radar.isTrackingVerified();
      populateText("isTrackingVerified: " + result);
    } catch (err) {
      populateText("isTrackingVerified error: " + err);
    }
  };

  const mockTracking = () => {
    Radar.mockTracking({
      origin: { latitude: 40.78382, longitude: -73.97536 },
      destination: { latitude: 40.7039, longitude: -73.9767 },
      mode: "car",
      steps: 5,
      interval: 1000,
    });
    populateText("mockTracking called");
  };

  const stopTracking = () => {
    Radar.stopTracking();
    populateText("stopTracking called");
  };

  const stopTrackingVerified = () => {
    Radar.stopTrackingVerified();
    populateText("stopTrackingVerified called");
  };

  const getTrackingOptions = async () => {
    try {
      const result = await Radar.getTrackingOptions();
      populateText("getTrackingOptions: " + stringify(result));
    } catch (err) {
      populateText("getTrackingOptions error: " + err);
    }
  };

  const isUsingRemoteTrackingOptions = async () => {
    try {
      const result = await Radar.isUsingRemoteTrackingOptions();
      populateText("isUsingRemoteTrackingOptions: " + result);
    } catch (err) {
      populateText("isUsingRemoteTrackingOptions error: " + err);
    }
  };

  const isTracking = async () => {
    try {
      const result = await Radar.isTracking();
      populateText("isTracking: " + result);
    } catch (err) {
      populateText("isTracking error: " + err);
    }
  };

  const setForegroundServiceOptions = () => {
    Radar.setForegroundServiceOptions({
      text: "fso text",
      title: "fso title",
      icon: 123,
      updatesOnly: true,
      activity: "com.radar.reactnative.RadarActivity",
      importance: 2,
      id: 123,
      channelName: "Radar Foreground Service",
      iconString: "icon",
      iconColor: "#FF0000",
    });
    populateText("setForegroundServiceOptions called");
  };

  const setNotificationOptions = () => {
    Radar.setNotificationOptions({
      iconString: "icon",
      iconColor: "#FF0000",
      foregroundServiceIconString: "fso_icon",
      foregroundServiceIconColor: "#00FF00",
      eventIconString: "event_icon",
      eventIconColor: "#0000FF",
    });
    populateText("setNotificationOptions called");
  };

  const getTripOptions = async () => {
    try {
      const result = await Radar.getTripOptions();
      populateText("getTripOptions: " + stringify(result));
    } catch (err) {
      populateText("getTripOptions error: " + err);
    }
  };

  const startTrip = async () => {
    try {
      const result = await Radar.startTrip({
        tripOptions: {
          externalId: "300",
          destinationGeofenceTag: "store",
          destinationGeofenceExternalId: "123",
          mode: "car",
          scheduledArrivalAt: new Date("2023-10-10T12:20:30Z").getTime(),
          metadata: {
            "test-trip-meta": "test-trip-data",
          },
        },
      });
      populateText("startTrip: " + stringify(result));
    } catch (err) {
      populateText("startTrip error: " + err);
    }
  };

  const startTripWithTrackingOptions = async () => {
    try {
      const result = await Radar.startTrip({
        tripOptions: {
          externalId: "302",
          destinationGeofenceTag: "store",
          destinationGeofenceExternalId: "123",
          mode: "car",
          scheduledArrivalAt: new Date("2023-10-10T12:20:30Z").getTime(),
        },
        trackingOptions: {
          desiredStoppedUpdateInterval: 30,
          fastestStoppedUpdateInterval: 30,
          desiredMovingUpdateInterval: 30,
          fastestMovingUpdateInterval: 30,
          desiredSyncInterval: 20,
          desiredAccuracy: "high",
          stopDuration: 0,
          stopDistance: 0,
          replay: "none",
          sync: "all",
          showBlueBar: true,
          useStoppedGeofence: false,
          stoppedGeofenceRadius: 0,
          useMovingGeofence: false,
          movingGeofenceRadius: 0,
          syncGeofences: false,
          syncGeofencesLimit: 0,
          beacons: false,
          foregroundServiceEnabled: false,
        },
      });
      populateText("startTrip: " + stringify(result));
    } catch (err) {
      populateText("startTrip error: " + err);
    }
  };

  const completeTrip = async () => {
    try {
      const result = await Radar.completeTrip();
      populateText("completeTrip: " + stringify(result));
    } catch (err) {
      populateText("completeTrip error: " + err);
    }
  };

  const cancelTrip = async () => {
    try {
      const result = await Radar.cancelTrip();
      populateText("cancelTrip: " + stringify(result));
    } catch (err) {
      populateText("cancelTrip error: " + err);
    }
  };

  const updateTrip = async () => {
    try {
      const result = await Radar.updateTrip({
        options: {
          externalId: "trip-001",
          destinationGeofenceTag: "store",
          destinationGeofenceExternalId: "123",
          mode: "car",
          scheduledArrivalAt: new Date("2023-10-10T12:20:31Z").getTime(),
          metadata: { foo: "bar" },
        },
        status: "approaching",
      });
      populateText("updateTrip: " + stringify(result));
    } catch (err) {
      populateText("updateTrip error: " + err);
    }
  };

  const acceptEvent = () => {
    Radar.acceptEvent("event-001", "place-001");
    populateText("acceptEvent called");
  };

  const rejectEvent = () => {
    Radar.rejectEvent("event-001");
    populateText("rejectEvent called");
  };

  const getContext = async () => {
    try {
      const result = await Radar.getContext({
        latitude: 40.78382,
        longitude: -73.97536,
        accuracy: 10,
      });
      populateText("getContext: " + stringify(result));
    } catch (err) {
      populateText("getContext error: " + err);
    }
  };

  const searchPlaces = async () => {
    try {
      const result = await Radar.searchPlaces({
        near: { latitude: 40.783826, longitude: -73.975363 },
        radius: 1000,
        chains: ["starbucks"],
        chainMetadata: { customFlag: "true" },
        countryCodes: ["CA", "US"],
        limit: 10,
      });
      populateText("searchPlaces: " + stringify(result));
    } catch (err) {
      populateText("searchPlaces error: " + err);
    }
  };

  const searchGeofences = async () => {
    try {
      const result = await Radar.searchGeofences({
        radius: 1000,
        tags: ["venue"],
        limit: 10,
        includeGeometry: true,
      });
      populateText("searchGeofences: " + stringify(result));
    } catch (err) {
      populateText("searchGeofences error: " + err);
    }
  };

  const autocomplete = async () => {
    try {
      const result = await Radar.autocomplete({
        query: "brooklyn roasting",
        country: "US",
        layers: ["locality"],
        near: { latitude: 40.7342, longitude: -73.9911 },
        limit: 10,
      });
      populateText("autocomplete: " + stringify(result));
    } catch (err) {
      populateText("autocomplete error: " + err);
    }
  };

  const geocode = async () => {
    try {
      const result = await Radar.geocode({ address: "20 jay st brooklyn", layers: ["address"], countries: ["US"] });
      populateText("geocode: " + stringify(result));
    } catch (err) {
      populateText("geocode error: " + err);
    }
  };

  const reverseGeocode = async () => {
    try {
      const result = await Radar.reverseGeocode({
        location: { latitude: 40.783826, longitude: -73.975363 },
        layers: ["address"],
      });
      populateText("reverseGeocode: " + stringify(result));
    } catch (err) {
      populateText("reverseGeocode error: " + err);
    }
  };

  const ipGeocode = async () => {
    try {
      const result = await Radar.ipGeocode();
      populateText("ipGeocode: " + stringify(result));
    } catch (err) {
      populateText("ipGeocode error: " + err);
    }
  };

  const validateAddress = async () => {
    try {
      const result = await Radar.validateAddress({
        latitude: 0,
        longitude: 0,
        city: "New York",
        stateCode: "NY",
        postalCode: "10003",
        countryCode: "US",
        street: "Broadway",
        number: "841",
      });
      populateText("validateAddress: " + stringify(result));
    } catch (err) {
      populateText("validateAddress error: " + err);
    }
  };

  const getDistance = async () => {
    try {
      const result = await Radar.getDistance({
        origin: { latitude: 40.78382, longitude: -73.97536 },
        destination: { latitude: 40.7039, longitude: -73.9867 },
        modes: ["foot", "car"],
        units: "imperial",
      });
      populateText("getDistance: " + stringify(result));
    } catch (err) {
      populateText("getDistance error: " + err);
    }
  };

  const getMatrix = async () => {
    try {
      const result = await Radar.getMatrix({
        origins: [
          { latitude: 40.78382, longitude: -73.97536 },
          { latitude: 40.7039, longitude: -73.9867 },
        ],
        destinations: [
          { latitude: 40.64189, longitude: -73.78779 },
          { latitude: 35.99801, longitude: -78.94294 },
        ],
        mode: "car",
        units: "imperial",
      });
      populateText("getMatrix: " + stringify(result));
    } catch (err) {
      populateText("getMatrix error: " + err);
    }
  };

  const logConversion = async () => {
    try {
      const result = await Radar.logConversion({
        name: "in_app_purchase",
        metadata: { sku: "123456789" },
      });
      populateText("logConversion: " + stringify(result));
    } catch (err) {
      populateText("logConversion error: " + err);
    }
  };

  const logConversionWithRevenue = async () => {
    try {
      const result = await Radar.logConversion({
        name: "in_app_purchase",
        revenue: 150,
        metadata: {
          sku: "123456789",
        },
      });
      populateText("logConversion:" + stringify(result));
    } catch (err) {
      populateText("logConversion:" + err);
    }
  };

  const nativeSdkVersion = async () => {
    try {
      const result = await Radar.nativeSdkVersion();
      populateText("nativeSdkVersion: " + result);
    } catch (err) {
      populateText("nativeSdkVersion error: " + err);
    }
  };

  const rnSdkVersion = () => {
    try {
      const result = Radar.rnSdkVersion();
      populateText("rnSdkVersion: " + result);
    } catch (err) {
      populateText("rnSdkVersion error: " + err);
    }
  };

  const getHost = async () => {
    try {
      const result = await Radar.getHost();
      populateText("getHost: " + result);
    } catch (err) {
      populateText("getHost error: " + err);
    }
  };

  const getPublishableKey = async () => {
    try {
      const result = await Radar.getPublishableKey();
      populateText("getPublishableKey: " + result);
    } catch (err) {
      populateText("getPublishableKey error: " + err);
    }
  };

  const runAll = async () => {
    const toRun = [
      getUserId,
      getDescription,
      getMetadata,
      getProduct,
      // requestPermissionsForeground,
      // requestPermissionsBackground,
      // getPermissionsStatus,
      getLocation,
      trackOnceManualWithBeacons,
      trackOnceManual,
      trackVerified,
      startTrackingCustom,
      isTracking,
      // getTrackingOptions,
      isUsingRemoteTrackingOptions,
      stopTracking,
      startTrackingVerified,
      isTrackingVerified,
      stopTrackingVerified,
      mockTracking,
      stopTracking,
      setForegroundServiceOptions,
      setNotificationOptions,
      startTrip,
      startTripWithTrackingOptions,
      getTripOptions,
      updateTrip,
      completeTrip,
      cancelTrip,
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
      logConversionWithRevenue,
      // nativeSdkVersion,
      // rnSdkVersion,
      getHost,
      getPublishableKey,
    ];
    const delay = 500;
    const wait = async () => {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }
    for (const fn of toRun) {
      try {
        await fn();
      } catch (err) {
        populateText(fn.name + " error: " + err);
      }
      await wait();
    }
  };

  return {
    getUserId,
    getDescription,
    getMetadata,
    setTags,
    getTags,
    addTags,
    removeTags,
    getProduct,
    setUserLanguage,
    getUserLanguage,
    clearUserLanguage,
    isSharing,
    clearSharing,
    getPermissionsStatus,
    requestPermissionsForeground,
    requestPermissionsBackground,
    getLocation,
    trackOnce,
    trackOnceManual,
    trackOnceManualWithBeacons,
    trackVerified,
    getVerifiedLocationToken,
    revealRisk,
    clearVerifiedLocationToken,
    setExpectedAddress,
    clearExpectedAddress,
    trackVerifiedExpectedAddress,
    trackOnceLocationInsights,
    requestBluetoothPermissions,
    startRangingBeacons,
    stopRangingBeacons,
    listenForEventTypes,
    startTrackingEfficient,
    startTrackingResponsive,
    startTrackingContinuous,
    startTrackingCustom,
    startTrackingVerified,
    isTrackingVerified,
    mockTracking,
    stopTracking,
    stopTrackingVerified,
    getTrackingOptions,
    isUsingRemoteTrackingOptions,
    isTracking,
    setForegroundServiceOptions,
    setNotificationOptions,
    getTripOptions,
    startTrip,
    startTripWithTrackingOptions,
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
    logConversionWithRevenue,
    nativeSdkVersion,
    rnSdkVersion,
    getHost,
    getPublishableKey,
    runAll,
  };
}

export type Actions = ReturnType<typeof createActions>;
