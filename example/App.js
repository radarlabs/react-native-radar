import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Radar, { Map, Autocomplete} from 'react-native-radar';
import MapLibreGL from '@maplibre/maplibre-react-native';

MapLibreGL.setAccessToken(null);


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

export default function App() {
  Radar.initialize('prj_live_pk_...');

  Radar.setLogLevel('info');

  Radar.setUserId('foo');

  Radar.setDescription("description");

  Radar.setMetadata({
    foo: 'bar',
    baz: true,
    qux: 1,
  });

  Radar.getUserId().then(result => {
    console.log('getUserId:', result);
  }).catch((err) => {
    console.log('getUserId:', err);
  });

  Radar.getDescription().then(result => {
    console.log('getDescription:', result);
  }).catch((err) => {
    console.log('getDescription:', err);
  });

  Radar.getMetadata().then(result => {
    console.log('getDescription:', result);
  }).catch((err) => {
    console.log('getDescription:', err);
  });

  Radar.requestPermissions(false).then((result) => {
    console.log('requestPermissions:', result);
  }).catch((err) => {
    console.log('requestPermissions:', err);
  });

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

  Radar.trackOnce({
    location: {
      latitude: 39.2904,
      longitude: -76.6122,
      accuracy: 60
    }
  }).then((result) => {
    console.log('trackOnce manual with location accuracy:', stringify(result));
  }).catch((err) => {
    console.log('trackOnce manual with location  accuracy:', err);
  });

  Radar.trackOnce({
    desiredAccuracy: "medium",
    beacons: true
  }).then((result) => {
    console.log('trackOnce manual with beacons:', stringify(result));
  }).catch((err) => {
    console.log('trackOnce manual with beacons:', err);
  });

  Radar.trackOnce({
    latitude: 39.2904,
    longitude: -76.6122,
    accuracy: 65
  }).then((result) => {
    console.log('trackOnce for back compatible', stringify(result));
  }).catch((err) => {
    console.log('trackOnce for back compatible:', err);
  });

  Radar.startTrackingContinuous();

  Radar.searchPlaces({
    near: {
      latitude: 40.783826,
      longitude: -73.975363,
    },
    radius: 1000,
    chains: ["starbucks"],
    chainMetadata: {
      "customFlag": "true"
    },
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

  /*Radar.startTrip({
    externalId: '299',
    destinationGeofenceTag: 'store',
    destinationGeofenceExternalId: '123',
    mode: 'car',
    scheduledArrivalAt: new Date('2023-10-10T12:20:30Z').getTime()
  });*/

  /*Radar.startTrip({
    tripOptions: {
      externalId: '300',
      destinationGeofenceTag: 'store',
      destinationGeofenceExternalId: '123',
      mode: 'car',
      scheduledArrivalAt: new Date('2023-10-10T12:20:30Z').getTime()
    }
  }).then((result) => {
    console.log('startTrip:', stringify(result));
  }).catch((err) => {
    console.log(err.stack);
  });*/

  Radar.startTrip({
    tripOptions: {
      externalId: '302',
      destinationGeofenceTag: 'store',
      destinationGeofenceExternalId: '123',
      mode: 'car',
      scheduledArrivalAt: new Date('2023-10-10T12:20:30Z').getTime()
    },
    trackingOptions: {
      desiredStoppedUpdateInterval: 30,
      fastestStoppedUpdateInterval: 30,
      desiredMovingUpdateInterval: 30,
      fastestMovingUpdateInterval: 30,
      desiredSyncInterval: 20,
      desiredAccuracy: "high",
      stopDuration: 0,
      stopDistance: 0,
      replay: "none",
      sync: "all",
      showBlueBar: true,
      useStoppedGeofence: false,
      stoppedGeofenceRadius: 0,
      useMovingGeofence: false,
      movingGeofenceRadius: 0,
      syncGeofences: false,
      syncGeofencesLimit: 0,
      beacons: false,
      foregroundServiceEnabled: false
    }
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

  Radar.completeTrip();
  
  Radar.logConversion({
    name: 'in_app_purchase',
    revenue: 150,
    metadata: {
      sku: '123456789',
    },
  }).then((result) => {
    console.log("sendEvent:", stringify(result));
  }).catch((err) => {
    console.log("sendEvent:", err);
  });

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', height: '50%'}}>
        <Map />
      </View>
      <View style={{ width: '100%', height: '15%'}}>
      <Autocomplete options={{
            near: {
              latitude: 40.7342,
              longitude: -73.9911,
            }
          }} />
      </View>
      <View style={{ width: '100%', height: '35%'}}>
          {/* buttons go here  */}
      </View>
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
