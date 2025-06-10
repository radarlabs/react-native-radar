import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import Radar from "react-native-radar";
import * as Location from 'expo-location';

const stringify = (obj: any) => JSON.stringify(obj, null, 2);

export default function App() {
  const [displayText, setDisplayText] = useState("🎯 Radar TurboModule Test App\n\nTesting New Architecture - Simplified");
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [listenersSetup, setListenersSetup] = useState(false);

  const handlePopulateText = (text: string) => {
    setDisplayText(prev => prev + "\n\n" + text);
  };

  // Test TurboModule availability immediately when component mounts
  useEffect(() => {
    try {
      // Test if we can access the TurboModule without errors
      if (typeof Radar.initialize === 'function') {
        handlePopulateText("✅ TurboModule loaded successfully - initialize() available");
      } else {
        handlePopulateText("❌ TurboModule initialize function not available");
      }

      if (typeof Radar.trackOnce === 'function') {
        handlePopulateText("✅ TurboModule trackOnce() available");
      } else {
        handlePopulateText("❌ TurboModule trackOnce function not available");
      }

      if (typeof Radar.on === 'function') {
        handlePopulateText("✅ TurboModule on() available for event listeners");
      } else {
        handlePopulateText("❌ TurboModule on function not available");
      }

      handlePopulateText("🎉 No 'NativeModules.RNRadar is undefined' error!");

    } catch (error) {
      handlePopulateText("❌ TurboModule access error: " + error);
    }
  }, []);

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
        "prj_test_pk_4899327d5733b7741a3bfa223157f3859273be46", // Test key
        false // No fraud detection for simplicity
      );
      setIsInitialized(true);
      handlePopulateText("✅ Radar initialized successfully with TurboModule");
    } catch (error) {
      handlePopulateText("❌ Radar initialization failed: " + error);
    }
  };

  const setupEventListeners = () => {
    if (!isInitialized) {
      handlePopulateText("❌ Please initialize Radar first");
      return;
    }

    try {
      handlePopulateText("🔄 Setting up event listeners...");

      // Test basic event listeners
      const eventsListener = Radar.on("events", (result: any) => {
        handlePopulateText("🎯 EVENTS: " + stringify(result));
      });

      const locationListener = Radar.on("location", (result: any) => {
        handlePopulateText("📍 LOCATION: " + stringify(result));
      });

      const errorListener = Radar.on("error", (err: any) => {
        handlePopulateText("⚠️ ERROR: " + stringify(err));
      });

      setListenersSetup(true);
      handlePopulateText("✅ Event listeners active!");

    } catch (error) {
      handlePopulateText("❌ Failed to set up event listeners: " + error);
    }
  };

  const triggerTrackOnce = () => {
    if (!isInitialized) {
      handlePopulateText("❌ Please initialize Radar first");
      return;
    }

    if (!hasLocationPermission) {
      handlePopulateText("❌ Please grant location permissions first");
      return;
    }

    handlePopulateText("🔄 Triggering trackOnce via TurboModule...");
    Radar.trackOnce()
      .then((result: any) => {
        handlePopulateText("✅ trackOnce completed: " + stringify(result));
      })
      .catch((err: any) => {
        handlePopulateText("❌ trackOnce error: " + stringify(err));
      });
  };

  const testManualLocation = () => {
    if (!isInitialized) {
      handlePopulateText("❌ Please initialize Radar first");
      return;
    }

    handlePopulateText("🔄 Testing with manual location (NYC) via TurboModule...");
    Radar.trackOnce({
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        accuracy: 10,
      },
    })
      .then((result: any) => {
        handlePopulateText("✅ Manual location test completed: " + stringify(result));
      })
      .catch((err: any) => {
        handlePopulateText("❌ Manual location test error: " + stringify(err));
      });
  };

  const clearDisplay = () => {
    setDisplayText("🎯 Radar TurboModule Test App\n\nTesting New Architecture - Simplified");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.displayContainer}>
        <Text style={styles.displayText}>{displayText}</Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={requestLocationPermissions}>
          <Text style={styles.buttonText}>
            {hasLocationPermission ? "✅ Permissions Granted" : "📍 1. Request Permissions"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={initializeRadar}>
          <Text style={styles.buttonText}>
            {isInitialized ? "✅ TurboModule Initialized" : "🔧 2. Initialize TurboModule"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.priorityButton]}
          onPress={setupEventListeners}
        >
          <Text style={styles.buttonText}>
            {listenersSetup ? "✅ Listeners Active" : "🎯 3. Setup Listeners"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={triggerTrackOnce}>
          <Text style={styles.buttonText}>🚀 4. Test trackOnce</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={testManualLocation}>
          <Text style={styles.buttonText}>📍 5. Test Manual Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearDisplay}>
          <Text style={styles.buttonText}>🧹 Clear Display</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  displayContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
    margin: 16,
    borderRadius: 8,
  },
  displayText: {
    color: "#00ff00",
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 16,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  priorityButton: {
    backgroundColor: "#FF6B35",
  },
  clearButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
