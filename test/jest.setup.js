jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
    return {
        default: jest.fn().mockImplementation(() => ({
            addListener: jest.fn(),
            removeListeners: jest.fn(),
            removeAllListeners: jest.fn(),
        })),
    }
    // return jest.fn().mockImplementation((nativeModule) => {
    //   return {
    //     addListener: jest.fn(),
    //     removeListener: jest.fn(),
    //     removeAllListeners: jest.fn(),
    //   };
    // });
  });

  jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
    RNRadar: {
      setLogLevel: jest.fn(),
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
      mockTracking: jest.fn(),
      stopTracking: jest.fn(),
      acceptEvent: jest.fn(),
      rejectEvent: jest.fn(),
      startTrip: jest.fn(),
      completeTrip: jest.fn(),
      cancelTrip: jest.fn(),
      getContext: jest.fn(),
      searchPlaces: jest.fn(),
      searchGeofences: jest.fn(),
      autocomplete: jest.fn(),
      geocode: jest.fn(),
      reverseGeocode: jest.fn(),
      ipGeocode: jest.fn(),
      getDistance: jest.fn(),
      getMatrix: jest.fn(),
      sendEvent: jest.fn(),
      getUserId: jest.fn(),
      getDescription: jest.fn(),
      getMetadata: jest.fn(),
      setAnonymousTrackingEnabled: jest.fn(),
      isTracking: jest.fn(),
      getTrackingOptions: jest.fn(),
      getTripOptions: jest.fn(),
      logConversion: jest.fn(),
      getLocationPermissionStatus: jest.fn(),
      openAppSettings: jest.fn(),
    },
  }));