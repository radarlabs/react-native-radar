import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { version } from '../package.json'
import { IRadarNative } from './definitions';


if (!NativeModules.RNRadar && (Platform.OS === 'ios' || Platform.OS === 'android')) {
  throw new Error('NativeModules.RNRadar is undefined');
}

const eventEmitter = new NativeEventEmitter(NativeModules.RNRadar);

const initialize = (publishableKey: string, fraud: boolean = false): void => {
  NativeModules.RNRadar.initialize(publishableKey, fraud);
};

const setLogLevel = (level: RadarLogLevel): void => {
  NativeModules.RNRadar.setLogLevel(level);
};

const setUserId = (userId: string): void => {
  NativeModules.RNRadar.setUserId(userId);
};

const getUserId = (): Promise<string> => (
  NativeModules.RNRadar.getUserId()
);

const setDescription = (description: string): void => {
  NativeModules.RNRadar.setDescription(description);
};

const getDescription = (): Promise<string> => (
  NativeModules.RNRadar.getDescription()
);

const setMetadata = (metadata: object): void => {
  NativeModules.RNRadar.setMetadata(metadata);
};

const getMetadata = (): Promise<object>  => (
  NativeModules.RNRadar.getMetadata()
)

const setAnonymousTrackingEnabled = (enabled: boolean): void => (
  NativeModules.RNRadar.setAnonymousTrackingEnabled(enabled)
)


const getPermissionsStatus = (): Promise<RadarPermissionsStatus> => (
  NativeModules.RNRadar.getPermissionsStatus()
);

const requestPermissions = (background: boolean): Promise<RadarPermissionsStatus> => (
  NativeModules.RNRadar.requestPermissions(background)
);

const getLocation = (desiredAccuracy?:RadarTrackingOptionsDesiredAccuracy): Promise<RadarLocationCallback> => (
  NativeModules.RNRadar.getLocation(desiredAccuracy)
);

const trackOnce = (options?: RadarTrackOnceOptions | Location): Promise<RadarTrackCallback> => {
  let backCompatibleOptions = options;
  if (options && 'latitude' in options) {
    backCompatibleOptions = {
      location: {
        ...options
      }
    }
  }
  return NativeModules.RNRadar.trackOnce(backCompatibleOptions)
};

export interface RadarTrackOnceOptions {
  location?: Location;
  desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy;
  beacons?: boolean;
}

const trackVerified = (): Promise<RadarTrackCallback> => (
  NativeModules.RNRadar.trackVerified()
);

const trackVerifiedToken = (): Promise<RadarTrackTokenCallback> => (
  NativeModules.RNRadar.trackVerifiedToken()
);

const startTrackingEfficient = (): void => (
  NativeModules.RNRadar.startTrackingEfficient()
);

const startTrackingResponsive = (): void => (
  NativeModules.RNRadar.startTrackingResponsive()
);

const startTrackingContinuous = (): void => (
  NativeModules.RNRadar.startTrackingContinuous()
);

const startTrackingCustom = (options: RadarTrackingOptions): void => (
  NativeModules.RNRadar.startTrackingCustom(options)
);

const mockTracking = (options: RadarMockTrackingOptions): void => (
  NativeModules.RNRadar.mockTracking(options)
);

const stopTracking = (): void => (
  NativeModules.RNRadar.stopTracking()
);

const getTrackingOptions = (): Promise<RadarTrackingOptions> => (
  NativeModules.RNRadar.getTrackingOptions()
)

const isUsingRemoteTrackingOptions = (): Promise<boolean> => (
  NativeModules.RNRadar.isUsingRemoteTrackingOptions()
)

const isTracking = (): boolean => (
  NativeModules.RNRadar.isTracking()
)

const setForegroundServiceOptions = (options: RadarTrackingOptionsForegroundService): void => (
  NativeModules.RNRadar.setForegroundServiceOptions(options)
);

const setNotificationOptions = (options:RadarNotificationOptions): void => (
  NativeModules.RNRadar.setNotificationOptions(options)
);

const getTripOptions = (): Promise<RadarTripOptions> => (
  NativeModules.RNRadar.getTripOptions()
)

const startTrip = (options: RadarStartTripOptions) : Promise<RadarTripCallback>=> (
  NativeModules.RNRadar.startTrip(options)
);

export interface RadarStartTripOptions {
  tripOptions: RadarTripOptions;
  trackingOptions: RadarTrackingOptions;
}

const completeTrip = (): Promise<RadarTripCallback> => (
  NativeModules.RNRadar.completeTrip()
);

const cancelTrip = (): Promise<RadarTripCallback> => (
  NativeModules.RNRadar.cancelTrip()
);

const updateTrip = (options:RadarUpdateTripOptions): Promise<RadarTripCallback> => (
  NativeModules.RNRadar.updateTrip(options)
);

