import { Text, View, StyleSheet, Button } from 'react-native';
import { multiply, requestPermissions, Radar } from 'react-native-radar';
import React from 'react';

const result = multiply(3, 7);
Radar.initialize("prj_test_pk_4899327d5733b7741a3bfa223157f3859273be46", false);


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
      <Text>Result: {result}</Text>
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
});
