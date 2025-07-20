import {
  Text,
  View,
  StyleSheet,
  Button,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Radar, { Map, Autocomplete } from "react-native-radar";
import React, { useEffect, useState } from "react";
import ExampleButton from "./components/exampleButton";
import MapLibreGL from "@maplibre/maplibre-react-native";

MapLibreGL.setAccessToken(null);

Radar.initialize("prj_test_pk_00000000000000000000000000000000", true);
const stringify = (obj: any) => JSON.stringify(obj, null, 2);
declare global {
  var __turboModuleProxy: any;
}
const isNewArchitecture = global.__turboModuleProxy != null;

export default function App() {
  const [displayText, setDisplayText] = useState("");

  const populateText = (displayText: string) => {
    setDisplayText(displayText);
  };

  // --- Button Handlers ---
  const getUser = async () => {
    try {
      const result_1 = await Radar.getUserId();
      populateText("getUserId:" + result_1);
    } catch (err) {
      populateText("getUserId:" + err);
    }
  };

  const getDescription = async () => {
    try {
      const result_1 = await Radar.getDescription();
      populateText("getDescription:" + result_1);
    } catch (err) {
      populateText("getDescription:" + err);
    }
  };

  const getMetadata = async () => {
    try {
      const result_1 = await Radar.getMetadata();
      populateText("getMetadata:" + stringify(result_1));
    } catch (err) {
      populateText("getMetadata:" + err);
    }
  };

  const requestPermissionsForeground = async () => {
    try {
      const result = await Radar.requestPermissions(false);
      populateText("requestPermissions:" + result);
    } catch (err) {
      populateText("requestPermissions:" + err);
    }
  };

  const requestPermissionsBackground = async () => {
    try {
      const result = await Radar.requestPermissions(true);
      populateText("requestPermissions:" + result);
    } catch (err) {
      populateText("requestPermissions:" + err);
    }
  };

  const getPermissionsStatus = async () => {
    try {
      const result_1 = await Radar.getPermissionsStatus();
      populateText("getPermissionsStatus:" + result_1);
    } catch (err) {
      populateText("getPermissionsStatus:" + err);
    }
  };

  const getLocation = async () => {
    try {
      const result = await Radar.getLocation();
      populateText("getLocation:" + stringify(result));
    } catch (err) {
      populateText("getLocation:" + err);
    }
  };

  const trackOnce = async () => {
    try {
      const result = await Radar.trackOnce();
      populateText("trackOnce:" + stringify(result));
    } catch (err) {
      populateText("trackOnce:" + err);
    }
  };

  const trackOnceManual = async () => {
    try {
      const result = await Radar.trackOnce({
        location: {
          latitude: 39.2904,
          longitude: -76.6122,
          accuracy: 60,
        },
      });
      populateText(
        "trackOnce manual with location accuracy::" + stringify(result)
      );
    } catch (err) {
      populateText(
        "trackOnce manual with location accuracy::" + err
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
      populateText("trackOnce manual with beacons:" + err);
    }
  };

  const startTracking = () => {
    return Promise.resolve(Radar.startTrackingEfficient());
  };

  const stopTracking = () => {
    return Promise.resolve(Radar.stopTracking());
  };

  const isTracking = async () => {
    try {
      const result_1 = await Radar.isTracking();
      populateText("isTracking:" + result_1);
    } catch (err) {
      populateText("isTracking:" + err);
    }
  };

  const searchPlaces = async () => {
    try {
      const result = await Radar.searchPlaces({
        near: {
          latitude: 40.783826,
          longitude: -73.975363,
        },
        radius: 1000,
        chains: ["starbucks"],
        chainMetadata: {
          customFlag: "true",
        },
        countryCodes: ["CA", "US"],
        limit: 10,
      });
      populateText("searchPlaces:" + stringify(result));
    } catch (err) {
      populateText("searchPlaces:" + err);
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
      populateText("searchGeofences:" + stringify(result));
    } catch (err) {
      populateText("searchGeofences:" + err);
    }
  };

  const autocomplete = async () => {
    try {
      const result = await Radar.autocomplete({
        query: "brooklyn roasting",
        limit: 10,
      });
      populateText("autocomplete:" + stringify(result));
    } catch (err) {
      populateText("autocomplete:" + err);
    }
  };

  const geocode = async () => {
    try {
      const result = await Radar.geocode({ address: "20 jay st brooklyn" });
      populateText("geocode:" + stringify(result));
    } catch (err) {
      populateText("geocode:" + err);
    }
  };

  const reverseGeocode = async () => {
    try {
      const result = await Radar.reverseGeocode({
        location: {
          latitude: 40.783826,
          longitude: -73.975363,
        },
      });
      populateText("reverseGeocode:" + stringify(result));
    } catch (err) {
      populateText("reverseGeocode:" + err);
    }
  };

  const ipGeocode = async () => {
    try {
      const result_1 = await Radar.ipGeocode();
      populateText("ipGeocode:" + stringify(result_1));
    } catch (err) {
      populateText("ipGeocode:" + err);
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
      populateText("validateAddress:" + stringify(result));
    } catch (err) {
      populateText("validateAddress:" + err);
    }
  };

  const getDistance = async () => {
    try {
      const result = await Radar.getDistance({
        origin: {
          latitude: 40.78382,
          longitude: -73.97536,
        },
        destination: {
          latitude: 40.7039,
          longitude: -73.9867,
        },
        modes: ["foot", "car"],
        units: "imperial",
      });
      populateText("getDistance:" + stringify(result));
    } catch (err) {
      populateText("getDistance:" + err);
    }
  };

  const getMatrix = async () => {
    try {
      const result = await Radar.getMatrix({
        origins: [
          {
            latitude: 40.78382,
            longitude: -73.97536,
          },
          {
            latitude: 40.7039,
            longitude: -73.9867,
          },
        ],
        destinations: [
          {
            latitude: 40.64189,
            longitude: -73.78779,
          },
          {
            latitude: 35.99801,
            longitude: -78.94294,
          },
        ],
        mode: "car",
        units: "imperial",
      });
      populateText("getMatrix:" + stringify(result));
    } catch (err) {
      populateText("getMatrix:" + err);
    }
  };

  const startTrip = async () => {
    try {
      const result_2 = await Radar.startTrip({
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
      populateText("startTrip:" + stringify(result_2));
    } catch (err) {
      populateText("startTrip:" + err);
    }
  };

  const startTripWithTrackingOptions = async () => {
    try {
      const result_2 = await Radar.startTrip({
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
      populateText("startTrip:" + stringify(result_2));
    } catch (err) {
      populateText("startTrip:" + err);
    }
  };

  const completeTrip = async () => {
    try {
      const result_1 = await Radar.completeTrip();
      populateText("completeTrip:" + stringify(result_1));
    } catch (err) {
      populateText("completeTrip:" + err);
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

  const logConversion = async () => {
    try {
      const result = await Radar.logConversion({
        name: "in_app_purchase",
        metadata: {
          sku: "123456789",
        },
      });
      populateText("logConversion:" + stringify(result));
    } catch (err) {
      populateText("logConversion:" + err);
    }
  };

  const trackVerified = async () => {
    try {
      const result = await Radar.trackVerified();
      populateText("trackVerified:" + stringify(result));
    } catch (err) {
      populateText("trackVerified:" + err);
    }
  };

  const startTrackingVerified = () => {
    return Promise.resolve(Radar.startTrackingVerified());
  };

  const isTrackingVerified = async () => {
    try {
      const result_1 = await Radar.isTrackingVerified();
      populateText("isTrackingVerified:" + stringify(result_1));
    } catch (err) {
      populateText("isTrackingVerified:" + err);
    }
  };

  const stopTrackingVerified = () => {
    return Promise.resolve(Radar.stopTrackingVerified());
  };

  const setProduct = () => {
    return Promise.resolve(Radar.setProduct("test"));
  };

  const getVerifiedLocationToken = async () => {
    try {
      const result_1 = await Radar.getVerifiedLocationToken();
      populateText("getVerifiedLocationToken:" + stringify(result_1));
    } catch (err) {
      populateText("getVerifiedLocationToken:" + err);
    }
  };

  const version = async () => {
    const nativeVersion = await Radar.nativeSdkVersion();
    populateText(
      `sdk: ${Radar.rnSdkVersion()}, native: ${nativeVersion}`
    );
  };

  const runAll = async () => {
    const delay = 500;
    const wait = async () => {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }

    // await getUser();
    // await getDescription();
    // await getMetadata();
    // await requestPermissionsForeground();
    // await requestPermissionsBackground();
    // await getPermissionsStatus();
    await getLocation();
    await wait();
    await trackOnce();
    await wait();
    await trackOnceManual();
    await wait();
    await trackOnceManualWithBeacons();
    await wait();
    await startTracking();
    await wait();
    await stopTracking();
    await wait();
    // await isTracking();
    await searchPlaces();
    await wait();
    await searchGeofences();
    await wait();
    await autocomplete();
    await wait();
    await geocode();
    await wait();
    await reverseGeocode();
    await wait();
    await ipGeocode();
    await wait();
    await validateAddress();
    await wait();
    await getDistance();
    await wait();
    await getMatrix();
    await wait();
    await startTrip();
    await wait();
    await completeTrip();
    await wait();
    await startTripWithTrackingOptions();
    await wait();
    await completeTrip();
    await wait();
    await logConversionWithRevenue();
    await wait();
    await logConversion();
    await wait();
    await trackVerified();
    await wait();
    await startTrackingVerified();
    await wait();
    // await isTrackingVerified();
    await stopTrackingVerified();
    await wait();
    // await setProduct();
    await getVerifiedLocationToken();
    // await version();
  };

  useEffect(() => {
    Radar.setLogLevel("info");

    Radar.setUserId("foo");

    Radar.setDescription("description");

    Radar.setMetadata({
      foo: "bar",
      baz: true,
      qux: 1,
    });

    Radar.onLocationUpdated((location) => {
      console.log("location update from callback", location);
    });
    Radar.onTokenUpdated((token) => {
      console.log("token update from callback", token);
    });
    // Radar.onLog((message) => {
    //   console.log("log update from callback", message);
    // });
    Radar.onError((error) => {
      console.log("error update from callback", error);
    });
    Radar.onEventsReceived((events) => {
      console.log("events update from callback", events);
    });
    Radar.onClientLocationUpdated((location) => {
      console.log("client location update from callback", location);
    });

    // for qa
    // Radar.onLog((message) => {
    //   if (/^\w+\(/.test(message))
    //     console.log("native sdk:", message);
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

  return (
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
              <Map />
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
            <ExampleButton title="getUser" onPress={getUser} />
            <ExampleButton title="getDescription" onPress={getDescription} />
            <ExampleButton title="getMetadata" onPress={getMetadata} />
            <ExampleButton
              title="requestPermissionsForeground"
              onPress={requestPermissionsForeground}
            />
            <ExampleButton
              title="requestPermissionsBackground"
              onPress={requestPermissionsBackground}
            />
            <ExampleButton
              title="getPermissionsStatus"
              onPress={getPermissionsStatus}
            />
            <ExampleButton title="getLocation" onPress={getLocation} />
            <ExampleButton title="trackOnce" onPress={trackOnce} />
            <ExampleButton title="trackOnce manual" onPress={trackOnceManual} />
            <ExampleButton
              title="trackOnce manual with beacons"
              onPress={trackOnceManualWithBeacons}
            />
            <ExampleButton title="startTracking" onPress={startTracking} />
            <ExampleButton title="stopTracking" onPress={stopTracking} />
            <ExampleButton title="isTracking" onPress={isTracking} />
            <ExampleButton title="searchPlaces" onPress={searchPlaces} />
            <ExampleButton title="searchGeofences" onPress={searchGeofences} />
            <ExampleButton title="autocomplete" onPress={autocomplete} />
            <ExampleButton title="geocode" onPress={geocode} />
            <ExampleButton title="reverseGeocode" onPress={reverseGeocode} />
            <ExampleButton title="ipGeocode" onPress={ipGeocode} />
            <ExampleButton title="validateAddress" onPress={validateAddress} />
            <ExampleButton title="getDistance" onPress={getDistance} />
            <ExampleButton title="getMatrix" onPress={getMatrix} />
            <ExampleButton title="startTrip" onPress={startTrip} />
            <ExampleButton
              title="startTrip with TrackingOptions"
              onPress={startTripWithTrackingOptions}
            />
            <ExampleButton title="completeTrip" onPress={completeTrip} />
            <ExampleButton
              title="logConversion with revenue"
              onPress={logConversionWithRevenue}
            />
            <ExampleButton title="logConversion" onPress={logConversion} />
            <ExampleButton title="trackVerified" onPress={trackVerified} />
            <ExampleButton
              title="startTrackingVerified"
              onPress={startTrackingVerified}
            />
            <ExampleButton
              title="isTrackingVerified"
              onPress={isTrackingVerified}
            />
            <ExampleButton
              title="stopTrackingVerified"
              onPress={stopTrackingVerified}
            />
            <ExampleButton title="setProduct" onPress={setProduct} />
            <ExampleButton
              title="getVerifiedLocationToken"
              onPress={getVerifiedLocationToken}
            />
            <ExampleButton title="version" onPress={version} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
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
