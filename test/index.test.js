import { NativeEventEmitter, NativeModules } from 'react-native';

import Radar from '../js/index';

jest.mock('NativeEventEmitter', () => jest.fn(() => ({
  addListener: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
})));

jest.mock('NativeModules', () => ({
  RNRadar: {
    setUserId: jest.fn(),
    setDescription: jest.fn(),
    setMetadata: jest.fn(),
    getPermissionsStatus: jest.fn(),
    requestPermissions: jest.fn(),
    getLocation: jest.fn(),
    trackOnce: jest.fn(),
    startTracking: jest.fn(),
    startTrackingEfficient: jest.fn(),
    startTrackingResponsive: jest.fn(),
    startTrackingContinuous: jest.fn(),
    startTrackingCustom: jest.fn(),
    stopTracking: jest.fn(),
    acceptEvent: jest.fn(),
    rejectEvent: jest.fn(),
    getContext: jest.fn(),
    searchPlaces: jest.fn(),
    searchGeofences: jest.fn(),
    searchPoints: jest.fn(),
    autocomplete: jest.fn(),
    geocode: jest.fn(),
    reverseGeocode: jest.fn(),
    ipGeocode: jest.fn(),
    getDistance: jest.fn(),
  },
}));

const mockModule = NativeModules.RNRadar;
const mockEmitter = NativeEventEmitter.mock.results[0].value;

