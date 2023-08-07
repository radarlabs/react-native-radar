import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import Radar from '../index.native';
import { getHost, getPublishableKey } from '../helpers';
import styles from './styles';

let MapLibreGL;
try {
  MapLibreGL = require('@maplibre/maplibre-react-native');
} catch (e) {
  MapLibreGL = null;
}

const DEFAULT_STYLE = 'radar-default-v1';

const createStyleURL = async (style = DEFAULT_STYLE) => {
  const host = await getHost();
  const publishableKey = await getPublishableKey();
  return `${host}/maps/styles/${style}?publishableKey=${publishableKey}`;
};

const RadarMap = ({ mapOptions, children }) => {
  const [styleURL, setStyleURL] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const style = mapOptions?.style || mapOptions?.mapStyle || DEFAULT_STYLE;
    createStyleURL(style).then((result) => {
      setStyleURL(result);
    });
  }, [mapOptions]);

  useEffect(() => {
    Radar.getLocation().then((result) => {
      setUserLocation({
        latitude: result.location.latitude,
        longitude: result.location.longitude,
      });
    });
  }, [mapOptions]);

  if (!styleURL) {
    return null;
  }

  if (!MapLibreGL) {
    return null;
  }

  const geoJSONUserLocation = {
    type: 'FeatureCollection',
    features: userLocation?.longitude !== undefined ? [
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

  return (
    <View style={styles.mapContainer}>
      <MapLibreGL.MapView
        style={styles.map}
        pitchEnabled={false}
        compassEnabled={false}
        logoEnabled={false}
        attributionEnabled
        onRegionDidChange={mapOptions?.onRegionDidChange ? mapOptions.onRegionDidChange : null}
        styleURL={styleURL}
      >
        {userLocationMapIndicator}
        {children}
      </MapLibreGL.MapView>
      <Image
        source={require('./map-logo.png')}
        style={styles.mapLogo}
      />
    </View>
  );
};

export default RadarMap;
