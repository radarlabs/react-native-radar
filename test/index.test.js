const { NativeModules, TurboModuleRegistry } = require('react-native');

import Radar from '../src/index.native.ts';

// Use either TurboModule or fallback to NativeModules
const mockModule = TurboModuleRegistry.getEnforcing("RNRadar") || NativeModules.RNRadar;

describe('calls native implementation', () => {
  test('setLogLevel', () => {
    const level = 'debug';
    Radar.setLogLevel(level);

    expect(mockModule.setLogLevel).toHaveBeenCalledTimes(1);
    expect(mockModule.setLogLevel).toBeCalledWith(level);
  });

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

  test('getPermissionsStatus', async () => {
    const mockPermissionStatus = 'GRANTED';
    
    mockModule.getPermissionsStatus.mockResolvedValue(mockPermissionStatus);
    
    const result = await Radar.getPermissionsStatus();

    expect(mockModule.getPermissionsStatus).toHaveBeenCalledTimes(1);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(['GRANTED', 'DENIED', 'NOT_DETERMINED'].includes(result)).toBe(true);
  });

  test('requestPermissions', () => {
    const background = true;
    Radar.requestPermissions(background);

    expect(mockModule.requestPermissions).toHaveBeenCalledTimes(1);
    expect(mockModule.requestPermissions).toBeCalledWith(background);
  });

  test('getLocation', async () => {
    const desiredAccuracy = 'medium';
    const mockLocationResult = {
      status: 'SUCCESS',
      location: {
        latitude: 40.783826,
        longitude: -73.975363,
        accuracy: 10,
        altitude: 0,
        speed: 0,
        course: 0,
      }
    };
    
    mockModule.getLocation.mockResolvedValue(mockLocationResult);
    
    const result = await Radar.getLocation(desiredAccuracy);

    expect(mockModule.getLocation).toHaveBeenCalledTimes(1);
    expect(mockModule.getLocation).toBeCalledWith(desiredAccuracy);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.location).toBeDefined();
    expect(result.location.latitude).toBe(40.783826);
    expect(result.location.longitude).toBe(-73.975363);
    expect(typeof result.location.accuracy).toBe('number');
  });

  test('trackOnce', () => {
    Radar.trackOnce();

    expect(mockModule.trackOnce).toHaveBeenCalledTimes(1);
  });

  test('updateLocation', () => {
    const location = {
      location: {
        latitude: 40.783826,
        longitude: -73.975363,
        accuracy: 65,
      }
    };
    Radar.trackOnce(location);

    expect(mockModule.trackOnce).toHaveBeenCalledTimes(1);
    expect(mockModule.trackOnce).toBeCalledWith(location);
  });

  test('updateLocation with old format parameters', () => {
    const location = {
      latitude: 40.783826,
      longitude: -73.975363,
      accuracy: 65,
    };

    Radar.trackOnce(location);

    expect(mockModule.trackOnce).toHaveBeenCalledTimes(1);
    expect(mockModule.trackOnce).toBeCalledWith(location);
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

  test('mockTracking', () => {
    const options = {
      origin: {
        latitude: 40.78382,
        longitude: -73.97536,
      },
      destination: {
        latitude: 40.70390,
        longitude: -73.98670,
      },
      mode: 'car',
      steps: 10,
      interval: 1,
    };
    Radar.mockTracking(options);

    expect(mockModule.mockTracking).toHaveBeenCalledTimes(1);
    expect(mockModule.mockTracking).toBeCalledWith(options);
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

  test('startTrip legacy', async () => {
    const options = {
      externalId: '299',
      destinationGeofenceTag: 'store',
      destinationGeofenceExternalId: '123',
      mode: 'car',
      scheduledArrivalAt: new Date('2022-10-10T12:20:30Z').getTime()
    };
    
    const mockTripResult = {
      status: 'SUCCESS',
      trip: {
        _id: 'trip-123',
        externalId: '299',
        mode: 'car',
        status: 'started',
        destinationGeofenceTag: 'store'
      },
      events: []
    };
    
    mockModule.startTrip.mockResolvedValue(mockTripResult);
    
    const result = await Radar.startTrip(options);

    expect(mockModule.startTrip).toHaveBeenCalledTimes(1);
    expect(mockModule.startTrip).toBeCalledWith(options);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.trip).toBeDefined();
    expect(result.trip._id).toBeDefined();
    expect(result.trip.externalId).toBe('299');
    expect(result.trip.mode).toBe('car');
    expect(Array.isArray(result.events)).toBe(true);
  });

  test('startTrip with tripOptions', () => {
    const options = {
      tripOptions: {
        externalId: '299',
        destinationGeofenceTag: 'store',
        destinationGeofenceExternalId: '123',
        mode: 'car',
        scheduledArrivalAt: new Date('2022-10-10T12:20:30Z').getTime()
      }
    };
    Radar.startTrip(options);

    expect(mockModule.startTrip).toHaveBeenCalledTimes(1);
    expect(mockModule.startTrip).toBeCalledWith(options);
  });

  test('startTrip with trackingOptions', () => {
    const options = {
      tripOptions: {
        externalId: '299',
        destinationGeofenceTag: 'store',
        destinationGeofenceExternalId: '123',
        mode: 'car',
        scheduledArrivalAt: new Date('2022-10-10T12:20:30Z').getTime()
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
    };
    Radar.startTrip(options);

    expect(mockModule.startTrip).toHaveBeenCalledTimes(1);
    expect(mockModule.startTrip).toBeCalledWith(options);
  });

  test('completeTrip', async () => {
    const mockTripResult = {
      status: 'SUCCESS',
      trip: {
        _id: 'trip-123',
        externalId: '299',
        mode: 'car',
        status: 'completed'
      },
      events: [
        {
          _id: 'event-123',
          type: 'user.trip.completed',
          trip: {
            _id: 'trip-123',
            status: 'completed'
          }
        }
      ]
    };
    
    mockModule.completeTrip.mockResolvedValue(mockTripResult);
    
    const result = await Radar.completeTrip();

    expect(mockModule.completeTrip).toHaveBeenCalledTimes(1);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.trip).toBeDefined();
    expect(result.trip.status).toBe('completed');
    expect(Array.isArray(result.events)).toBe(true);
  });

  test('cancelTrip', async () => {
    const mockTripResult = {
      status: 'SUCCESS',
      trip: {
        _id: 'trip-123',
        externalId: '299',
        mode: 'car',
        status: 'cancelled'
      },
      events: [
        {
          _id: 'event-124',
          type: 'user.trip.cancelled',
          trip: {
            _id: 'trip-123',
            status: 'cancelled'
          }
        }
      ]
    };
    
    mockModule.cancelTrip.mockResolvedValue(mockTripResult);
    
    const result = await Radar.cancelTrip();

    expect(mockModule.cancelTrip).toHaveBeenCalledTimes(1);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.trip).toBeDefined();
    expect(result.trip.status).toBe('cancelled');
    expect(Array.isArray(result.events)).toBe(true);
  });

  test('getContext', async () => {
    const location = {
      latitude: 40.783826,
      longitude: -73.975363,
      accuracy: 65,
    };
    
    const mockContextResult = {
      status: 'SUCCESS',
      location: {
        latitude: 40.783826,
        longitude: -73.975363,
        accuracy: 65
      },
      geofences: [
        {
          _id: 'geofence-123',
          tag: 'store',
          externalId: 'store-456',
          description: 'Test Store'
        }
      ],
      place: {
        _id: 'place-789',
        name: 'Test Place',
        categories: ['restaurant']
      },
      country: {
        code: 'US',
        name: 'United States'
      }
    };
    
    mockModule.getContext.mockResolvedValue(mockContextResult);
    
    const result = await Radar.getContext(location);

    expect(mockModule.getContext).toHaveBeenCalledTimes(1);
    expect(mockModule.getContext).toBeCalledWith(location);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.location).toBeDefined();
    expect(result.location.latitude).toBe(location.latitude);
    expect(result.location.longitude).toBe(location.longitude);
    expect(Array.isArray(result.geofences)).toBe(true);
    expect(result.place).toBeDefined();
    expect(result.country).toBeDefined();
    expect(result.country.code).toBeDefined();
  });

  test('searchPlaces', async () => {
    const options = {
      near: {
        latitude: 40.783826,
        longitude: -73.975363,
      },
      radius: 1000,
      chains: ['mcdonalds'],
      chainMetadata: {
        "customFlag": "true"
      },
      limit: 10,
    };
    
    const mockSearchResult = {
      status: 'SUCCESS',
      places: [
        {
          _id: 'place-123',
          name: 'McDonald\'s',
          location: {
            latitude: 40.784,
            longitude: -73.976
          },
          chain: {
            slug: 'mcdonalds',
            name: 'McDonald\'s'
          }
        }
      ]
    };
    
    mockModule.searchPlaces.mockResolvedValue(mockSearchResult);
    
    const result = await Radar.searchPlaces(options);

    expect(mockModule.searchPlaces).toHaveBeenCalledTimes(1);
    expect(mockModule.searchPlaces).toBeCalledWith(options);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(Array.isArray(result.places)).toBe(true);
    expect(result.places.length).toBeGreaterThan(0);
    
    const firstPlace = result.places[0];
    expect(firstPlace._id).toBeDefined();
    expect(firstPlace.name).toBeDefined();
    expect(firstPlace.location).toBeDefined();
    expect(typeof firstPlace.location.latitude).toBe('number');
    expect(typeof firstPlace.location.longitude).toBe('number');
  });

  test('searchGeofences', async () => {
    const options = {
      near: {
        latitude: 40.783826,
        longitude: -73.975363,
      },
      radius: 1000,
      tags: ['store'],
      limit: 10,
    };
    
    const mockGeofenceResult = {
      status: 'SUCCESS',
      geofences: [
        {
          _id: 'geofence-123',
          tag: 'store',
          externalId: 'store-456',
          description: 'Test Store Geofence',
          geometry: {
            type: 'Point',
            coordinates: [-73.975363, 40.783826]
          }
        }
      ]
    };
    
    mockModule.searchGeofences.mockResolvedValue(mockGeofenceResult);
    
    const result = await Radar.searchGeofences(options);

    expect(mockModule.searchGeofences).toHaveBeenCalledTimes(1);
    expect(mockModule.searchGeofences).toBeCalledWith(options);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(Array.isArray(result.geofences)).toBe(true);
    expect(result.geofences.length).toBeGreaterThan(0);
    
    const firstGeofence = result.geofences[0];
    expect(firstGeofence._id).toBeDefined();
    expect(firstGeofence.tag).toBe('store');
    expect(firstGeofence.geometry).toBeDefined();
  });

  test('autocomplete', () => {
    const options = {
      query: 'brooklyn roasting',
      layers: ['address'],
      near: {
        latitude: 40.783826,
        longitude: -73.975363,
      },
      limit: 10,
      countryCode: "US",
      mailable: true
    };
    Radar.autocomplete(options);

    expect(mockModule.autocomplete).toHaveBeenCalledTimes(1);
    expect(mockModule.autocomplete).toBeCalledWith(options);
  });

  test('geocode', async () => {
    const query = {
      address: '20 jay st brooklyn'
    };
    
    const mockGeocodeResult = {
      status: 'SUCCESS',
      addresses: [
        {
          latitude: 40.6892,
          longitude: -73.9877,
          formattedAddress: '20 Jay St, Brooklyn, NY 11201, USA',
          country: 'United States',
          countryCode: 'US',
          state: 'New York',
          stateCode: 'NY',
          postalCode: '11201',
          city: 'Brooklyn',
          borough: 'Brooklyn',
          county: 'Kings County',
          neighborhood: 'DUMBO'
        }
      ]
    };
    
    mockModule.geocode.mockResolvedValue(mockGeocodeResult);
    
    const result = await Radar.geocode(query);

    expect(mockModule.geocode).toHaveBeenCalledTimes(1);
    expect(mockModule.geocode).toBeCalledWith(query);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(Array.isArray(result.addresses)).toBe(true);
    expect(result.addresses.length).toBeGreaterThan(0);
    
    const firstAddress = result.addresses[0];
    expect(typeof firstAddress.latitude).toBe('number');
    expect(typeof firstAddress.longitude).toBe('number');
    expect(firstAddress.formattedAddress).toBeDefined();
    expect(firstAddress.countryCode).toBe('US');
  });

  test('reverseGeocode', async () => {
    const query = {
      location: {
        latitude: 40.783826,
        longitude: -73.975363,
      }
    };
    
    const mockReverseGeocodeResult = {
      status: 'SUCCESS',
      addresses: [
        {
          latitude: 40.783826,
          longitude: -73.975363,
          formattedAddress: '1 Central Park W, New York, NY 10023, USA',
          country: 'United States',
          countryCode: 'US',
          state: 'New York',
          stateCode: 'NY',
          postalCode: '10023',
          city: 'New York',
          borough: 'Manhattan',
          county: 'New York County',
          neighborhood: 'Upper West Side'
        }
      ]
    };
    
    mockModule.reverseGeocode.mockResolvedValue(mockReverseGeocodeResult);
    
    const result = await Radar.reverseGeocode(query);

    expect(mockModule.reverseGeocode).toHaveBeenCalledTimes(1);
    expect(mockModule.reverseGeocode).toBeCalledWith(query);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(Array.isArray(result.addresses)).toBe(true);
    expect(result.addresses.length).toBeGreaterThan(0);
    
    const firstAddress = result.addresses[0];
    expect(firstAddress.latitude).toBe(query.location.latitude);
    expect(firstAddress.longitude).toBe(query.location.longitude);
    expect(firstAddress.formattedAddress).toBeDefined();
    expect(firstAddress.neighborhood).toBeDefined();
  });

  test('ipGeocode', async () => {
    const mockIpGeocodeResult = {
      status: 'SUCCESS',
      address: {
        latitude: 40.7589,
        longitude: -73.9851,
        city: 'New York',
        state: 'New York',
        stateCode: 'NY',
        country: 'United States',
        countryCode: 'US',
        postalCode: '10013'
      }
    };
    
    mockModule.ipGeocode.mockResolvedValue(mockIpGeocodeResult);
    
    const result = await Radar.ipGeocode();

    expect(mockModule.ipGeocode).toHaveBeenCalledTimes(1);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.address).toBeDefined();
    expect(typeof result.address.latitude).toBe('number');
    expect(typeof result.address.longitude).toBe('number');
    expect(result.address.countryCode).toBeDefined();
    expect(result.address.city).toBeDefined();
  });

  test('getDistance', async () => {
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
    
    const mockDistanceResult = {
      status: 'SUCCESS',
      routes: {
        foot: {
          distance: {
            value: 5.2,
            text: '5.2 mi'
          },
          duration: {
            value: 6240,
            text: '1 hr 44 mins'
          }
        },
        car: {
          distance: {
            value: 4.8,
            text: '4.8 mi'
          },
          duration: {
            value: 900,
            text: '15 mins'
          }
        }
      }
    };
    
    mockModule.getDistance.mockResolvedValue(mockDistanceResult);
    
    const result = await Radar.getDistance(options);

    expect(mockModule.getDistance).toHaveBeenCalledTimes(1);
    expect(mockModule.getDistance).toBeCalledWith(options);
    
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.routes).toBeDefined();
    expect(result.routes.foot).toBeDefined();
    expect(result.routes.car).toBeDefined();
    expect(typeof result.routes.foot.distance.value).toBe('number');
    expect(typeof result.routes.car.duration.value).toBe('number');
  });

  test('getMatrix', () => {
    const options = {
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
    };
    Radar.getMatrix(options);

    expect(mockModule.getMatrix).toHaveBeenCalledTimes(1);
    expect(mockModule.getMatrix).toBeCalledWith(options);
  });

  test('onLocationUpdated', () => {
    const callback = () => {};
    Radar.onLocationUpdated(callback);

    expect(typeof Radar.onLocationUpdated).toBe('function');
  });

  test('onEventsReceived', () => {
    const callback = () => {};
    Radar.onEventsReceived(callback);

    expect(typeof Radar.onEventsReceived).toBe('function');
  });

  test('onError', () => {
    const callback = () => {};
    Radar.onError(callback);

    expect(typeof Radar.onError).toBe('function');
  });

  test('getUserId', async () => {
    const mockUserId = 'test-user-123';
    
    mockModule.getUserId.mockResolvedValue(mockUserId);
    
    const result = await Radar.getUserId();

    expect(mockModule.getUserId).toHaveBeenCalledTimes(1);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result).toBe(mockUserId);
  });

  test('getDescription', () => {
    Radar.getDescription();

    expect(mockModule.getDescription).toHaveBeenCalledTimes(1);
  });

  test('getMetadata', async () => {
    const mockMetadata = {
      userId: 'test-user-123',
      customField: 'custom-value',
      isVip: true,
      score: 85
    };
    
    mockModule.getMetadata.mockResolvedValue(mockMetadata);
    
    const result = await Radar.getMetadata();

    expect(mockModule.getMetadata).toHaveBeenCalledTimes(1);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result.userId).toBe('test-user-123');
    expect(result.customField).toBe('custom-value');
    expect(typeof result.isVip).toBe('boolean');
    expect(typeof result.score).toBe('number');
  });

  test('setAnonymousTrackingEnabled', () => {
    const enabled = true;
    Radar.setAnonymousTrackingEnabled(enabled);

    expect(mockModule.setAnonymousTrackingEnabled).toHaveBeenCalledTimes(1);
    expect(mockModule.setAnonymousTrackingEnabled).toBeCalledWith(enabled);
  });

  test('isTracking', async () => {
    const mockTrackingStatus = true;
    
    mockModule.isTracking.mockResolvedValue(mockTrackingStatus);
    
    const result = await Radar.isTracking();

    expect(mockModule.isTracking).toHaveBeenCalledTimes(1);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  test('getTrackingOptions', async () => {
    const mockTrackingOptions = {
      desiredStoppedUpdateInterval: 30,
      fastestStoppedUpdateInterval: 30,
      desiredMovingUpdateInterval: 30,
      fastestMovingUpdateInterval: 30,
      desiredSyncInterval: 20,
      desiredAccuracy: 'high',
      stopDuration: 0,
      stopDistance: 0,
      sync: 'all',
      replay: 'none'
    };
    
    mockModule.getTrackingOptions.mockResolvedValue(mockTrackingOptions);
    
    const result = await Radar.getTrackingOptions();

    expect(mockModule.getTrackingOptions).toHaveBeenCalledTimes(1);
    
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(typeof result.desiredStoppedUpdateInterval).toBe('number');
    expect(typeof result.desiredMovingUpdateInterval).toBe('number');
    expect(typeof result.desiredSyncInterval).toBe('number');
    expect(result.desiredAccuracy).toBeDefined();
    expect(['low', 'medium', 'high'].includes(result.desiredAccuracy)).toBe(true);
  });

  test('getTripOptions', () => {
    Radar.getTripOptions();

    expect(mockModule.getTripOptions).toHaveBeenCalledTimes(1);
  });

  test('logConversions', () => {
    const options = { name: 'name' };
    Radar.logConversion(options);

    expect(mockModule.logConversion).toHaveBeenCalledTimes(1);
  });
});