export interface RadarUpdateTripOptions {
  options: RadarTripOptions;
  status: RadarTripStatus;
}

const acceptEvent = (eventId: string, verifiedPlaceId: string):void => (
  NativeModules.RNRadar.acceptEvent(eventId, verifiedPlaceId)
);

const rejectEvent = (eventId: string): void => (
  NativeModules.RNRadar.rejectEvent(eventId)
);

const getContext = (location?: Location): Promise<RadarContextCallback> => (
  NativeModules.RNRadar.getContext(location)
);

const searchPlaces = (options: RadarSearchPlacesOptions): Promise<RadarSearchPlacesCallback> => (
  NativeModules.RNRadar.searchPlaces(options)
);

const searchGeofences = (options: RadarSearchGeofencesOptions): Promise<RadarSearchGeofencesCallback> => (
  NativeModules.RNRadar.searchGeofences(options)
);


const autocomplete = (options:RadarAutocompleteOptions):Promise<RadarGeocodeCallback> => (
  NativeModules.RNRadar.autocomplete(options)
);

const geocode = (address: string): Promise<RadarGeocodeCallback> => (
  NativeModules.RNRadar.geocode(address)
);

const reverseGeocode = (location: Location): Promise<RadarGeocodeCallback> => (
  NativeModules.RNRadar.reverseGeocode(location)
);

const ipGeocode = ():Promise<RadarGeocodeCallback> => (
  NativeModules.RNRadar.ipGeocode()
);

const getDistance = (options: RadarGetDistanceOptions): Promise<RadarRouteCallback> => (
  NativeModules.RNRadar.getDistance(options)
);

export interface RadarGetDistanceOptions { 
  origin?:Location;
  destination?: Location;
  modes: string[];
  units: string;
}

const getMatrix = (options:RadarGetDistanceOptions): Promise<RadarRouteMatrix> => (
  NativeModules.RNRadar.getMatrix(options)
);

const logConversion = (options: RadarLogConversionOptions): Promise<RadarLogConversionCallback> => (
  NativeModules.RNRadar.logConversion(options)
)

//??????
const sendEvent = (name, metadata) => (
  NativeModules.RNRadar.sendEvent(name, metadata)
)

const on = (event, callback) => (
  eventEmitter.addListener(event, callback)
);

const off = (event, callback) => {
  if (callback) {
    // @ts-ignore
    eventEmitter.removeListener(event, callback);
  } else {
    eventEmitter.removeAllListeners(event);
  }
};

const nativeSdkVersion = ():Promise<string> => (
  NativeModules.RNRadar.nativeSdkVersion()
);

const rnSdkVersion = ():string  => (version)

const Radar:IRadarNative= {
  initialize,
  setLogLevel,
  setUserId,
  getUserId,
  setDescription,
  getDescription,
  setMetadata,
  getMetadata,
  setAnonymousTrackingEnabled,
  isUsingRemoteTrackingOptions,
  getPermissionsStatus,
  requestPermissions,
  getLocation,
  trackOnce,
  trackVerified,
  trackVerifiedToken,
  startTrackingEfficient,
  startTrackingResponsive,
  startTrackingContinuous,
  startTrackingCustom,
  mockTracking,
  stopTracking,
  isTracking,
  getTrackingOptions,
  setForegroundServiceOptions,
  setNotificationOptions,
  acceptEvent,
  rejectEvent,
  getTripOptions,
  startTrip,
  updateTrip,
  completeTrip,
  cancelTrip,
  getContext,
  searchPlaces,
  searchGeofences,
  autocomplete,
  geocode,
  reverseGeocode,
  ipGeocode,
  getDistance,
  getMatrix,
  logConversion,
  sendEvent,
  on,
  off,
  nativeSdkVersion,
  rnSdkVersion,
};

export default Radar;


export interface RadarLocationCallback {
  status: string;
  location?: Location;
  stopped?: boolean;
}

export interface RadarTrackCallback {
  status: string;
  location?: Location;
  user?: RadarUser;
  events?: RadarEvent[];
}

export type RadarPermissionsStatus = 'GRANTED_FOREGROUND' | 'GRANTED_FOREGROUND' | 'DENIED' | 'NOT_DETERMINED' | 'UNKNOWN';
 
export type RadarLogLevel = 'info' | 'debug' | 'warning' | 'error' | 'none';

export interface RadarTrackTokenCallback {
  status: string;
  token?: String;
}

export interface RadarTripCallback {
  status: string;
  trip?: RadarTrip;
  events?: RadarEvent[];
}

export interface RadarContextCallback {
  status: string;
  location?: Location;
  context?: RadarContext;
}

export interface RadarSearchPlacesCallback {
  status: string;
  location?: Location;
  places?: RadarPlace[];
}

