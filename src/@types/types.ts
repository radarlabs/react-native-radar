export type RadarMetadata = Record<string, string | number | boolean>;

export interface RadarTrackOnceOptions {
  location?: Location;
  desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy;
  beacons?: boolean;
}

export interface RadarTrackingOptions {
  desiredStoppedUpdateInterval: number;
  fastestStoppedUpdateInterval?: number;
  desiredMovingUpdateInterval: number;
  fastestMovingUpdateInterval?: number;
  desiredSyncInterval: number;
  desiredAccuracy: String;
  stopDuration: number;
  stopDistance: number;
  sync: String;
  replay: String;
  useStoppedGeofence: boolean;
  showBlueBar?: boolean;
  foregroundServiceEnabled?: boolean;
  startTrackingAfter?: number | undefined;
  stopTrackingAfter?: number | undefined;
  syncLocations?: String;
  stoppedGeofenceRadius: number;
  useMovingGeofence: boolean;
  movingGeofenceRadius: number;
  syncGeofences: boolean;
  useVisits?: boolean;
  useSignificantLocationChanges?: boolean;
  beacons: boolean;
  syncGeofencesLimit?: number;
}

export interface RadarMockTrackingOptions {
  origin: Location;
  destination: Location;
  mode: RadarRouteMode;
  steps: number;
  interval: number;
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
  limit?: number;
}

export interface RadarAutocompleteOptions {
  query: string;
  near?: Location;
  layers?: string[];
  limit: number;
  country?: string;
  expandUnits?: boolean;
  mailable?: boolean;
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
  scheduledArrivalAt?: Date;
  approachingThreshold?: number;
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
  verificationStatus?: RadarAddressVerificationStatus;
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

export interface RadarTrackTokenCallback {
  status: string;
  token?: String;
}

export interface RadarEventUpdate {
  user: RadarUser;
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
  source: string;
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

export type RadarListenerCallback =
  | RadarEventUpdateCallback
  | RadarLocationUpdateCallback
  | RadarClientLocationUpdateCallback
  | RadarErrorCallback
  | RadarLogUpdateCallback;

export type RadarPermissionsStatus =
  | "GRANTED_FOREGROUND"
  | "GRANTED_FOREGROUND"
  | "DENIED"
  | "NOT_DETERMINED"
  | "UNKNOWN";

export type Event = "clientLocation" | "location" | "error" | "events" | "log";

export type RadarLogLevel = "info" | "debug" | "warning" | "error" | "none";

export type RadarHostRegion = "na" | "eu" | "global";

export interface RadarRouteMatrix {
  status: string;
  matrix?: object[];
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
  mode?: string;
  eta?: RadarTripEta;
  status: string;
  scheduledArrivalAt?: Date;
  destinationLocation: Location;
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
  | "user.stopped_trip";

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
  type?: string;
  geometryRadius?: number;
  geometryCenter?: RadarCoordinate;
  coordinates?: number[][];
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
  street?: string;
  unit?: string;
  distance?: number;
  confidence?: string;
  layer?: string;
  plus4?: string;
  dmaCode?: string;
  dma?: string;
  metadata?: RadarMetadata;
}

export interface RadarAddressVerificationStatus {
  status: string;
}

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
}

export type RadarTrackingOptionsReplay = "all" | "stops" | "none";

export type RadarTrackingOptionsSync = "none" | "stopsAndExits" | "all";

export type RadarRouteMode = "foot" | "bike" | "car";

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

export type RadarTripStatus =
  | "unknown"
  | "started"
  | "approaching"
  | "arrived"
  | "expired"
  | "completed"
  | "canceled";
