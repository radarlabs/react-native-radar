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
    startTracking: jest.fn(),
    stopTracking: jest.fn(),
    trackOnce: jest.fn(),
    acceptEvent: jest.fn(),
    rejectEvent: jest.fn(),
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

  test('startTracking', () => {
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
    Radar.startTracking(options);

    expect(mockModule.startTracking).toHaveBeenCalledTimes(1);
    expect(mockModule.startTracking).toBeCalledWith(options);
  });

  test('stopTracking', () => {
    Radar.stopTracking();

    expect(mockModule.stopTracking).toHaveBeenCalledTimes(1);
  });

  test('trackOnce', () => {
    Radar.trackOnce();

    expect(mockModule.trackOnce).toHaveBeenCalledTimes(1);
  });

  test('trackOnceWithLocation', () => {
    const location = {
      latitude: 40.783826,
      longitude: -73.975363,
      accuracy: 65,
    };
    Radar.trackOnce(location);

    expect(mockModule.trackOnce).toHaveBeenCalledTimes(1);
    expect(mockModule.trackOnce).toBeCalledWith(location);
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
