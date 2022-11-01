import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Radar from 'react-native-radar';

const stringify = obj => (
  JSON.stringify(obj, null, 2)
);

export default function App() {  
  Radar.initialize("prj_test_pk_0000000000000000000000000000000000000000");

  Radar.setLogLevel('info');

  Radar.setUserId('foo');

  Radar.setMetadata({
    foo: 'bar',
    baz: true,
    qux: 1,
  });

  Radar.getPermissionsStatus().then((result) => {
    console.log(result)
  }).catch(err => {
    console.log(err)
  })

  Radar.getLocation().then((result) => {
    console.log(result)
  }).catch(err => {
    console.log(err)
  })

  Radar.trackOnce().then((result) => {
    console.log(result)
  }).catch(err => {
    console.log(err)
  })

  Radar.trackOnce({
    latitude: 39.2904,
    longitude: -76.6122,
    accuracy: 60
  }).then((result) => {
    console.log('trackOnce manual with location accuracy:', stringify(result));
  }).catch((err) => {
    console.log('trackOnce manual with location  accuracy:', err);
  });

  Radar.searchPlaces({
    near: {
      latitude: 40.783826,
      longitude: -73.975363,
    },
    radius: 1000,
    chains: ["starbucks"],
    limit: 10,
  }).then((result) => {
    console.log('searchPlaces:', stringify(result));
  }).catch((err) => {
    console.log('searchPlaces:', err);
  });

  Radar.searchGeofences({
    radius: 1000,
    tags: ["store"],
    limit: 10,
    near: {
      latitude: 37.76,
      longitude:  -122.438
    }
  }).then((result) => {
    console.log('searchGeofences:', stringify(result));
  }).catch((err) => {
    console.log('searchGeofences:', err);
  }); 
 
  Radar.autocomplete({
    query: 'brooklyn roasting',
    near: {
      latitude: 40.783826,
      longitude: -73.975363,
    },
    limit: 10,
  }).then((result) => {
    console.log('autocomplete:', stringify(result));
  }).catch((err) => {
    console.log('autocomplete:', err);
  });

  Radar.geocode('20 jay st brooklyn').then((result) => {
    console.log('geocode:', stringify(result));
  }).catch((err) => {
    console.log('geocode:', err);
  });

  Radar.reverseGeocode({
    latitude: 40.783826,
    longitude: -73.975363,
  }).then((result) => {
    console.log('reverseGeocode:', stringify(result));
  }).catch((err) => {
    console.log('reverseGeocode:', err);
  });

  Radar.ipGeocode().then((result) => {
    console.log('ipGeocode:', stringify(result));
  }).catch((err) => {
    console.log('ipGeocode:', err);
  });

  Radar.getDistance({
    origin: {
      latitude: 40.78382,
      longitude: -73.97536,
    },
    destination: {
      latitude: 40.70390,
      longitude: -73.98670,
    },
    modes: [
      'foot',
      'car',
    ],
    units: 'imperial',
  }).then((result) => {
    console.log('getDistance:', stringify(result));
  }).catch((err) => {
    console.log('getDistance:', err);
  });

  Radar.getMatrix({
    origins: [
      {
        latitude: 40.78382,
        longitude: -73.97536,
      },
      {
        latitude: 40.70390,
        longitude: -73.98670,
      },
    ],
    destinations: [
      {
        latitude: 40.64189,
        longitude: -73.78779,
      },
      {
        latitude: 35.99801,
        longitude: -78.94294,
      },
    ],
    mode: 'car',
    units: 'imperial',
  }).then((result) => {
    console.log('getMatrix:', stringify(result));
  }).catch((err) => {
    console.log('getMatrix:', err);
  });

  Radar.startTrip({
    externalId: '299',
    destinationGeofenceTag: 'store',
    destinationGeofenceExternalId: '123',
    mode: 'car',
  }).then((result) => {
    console.log('startTrip:', stringify(result));
  }).catch((err) => {
    console.log('startTrip:', err);
  });

  Radar.mockTracking({
    origin: {
      latitude: 40.78382,
      longitude: -73.97536,
    },
    destination: {
      latitude: 40.70390,
      longitude: -73.98670,
    },
    mode: 'car',
    steps: 3,
    interval: 3,
  });

  Radar.completeTrip().then((result) => {
    console.log('completeTrip:', stringify(result));
  }).catch((err) => {
    console.log('completeTrip:', err);
  })

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