export interface RadarSearchGeofencesCallback {
  status: string;
  location?: Location;
  geofences?: RadarGeofence[];
}

export interface RadarSearchGeofencesOptions { 
  near?: Location;
  radius: number;
  metadata?: object;
  tags?: string[];
  limit: number;
}

export interface RadarGeocodeCallback {
  status: string;
  addresses?: RadarAddress[];
}

export interface RadarValidateAddressCallback {
  status: string;
  address?: RadarAddress;
  verificationStatus?: RadarAddressVerificationStatus;
}

export interface RadarIPGeocodeCallback {
  status: string;
  address?: RadarAddress;
}

export interface RadarTrackingOptionsForegroundServiceOptions {
  text?: string;
  title?: string;
  updatesOnly: boolean;
  activity?: string;
  importance?: number;
  id?: number;
  channelName?: string;
  iconString?: string;
  iconColor?: string;
  }

export interface RadarRouteCallback {
  status: string;
  routes?: RadarRoutes;
}

export interface RadarLogConversionCallback {
  status: string;
  event: RadarEvent;
}

export interface RadarRouteMatrix {
  status: string;
  matrix?: object;
}

export interface RadarSearchPlacesOptions { 
  near?: Location;
  radius: number;
  chains?: string[];
  chainMetadata?: object;
  categories?: string[];
  groups?: string[];
  limit: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  altitude?: number;
  course?: number;
  verticalAccuracy?: number;
  speedAccuracy?: number;
  courseAccuracy?: number;
}

export interface RadarUser {
  _id: string;
  userId?: string;
  deviceId?: string;
  description?: string;
  metadata?: object;
  location?: Point;
  geofences?: RadarGeofence[];
  place?: RadarPlace;
  beacons?: RadarBeacon[];
  stopped?: boolean;
  foreground?: boolean;
  country?: RadarRegion;
  state?: RadarRegion;
  dma?: RadarRegion;
  postalCode?: RadarRegion;
  nearbyPlaceChains?: RadarPlace[];
  segments?: RadarSegment[];
  topChains?: RadarPlace[];
  source?: LocationSource;
  trip?: RadarTrip;
  debug?: boolean;
  fraud?: RadarFraud;
}
export interface RadarAutocompleteOptions { query: string, near?: Location, layers?: string[], limit: number, country?: string, expandUnits?: boolean }

export interface Point {
  type: "Point";
  coordinates: [number,number];
}

export type LocationSource =
  | 'FOREGROUND_LOCATION'
  | 'BACKGROUND_LOCATION'
  | 'MANUAL_LOCATION'
  | 'VISIT_ARRIVAL'
  | 'VISIT_DEPARTURE'
  | 'GEOFENCE_ENTER'
  | 'GEOFENCE_EXIT'
  | 'MOCK_LOCATION'
  | 'BEACON_ENTER'
  | 'BEACON_EXIT'
  | 'UNKNOWN';

export interface RadarTrip {
  _id: string;
  externalId: string;
  metadata?: object;
  destinationGeofenceTag?: string;
  destinationGeofenceExternalId?: string;
  mode?: string;
  eta?: RadarTripEta;
  status: string;
  scheduledArrivalAt?: Date;
}

export interface RadarSegment {
  description: string;
  externalId: string;
}

export interface RadarContext {
  geofences?: RadarGeofence[];
  place?: RadarPlace;
  country?: RadarRegion;
  state?: RadarRegion;
  dma?: RadarRegion;
  postalCode?: RadarRegion;
}

export interface RadarEvent {
  _id: string;
  live: boolean;
  type: RadarEventType;
  geofence?: RadarGeofence;
  place?: RadarPlace;
  region?: RadarRegion;
  confidence: RadarEventConfidence;
  duration?: number;
  beacon?: RadarBeacon;
  trip?: RadarTrip;
  alternatePlaces?: RadarPlace[];
  location?: Point;
  metadata?: object;
}

export enum RadarEventConfidence {
  none = 0,
  low = 1,
  medium = 2,
  high = 3
}

export type RadarEventType =
  | 'unknown'
  | 'user.entered_geofence'
  | 'user.entered_beacon'
  | 'user.dwelled_in_geofence'
  | 'user.entered_place'
  | 'user.entered_region_country'
  | 'user.entered_region_dma'
  | 'user.entered_region_state'
  | 'user.entered_region_postal_code'
  | 'user.exited_geofence'
  | 'user.exited_beacon'
  | 'user.exited_place'
  | 'user.exited_region_country'
  | 'user.exited_region_dma'
  | 'user.exited_region_state'
  | 'user.exited_region_postal_code'
  | 'user.nearby_place_chain'
  | 'user.started_trip'
  | 'user.updated_trip'
  | 'user.approaching_trip_destination'
  | 'user.arrived_at_trip_destination'
  | 'user.stopped_trip';