describe('parameter validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setLogLevel', () => {
    test('should accept valid log levels', () => {
      const validLevels = ['error', 'warning', 'info', 'debug'];
      
      validLevels.forEach(level => {
        Radar.setLogLevel(level);
        expect(mockModule.setLogLevel).toHaveBeenCalledWith(level);
      });
    });

    test('should handle invalid log level gracefully', () => {
      // Test that method still calls native layer even with invalid input
      // (validation might happen on native side)
      Radar.setLogLevel('invalid-level');
      expect(mockModule.setLogLevel).toHaveBeenCalledWith('invalid-level');
    });

    test('should handle null/undefined', () => {
      Radar.setLogLevel(null);
      expect(mockModule.setLogLevel).toHaveBeenCalledWith(null);
      
      Radar.setLogLevel(undefined);
      expect(mockModule.setLogLevel).toHaveBeenCalledWith(undefined);
    });
  });

  describe('setMetadata', () => {
    test('should accept valid metadata object', () => {
      const validMetadata = {
        string: 'value',
        number: 123,
        boolean: true,
        nested: { key: 'value' }
      };
      
      Radar.setMetadata(validMetadata);
      expect(mockModule.setMetadata).toHaveBeenCalledWith(validMetadata);
    });

    test('should handle empty object', () => {
      Radar.setMetadata({});
      expect(mockModule.setMetadata).toHaveBeenCalledWith({});
    });

    test('should handle null/undefined', () => {
      Radar.setMetadata(null);
      expect(mockModule.setMetadata).toHaveBeenCalledWith(null);
    });

    test('should handle non-object types', () => {
      // These might be invalid but we test that they're passed through
      Radar.setMetadata('not-an-object');
      expect(mockModule.setMetadata).toHaveBeenCalledWith('not-an-object');
      
      Radar.setMetadata(123);
      expect(mockModule.setMetadata).toHaveBeenCalledWith(123);
    });
  });

  describe('getLocation', () => {
    test('should accept valid accuracy levels', async () => {
      const validAccuracies = ['low', 'medium', 'high'];
      
      mockModule.getLocation.mockResolvedValue({
        status: 'SUCCESS',
        location: { latitude: 40.7589, longitude: -73.9851, accuracy: 10 }
      });

      for (const accuracy of validAccuracies) {
        await Radar.getLocation(accuracy);
        expect(mockModule.getLocation).toHaveBeenCalledWith(accuracy);
      }
    });

    test('should handle invalid accuracy values', async () => {
      mockModule.getLocation.mockResolvedValue({
        status: 'SUCCESS',
        location: { latitude: 40.7589, longitude: -73.9851, accuracy: 10 }
      });

      await Radar.getLocation('invalid-accuracy');
      expect(mockModule.getLocation).toHaveBeenCalledWith('invalid-accuracy');
    });

    test('should handle undefined accuracy', async () => {
      mockModule.getLocation.mockResolvedValue({
        status: 'SUCCESS',
        location: { latitude: 40.7589, longitude: -73.9851, accuracy: 10 }
      });

      await Radar.getLocation();
      expect(mockModule.getLocation).toHaveBeenCalledWith(null);
    });
  });

  describe('trackOnce location parameter', () => {
    test('should accept valid location object', () => {
      const validLocation = {
        latitude: 40.783826,
        longitude: -73.975363,
        accuracy: 65
      };
      
      Radar.trackOnce(validLocation);
      expect(mockModule.trackOnce).toHaveBeenCalledWith(validLocation);
    });

    test('should accept location with nested location property', () => {
      const nestedLocation = {
        location: {
          latitude: 40.783826,
          longitude: -73.975363,
          accuracy: 65
        }
      };
      
      Radar.trackOnce(nestedLocation);
      expect(mockModule.trackOnce).toHaveBeenCalledWith(nestedLocation);
    });

    test('should handle invalid coordinates', () => {
      const invalidLocations = [
        { latitude: 'invalid', longitude: -73.975363, accuracy: 65 },
        { latitude: 40.783826, longitude: 'invalid', accuracy: 65 },
        { latitude: 91, longitude: -73.975363, accuracy: 65 }, 
        { latitude: 40.783826, longitude: 181, accuracy: 65 }, 
        { latitude: -91, longitude: -73.975363, accuracy: 65 }, 
        { latitude: 40.783826, longitude: -181, accuracy: 65 }, 
      ];

      invalidLocations.forEach(location => {
        Radar.trackOnce(location);
        expect(mockModule.trackOnce).toHaveBeenCalledWith(location);
      });
    });

    test('should handle missing required properties', () => {
      const incompleteLocations = [
        { latitude: 40.783826 }, 
        { longitude: -73.975363 }, 
        {}, // empty object
      ];

      incompleteLocations.forEach(location => {
        Radar.trackOnce(location);
        expect(mockModule.trackOnce).toHaveBeenCalledWith(location);
      });
      
      Radar.trackOnce(null);
      expect(mockModule.trackOnce).toHaveBeenCalledWith(null);
      
      const callCountBefore = mockModule.trackOnce.mock.calls.length;
      Radar.trackOnce(undefined);
      const callCountAfter = mockModule.trackOnce.mock.calls.length;
      
      expect(callCountAfter).toBe(callCountBefore + 1);
    });
  });

  describe('searchPlaces options', () => {
    test('should accept valid search options', async () => {
      const validOptions = {
        near: { latitude: 40.783826, longitude: -73.975363 },
        radius: 1000,
        chains: ['starbucks', 'mcdonalds'],
        limit: 10
      };

      mockModule.searchPlaces.mockResolvedValue({
        status: 'SUCCESS',
        places: []
      });
      
      await Radar.searchPlaces(validOptions);
      expect(mockModule.searchPlaces).toHaveBeenCalledWith(validOptions);
    });

    test('should handle invalid radius values', async () => {
      const invalidRadiusOptions = [
        { near: { latitude: 40.783826, longitude: -73.975363 }, radius: -100 }, 
        { near: { latitude: 40.783826, longitude: -73.975363 }, radius: 'invalid' },
        { near: { latitude: 40.783826, longitude: -73.975363 }, radius: 0 }, 
        { near: { latitude: 40.783826, longitude: -73.975363 }, radius: 100000 }, 
      ];

      mockModule.searchPlaces.mockResolvedValue({
        status: 'SUCCESS',
        places: []
      });

      for (const options of invalidRadiusOptions) {
        await Radar.searchPlaces(options);
        expect(mockModule.searchPlaces).toHaveBeenCalledWith(options);
      }
    });

    test('should handle invalid limit values', async () => {
      const invalidLimitOptions = [
        { near: { latitude: 40.783826, longitude: -73.975363 }, limit: -1 }, 
        { near: { latitude: 40.783826, longitude: -73.975363 }, limit: 'invalid' }, 
        { near: { latitude: 40.783826, longitude: -73.975363 }, limit: 0 }, 
        { near: { latitude: 40.783826, longitude: -73.975363 }, limit: 1000 }, 
      ];

      mockModule.searchPlaces.mockResolvedValue({
        status: 'SUCCESS',
        places: []
      });

      for (const options of invalidLimitOptions) {
        await Radar.searchPlaces(options);
        expect(mockModule.searchPlaces).toHaveBeenCalledWith(options);
      }
    });

    test('should handle missing required near parameter', async () => {
      const optionsWithoutNear = {
        radius: 1000,
        chains: ['starbucks'],
        limit: 10
      };

      mockModule.searchPlaces.mockResolvedValue({
        status: 'SUCCESS',
        places: []
      });
      
      await Radar.searchPlaces(optionsWithoutNear);
      expect(mockModule.searchPlaces).toHaveBeenCalledWith(optionsWithoutNear);
    });
  });

  describe('startTrip options', () => {
    test('should accept valid trip options', async () => {
      const validOptions = {
        externalId: 'trip-123',
        destinationGeofenceTag: 'store',
        destinationGeofenceExternalId: '456',
        mode: 'car',
        scheduledArrivalAt: Date.now()
      };

      mockModule.startTrip.mockResolvedValue({
        status: 'SUCCESS',
        trip: { _id: 'trip-123', status: 'started' },
        events: []
      });
      
      await Radar.startTrip(validOptions);
      expect(mockModule.startTrip).toHaveBeenCalledWith(validOptions);
    });

    test('should handle invalid mode values', async () => {
      const invalidModes = ['invalid-mode', 123, null, undefined];

      mockModule.startTrip.mockResolvedValue({
        status: 'SUCCESS',
        trip: { _id: 'trip-123', status: 'started' },
        events: []
      });

      for (const mode of invalidModes) {
        const options = {
          externalId: 'trip-123',
          destinationGeofenceTag: 'store',
          mode: mode
        };
        
        await Radar.startTrip(options);
        expect(mockModule.startTrip).toHaveBeenCalledWith(options);
      }
    });

    test('should handle missing required parameters', async () => {
      const incompleteOptions = [
        { destinationGeofenceTag: 'store' }, 
        { externalId: 'trip-123' }, 
        {}, 
      ];

      mockModule.startTrip.mockResolvedValue({
        status: 'SUCCESS',
        trip: { _id: 'trip-123', status: 'started' },
        events: []
      });

      for (const options of incompleteOptions) {
        await Radar.startTrip(options);
        expect(mockModule.startTrip).toHaveBeenCalledWith(options);
      }
    });
  });

  describe('startTrackingCustom options', () => {
    test('should accept valid tracking options', () => {
      const validOptions = {
        desiredStoppedUpdateInterval: 30,
        desiredMovingUpdateInterval: 30,
        desiredSyncInterval: 20,
        desiredAccuracy: 'high',
        stopDuration: 0,
        stopDistance: 0,
        sync: 'all',
        replay: 'none',
        showBlueBar: false,
        useStoppedGeofence: true,
        stoppedGeofenceRadius: 200,
        useMovingGeofence: false,
        movingGeofenceRadius: 0,
        useVisits: true,
        useSignificantLocationChanges: true
      };
      
      Radar.startTrackingCustom(validOptions);
      expect(mockModule.startTrackingCustom).toHaveBeenCalledWith(validOptions);
    });

    test('should handle invalid interval values', () => {
      const invalidIntervals = [
        { desiredStoppedUpdateInterval: -1 }, 
        { desiredMovingUpdateInterval: 'invalid' },
        { desiredSyncInterval: null }, 
      ];

      invalidIntervals.forEach(options => {
        Radar.startTrackingCustom(options);
        expect(mockModule.startTrackingCustom).toHaveBeenCalledWith(options);
      });
    });

    test('should handle invalid accuracy values', () => {
      const invalidAccuracyOptions = [
        { desiredAccuracy: 'invalid-accuracy' },
        { desiredAccuracy: 123 },
        { desiredAccuracy: null }
      ];

      invalidAccuracyOptions.forEach(options => {
        Radar.startTrackingCustom(options);
        expect(mockModule.startTrackingCustom).toHaveBeenCalledWith(options);
      });
    });
  });

  describe('getDistance options', () => {
    test('should accept valid distance options', async () => {
      const validOptions = {
        origin: { latitude: 40.78382, longitude: -73.97536 },
        destination: { latitude: 40.70390, longitude: -73.98670 },
        modes: ['foot', 'car'],
        units: 'imperial'
      };

      mockModule.getDistance.mockResolvedValue({
        status: 'SUCCESS',
        routes: {}
      });
      
      await Radar.getDistance(validOptions);
      expect(mockModule.getDistance).toHaveBeenCalledWith(validOptions);
    });

    test('should handle invalid coordinate values', async () => {
      const invalidCoordinateOptions = [
        {
          origin: { latitude: 'invalid', longitude: -73.97536 },
          destination: { latitude: 40.70390, longitude: -73.98670 },
          modes: ['foot'], units: 'imperial'
        },
        {
          origin: { latitude: 91, longitude: -73.97536 }, // lat > 90
          destination: { latitude: 40.70390, longitude: -73.98670 },
          modes: ['foot'], units: 'imperial'
        },
        {
          origin: { latitude: 40.78382, longitude: 181 }, // lng > 180
          destination: { latitude: 40.70390, longitude: -73.98670 },
          modes: ['foot'], units: 'imperial'
        }
      ];

      mockModule.getDistance.mockResolvedValue({
        status: 'SUCCESS',
        routes: {}
      });

      for (const options of invalidCoordinateOptions) {
        await Radar.getDistance(options);
        expect(mockModule.getDistance).toHaveBeenCalledWith(options);
      }
    });

    test('should handle invalid modes', async () => {
      const invalidModeOptions = [
        {
          origin: { latitude: 40.78382, longitude: -73.97536 },
          destination: { latitude: 40.70390, longitude: -73.98670 },
          modes: ['invalid-mode'],
          units: 'imperial'
        },
        {
          origin: { latitude: 40.78382, longitude: -73.97536 },
          destination: { latitude: 40.70390, longitude: -73.98670 },
          modes: [], 
          units: 'imperial'
        },
        {
          origin: { latitude: 40.78382, longitude: -73.97536 },
          destination: { latitude: 40.70390, longitude: -73.98670 },
          modes: 'not-an-array',
          units: 'imperial'
        }
      ];

      mockModule.getDistance.mockResolvedValue({
        status: 'SUCCESS',
        routes: {}
      });

      for (const options of invalidModeOptions) {
        await Radar.getDistance(options);
        expect(mockModule.getDistance).toHaveBeenCalledWith(options);
      }
    });

    test('should handle invalid units', async () => {
      const invalidUnitOptions = [
        {
          origin: { latitude: 40.78382, longitude: -73.97536 },
          destination: { latitude: 40.70390, longitude: -73.98670 },
          modes: ['foot'],
          units: 'invalid-unit'
        },
        {
          origin: { latitude: 40.78382, longitude: -73.97536 },
          destination: { latitude: 40.70390, longitude: -73.98670 },
          modes: ['foot'],
          units: 123
        }
      ];

      mockModule.getDistance.mockResolvedValue({
        status: 'SUCCESS',
        routes: {}
      });

      for (const options of invalidUnitOptions) {
        await Radar.getDistance(options);
        expect(mockModule.getDistance).toHaveBeenCalledWith(options);
      }
    });
  });

  describe('autocomplete options', () => {
    test('should accept valid autocomplete options', async () => {
      const validOptions = {
        query: 'brooklyn roasting',
        layers: ['address'],
        near: { latitude: 40.783826, longitude: -73.975363 },
        limit: 10,
        countryCode: 'US',
        mailable: true
      };

      mockModule.autocomplete.mockResolvedValue({
        status: 'SUCCESS',
        addresses: []
      });
      
      await Radar.autocomplete(validOptions);
      expect(mockModule.autocomplete).toHaveBeenCalledWith(validOptions);
    });

    test('should handle empty query string', async () => {
      const emptyQueryOptions = {
        query: '',
        near: { latitude: 40.783826, longitude: -73.975363 }
      };

      mockModule.autocomplete.mockResolvedValue({
        status: 'SUCCESS',
        addresses: []
      });
      
      await Radar.autocomplete(emptyQueryOptions);
      expect(mockModule.autocomplete).toHaveBeenCalledWith(emptyQueryOptions);
    });

    test('should handle invalid country codes', async () => {
      const invalidCountryOptions = [
        {
          query: 'test',
          near: { latitude: 40.783826, longitude: -73.975363 },
          countryCode: 'INVALID'
        },
        {
          query: 'test',
          near: { latitude: 40.783826, longitude: -73.975363 },
          countryCode: 123
        }
      ];

      mockModule.autocomplete.mockResolvedValue({
        status: 'SUCCESS',
        addresses: []
      });

      for (const options of invalidCountryOptions) {
        await Radar.autocomplete(options);
        expect(mockModule.autocomplete).toHaveBeenCalledWith(options);
      }
    });
  });
});

