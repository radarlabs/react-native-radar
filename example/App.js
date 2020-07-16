/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Radar from 'react-native-radar';

const stringify = obj => (
  JSON.stringify(obj, null, 2)
);

Radar.on('events', (result) => {
  console.log('events:', stringify(result));
});

Radar.on('location', (result) => {
  console.log('location:', stringify(result));
});

Radar.on('clientLocation', (result) => {
  console.log('clientLocation:', stringify(result));
});

Radar.on('error', (err) => {
  console.log('error:', stringify(err));
});

Radar.on('log', (result) => {
  console.log('log:', stringify(result));
});

const App: () => React$Node = () => {
  Radar.setUserId("foo");
  Radar.setMetadata({
    foo: 'bar',
    baz: true,
    qux: 1,
  });

  Radar.requestPermissions(true);

  Radar.getPermissionsStatus().then((result) => {
    console.log('getPermissionsStatus:', result);
  }).catch((err) => {
    console.log('getPermissionsStatus:', err);
  });

  Radar.getLocation().then((result) => {
    console.log('getLocation:', stringify(result));
  }).catch((err) => {
    console.log('getLocation:', err);
  });

  Radar.trackOnce().then((result) => {
    console.log('trackOnce:', stringify(result));
  }).catch((err) => {
    console.log('trackOnce:', err);
  });

  Radar.startTrackingContinuous();

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
    tags: ["venue"],
    limit: 10,
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

  Radar.startTrip({
    externalId: '299',
    destinationGeofenceTag: 'store',
    destinationGeofenceExternalId: '123',
    mode: 'car',
  });

  let i = 0;
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
  }).then((result) => {
    console.log('mockTracking:', stringify(result));

    i++;

    if (i == steps - 1) {
      Radar.stopTrip();
    }
  }).catch((err) => {
    console.log('mockTracking:', err);
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
