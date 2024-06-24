//Responsibility: handle the redux and state
import Radar from 'react-native-radar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";

export default function App() {
  // add in your test code here!
  const [displayText, setDisplayText] = useState("");

  const handlePopulateText = (displayText: any) => {
    setDisplayText(displayText);
  };

  const stringify = (obj: any) => JSON.stringify(obj, null, 2);

  useEffect(() => {
    Radar.initialize(
      "prj_test_pk_ca1c535d59d979f05256cd964ec3c15f3016bb8e",
      true
    );

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
        {/* <Map /> */}
      </View>
      <View style={{ width: "100%", height: "10%" }}>
        {/* <Autocomplete
          options={{
            near: {
              latitude: 40.7342,
              longitude: -73.9911,
            },
          }}
        /> */}
      </View>
      <View style={{ width: "100%", height: "50%" }}>
        <ScrollView>
          <Text style={styles.displayText}>{displayText}</Text>
        </ScrollView>
        <ScrollView>
          <Button
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
          <Button
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
          <Button
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
          <Button
            title="requestPermissions"
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
          <Button
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
          <Button
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
          <Button
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
          <Button
            title="isTracking"
            onPress={() => {
              handlePopulateText("isTracking:" + Radar.isTracking())
                // .then((result) => {
                //   handlePopulateText("isTracking:" + result);
                // })
                // .catch((err) => {
                //   handlePopulateText("isTracking:" + err);
                // });
            }}
          />
          <Button
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
          <Button
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
          <Button
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

          <Button
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

          <Button
            title="searchGeofences"
            onPress={() => {
              Radar.searchGeofences({
                radius: 1000,
                tags: ["venue"],
                limit: 10,
                includeGeometry: false,
              })
                .then((result) => {
                  handlePopulateText("searchGeofences:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("searchGeofences:" + err);
                });
            }}
          />

          <Button
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

          <Button
            title="geocode"
            onPress={() => {
              Radar.geocode({
                  address: "20 jay st brooklyn"
                })
                .then((result) => {
                  handlePopulateText("geocode:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("geocode:" + err);
                });
            }}
          />


          <Button
            title="geocode with countries and layers"
            onPress={() => {
              Radar.geocode({
                  address: "20 jay st",
                  countries: ["CA"],
                  layers: ["locality"],
                })
                .then((result) => {
                  handlePopulateText("geocode:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("geocode:" + err);
                });
            }}
          />

          <Button
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

          <Button
            title="reverseGeocode with layers"
            onPress={() => {
              Radar.reverseGeocode({
                location: {
                  latitude: 40.783826,
                  longitude: -73.975363,
                },
                layers: ["county"]
              })
                .then((result) => {
                  handlePopulateText("reverseGeocode:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("reverseGeocode:" + err);
                });
            }}
          />

          <Button
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

          <Button
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

          <Button
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

          <Button
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

          <Button
            title="startTrip with tracking options"
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

          <Button
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

          <Button
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

          <Button
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

          {/* <Button
            title="startTrackingCustom"
            onPress={() => {
              const customTrackingOptions = {...presetEfficient, beacons: true};
              Radar.startTrackingCustom(customTrackingOptions)
            }}
          /> */}

          <Button
            title="requestForegroundLocationPermission"
            onPress={() => {
              Radar.requestForegroundLocationPermission();
            }}
          />

          <Button
            title="requestBackgroundLocationPermission"
            onPress={() => {
              Radar.requestBackgroundLocationPermission();
            }}
          />

          <Button
            title="getLocationPermissionStatus"
            onPress={() => {
              Radar.getLocationPermissionStatus()
                .then((result) => {
                  handlePopulateText("getLocationPermissionStatus:" + stringify(result));
                })
                .catch((err) => {
                  handlePopulateText("getLocationPermissionStatus:" + err);
                });
            }}
          />

          <Button
            title="openAppSettings"
            onPress={() => {
              Radar.openAppSettings();
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayText: {

  }
});