describe('Event listeners and callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initialize', () => {
    const publishableKey = 'prj_test_pk_123456789';
    const fraud = true;
    
    Radar.initialize(publishableKey, fraud);
    
    expect(mockModule.initialize).toHaveBeenCalledTimes(1);
    expect(mockModule.initialize).toHaveBeenCalledWith(publishableKey, fraud);
  });

  test('onLocationUpdated', () => {
    const callback = jest.fn();
    
    Radar.onLocationUpdated(callback);
    
    expect(typeof Radar.onLocationUpdated).toBe('function');
  });

  test('onLocationUpdated with null callback', () => {
    Radar.onLocationUpdated(null);
    
    expect(typeof Radar.onLocationUpdated).toBe('function');
  });

  test('onClientLocationUpdated', () => {
    const callback = jest.fn();
    
    Radar.onClientLocationUpdated(callback);
    
    expect(typeof Radar.onClientLocationUpdated).toBe('function');
  });

  test('onError', () => {
    const callback = jest.fn();
    
    Radar.onError(callback);
    
    expect(typeof Radar.onError).toBe('function');
  });

  test('onLog', () => {
    const callback = jest.fn();
    
    Radar.onLog(callback);
    
    expect(typeof Radar.onLog).toBe('function');
  });

  test('onEventsReceived', () => {
    const callback = jest.fn();
    
    Radar.onEventsReceived(callback);
    
    expect(typeof Radar.onEventsReceived).toBe('function');
  });

  test('onTokenUpdated', () => {
    const callback = jest.fn();
    
    Radar.onTokenUpdated(callback);
    
    expect(typeof Radar.onTokenUpdated).toBe('function');
  });

  test('onNewInAppMessage', () => {
    const callback = jest.fn();
    
    Radar.onNewInAppMessage(callback);
    
    expect(typeof Radar.onNewInAppMessage).toBe('function');
  });

  test('onInAppMessageDismissed', () => {
    const callback = jest.fn();
    
    Radar.onInAppMessageDismissed(callback);
    
    expect(typeof Radar.onInAppMessageDismissed).toBe('function');
  });

  test('onInAppMessageClicked', () => {
    const callback = jest.fn();
    
    Radar.onInAppMessageClicked(callback);
    
    expect(typeof Radar.onInAppMessageClicked).toBe('function');
  });
});

