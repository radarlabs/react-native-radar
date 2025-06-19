import { Alert, type EventSubscription, Text, View, StyleSheet, Button } from 'react-native';
import { multiply, requestPermissions, locationEmitter, Radar } from 'react-native-radar';
import React from 'react';

const result = multiply(3, 7);
Radar.initialize("prj_test_pk_4899327d5733b7741a3bfa223157f3859273be46", false);

requestPermissions(false);
export default function App() {

  const listenerSubscription = React.useRef<null | EventSubscription>(null);
  
  React.useEffect(() => {
    listenerSubscription.current = locationEmitter((location:any) => {
      console.log("from callback", location);
      //Alert.alert(`New location: ${location}`);
    });
    
    return  () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
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