describe('calls native implementation', () => {
  test('setUserId', () => {
    const userId = 'userId';
    Radar.setUserId(userId);

    expect(mockModule.setUserId).toHaveBeenCalledTimes(1);
    expect(mockModule.setUserId).toBeCalledWith(userId);
  });

  test('setDescription', () => {
    const description = 'some user description';
    Radar.setDescription(description);

    expect(mockModule.setDescription).toHaveBeenCalledTimes(1);
    expect(mockModule.setDescription).toBeCalledWith(description);
  });

  test('setMetadata', () => {
    const metadata = {
      foo: 'bar',
      baz: true,
      qux: 1,
    };
    Radar.setMetadata(metadata);

    expect(mockModule.setMetadata).toHaveBeenCalledTimes(1);
    expect(mockModule.setMetadata).toBeCalledWith(metadata);
  });

  test('getPermissionsStatus', () => {
    Radar.getPermissionsStatus();

    expect(mockModule.getPermissionsStatus).toHaveBeenCalledTimes(1);
  });

  test('requestPermissions', () => {
    const background = true;
    Radar.requestPermissions(background);

    expect(mockModule.requestPermissions).toHaveBeenCalledTimes(1);
    expect(mockModule.requestPermissions).toBeCalledWith(background);
  });

  test('getLocation', () => {
    Radar.getLocation();

    expect(mockModule.getLocation).toHaveBeenCalledTimes(1);
  });

  test('trackOnce', () => {
    Radar.trackOnce();

    expect(mockModule.trackOnce).toHaveBeenCalledTimes(1);
  });

  test('trackOnce(location)', () => {
    const location = {
      latitude: 40.783826,
      longitude: -73.975363,
      accuracy: 65,
    };
    Radar.trackOnce(location);

    expect(mockModule.trackOnce).toHaveBeenCalledTimes(1);
    expect(mockModule.trackOnce).toBeCalledWith(location);
  });

  test('startTracking', () => {
    Radar.startTracking();

    expect(mockModule.startTracking).toHaveBeenCalledTimes(1);
  });

  test('startTrackingEfficient', () => {
    Radar.startTrackingEfficient();

    expect(mockModule.startTrackingEfficient).toHaveBeenCalledTimes(1);
  });

  test('startTrackingResponsive', () => {
    Radar.startTrackingResponsive();

    expect(mockModule.startTrackingResponsive).toHaveBeenCalledTimes(1);
  });

  test('startTrackingContinuous', () => {
    Radar.startTrackingContinuous();

    expect(mockModule.startTrackingContinuous).toHaveBeenCalledTimes(1);
  });

  test('startTrackingCustom', () => {
    const options = {
      desiredStoppedUpdateInterval: 0,
      desiredMovingUpdateInterval: 150,
      desiredSyncInterval: 140,
      desiredAccuracy: 'medium',
      stopDuration: 140,
      stopDistance: 70,
      sync: 'stopsAndExits',
      replay: 'stops',
      showBlueBar: false,
      useStoppedGeofence: true,
      stoppedGeofenceRadius: 200,
      useMovingGeofence: false,
      movingGeofenceRadius: 0,
      useVisits: true,
      useSignificantLocationChanges: true,
    };
    Radar.startTrackingCustom(options);

    expect(mockModule.startTrackingCustom).toHaveBeenCalledTimes(1);
    expect(mockModule.startTrackingCustom).toBeCalledWith(options);
  });

  test('stopTracking', () => {
    Radar.stopTracking();

    expect(mockModule.stopTracking).toHaveBeenCalledTimes(1);
  });

  test('acceptEvent', () => {
    const eventId = 'eventId';
    const verifiedPlaceId = 'verifiedPlaceId';
    Radar.acceptEvent(eventId, verifiedPlaceId);

    expect(mockModule.acceptEvent).toHaveBeenCalledTimes(1);
    expect(mockModule.acceptEvent).toBeCalledWith(eventId, verifiedPlaceId);
  });

  test('rejectEvent', () => {
    const eventId = 'eventId';
    Radar.rejectEvent(eventId);

    expect(mockModule.rejectEvent).toHaveBeenCalledTimes(1);
    expect(mockModule.rejectEvent).toBeCalledWith(eventId);
  });

  test('getContext', () => {
    Radar.getContext();

    expect(mockModule.getContext).toHaveBeenCalledTimes(1);
  });

  test('getContext(location)', () => {
    const location = {
      latitude: 40.783826,
      longitude: -73.975363,
      accuracy: 65,
    };
    Radar.getContext(location);

    expect(mockModule.getContext).toHaveBeenCalledTimes(1);
    expect(mockModule.getContext).toBeCalledWith(location);
  });

  test('searchPlaces', () => {
    const options = {
      near: {
        latitude: 40.783826,
        longitude: -73.975363,
      },
      radius: 1000,
      chains: ['mcdonalds'],
      limit: 10,
    };
    Radar.searchPlaces(options);

    expect(mockModule.searchPlaces).toHaveBeenCalledTimes(1);
    expect(mockModule.searchPlaces).toBeCalledWith(options);
  });

  test('searchGeofences', () => {
    const options = {
      near: {
        latitude: 40.783826,
        longitude: -73.975363,
      },
      radius: 1000,
      tags: ['store'],
      limit: 10,
    };
    Radar.searchGeofences(options);

    expect(mockModule.searchGeofences).toHaveBeenCalledTimes(1);
    expect(mockModule.searchGeofences).toBeCalledWith(options);
  });

  test('searchPoints', () => {
    const options = {
      near: {
        latitude: 40.783826,
        longitude: -73.975363,
      },
      radius: 1000,
      tags: ['article'],
      limit: 10,
    };
    Radar.searchPoints(options);

    expect(mockModule.searchPoints).toHaveBeenCalledTimes(1);
    expect(mockModule.searchPoints).toBeCalledWith(options);
  });

  test('autocomplete', () => {
    const options = {
      query: 'brooklyn roasting',
      near: {
        latitude: 40.783826,
        longitude: -73.975363,
      },
      limit: 10,
    };
    Radar.searchPoints(options);

    expect(mockModule.searchPoints).toHaveBeenCalledTimes(1);
    expect(mockModule.searchPoints).toBeCalledWith(options);
  });

  test('geocode', () => {
    const options = {
      query: '20 jay st brooklyn',
    };
    Radar.geocode(options);

    expect(mockModule.geocode).toHaveBeenCalledTimes(1);
    expect(mockModule.geocode).toBeCalledWith(options);
  });

  test('reverseGeocode', () => {
    const options = {
      location: {
        latitude: 40.783826,
        longitude: -73.975363,
      },
    };
    Radar.reverseGeocode(options);

    expect(mockModule.reverseGeocode).toHaveBeenCalledTimes(1);
    expect(mockModule.reverseGeocode).toBeCalledWith(options);
  });

  test('ipGeocode', () => {
    Radar.ipGeocode();

    expect(mockModule.ipGeocode).toHaveBeenCalledTimes(1);
  });

  test('getDistance', () => {
    const options = {
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
    };
    Radar.getDistance(options);

    expect(mockModule.getDistance).toHaveBeenCalledTimes(1);
    expect(mockModule.getDistance).toBeCalledWith(options);
  });

  test('on', () => {
    const event = 'events';
    const callback = () => {};
    Radar.on(event, callback);

    expect(mockEmitter.addListener).toHaveBeenCalledTimes(1);
    expect(mockEmitter.addListener).toHaveBeenCalledWith(event, callback);
  });

  test('off', () => {
    const event = 'locations';
    Radar.off(event);

    expect(mockEmitter.removeAllListeners).toHaveBeenCalledTimes(1);
    expect(mockEmitter.removeAllListeners).toHaveBeenCalledWith(event);
  });
});