describe('Utility and SDK methods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('nativeSdkVersion', async () => {
    const mockVersion = '3.9.0';
    
    mockModule.nativeSdkVersion.mockResolvedValue(mockVersion);
    
    const result = await Radar.nativeSdkVersion();
    
    expect(mockModule.nativeSdkVersion).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockVersion);
    expect(typeof result).toBe('string');
  });

  test('rnSdkVersion', () => {
    const result = Radar.rnSdkVersion();
    
    expect(typeof result).toBe('string');
    expect(result).toBeDefined();
  });

  test('getHost', async () => {
    const mockHost = 'api.radar.io';
    
    mockModule.getHost.mockResolvedValue(mockHost);
    
    const result = await Radar.getHost();
    
    expect(mockModule.getHost).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockHost);
    expect(typeof result).toBe('string');
  });

  test('getPublishableKey', async () => {
    const mockKey = 'prj_test_pk_123456789';
    
    mockModule.getPublishableKey.mockResolvedValue(mockKey);
    
    const result = await Radar.getPublishableKey();
    
    expect(mockModule.getPublishableKey).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockKey);
    expect(typeof result).toBe('string');
  });

  test('showInAppMessage', () => {
    const mockInAppMessage = {
      _id: 'message-123',
      text: 'Welcome to our app!',
      url: 'https://example.com'
    };
    
    Radar.showInAppMessage(mockInAppMessage);
    
    expect(mockModule.showInAppMessage).toHaveBeenCalledTimes(1);
    expect(mockModule.showInAppMessage).toHaveBeenCalledWith(mockInAppMessage);
  });
});

