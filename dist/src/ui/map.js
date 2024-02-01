"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const index_native_1 = __importDefault(require("../index.native"));
const helpers_1 = require("../helpers");
const styles_1 = __importDefault(require("./styles"));
let MapLibreGL;
try {
    MapLibreGL = require('@maplibre/maplibre-react-native');
}
catch (e) {
    MapLibreGL = null;
}
const DEFAULT_STYLE = 'radar-default-v1';
const createStyleURL = async (style = DEFAULT_STYLE) => {
    const host = await (0, helpers_1.getHost)();
    const publishableKey = await (0, helpers_1.getPublishableKey)();
    return `${host}/maps/styles/${style}?publishableKey=${publishableKey}`;
};
const RadarMap = ({ mapOptions, children }) => {
    const [styleURL, setStyleURL] = (0, react_1.useState)(null);
    const [userLocation, setUserLocation] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        createStyleURL(mapOptions?.mapStyle || DEFAULT_STYLE).then((result) => {
            setStyleURL(result);
        });
    }, [mapOptions]);
    (0, react_1.useEffect)(() => {
        index_native_1.default.getLocation().then((result) => {
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
    const userLocationMapIndicator = (<MapLibreGL.ShapeSource id="user-location" shape={geoJSONUserLocation}>
      <MapLibreGL.CircleLayer id="user-location-inner" style={{
            circleRadius: 15,
            circleColor: '#000257',
            circleOpacity: 0.2,
            circlePitchAlignment: 'map',
        }}/>
      <MapLibreGL.CircleLayer id="user-location-middle" style={{
            circleRadius: 9,
            circleColor: '#fff',
            circlePitchAlignment: 'map',
        }}/>
      <MapLibreGL.CircleLayer id="user-location-outer" style={{
            circleRadius: 6,
            circleColor: '#000257',
            circlePitchAlignment: 'map',
        }}/>
    </MapLibreGL.ShapeSource>);
    return (<react_native_1.View style={styles_1.default.mapContainer}>
      <MapLibreGL.MapView style={styles_1.default.map} pitchEnabled={false} compassEnabled={false} logoEnabled={false} attributionEnabled onRegionDidChange={mapOptions?.onRegionDidChange ? mapOptions.onRegionDidChange : null} styleURL={styleURL}>
        {userLocationMapIndicator}
        {children}
      </MapLibreGL.MapView>
      <react_native_1.Image source={require('./map-logo.png')} style={styles_1.default.mapLogo}/>
    </react_native_1.View>);
};
exports.default = RadarMap;
