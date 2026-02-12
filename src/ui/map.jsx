import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import Radar from '../index.native';
import { getHost, getPublishableKey } from '../helpers';
import styles from './styles';

let MapLibreGL;
let MapLibreMap;
let GeoJSONSource;
let Layer;
try {
  MapLibreGL = require('@maplibre/maplibre-react-native');
  MapLibreMap = MapLibreGL.Map;
  GeoJSONSource = MapLibreGL.GeoJSONSource;
  Layer = MapLibreGL.Layer;
} catch (e) {
  MapLibreGL = null;
  MapLibreMap = null;
  GeoJSONSource = null;
  Layer = null;
}

const DEFAULT_STYLE = 'radar-default-v1';

const createStyleURL = async (style = DEFAULT_STYLE) => {
  const host = await getHost();
  const publishableKey = await getPublishableKey();
  return `${host}/maps/styles/${style}?publishableKey=${publishableKey}`;
};

/**
 * RadarMap component for displaying maps with Radar integration
 * @param {Object} props - Component props
 * @param {Object} [props.mapOptions] - Map configuration options
 * @param {string} [props.mapOptions.mapStyle] - Map style identifier (defaults to 'radar-default-v1')
 * @param {boolean} [props.mapOptions.showUserLocation] - Whether to show the user's location on the map (default: true)
 * @param {React.Ref} [props.mapOptions.mapRef] - Ref to the underlying MapLibre Map component
 * @param {function} [props.mapOptions.onRegionDidChange] - Callback fired when the map region changes
 * @param {Object} props.mapOptions.onRegionDidChange.event - The region event data
 * @param {function} [props.mapOptions.onDidFinishLoadingMap] - Callback fired when the map finishes loading
 * @param {function} [props.mapOptions.onWillStartLoadingMap] - Callback fired when the map starts loading
 * @param {function} [props.mapOptions.onDidFailLoadingMap] - Callback fired when the map fails to load
 * @param {React.ReactNode} [props.children] - Child components to render within the map
 * @returns {React.Component|null} The RadarMap component or null if dependencies are missing
 */

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
    <GeoJSONSource
      id="user-location"
      data={JSON.stringify(geoJSONUserLocation)}
    >
      <Layer
        id="user-location-inner"
        type="circle"
        paint={{
          'circle-radius': 15,
          'circle-color': '#000257',
          'circle-opacity': 0.2,
          'circle-pitch-alignment': 'map',
        }}
      />
      <Layer
        id="user-location-middle"
        type="circle"
        paint={{
          'circle-radius': 9,
          'circle-color': '#fff',
          'circle-pitch-alignment': 'map',
        }}
      />
      <Layer
        id="user-location-outer"
        type="circle"
        paint={{
          'circle-radius': 6,
          'circle-color': '#000257',
          'circle-pitch-alignment': 'map',
        }}
      />
    </GeoJSONSource>
  );

  return (
    <View style={styles.mapContainer}>
      <MapLibreMap
        ref={mapOptions?.mapRef}
        style={styles.map}
        touchPitch={false}
        compass={false}
        logo={false}
        attribution
        onRegionDidChange={ mapOptions?.onRegionDidChange 
          ? (event) => mapOptions.onRegionDidChange(event.nativeEvent) 
          : null
        }
        onDidFinishLoadingMap={mapOptions?.onDidFinishLoadingMap ? mapOptions.onDidFinishLoadingMap : null}
        onWillStartLoadingMap={mapOptions?.onWillStartLoadingMap ? mapOptions.onWillStartLoadingMap : null}
        onDidFailLoadingMap={mapOptions?.onDidFailLoadingMap ? mapOptions.onDidFailLoadingMap : null}
        mapStyle={styleURL}>
        {mapOptions?.showUserLocation !== false && userLocationMapIndicator}
        {children}
      </MapLibreMap>
      <Image
        source={require('./map-logo.png')}
        style={styles.mapLogo}
      />
    </View>
  );
};

export default RadarMap;
