import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Radar, { Map, Autocomplete } from "react-native-radar";
import MapLibreGL from "@maplibre/maplibre-react-native";
import ExampleButton from "./components/exampleButton";

MapLibreGL.setAccessToken(null);

const stringify = (obj) => JSON.stringify(obj, null, 2);

Radar.on("events", (result) => {
  console.log("events:", stringify(result));
});

Radar.on("location", (result) => {
  console.log("location:", stringify(result));
});

Radar.on("clientLocation", (result) => {
  console.log("clientLocation:", stringify(result));
});

Radar.on("error", (err) => {
  console.log("error:", stringify(err));
});

Radar.on("log", (result) => {
  console.log("log:", stringify(result));
});

export default function App() {
  // add in your test code here!
  const [displayText, setDisplayText] = useState("");

  const handlePopulateText = (displayText) => {
    setDisplayText(displayText);
  };

  const stringify = (obj) => JSON.stringify(obj, null, 2);

  Radar.initialize("prj_test_pk_", true);
  
  useEffect(() => {
    Radar.setLogLevel("info");

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
      <View style={{ width: "100%", height: "50%" }}>
        <ScrollView>
          <Text style={styles.displayText}>{displayText}</Text>
        </ScrollView>
        <ScrollView>
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
            title="trackOnce manual with beacons:"
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
                near: {
                  latitude: 40.783826,
                  longitude: -73.975363,
                },
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
              Radar.geocode("20 jay st brooklyn")
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
                latitude: 40.783826,
                longitude: -73.975363,
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
                  scheduledArrivalAt: new Date("2023-10-10T12:20:30Z"),
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
            title="startTrip"
            onPress={() => {
              Radar.startTrip({
                tripOptions: {
                  externalId: "302",
                  destinationGeofenceTag: "store",
                  destinationGeofenceExternalId: "123",
                  mode: "car",
                  scheduledArrivalAt: new Date("2023-10-10T12:20:30Z"),
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
            title="logConversion"
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
            title="trackVerifiedToken"
            onPress={() => {
              Radar.trackVerifiedToken()
                .then((result) => {
                  handlePopulateText("trackVerifiedToken:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("trackVerifiedToken:" + err);
                });
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
});