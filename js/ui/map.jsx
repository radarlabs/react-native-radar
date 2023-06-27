import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { getHost, getPublishableKey } from '../helpers';
import Radar from '../index.native';

const DEFAULT_STYLE = 'radar-default-v1';

const defaultMarkerOptions = {
  color: '#000257',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  logo: {
    position: 'absolute',
    bottom: -15,
    left: 5,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  userLocation: {
    pulse: {
      circleRadius: 15,
      circleColor: '#000257',
      circleOpacity: 0.2,
      circlePitchAlignment: 'map',
    },
    background: {
      circleRadius: 9,
      circleColor: '#fff',
      circlePitchAlignment: 'map',
    },
    foreground: {
      circleRadius: 6,
      circleColor: '#000257',
      circlePitchAlignment: 'map',
    },
  },
});

const createStyleURL = async (style = DEFAULT_STYLE) => {
  const host = await getHost();
  const publishableKey = await getPublishableKey();
  return `${host}/maps/styles/${style}?publishableKey=${publishableKey}`;
};

const RadarMap = ({ mapOptions, markerOptions }) => {
  const [userLocation, setUserLocation] = useState(null);

  const [styleURL, setStyleURL] = useState(null);
  createStyleURL(mapOptions?.mapStyle || DEFAULT_STYLE).then((result) => {
    setStyleURL(result);
  });


  const [cameraConfig, setCameraConfig] = useState({
    triggerKey: Date.now(),
    centerCoordinate: [-94.630146, 39.113581],
    animationMode: 'flyTo',
    animationDuration: 600,
    zoomLevel: 2, // was 12
  });

  const geoJSONUserLocation = {
    type: 'FeatureCollection',
    features: (userLocation !== null) ? [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [userLocation.longitude, userLocation.latitude],
        },
      },
    ] : [],
  };

  const userLocationMapIndicator = (
    <MapLibreGL.ShapeSource
      id="user-location"
      shape={geoJSONUserLocation}
    >
      <MapLibreGL.CircleLayer
        id="user-location-inner"
        style={styles.userLocation.pulse}
      />
      <MapLibreGL.CircleLayer
        id="user-location-middle"
        style={styles.userLocation.background}
      />
      <MapLibreGL.CircleLayer
        id="user-location-outer"
        style={styles.userLocation.foreground}
      />

    </MapLibreGL.ShapeSource>
  );

  useEffect(() => {
    Radar.getLocation().then((result) => {
      if (result.status === 'SUCCESS') {
        setUserLocation({
          latitude: result.location.latitude,
          longitude: result.location.longitude,
        });
      }
    });
  }, []);

  if (!styleURL) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        pitchEnabled={false}
        compassEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        // onRegionDidChange={mapOptions.onRegionDidChange}
        styleURL={styleURL}
      >
        {userLocationMapIndicator}
        <MapLibreGL.Camera
          {...cameraConfig}
        />
        {markerOptions && (
          <MapLibreGL.PointAnnotation
            id="marker"
            {...defaultMarkerOptions}
            {...markerOptions}
          >
            <MapLibreGL.Callout title={markerOptions.text} />
          </MapLibreGL.PointAnnotation>
        )}
      </MapLibreGL.MapView>
      <Image
        source={require('./map-logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default RadarMap;
