import { Platform } from "react-native";
const platform = Platform.OS;

export type RadarMetadata = Record<string, string | number | boolean>;

export interface RadarTrackOnceOptions {
  location?: Location;
  desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy;
  beacons?: boolean;
}

export interface RadarTrackVerifiedOptions {
  beacons?: boolean;
  desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy;
  reason?: string;
  transactionId?: string;
}

/**
 * Options for tracking the user's location.
 * @see {@link https://radar.com/documentation/sdk/tracking}
 */
export interface RadarTrackingOptions {
  desiredStoppedUpdateInterval: number;
  fastestStoppedUpdateInterval?: number;
  desiredMovingUpdateInterval: number;
  fastestMovingUpdateInterval?: number;
  desiredSyncInterval: number;
  desiredAccuracy: RadarTrackingOptionsDesiredAccuracy;
  stopDuration: number;
  stopDistance: number;
  sync: "all" | "stopsAndExits" | "none";
  replay: "all" | "stops" | "none";
  useStoppedGeofence: boolean;
  showBlueBar?: boolean;
  startTrackingAfter?: number;
  stopTrackingAfter?: number;
  stoppedGeofenceRadius: number;
  useMovingGeofence: boolean;
  movingGeofenceRadius: number;
  syncGeofences: boolean;
  useVisits?: boolean;
  useSignificantLocationChanges?: boolean;
  beacons: boolean;
  syncGeofencesLimit?: number;
  foregroundServiceEnabled?: boolean;
}

export const presetContinuousIOS: RadarTrackingOptions = {
  desiredStoppedUpdateInterval: 30,
  desiredMovingUpdateInterval: 30,
  desiredSyncInterval: 20,
  desiredAccuracy: "high",
  stopDuration: 140,
  stopDistance: 70,
  replay: "none",
  useStoppedGeofence: false,
  showBlueBar: true,
  startTrackingAfter: undefined,
  stopTrackingAfter: undefined,
  stoppedGeofenceRadius: 0,
  useMovingGeofence: false,
  movingGeofenceRadius: 0,
  syncGeofences: true,
  useVisits: false,
  useSignificantLocationChanges: false,
  beacons: false,
  sync: "all",
};

export const presetContinuousAndroid: RadarTrackingOptions = {
  desiredStoppedUpdateInterval: 30,
  fastestStoppedUpdateInterval: 30,
  desiredMovingUpdateInterval: 30,
  fastestMovingUpdateInterval: 30,
  desiredSyncInterval: 20,
  desiredAccuracy: "high",
  stopDuration: 140,
  stopDistance: 70,
  replay: "none",
  sync: "all",
  useStoppedGeofence: false,
  stoppedGeofenceRadius: 0,
  useMovingGeofence: false,
  movingGeofenceRadius: 0,
  syncGeofences: true,
  syncGeofencesLimit: 0,
  foregroundServiceEnabled: true,
  beacons: false,
  startTrackingAfter: undefined,
  stopTrackingAfter: undefined,
};

export const presetContinuous: RadarTrackingOptions =
  platform === "ios" ? presetContinuousIOS : presetContinuousAndroid;

export const presetResponsiveIOS: RadarTrackingOptions = {
  desiredStoppedUpdateInterval: 0,
  desiredMovingUpdateInterval: 150,
  desiredSyncInterval: 20,
  desiredAccuracy: "medium",
  stopDuration: 140,
  stopDistance: 70,
  replay: "stops",
  useStoppedGeofence: true,
  showBlueBar: false,
  startTrackingAfter: undefined,
  stopTrackingAfter: undefined,
  stoppedGeofenceRadius: 100,
  useMovingGeofence: true,
  movingGeofenceRadius: 100,
  syncGeofences: true,
  useVisits: true,
  useSignificantLocationChanges: true,
  beacons: false,
  sync: "all",
};

