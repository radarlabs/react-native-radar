import { Text, View, StyleSheet, Button, Platform } from 'react-native';
import { Radar } from 'react-native-radar';
import React from 'react';

Radar.initialize("prj_test_pk_4899327d5733b7741a3bfa223157f3859273be46", false);

// Check if we're using the new architecture
const isNewArchitecture = global.__turboModuleProxy != null;

export default function App() {

  
  React.useEffect(() => {
    Radar.onLocationUpdate((location) => {
      console.log("from callback", location);
    });
    Radar.requestPermissions(false).then((status) => {
      console.log("from promise", status);
      if (status === "GRANTED_FOREGROUND") {
        Radar.requestPermissions(true).then((status) => {
          console.log("from promise", status);
        }).catch((error) => {
          console.log("from promise error", error);
        });
      }
    }).catch((error) => {
      console.log("from promise error", error);
    });

    return () => {
      Radar.clearLocationUpdate();
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.architectureIndicator}>
        <Text style={styles.architectureText}>
          Architecture: {isNewArchitecture ? 'New Architecture' : 'Old Architecture'}
        </Text>
        <Text style={styles.platformText}>
          Platform: {Platform.OS}
        </Text>
      </View>
      <Button title="Track Once" onPress={() => Radar.trackOnce().then((result) => {
        console.log("from promise", result);
      }).catch((error) => {
        console.log("from promise error", error);
      })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  architectureIndicator: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  architectureText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  platformText: {
    fontSize: 14,
    color: '#666',
  },
});
