import { Alert, type EventSubscription, Text, View, StyleSheet, Button } from 'react-native';
import { multiply, initialize, requestPermissions, trackOnce, locationEmitter } from 'react-native-radar';
import React from 'react';

const result = multiply(3, 7);
initialize("prj_test_pk_4899327d5733b7741a3bfa223157f3859273be46", false);
requestPermissions(false);
export default function App() {

  const listenerSubscription = React.useRef<null | EventSubscription>(null);
  
  React.useEffect(() => {
    listenerSubscription.current = locationEmitter((location:any) => {
      console.log(location);
      Alert.alert(`New location: ${location}`);
    });
    
    return  () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button title="Track Once" onPress={() => trackOnce()} />
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
