declare module 'react-native-radar' {
  export type permissionStatus = 'GRANTED' | 'DENIED' | 'UNKNOWN';
  export type errorString =
    | 'ERROR_PUBLISHABLE_KEY'
    | 'ERROR_PERMISSIONS'
    | 'ERROR_LOCATION'
    | 'ERROR_NETWORK'
    | 'ERROR_UNAUTHORIZED'
    | 'ERROR_SERVER'
    | 'ERROR_UNKNOWN';

  export interface trackResult {
    location: any;
    events: any;
    user?: {
      geofences: any;
    };
  }

  export type onEvents = (
    event: 'events',
    callback: (result: { events: any; user: any }) => void,
  ) => void;

  export type onLocation = (
    event: 'location',
    callback: (result: { location: any; user: any }) => void,
  ) => void;

  export type onError = (event: 'error', callback: (err: any) => void) => void;

  export type onEvent = onEvents | onLocation | onError;

  export interface RadarLocation {
    latitude: number;
    longitude: number;
    accuracy: number;
  }

  export interface Radar {
    initialize: (publishableKey: string) => void;
    setUserId: (userId: string) => void;
    setMetadata: (metadata: object) => void;
    setDescription: (setDescription: string) => void;
    getPermissionsStatus: () => Promise<permissionStatus>;
    // posible return permissionStatus but idk
    requestPermissions: (background: boolean) => any;
    trackOnce: () => Promise<trackResult>;
    startTracking: (options: object) => any;
    stopTracking: () => void;
    on: onEvent;
    off: (event: 'events' | 'location' | 'error') => void;
    updateLocation: (location: RadarLocation) => trackResult;
  }

  const Radar: Radar;

  export default Radar;
}