describe('Advanced features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('validateAddress', async () => {
    const address = {
      latitude: 40.7589,
      longitude: -73.9851,
      city: 'New York',
      stateCode: 'NY',
      postalCode: '10013',
      countryCode: 'US',
      street: 'Broadway',
      number: '841'
    };

    const mockValidationResult = {
      status: 'SUCCESS',
      result: {
        address: {
          ...address,
          formattedAddress: '841 Broadway, New York, NY 10013, USA'
        },
        verificationStatus: 'VERIFIED'
      }
    };

    mockModule.validateAddress.mockResolvedValue(mockValidationResult);

    const result = await Radar.validateAddress(address);

    expect(mockModule.validateAddress).toHaveBeenCalledTimes(1);
    expect(mockModule.validateAddress).toHaveBeenCalledWith(address);
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.result.verificationStatus).toBe('VERIFIED');
  });

  test('getMatrix', async () => {
    const options = {
      origins: [
        { latitude: 40.78382, longitude: -73.97536 },
        { latitude: 40.70390, longitude: -73.98670 }
      ],
      destinations: [
        { latitude: 40.64189, longitude: -73.78779 },
        { latitude: 35.99801, longitude: -78.94294 }
      ],
      mode: 'car',
      units: 'imperial'
    };

    const mockMatrixResult = {
      status: 'SUCCESS',
      matrix: [
        [
          { distance: { value: 15.2, text: '15.2 mi' }, duration: { value: 1800, text: '30 mins' } },
          { distance: { value: 350.1, text: '350.1 mi' }, duration: { value: 21600, text: '6 hrs' } }
        ],
        [
          { distance: { value: 18.7, text: '18.7 mi' }, duration: { value: 2100, text: '35 mins' } },
          { distance: { value: 346.8, text: '346.8 mi' }, duration: { value: 21300, text: '5 hrs 55 mins' } }
        ]
      ]
    };

    mockModule.getMatrix.mockResolvedValue(mockMatrixResult);

    const result = await Radar.getMatrix(options);

    expect(mockModule.getMatrix).toHaveBeenCalledTimes(1);
    expect(mockModule.getMatrix).toHaveBeenCalledWith(options);
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(Array.isArray(result.matrix)).toBe(true);
    expect(result.matrix.length).toBe(2);
    expect(result.matrix[0].length).toBe(2);
  });

  test('updateTrip', async () => {
    const options = {
      options: {
        externalId: 'trip-123',
        destinationGeofenceTag: 'store',
        destinationGeofenceExternalId: '456',
        mode: 'car',
        scheduledArrivalAt: Date.now(),
        metadata: { priority: 'high' }
      },
      status: 'approaching'
    };

    const mockUpdateResult = {
      status: 'SUCCESS',
      trip: {
        _id: 'trip-123',
        externalId: 'trip-123',
        status: 'approaching',
        mode: 'car'
      },
      events: [
        {
          _id: 'event-123',
          type: 'user.trip.updated',
          trip: {
            _id: 'trip-123',
            status: 'approaching'
          }
        }
      ]
    };

    mockModule.updateTrip.mockResolvedValue(mockUpdateResult);

    const result = await Radar.updateTrip(options);

    expect(mockModule.updateTrip).toHaveBeenCalledTimes(1);
    expect(mockModule.updateTrip).toHaveBeenCalledWith(options);
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.trip.status).toBe('approaching');
    expect(Array.isArray(result.events)).toBe(true);
  });

  test('autocomplete', async () => {
    const options = {
      query: 'brooklyn roasting',
      layers: ['address'],
      near: { latitude: 40.783826, longitude: -73.975363 },
      limit: 10,
      countryCode: 'US',
      mailable: true
    };

    const mockAutocompleteResult = {
      status: 'SUCCESS',
      addresses: [
        {
          latitude: 40.6892,
          longitude: -73.9877,
          formattedAddress: '25 Jay St, Brooklyn, NY 11201, USA',
          country: 'United States',
          countryCode: 'US',
          state: 'New York',
          stateCode: 'NY'
        }
      ]
    };

    mockModule.autocomplete.mockResolvedValue(mockAutocompleteResult);

    const result = await Radar.autocomplete(options);

    expect(mockModule.autocomplete).toHaveBeenCalledTimes(1);
    expect(mockModule.autocomplete).toHaveBeenCalledWith(options);
    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(Array.isArray(result.addresses)).toBe(true);
    expect(result.addresses[0].countryCode).toBe('US');
  });
});
