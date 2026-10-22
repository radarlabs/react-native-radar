import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Map } from "react-native-radar";
import type { RadarMapOptions } from "react-native-radar";
import { useLogStore } from "../console/logStore";
import type { Actions } from "../actions";
import { colors } from "../theme";

export default function MapScreen({ actions }: { actions: Actions }) {
  const { write } = useLogStore();

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, styles.placeholder]}>
        <Text style={styles.placeholderText}>The Radar map isn't available on web.</Text>
      </View>
    );
  }

  const mapOptions: RadarMapOptions = {
    mapStyle: "radar-default-v1",
    showUserLocation: true,
    onDidFinishLoadingMap: () => write("log", "Map finished loading"),
    onWillStartLoadingMap: () => write("log", "Map will start loading"),
    onDidFailLoadingMap: () => write("error", "Map failed to load"),
  };

  return (
    <View style={styles.container}>
      <Map mapOptions={mapOptions} />
      <TouchableOpacity
        accessibilityLabel="Refresh location"
        style={styles.fab}
        onPress={() => {
          write("action", "trackOnce");
          actions.trackOnce();
        }}
      >
        <Text style={styles.fabText}>↻</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  placeholderText: {
    color: colors.secondaryText,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  fabText: {
    fontSize: 24,
    color: colors.tint,
  },
});
