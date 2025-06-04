import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import Radar from "react-native-radar";
import * as Location from 'expo-location';

const stringify = (obj: any) => JSON.stringify(obj, null, 2);

export default function App() {
  const [displayText, setDisplayText] = useState("Radar SDK Test App\n\nTesting New Architecture Migration");
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const handlePopulateText = (text: string) => {
    setDisplayText(prev => prev + "\n\n" + text);
  };

  const requestLocationPermissions = async () => {
    try {
      handlePopulateText("🔄 Requesting location permissions...");

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        handlePopulateText("❌ Location permission denied");
        return;
      }

      setHasLocationPermission(true);
      handlePopulateText("✅ Location permissions granted");
    } catch (error) {
      handlePopulateText("❌ Permission request failed: " + error);
    }
  };

  const initializeRadar = () => {
    try {
      Radar.initialize(
        "prj_test_pk_4899327d5733b7741a3bfa223157f3859273be46",
        true
      );
      setIsInitialized(true);
      handlePopulateText("✅ Radar initialized successfully");
    } catch (error) {
      handlePopulateText("❌ Radar initialization failed: " + error);
    }
  };

  const testTrackOnce = () => {
    if (!isInitialized) {
      handlePopulateText("❌ Please initialize Radar first");
      return;
    }

    if (!hasLocationPermission) {
      handlePopulateText("❌ Please grant location permissions first");
      return;
    }

    handlePopulateText("🔄 Testing trackOnce...");
    Radar.trackOnce()
      .then((result: any) => {
        handlePopulateText("✅ trackOnce success: " + stringify(result));
      })
      .catch((err: any) => {
        handlePopulateText("❌ trackOnce error: " + stringify(err));
      });
  };

  const testTrackOnceWithLocation = () => {
    if (!isInitialized) {
      handlePopulateText("❌ Please initialize Radar first");
      return;
    }

    handlePopulateText("🔄 Testing trackOnce with manual location...");
    Radar.trackOnce({
      location: {
        latitude: 40.7342,
        longitude: -73.9911,
        accuracy: 60,
      },
    })
      .then((result: any) => {
        handlePopulateText("✅ trackOnce with location success: " + stringify(result));
      })
      .catch((err: any) => {
        handlePopulateText("❌ trackOnce with location error: " + stringify(err));
      });
  };

  const setupEventListeners = () => {
    if (!isInitialized) {
      handlePopulateText("❌ Please initialize Radar first");
      return;
    }

    try {
      // Set up event listeners
      Radar.on("events", (result: any) => {
        handlePopulateText("📡 Events received: " + stringify(result));
      });

      Radar.on("location", (result: any) => {
        handlePopulateText("📍 Location update: " + stringify(result));
      });

      Radar.on("clientLocation", (result: any) => {
        handlePopulateText("📱 Client location: " + stringify(result));
      });

      Radar.on("error", (err: any) => {
        handlePopulateText("❌ Radar error: " + stringify(err));
      });

      Radar.on("log", (result: string) => {
        handlePopulateText("📝 Radar log: " + stringify(result));
      });

      handlePopulateText("✅ Event listeners set up successfully");
    } catch (error) {
      handlePopulateText("❌ Failed to set up event listeners: " + error);
    }
  };

  const clearDisplay = () => {
    setDisplayText("Radar SDK Test App\n\nTesting New Architecture Migration");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.displayContainer}>
        <Text style={styles.displayText}>{displayText}</Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={requestLocationPermissions}>
          <Text style={styles.buttonText}>
            {hasLocationPermission ? "✅ Permissions Granted" : "📍 Request Permissions"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={initializeRadar}>
          <Text style={styles.buttonText}>Initialize Radar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={setupEventListeners}>
          <Text style={styles.buttonText}>Setup Event Listeners</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testTrackOnce}>
          <Text style={styles.buttonText}>Test trackOnce</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testTrackOnceWithLocation}>
          <Text style={styles.buttonText}>Test trackOnce (Manual Location)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearDisplay}>
          <Text style={styles.buttonText}>Clear Display</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  displayContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  displayText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  buttonContainer: {
    padding: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
