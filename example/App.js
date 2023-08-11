import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Radar, { Map, Autocomplete } from "react-native-radar";
import MapLibreGL from "@maplibre/maplibre-react-native";
import DisplayText from "./components/displayText";

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
  Radar.initialize("prj_test_pk_...");

  Radar.setLogLevel("info");

  Radar.setUserId("foo");

  Radar.setDescription("description");

  Radar.setMetadata({
    foo: "bar",
    baz: true,
    qux: 1,
  });

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", height: "50%" }}>
        <Map />
      </View>
      <View style={{ width: "100%", height: "15%" }}>
        <Autocomplete
          options={{
            near: {
              latitude: 40.7342,
              longitude: -73.9911,
            },
          }}
        />
      </View>
      <View style={{ width: "100%", height: "35%" }}>
        <DisplayText />
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
