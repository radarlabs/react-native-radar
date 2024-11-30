import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import Radar, { Map, Autocomplete, RadarClientLocationUpdate, RadarLocationUpdate, RadarEventUpdate } from "react-native-radar";
import MapLibreGL from "@maplibre/maplibre-react-native";
import ExampleButton from "./components/exampleButton";

// The current version of MapLibre does not support the new react native architecture
// MapLibreGL.setAccessToken(null);

const stringify = (obj: any) => JSON.stringify(obj, null, 2);

Radar.on("events", (result: RadarEventUpdate) => {
  console.log("events:", stringify(result));
});

Radar.on("location", (result: RadarLocationUpdate) => {
  console.log("location:", stringify(result));
});

Radar.on("clientLocation", (result: RadarClientLocationUpdate) => {
  console.log("clientLocation:", stringify(result));
});

Radar.on("error", (err) => {
  console.log("error:", stringify(err));
});

Radar.on("log", (result: string) => {
  console.log("log:", stringify(result));
});

export default function App() {
  // add in your test code here!
  const [displayText, setDisplayText] = useState("");

  const handlePopulateText = (displayText: string) => {
    setDisplayText(displayText);
  };
  Radar.initialize("prj_test_pk_0000000000000000000000000000000000000000", true);

  useEffect(() => {
    Radar.setLogLevel("debug");

    Radar.setUserId("foo");

    Radar.setDescription("description");

    Radar.setMetadata({
      foo: "bar",
      baz: true,
      qux: 1,
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* The current version of MapLibre does not support the new react native architecture  */}
      {Platform.OS !== "web" &&
        <>
          <View style={{ width: "100%", height: "40%" }}>
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
      }
      <View style={{ width: "100%", height: Platform.OS !== "web" ? "50%" : "100%" }}>
        <ScrollView style={{ height: "25%" }}>
          <Text style={styles.displayText}>{displayText}</Text>
        </ScrollView>
        <ScrollView style={{ height: "75%" }}>
          <ExampleButton
            title="getUser"
            onPress={() => {
              Radar.getUserId()
                .then((result) => {
                  handlePopulateText("getUserId:" + result);
                })
                .catch((err) => {
                  handlePopulateText("getUserId:" + err);
                });
            }}
          />
          <ExampleButton
            title="getDescription"
            onPress={() => {
              Radar.getDescription()
                .then((result) => {
                  handlePopulateText("getDescription:" + result);
                })
                .catch((err) => {
                  handlePopulateText("getDescription:" + err);
                });
            }}
          />
          <ExampleButton
            title="getMetadata"
            onPress={() => {
              Radar.getMetadata()
                .then((result) => {
                  handlePopulateText("getMetadata:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("getMetadata:" + err);
                });
            }}
          />
          <ExampleButton
            title="requestPermissionsForeground"
            onPress={() => {
              Radar.requestPermissions(false)
                .then((result) => {
                  handlePopulateText("requestPermissions:" + result);
                })
                .catch((err) => {
                  handlePopulateText("requestPermissions:" + err);
                });
            }}
          />

          <ExampleButton
            title="requestPermissionsBackground"
            onPress={() => {
              Radar.requestPermissions(true)
                .then((result) => {
                  handlePopulateText("requestPermissions:" + result);
                })
                .catch((err) => {
                  handlePopulateText("requestPermissions:" + err);
                });
            }}
          />
          <ExampleButton
            title="getPermissionsStatus"
            onPress={() => {
              Radar.getPermissionsStatus()
                .then((result) => {
                  handlePopulateText("getPermissionsStatus:" + result);
                })
                .catch((err) => {
                  handlePopulateText("getPermissionsStatus:" + err);
                });
            }}
          />
          <ExampleButton
            title="getLocation"
            onPress={() => {
              Radar.getLocation()
                .then((result) => {
                  handlePopulateText("getLocation:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("getLocation:" + err);
                });
            }}
          />
          <ExampleButton
            title="trackOnce"
            onPress={() => {
              Radar.trackOnce()
                .then((result) => {
                  handlePopulateText("trackOnce:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("trackOnce:" + err);
                });
            }}
          />

          <ExampleButton
            title="trackOnce manual"
            onPress={() => {
              Radar.trackOnce({
                location: {
                  latitude: 39.2904,
                  longitude: -76.6122,
                  accuracy: 60,
                },
              })
                .then((result) => {
                  handlePopulateText(
                    "trackOnce manual with location accuracy::" +
                    stringify(result)
                  );
                })
                .catch((err) => {
                  handlePopulateText(
                    "trackOnce manual with location accuracy::" + err
                  );
                });
            }}
          />
          <ExampleButton
            title="trackOnce manual with beacons"
            onPress={() => {
              Radar.trackOnce({
                desiredAccuracy: "medium",
                beacons: true,
              })
                .then((result) => {
                  handlePopulateText(
                    "trackOnce manual with beacons:" + stringify(result)
                  );
                })
                .catch((err) => {
                  handlePopulateText("trackOnce manual with beacons:" + err);
                });
            }}
          />
          <ExampleButton
            title="trackOnce for back compatible"
            onPress={() => {
              Radar.trackOnce({
                latitude: 39.2904,
                longitude: -76.6122,
                accuracy: 65,
              })
                .then((result) => {
                  handlePopulateText(
                    "trackOnce for back compatible:" + stringify(result)
                  );
                })
                .catch((err) => {
                  handlePopulateText("trackOnce for back compatible:" + err);
                });
            }}
          />

          <ExampleButton
            title="searchPlaces"
            onPress={() => {
              Radar.searchPlaces({
                near: {
                  latitude: 40.783826,
                  longitude: -73.975363,
                },
                radius: 1000,
                chains: ["starbucks"],
                chainMetadata: {
                  customFlag: "true",
                },
                limit: 10,
              })
                .then((result) => {
                  handlePopulateText("searchPlaces:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("searchPlaces:" + err);
                });
            }}
          />

          <ExampleButton
            title="searchGeofences"
            onPress={() => {
              Radar.searchGeofences({
                radius: 1000,
                tags: ["venue"],
                limit: 10,
                includeGeometry: true,
              })
                .then((result) => {
                  handlePopulateText("searchGeofences:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("searchGeofences:" + err);
                });
            }}
          />

          <ExampleButton
            title="autocomplete"
            onPress={() => {
              Radar.autocomplete({
                query: "brooklyn roasting",
                limit: 10,
              })
                .then((result) => {
                  handlePopulateText("autocomplete:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("autocomplete:" + err);
                });
            }}
          />

          <ExampleButton
            title="geocode"
            onPress={() => {
              Radar.geocode({ address: "20 jay st brooklyn" })
                .then((result) => {
                  handlePopulateText("geocode:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("geocode:" + err);
                });
            }}
          />

          <ExampleButton
            title="reverseGeocode"
            onPress={() => {
              Radar.reverseGeocode({
                location: {
                  latitude: 40.783826,
                  longitude: -73.975363,
                }
              })
                .then((result) => {
                  handlePopulateText("reverseGeocode:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("reverseGeocode:" + err);
                });
            }}
          />

          <ExampleButton
            title="ipGeocode"
            onPress={() => {
              Radar.ipGeocode()
                .then((result) => {
                  handlePopulateText("ipGeocode:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("ipGeocode:" + err);
                });
            }}
          />

          <ExampleButton
            title="validateAddress"
            onPress={() => {
              Radar.validateAddress({
                latitude: 0,
                longitude: 0,
                city: "New York",
                stateCode: "NY",
                postalCode: "10003",
                countryCode: "US",
                street: "Broadway",
                number: "841",
              })
                .then((result) => {
                  handlePopulateText("validateAddress:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("validateAddress:" + err);
                });
            }}
          />

          <ExampleButton
            title="getDistance"
            onPress={() => {
              Radar.getDistance({
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
              })
                .then((result) => {
                  handlePopulateText("getDistance:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("getDistance:" + err);
                });
            }}
          />

          <ExampleButton
            title="getMatrix"
            onPress={() => {
              Radar.getMatrix({
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
              })
                .then((result) => {
                  handlePopulateText("getMatrix:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("getMatrix:" + err);
                });
            }}
          />

          <ExampleButton
            title="startTrip"
            onPress={() => {
              Radar.startTrip({
                tripOptions: {
                  externalId: "300",
                  destinationGeofenceTag: "store",
                  destinationGeofenceExternalId: "123",
                  mode: "car",
                  scheduledArrivalAt: new Date(
                    "2023-10-10T12:20:30Z"
                  ).getTime(),
                  metadata: {
                    "test-trip-meta": "test-trip-data"
                  }
                },
              })
                .then((result) => {
                  handlePopulateText("startTrip:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("startTrip:" + err);
                });
            }}
          />

          <ExampleButton
            title="startTrip with TrackingOptions"
            onPress={() => {
              Radar.startTrip({
                tripOptions: {
                  externalId: "302",
                  destinationGeofenceTag: "store",
                  destinationGeofenceExternalId: "123",
                  mode: "car",
                  scheduledArrivalAt: new Date(
                    "2023-10-10T12:20:30Z"
                  ).getTime(),
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
              })
                .then((result) => {
                  handlePopulateText("startTrip:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("startTrip:" + err);
                });
            }}
          />

          <ExampleButton
            title="completeTrip"
            onPress={() => {
              Radar.completeTrip()
                .then((result) => {
                  handlePopulateText("completeTrip:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("completeTrip:" + err);
                });
            }}
          />

          <ExampleButton
            title="logConversion with revenue"
            onPress={() => {
              Radar.logConversion({
                name: "in_app_purchase",
                revenue: 150,
                metadata: {
                  sku: "123456789",
                },
              })
                .then((result) => {
                  handlePopulateText("logConversion:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("logConversion:" + err);
                });
            }}
          />

          <ExampleButton
            title="logConversion"
            onPress={() => {
              Radar.logConversion({
                name: "in_app_purchase",
                metadata: {
                  sku: "123456789",
                },
              })
                .then((result) => {
                  handlePopulateText("logConversion:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("logConversion:" + err);
                });
            }}
          />

          <ExampleButton
            title="trackVerified"
            onPress={() => {
              Radar.trackVerified()
                .then((result) => {
                  handlePopulateText("trackVerified:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("trackVerified:" + err);
                });
            }}
          />

          <ExampleButton
            title="getVerifiedLocationToken"
            onPress={() => {
              Radar.getVerifiedLocationToken()
                .then((result) => {
                  handlePopulateText("getVerifiedLocationToken:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("getVerifiedLocationToken:" + err);
                });
            }}
          />

          <ExampleButton
            title="startVerifyServer"
            onPress={() => {
              Radar.startVerifyServer();
            }}
          />

          <ExampleButton
            title="stopVerifyServer"
            onPress={() => {
              Radar.stopVerifyServer();
            }}
          />

          <ExampleButton
            title="version"
            onPress={() => {
              Radar.nativeSdkVersion().then((nativeVersion) => {
                handlePopulateText(`sdk: ${Radar.rnSdkVersion()}, native: ${nativeVersion}`);
              })
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  displayText: {
    flex: 1
  }
});
