import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Radar from "react-native-radar";
import React, { useEffect, useMemo, useState } from "react";
import { Settings as RNSettings } from "react-native";
// Load MapLibre independently of RadarMap to exercise shared native registration.
// Unused named imports are removed by the TypeScript transform.
import "@maplibre/maplibre-react-native";
import { createActions } from "./src/actions";
import TabBar, { type Tab } from "./src/components/TabBar";
import { LogStoreProvider, useLogStore } from "./src/console/logStore";
import DebugScreen from "./src/screens/DebugScreen";
import MapScreen from "./src/screens/MapScreen";
import SettingsSheet from "./src/screens/SettingsSheet";
import TestsScreen from "./src/screens/TestsScreen";
import { colors } from "./src/theme";

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

declare global {
  var __turboModuleProxy: any;
  var nativeFabricUIManager: any;
}

const globalAny = globalThis as any;
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

const architecture = isNewArchitecture ? "New Architecture" : "Old Architecture";

export default function App() {
  return (
    <SafeAreaProvider>
      <LogStoreProvider>
        <ExampleApp />
      </LogStoreProvider>
    </SafeAreaProvider>
  );
}

// Map / Debug / Tests tabs, like the native example apps. Opens on Tests.
function ExampleApp() {
  const { writeResult, writeEvents } = useLogStore();
  const [tab, setTab] = useState<Tab>("Tests");
  const [settingsVisible, setSettingsVisible] = useState(false);

  const populateText = (displayText: string) => {
    writeResult(displayText);
  };

  const actions = useMemo(() => createActions(populateText, writeEvents), [writeResult, writeEvents]);

  useEffect(() => {
    console.log(architecture);

    Radar.setLogLevel("info");

    Radar.setUserId("foo");

    Radar.setDescription("description");

    Radar.setMetadata({
      foo: "bar",
      baz: true,
      qux: 1
    });

    // setProduct isn't implemented on web.
    Radar.setProduct?.("test-product");

    Radar.setAnonymousTrackingEnabled(false);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.screen}>
        {tab === "Map" && <MapScreen actions={actions} />}
        {tab === "Debug" && <DebugScreen />}
        {tab === "Tests" && (
          <TestsScreen
            actions={actions}
            architecture={architecture}
            onOpenSettings={() => setSettingsVisible(true)}
            onViewAll={() => setTab("Debug")}
          />
        )}
      </View>
      <TabBar selected={tab} onSelect={setTab} />
      <SettingsSheet visible={settingsVisible} actions={actions} onClose={() => setSettingsVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
});
