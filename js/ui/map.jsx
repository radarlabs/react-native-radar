import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { getHost, getPublishableKey } from '../helpers';

const DEFAULT_STYLE = 'radar-default-v1';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  logo: {
    position: 'absolute',
    bottom: -10,
    left: 5,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

const createStyleURL = async (style = DEFAULT_STYLE) => {
  const host = await getHost();
  const publishableKey = await getPublishableKey();
  return `${host}/maps/styles/${style}?publishableKey=${publishableKey}`;
};

const RadarMap = ({ mapOptions, children }) => {
  const [styleURL, setStyleURL] = useState(null);
  createStyleURL(mapOptions?.mapStyle || DEFAULT_STYLE).then((result) => {
    setStyleURL(result);
  });

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
        attributionEnabled
        onRegionDidChange={mapOptions.onRegionDidChange ? mapOptions.onRegionDidChange : null}
        styleURL={styleURL}
      >
        <MapLibreGL.UserLocation />
        {children}
      </MapLibreGL.MapView>
      <Image
        source={require('./map-logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default RadarMap;
