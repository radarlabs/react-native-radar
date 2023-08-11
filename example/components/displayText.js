import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import ExampleButton from "./exampleButton";
import Radar, { Map, Autocomplete } from "react-native-radar";

const DisplayText = () => {
  const [displayText, setDisplayText] = useState("");

  const handlePopulateText = (displayText) => {
    setDisplayText(displayText);
  };

  const stringify = (obj) => JSON.stringify(obj, null, 2);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.displayText}>{displayText}</Text>
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
            Radar.getUserId()
              .then((result) => {
                handlePopulateText("geocode:" + stringify(result));
              })
              .catch((err) => {
                handlePopulateText("geocode:" + err);
              });
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  displayText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default DisplayText;