export const presetResponsiveAndroid: RadarTrackingOptions = {
  desiredStoppedUpdateInterval: 0,
  fastestStoppedUpdateInterval: 0,
  desiredMovingUpdateInterval: 150,
  fastestMovingUpdateInterval: 30,
  desiredSyncInterval: 20,
  desiredAccuracy: "medium",
  stopDuration: 140,
  stopDistance: 70,
  replay: "stops",
  sync: "all",
  useStoppedGeofence: true,
  stoppedGeofenceRadius: 100,
  useMovingGeofence: true,
  movingGeofenceRadius: 100,
  syncGeofences: true,
  syncGeofencesLimit: 10,
  foregroundServiceEnabled: false,
  beacons: false,
  startTrackingAfter: undefined,
  stopTrackingAfter: undefined,
};

export const presetResponsive: RadarTrackingOptions =
  platform === "ios" ? presetResponsiveIOS : presetResponsiveAndroid;

export const presetEfficientIOS: RadarTrackingOptions = {
  desiredStoppedUpdateInterval: 0,
  desiredMovingUpdateInterval: 0,
  desiredSyncInterval: 0,
  desiredAccuracy: "medium",
  stopDuration: 0,
  stopDistance: 0,
  replay: "stops",
  useStoppedGeofence: false,
  showBlueBar: false,
  startTrackingAfter: undefined,
  stopTrackingAfter: undefined,
  stoppedGeofenceRadius: 0,
  useMovingGeofence: false,
  movingGeofenceRadius: 0,
  syncGeofences: true,
  useVisits: true,
  useSignificantLocationChanges: false,
  beacons: false,
  sync: "all",
};

export const presetEfficientAndroid: RadarTrackingOptions = {
  desiredStoppedUpdateInterval: 3600,
  fastestStoppedUpdateInterval: 1200,
  desiredMovingUpdateInterval: 1200,
  fastestMovingUpdateInterval: 360,
  desiredSyncInterval: 140,
  desiredAccuracy: "medium",
  stopDuration: 140,
  stopDistance: 70,
  replay: "stops",
  sync: "all",
  useStoppedGeofence: false,
  stoppedGeofenceRadius: 0,
  useMovingGeofence: false,
  movingGeofenceRadius: 0,
  syncGeofences: true,
  syncGeofencesLimit: 10,
  foregroundServiceEnabled: false,
  beacons: false,
  startTrackingAfter: undefined,
  stopTrackingAfter: undefined,
};

export const presetEfficient: RadarTrackingOptions =
  platform === "ios" ? presetEfficientIOS : presetEfficientAndroid;

export interface RadarMockTrackingOptions {
  origin: Location;
  destination: Location;
  mode: RadarRouteMode;
  steps: number;
  interval: number;
}

export interface RadarVerifiedTrackingOptions {
  interval?: number;
  beacons?: boolean;
}

export interface RadarVerifiedLocationToken {
  user: RadarUser;
  events: RadarEvent[];
  token: string;
  expiresAt: Date;
  expiresIn: number;
  passed: boolean;
}

export interface RadarGetDistanceOptions {
  origin?: Location;
  destination?: Location;
  modes?: RadarRouteMode[];
  units?: "metric" | "imperial";
}

export interface RadarGetMatrixOptions {
  origins?: Location[];
  destinations?: Location[];
  mode?: RadarRouteMode;
  units?: "metric" | "imperial";
}

export interface RadarUpdateTripOptions {
  options: RadarTripOptions;
  status: RadarTripStatus;
}

export interface RadarStartTripOptions {
  tripOptions: RadarTripOptions;
  trackingOptions?: RadarTrackingOptions;
}

