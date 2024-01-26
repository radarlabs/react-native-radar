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
    createStyleURL(mapOptions?.mapStyle || DEFAULT_STYLE).then((result) => {
      setStyleURL(result);
    });
  }, [mapOptions]);

  useEffect(() => {
    Radar.getLocation().then((result) => {
      if (result?.location?.latitude && result?.location?.longitude) {
        setUserLocation({
          latitude: result.location.latitude,
          longitude: result.location.longitude,
        });
      }
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.warn(`Radar SDK: Failed to get location: ${err}`);
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
        style={{
          circleRadius: 15,
          circleColor: '#000257',
          circleOpacity: 0.2,
          circlePitchAlignment: 'map',
        }}
      />
      <MapLibreGL.CircleLayer
        id="user-location-middle"
        style={{
          circleRadius: 9,
          circleColor: '#fff',
          circlePitchAlignment: 'map',
        }}
      />
      <MapLibreGL.CircleLayer
        id="user-location-outer"
        style={{
          circleRadius: 6,
          circleColor: '#000257',
          circlePitchAlignment: 'map',
        }}
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