export type RadarTrackingOptionsDesiredAccuracy = 
  | 'high'
  | 'medium'
  | 'low'
  | 'none'

export enum RadarEventVerification {
  accept = 1,
  unverify = 0,
  reject = -1
}

export type RadarBeaconType = 
  | 'eddystone'
  | 'ibeacon'

export interface RadarGeofence {
  _id: string;
  description: string;
  tag?: string;
  externalId?: string;
  metadata?: object;
}

export interface RadarBeacon {
  _id: string;
  metadata?: object;
  type: RadarBeaconType;
  uid?: string;
  instance?: string;
  major?: string;
  minor?: string;
}

export interface RadarPlace {
  _id: string;
  name: string;
  categories: string[];
  chain?: RadarChain;
}

export interface RadarChain {
  name: string;
  slug: string;
  externalId?: string;
  metadata?: object;
}

export interface RadarRegion {
  _id: string;
  type: string;
  code: string;
  name: string;
  allowed?: boolean;
}

export interface RadarLocationPermissionsCallback {
  status: string;
}

export interface RadarAddress {
  latitude: number;
  longitude: number;
  placeLabel?: string;
  addressLabel?: string;
  formattedAddress?: string;
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  city?: string;
  borough?: string;
  county?: string;
  neighborhood?: string;
  number?: string;
  distance?: number;
  confidence?: string;
  layer?: string;
  plus4?: string; 
}

export interface RadarAddressVerificationStatus {
  status: string;
}

export interface RadarRoutes {
  geodesic: RadarRoute;
  foot?: RadarRoute;
  bike?: RadarRoute;
  car?: RadarRoute;
}

export interface RadarRoute {
  distance?: RadarRouteDistance;
  duration?: RadarRouteDuration;
}

export interface RadarRouteDistance {
  value: number;
  text: string;
}

export interface RadarNotificationOptions {
  iconString?: string;
  iconColor?: string;
  foregroundServiceIconString?: string;
  foregroundServiceIconColor?: string;
  eventIconString?: string;
  eventIconColor?: string;
}

export interface RadarRouteDuration {
  value: number;
  text: string;
}

export interface RadarTripEta {
  distance?: number;
  duration?: number;
}

export interface RadarFraud {
  passed: boolean;
  bypassed: boolean;
  verified: boolean;
  proxy: boolean;
  mocked: boolean;
  compromised: boolean;
  jumped: boolean;
  sharing: boolean;
}

export interface RadarMockTrackingOptions {
  origin: Location;
  destination: Location;
  mode: RadarRouteMode;
  steps: number;
  interval: number;
}

export type RadarTrackingOptionsReplay = 
  | 'all'
  | 'stops'
  | 'none'

export type RadarTrackingOptionsSync =
  | 'none'
  | 'stopsAndExits'
  | 'all'

export interface RadarTrackingOptions {
   desiredStoppedUpdateInterval: number;
   fastestStoppedUpdateInterval: number;
   desiredMovingUpdateInterval: number;
   fastestMovingUpdateInterval: number;
   desiredSyncInterval: number;
   desiredAccuracy: RadarTrackingOptionsDesiredAccuracy,
   stopDuration: number;
   stopDistance: number;
   startTrackingAfter?: Date;
   stopTrackingAfter?: Date;
   replay: RadarTrackingOptionsReplay;
   sync: RadarTrackingOptionsSync;
   showBlueBar: boolean;
   useStoppedGeofence: boolean,
   stoppedGeofenceRadius: number;
   useMovingGeofence: boolean,
   movingGeofenceRadius: number;
   syncGeofences: boolean,
   syncGeofencesLimit: number;
   foregroundServiceEnabled: boolean,
   beacons: boolean
}

export interface RadarLogConversionOptions {
  name: string;
  revenue?: number;
  metadata?: object;
}

export type RadarRouteMode =
  | 'foot'
  | 'bike'
  | 'car'

export interface RadarTrackingStatus {
  isTracking: string;
}

export interface RadarTrackingOptionsForegroundService {
  text?: string;
  title?: string;
  icon?: number;
  updatesOnly?: boolean;
  activity?: string;
  importance?: number;
  id?: number;
  channelName?: string;
}

export interface RadarTripOptions {
   externalId: string;
   metadata?: object;
   destinationGeofenceTag?: string;
   destinationGeofenceExternalId?: string;
   mode?: RadarRouteMode;
   scheduledArrivalAt?: Date;
   approachingThreshold?: number
}

export type RadarTripStatus = 
  | 'unknown'
  | 'started'
  | 'approaching'
  | 'arrived'
  | 'expired'
  | 'completed'
  | 'canceled'