import {
  Text,
  View,
  StyleSheet,
  Button,
  Platform,
  ScrollView,
  Settings,
  NativeModules
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Radar, { Map, Autocomplete } from "react-native-radar";
import type { RadarMapOptions } from "react-native-radar";
import React, { useEffect, useState } from "react";
import ExampleButton from "./components/exampleButton";
import { Settings as RNSettings } from 'react-native';

// let host = '';
// if (host) {
//   if (Platform.OS === 'ios') {
//     RNSettings.set({ 'radar-host': host });
//   } else if (Platform.OS === 'android') {
//     const SharedPreferences = require('expo-shared-preferences');
//     SharedPreferences.setItemAsync('host', host, {
//       name: 'RadarSDK',
//     });
//   }
// }


Radar.initialize("prj_test_pk_", true);
const stringify = (obj: any) => JSON.stringify(obj, null, 2);
declare global {
  var __turboModuleProxy: any;
  var nativeFabricUIManager: any;
}

const globalAny = global as any;
const isNewArchitecture = (() => {
  if (globalAny.nativeFabricUIManager) {
    return true;
  }
  
  if (globalAny.__turboModuleProxy) {
    return true;
  }
  
  try {
    const constants = Platform.constants;
    const version = constants?.reactNativeVersion;
    if (version && version.major >= 0 && version.minor >= 68) {
      return globalAny.nativeFabricUIManager || globalAny.__turboModuleProxy;
    }
  } catch (e) {
    // Ignore errors
  }
  
  return false;
})();

export default function App() {
  const [displayText, setDisplayText] = useState("");

  const populateText = (displayText: string) => {
    setDisplayText(displayText);
  };

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

  const clearVerifiedLocationToken = () => {
    Radar.clearVerifiedLocationToken();
    populateText("clearVerifiedLocationToken called");
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

  useEffect(() => {
    console.log(`${isNewArchitecture ? "New Architecture" : "Old Architecture"}`);

    Radar.setLogLevel("info");

    // // for qa (leave commented for iOS)
    // Radar.onLog((message) => {
    //   if (/^\w+\(/.test(message))
    //     console.log("native sdk:", message);
    // });

    Radar.setUserId("foo");

    Radar.setDescription("description");

    Radar.setMetadata({
      foo: "bar",
      baz: true,
      qux: 1
    });

    Radar.setProduct("test-product");

    Radar.setAnonymousTrackingEnabled(false);

    // Radar.onLocationUpdated((location) => {
    //   console.log("location update from callback", location);
    // });
    // Radar.onTokenUpdated((token) => {
    //   console.log("token update from callback", token);
    // });
    // // Radar.onLog((message) => {
    // //   console.log("log update from callback", message);
    // // });
    // Radar.onError((error) => {
    //   console.log("error update from callback", error);
    // });
    // Radar.onEventsReceived((events) => {
    //   console.log("events update from callback", events);
    // });
    // Radar.onClientLocationUpdated((location) => {
    //   console.log("client location update from callback", location);
    // });
    // Radar.onInAppMessageDismissed((inAppMessage) => {
    //   console.log("inAppMessage dismissed from callback", inAppMessage);
    // });
    // Radar.onInAppMessageClicked((inAppMessage) => {
    //   console.log("inAppMessage clicked from callback", inAppMessage);
    // });
    // Radar.onNewInAppMessage((inAppMessage) => {
    //   console.log("inAppMessage displayed from callback", inAppMessage);
    //   Radar.showInAppMessage(inAppMessage);
    // });

    Radar.requestPermissions(false)
      .then((status) => {
        console.log("from promise", status);
        if (status === "GRANTED_FOREGROUND") {
          Radar.requestPermissions(true)
            .then((status) => {
              console.log("from promise", status);
            })
            .catch((error) => {
              console.log("from promise error", error);
            });
        }
      })
      .catch((error) => {
        console.log("from promise error", error);
      });
  }, []);

  const mapOptions: RadarMapOptions = {
    mapStyle: 'radar-default-v1',
    showUserLocation: true,
    onDidFinishLoadingMap: () => {
      console.log('Map finished loading');
      populateText('Map finished loading');
    },
    onWillStartLoadingMap: () => {
      console.log('Map will start loading');
      populateText('Map will start loading');
    },
    onDidFailLoadingMap: () => {
      console.log('Map failed to load');
      populateText('Map failed to load');
    },
    onRegionDidChange: (feature) => {
      console.log('Map region changed:', feature);
      populateText('Map region changed: ' + JSON.stringify(feature));
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.architectureIndicator}>
            <Text style={styles.architectureText}>
              Architecture:{" "}
              {isNewArchitecture ? "New Architecture" : "Old Architecture"}
            </Text>
            <Text style={styles.platformText}>Platform: {Platform.OS}</Text>
          </View>
          {/* The current version of MapLibre does not support the new react native architecture  */}
          {Platform.OS !== "web" && (
            <>
              <View style={{ width: "100%", height: "25%" }}>
                <Map mapOptions={mapOptions} />
              </View>
              <View style={{ width: "100%", height: "10%" }}>
                <Autocomplete
                  options={{
                    near: {
                      latitude: 40.7342,
                      longitude: -73.9911,
                    },
                  }}
                />
              </View>
            </>
          )}
          <View
            style={{
              width: "100%",
              height: Platform.OS !== "web" ? "50%" : "100%",
            }}
          >
            <ScrollView style={{ height: "25%" }}>
              <Text style={styles.displayText}>{displayText}</Text>
            </ScrollView>
            <ScrollView style={{ height: "55%" }}>
              <ExampleButton title="runAll" onPress={runAll} />
              <ExampleButton title="getUserId" onPress={getUserId} />
              <ExampleButton title="getDescription" onPress={getDescription} />
              <ExampleButton title="getMetadata" onPress={getMetadata} />
              <ExampleButton title="setTags" onPress={setTags} />
              <ExampleButton title="getTags" onPress={getTags} />
              <ExampleButton title="addTags" onPress={addTags} />
              <ExampleButton title="removeTags" onPress={removeTags} />
              <ExampleButton title="getPermissionsStatus" onPress={getPermissionsStatus} />
              <ExampleButton title="getProduct" onPress={getProduct} />
              <ExampleButton title="requestPermissionsForeground" onPress={requestPermissionsForeground} />
              <ExampleButton title="requestPermissionsBackground" onPress={requestPermissionsBackground} />
              <ExampleButton title="getLocation" onPress={getLocation} />
              <ExampleButton title="trackOnce" onPress={trackOnce} />
              <ExampleButton title="trackOnce manual" onPress={trackOnceManual} />
              <ExampleButton title="trackOnce manual with beacons" onPress={trackOnceManualWithBeacons} />
              <ExampleButton title="trackVerified" onPress={trackVerified} />
              <ExampleButton title="getVerifiedLocationToken" onPress={getVerifiedLocationToken} />
              <ExampleButton title="clearVerifiedLocationToken" onPress={clearVerifiedLocationToken} />
              <ExampleButton title="startTrackingEfficient" onPress={startTrackingEfficient} />
              <ExampleButton title="startTrackingResponsive" onPress={startTrackingResponsive} />
              <ExampleButton title="startTrackingContinuous" onPress={startTrackingContinuous} />
              <ExampleButton title="startTrackingCustom" onPress={startTrackingCustom} />
              <ExampleButton title="startTrackingVerified" onPress={startTrackingVerified} />
              <ExampleButton title="isTrackingVerified" onPress={isTrackingVerified} />
              <ExampleButton title="mockTracking" onPress={mockTracking} />
              <ExampleButton title="stopTracking" onPress={stopTracking} />
              <ExampleButton title="stopTrackingVerified" onPress={stopTrackingVerified} />
              <ExampleButton title="getTrackingOptions" onPress={getTrackingOptions} />
              <ExampleButton title="isUsingRemoteTrackingOptions" onPress={isUsingRemoteTrackingOptions} />
              <ExampleButton title="isTracking" onPress={isTracking} />
              <ExampleButton title="setForegroundServiceOptions" onPress={setForegroundServiceOptions} />
              <ExampleButton title="setNotificationOptions" onPress={setNotificationOptions} />
              <ExampleButton title="getTripOptions" onPress={getTripOptions} />
              <ExampleButton title="startTrip" onPress={startTrip} />
              <ExampleButton title="startTrip with tracking options" onPress={startTripWithTrackingOptions} />
              <ExampleButton title="completeTrip" onPress={completeTrip} />
              <ExampleButton title="cancelTrip" onPress={cancelTrip} />
              <ExampleButton title="updateTrip" onPress={updateTrip} />
              <ExampleButton title="acceptEvent" onPress={acceptEvent} />
              <ExampleButton title="rejectEvent" onPress={rejectEvent} />
              <ExampleButton title="getContext" onPress={getContext} />
              <ExampleButton title="searchPlaces" onPress={searchPlaces} />
              <ExampleButton title="searchGeofences" onPress={searchGeofences} />
              <ExampleButton title="autocomplete" onPress={autocomplete} />
              <ExampleButton title="geocode" onPress={geocode} />
              <ExampleButton title="reverseGeocode" onPress={reverseGeocode} />
              <ExampleButton title="ipGeocode" onPress={ipGeocode} />
              <ExampleButton title="validateAddress" onPress={validateAddress} />
              <ExampleButton title="getDistance" onPress={getDistance} />
              <ExampleButton title="getMatrix" onPress={getMatrix} />
              <ExampleButton title="logConversion" onPress={logConversion} />
              <ExampleButton title="logConversion with revenue" onPress={logConversionWithRevenue} />
              <ExampleButton title="nativeSdkVersion" onPress={nativeSdkVersion} />
              <ExampleButton title="rnSdkVersion" onPress={rnSdkVersion} />
              <ExampleButton title="getHost" onPress={getHost} />
              <ExampleButton title="getPublishableKey" onPress={getPublishableKey} />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  architectureIndicator: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  architectureText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  platformText: {
    fontSize: 14,
    color: "#666",
  },
  displayText: {
    fontSize: 16,
    marginBottom: 10,
    flex: 1,
    textAlign: "left",
  },
  safeArea: {
    flex: 1,
  },
});
