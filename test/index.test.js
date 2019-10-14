import { NativeEventEmitter, NativeModules } from 'react-native';
import Radar from '../js/index';

jest.mock('NativeEventEmitter', () => jest.fn(() => ({
  addListener: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
})));
jest.mock('NativeModules', () => (
  {
    RNRadar: {
      setUserId: jest.fn(),
      setDescription: jest.fn(),
      setMetadata: jest.fn(),
      setPlacesProvider: jest.fn(),
      getPermissionsStatus: jest.fn(),
      requestPermissions: jest.fn(),
      startTracking: jest.fn(),
      stopTracking: jest.fn(),
      trackOnce: jest.fn(),
      updateLocation: jest.fn(),
      acceptEvent: jest.fn(),
      rejectEvent: jest.fn(),
    },
  }
));

const mockNative = NativeModules.RNRadar;
const mockEmitter = NativeEventEmitter.mock.results[0].value;

describe('Calls native implementation', () => {
  test('setUserId', () => {
    const userId = 'some-user-id123';
    Radar.setUserId(userId);

    expect(mockNative.setUserId).toHaveBeenCalledTimes(1);
    expect(mockNative.setUserId).toBeCalledWith(userId);
  });

  test('setDescription', () => {
    const description = 'some user description';
    Radar.setDescription(description);

    expect(mockNative.setDescription).toHaveBeenCalledTimes(1);
    expect(mockNative.setDescription).toBeCalledWith(description);
  });

  test('setMetadata', () => {
    const metadata = {
      'key': 'some string',
      'bool': true,
      'int': 123,
      'double': 1.23
    }
    Radar.setMetadata(metadata)

    expect(mockNative.setMetadata).toHaveBeenCalledTimes(1)
    expect(mockNative.setMetadata).toBeCalledWith(metadata)
  })

  test('setPlacesProvider', () => {
    const provider = 'facebook';
    Radar.setPlacesProvider(provider);

    expect(mockNative.setPlacesProvider).toHaveBeenCalledTimes(1);
    expect(mockNative.setPlacesProvider).toBeCalledWith(provider);
  });

  test('getPermissionsStatus', () => {
    Radar.getPermissionsStatus();

    expect(mockNative.getPermissionsStatus).toHaveBeenCalledTimes(1);
  });

  test('requestPermissions', () => {
    const background = true;
    Radar.requestPermissions(background);

    expect(mockNative.requestPermissions).toHaveBeenCalledTimes(1);
    expect(mockNative.requestPermissions).toBeCalledWith(background);
  });

  test('startTracking', () => {
    const options = {
      sync: 'all',
      offline: 'replayOff',
      priority: 'efficiency',
    };
    Radar.startTracking(options);

    expect(mockNative.startTracking).toHaveBeenCalledTimes(1);
    expect(mockNative.startTracking).toBeCalledWith(options);
  });

  test('stopTracking', () => {
    Radar.stopTracking();

    expect(mockNative.stopTracking).toHaveBeenCalledTimes(1);
  });

  test('requestPetrackOncermissions', () => {
    Radar.trackOnce();

    expect(mockNative.trackOnce).toHaveBeenCalledTimes(1);
  });

  test('updateLocation', () => {
    const location = {
      latitude: 10.0,
      longitude: 11.0,
    };
    Radar.updateLocation(location);

    expect(mockNative.updateLocation).toHaveBeenCalledTimes(1);
    expect(mockNative.updateLocation).toBeCalledWith(location);
  });

  test('acceptEvent', () => {
    const eventId = '123';
    const verifiedPlaceId = 'placeId';
    Radar.acceptEvent(eventId, verifiedPlaceId);

    expect(mockNative.acceptEvent).toHaveBeenCalledTimes(1);
    expect(mockNative.acceptEvent).toBeCalledWith(eventId, verifiedPlaceId);
  });

  test('rejectEvent', () => {
    const eventId = '123';
    Radar.rejectEvent(eventId);

    expect(mockNative.rejectEvent).toHaveBeenCalledTimes(1);
    expect(mockNative.rejectEvent).toBeCalledWith(eventId);
  });

  test('on', () => {
    const event = 'events';
    const cb = function () {};
    Radar.on(event, cb);

    expect(mockEmitter.addListener).toHaveBeenCalledTimes(1);
    expect(mockEmitter.addListener).toHaveBeenCalledWith(event, cb);
  });

  test('off - with callback', () => {
    const event = 'locations';
    const cb = function () {};
    Radar.off(event, cb);

    expect(mockEmitter.removeListener).toHaveBeenCalledTimes(1);
    expect(mockEmitter.removeListener).toHaveBeenCalledWith(event, cb);
  });

  test('off - without callback', () => {
    const event = 'locations';
    Radar.off(event);

    expect(mockEmitter.removeAllListeners).toHaveBeenCalledTimes(1);
    expect(mockEmitter.removeAllListeners).toHaveBeenCalledWith(event);
  });
});