export interface RadarSearchGeofencesOptions {
  near?: Location;
  radius?: number;
  metadata?: RadarMetadata;
  tags?: string[];
  limit?: number;
  includeGeometry: boolean;
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

export interface RadarSearchPlacesOptions {
  near?: Location;
  radius?: number;
  chains?: string[];
  chainMetadata?: RadarMetadata;
  categories?: string[];
  groups?: string[];
  countryCodes?: string[];
  limit?: number;
}

export interface RadarAutocompleteOptions {
  query: string;
  near?: Location;
  layers?: string[];
  limit: number;
  country?: string;
  /** @deprecated this is always true, regardless of the value passed here */
  expandUnits?: boolean;
  mailable?: boolean;
}

export interface RadarGeocodeOptions {
  address: string;
  layers?: string[];
  countries?: string[];
}

export interface RadarReverseGeocodeOptions {
  location?: Location;
  layers?: string[];
}

export interface RadarNotificationOptions {
  iconString?: string;
  iconColor?: string;
  foregroundServiceIconString?: string;
  foregroundServiceIconColor?: string;
  eventIconString?: string;
  eventIconColor?: string;
}

export interface RadarLogConversionOptions {
  name: string;
  revenue?: number;
  metadata?: RadarMetadata;
}

export interface RadarTripOptions {
  externalId: string;
  metadata?: RadarMetadata;
  destinationGeofenceTag?: string;
  destinationGeofenceExternalId?: string;
  mode?: RadarRouteMode;
  scheduledArrivalAt?: number;
  approachingThreshold?: number;
  startTracking?: boolean; // defaults to true
}

export interface RadarTrackCallback {
  status: string;
  location?: Location;
  user?: RadarUser;
  events?: RadarEvent[];
}

export interface RadarLocationCallback {
  status: string;
  location?: Location;
  stopped: boolean;
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

export interface RadarAddressCallback {
  status: string;
  addresses?: RadarAddress[];
}

export interface RadarIPGeocodeCallback {
  status: string;
  address?: RadarAddress;
  proxy?: boolean;
}

export interface RadarValidateAddressCallback {
  status: string;
  address?: RadarAddress;
  verificationStatus?: RadarVerificationStatus;
}

export interface RadarIPGeocodeCallback {
  status: string;
  address?: RadarAddress;
  proxy?: boolean;
}

export interface RadarRouteCallback {
  status: string;
  routes?: RadarRoutes;
}

export interface RadarLogConversionCallback {
  status: string;
  event?: RadarEvent;
}

export interface RadarTrackVerifiedCallback {
  status: string;
  token?: RadarVerifiedLocationToken;
}

export interface RadarEventUpdate {
  user?: RadarUser;
  events: RadarEvent[];
}

export interface RadarEventUpdateCallback {
  (args: RadarEventUpdate): void;
}

export interface RadarLocationUpdate {
  location: Location;
  user: RadarUser;
}

export interface RadarLocationUpdateCallback {
  (args: RadarLocationUpdate): void;
}

export interface RadarClientLocationUpdate {
  location: Location;
  stopped: boolean;
  source: RadarLocationSource;
}

export interface RadarClientLocationUpdateCallback {
  (args: RadarClientLocationUpdate): void;
}

export interface RadarErrorCallback {
  (status: string): void;
}

export interface RadarLogUpdateCallback {
  (status: string): void;
}

export interface RadarTokenUpdateCallback {
  (token: Object): void;
}

export interface RadarInAppMessage {
  title: {
    text: string;
    color: string;
  };
  body: {
    text: string;
    color: string;
  };
  button?: {
    text: string;
    color: string;
    backgroundColor: string;
    deepLink?: string;
  };
  image?: {
    name: string;
    url: string;
  };
}

export interface RadarNewInAppMessageCallback {
  (inAppMessage: RadarInAppMessage): void;
}

export interface RadarInAppMessageDismissedCallback {
  (inAppMessage: RadarInAppMessage): void;
}

export interface RadarInAppMessageClickedCallback {
  (inAppMessage: RadarInAppMessage): void;
}

export type RadarListenerCallback =
  | RadarEventUpdateCallback
  | RadarLocationUpdateCallback
  | RadarClientLocationUpdateCallback
  | RadarErrorCallback
  | RadarLogUpdateCallback
  | RadarTokenUpdateCallback;

export type RadarPermissionsStatus =
  | "GRANTED_FOREGROUND"
  | "GRANTED_BACKGROUND"
  | "DENIED"
  | "NOT_DETERMINED"
  | "UNKNOWN";

export type RadarLocationSource =
  | "FOREGROUND_LOCATION"
  | "BACKGROUND_LOCATION"
  | "MANUAL_LOCATION"
  | "VISIT_ARRIVAL"
  | "VISIT_DEPARTURE"
  | "GEOFENCE_ENTER"
  | "GEOFENCE_DWELL"
  | "GEOFENCE_EXIT"
  | "MOCK_LOCATION"
  | "BEACON_ENTER"
  | "BEACON_EXIT"
  | "UNKNOWN";

export type RadarEventChannel =
  | "clientLocation"
  | "location"
  | "error"
  | "events"
  | "log"
  | "token";

export type RadarLogLevel = "info" | "debug" | "warning" | "error" | "none";

export interface RadarRouteMatrix {
  status: string;
  matrix?: RadarRoute[][];
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
  mocked?: boolean;
}

export interface RadarUser {
  _id: string;
  userId?: string;
  deviceId?: string;
  description?: string;
  metadata?: RadarMetadata;
  location?: RadarCoordinate;
  geofences?: RadarGeofence[];
  place?: RadarPlace;
  beacons?: RadarBeacon[];
  stopped?: boolean;
  foreground?: boolean;
  country?: RadarRegion;
  state?: RadarRegion;
  dma?: RadarRegion;
  postalCode?: RadarRegion;
  nearbyPlaceChains?: RadarChain[];
  segments?: RadarSegment[];
  topChains?: RadarChain[];
  source?: LocationSource;
  trip?: RadarTrip;
  debug?: boolean;
  fraud?: RadarFraud;
}

export interface RadarCoordinate {
  type: string;
  coordinates: [number, number];
}

export type LocationSource =
  | "FOREGROUND_LOCATION"
  | "BACKGROUND_LOCATION"
  | "MANUAL_LOCATION"
  | "VISIT_ARRIVAL"
  | "VISIT_DEPARTURE"
  | "GEOFENCE_ENTER"
  | "GEOFENCE_EXIT"
  | "MOCK_LOCATION"
  | "BEACON_ENTER"
  | "BEACON_EXIT"
  | "UNKNOWN";

export interface RadarTrip {
  _id: string;
  externalId: string;
  metadata?: RadarMetadata;
  destinationGeofenceTag?: string;
  destinationGeofenceExternalId?: string;
  mode?: RadarRouteMode;
  eta?: RadarTripEta;
  status: RadarTripStatus;
  scheduledArrivalAt?: Date;
  destinationLocation: Location;
  delay: RadarDelay;
}

export interface RadarDelay {
  delayed: boolean;
  scheduledArrivalTimeDelay: number;
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
  location?: RadarCoordinate;
  metadata?: RadarMetadata;
  replayed?: boolean;
  createdAt: string;
  actualCreatedAt: string;
  fraud?: RadarFraud;
}

export enum RadarEventConfidence {
  none = 0,
  low = 1,
  medium = 2,
  high = 3,
}

export type RadarEventType =
  | "unknown"
  | "user.entered_geofence"
  | "user.entered_beacon"
  | "user.dwelled_in_geofence"
  | "user.entered_place"
  | "user.entered_region_country"
  | "user.entered_region_dma"
  | "user.entered_region_state"
  | "user.entered_region_postal_code"
  | "user.exited_geofence"
  | "user.exited_beacon"
  | "user.exited_place"
  | "user.exited_region_country"
  | "user.exited_region_dma"
  | "user.exited_region_state"
  | "user.exited_region_postal_code"
  | "user.nearby_place_chain"
  | "user.started_trip"
  | "user.updated_trip"
  | "user.approaching_trip_destination"
  | "user.arrived_at_trip_destination"
  | "user.stopped_trip"
  | "user.arrived_at_wrong_trip_destination"
  | "user.delayed_during_trip"
  | "user.failed_fraud";

export type RadarTrackingOptionsDesiredAccuracy =
  | "high"
  | "medium"
  | "low"
  | "none";

export enum RadarEventVerification {
  accept = 1,
  unverify = 0,
  reject = -1,
}

export type RadarBeaconType = "eddystone" | "ibeacon";

export interface RadarGeofence {
  _id: string;
  description: string;
  tag?: string;
  externalId?: string;
  metadata?: RadarMetadata;
  type?: "Circle" | "Polygon";
  geometryRadius?: number;
  geometryCenter?: RadarCoordinate;
  // only available for geofences of type "Polygon"
  coordinates?: number[][];
  operatingHours?: RadarOperatingHours;
}

export interface RadarOperatingHours {
  [day: string]: string[][];
}

export interface RadarBeacon {
  _id: string;
  metadata?: RadarMetadata;
  type: RadarBeaconType;
  uuid?: string;
  instance?: string;
  major?: string;
  minor?: string;
  geometry?: RadarCoordinate;
  rss?: number;
}

export interface RadarPlace {
  _id: string;
  name: string;
  categories: string[];
  chain?: RadarChain;
  location: Location;
  metadata?: RadarMetadata;
  group?: string;
  address?: RadarAddress;
}

export interface RadarChain {
  name: string;
  slug: string;
  externalId?: string;
  metadata?: RadarMetadata;
}

export interface RadarRegion {
  _id: string;
  type: string;
  code: string;
  name: string;
  allowed?: boolean;
  flag?: string;
  passed?: boolean;
  inExclusionZone?: boolean;
  inBufferZone?: boolean;
  distanceToBorder?: number;
}

export interface RadarAddress {
  addressLabel?: string;
  borough?: string;
  categories?: string[];
  city?: string;
  confidence?: string;
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  county?: string;
  distance?: number;
  dma?: string;
  dmaCode?: string;
  formattedAddress?: string;
  latitude: number;
  layer?: string;
  longitude: number;
  metadata?: RadarMetadata;
  neighborhood?: string;
  number?: string;
  placeLabel?: string;
  plus4?: string;
  postalCode?: string;
  state?: string;
  stateCode?: string;
  street?: string;
  unit?: string;
  timeZone?: RadarTimeZone;
}

export interface RadarTimeZone {
  id: string;
  name: string;
  code: string;
  currentTime: string;
  utcOffset: number;
  dstOffset: number;
}

export type RadarVerificationStatus =
  | "verified"
  | "partially verified"
  | "ambiguous"
  | "unverified";

export interface RadarRoutes {
  geodesic?: RadarRouteDistance;
  foot?: RadarRoute;
  bike?: RadarRoute;
  car?: RadarRoute;
  truck?: RadarRoute;
  motorbike?: RadarRoute;
}

export interface RadarRouteGeometry {
  type: string;
  coordinates: number[][];
}

export interface RadarRoute {
  distance?: RadarRouteDistance;
  duration?: RadarRouteDuration;
  geometry?: RadarRouteGeometry;
}

export interface RadarRouteDistance {
  value: number;
  text: string;
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
  inaccurate: boolean;
  blocked: boolean;
  sharing: boolean;
}

export type RadarTrackingOptionsReplay = "all" | "stops" | "none";

export type RadarTrackingOptionsSync = "none" | "stopsAndExits" | "all";

export type RadarRouteMode = "foot" | "bike" | "car" | "truck" | "motorbike";

export interface RadarTrackingOptionsForegroundService {
  text?: string;
  title?: string;
  icon?: number;
  updatesOnly?: boolean;
  activity?: string;
  importance?: number;
  id?: number;
  channelName?: string;
  iconString?: string;
  iconColor?: string;
}

export type RadarTripStatus =
  | "unknown"
  | "started"
  | "approaching"
  | "arrived"
  | "expired"
  | "completed"
  | "canceled";
