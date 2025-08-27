import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";
import type { EventEmitter } from "react-native/Libraries/Types/CodegenTypes";

export type LocationEmitter = {
  location: Object;
  user: Object;
};

export type ClientLocationEmitter = {
  location: Object;
  stopped: boolean;
  source: string;
};

export type ErrorEmitter = {
  status: string;
};

export type LogEmitter = {
  message: string;
};

export type EventsEmitter = {
  events: Array<Object>;
  user: Object;
};

export type TokenEmitter = {
  token: Object;
};

export type NewInAppMessageEmitter = {
  inAppMessage: Object;
};

export type InAppMessageDismissedEmitter = {
  inAppMessage: Object;
};

export type InAppMessageClickedEmitter = {
  inAppMessage: Object;
};

export interface Spec extends TurboModule {
  initialize(publishableKey: string, fraud: boolean): void;
  requestPermissions(background: boolean): Promise<string>;
  getPermissionsStatus(): Promise<string>;
  trackOnce(trackOnceOptions: Object | null): Promise<Object>;
  setLogLevel(level: string): void;
  setUserId(userId: string): void;
  getUserId(): Promise<string>;
  setDescription(description: string): void;
  getDescription(): Promise<string>;
  setMetadata(metadata: Object): void;
  getMetadata(): Promise<Object>;
  setProduct(product: string): void;
  getProduct(): Promise<string>;
  setAnonymousTrackingEnabled(enabled: boolean): void;
  getLocation(desiredAccuracy: string | null): Promise<Object>;
  trackVerified(trackVerifiedOptions: Object | null): Promise<Object>;
  getVerifiedLocationToken(): Promise<Object>;
  clearVerifiedLocationToken(): void;
  startTrackingEfficient(): void;
  startTrackingResponsive(): void;
  startTrackingContinuous(): void;
  startTrackingCustom(options: Object): void;
  startTrackingVerified(options: Object | null): void;
  isTrackingVerified(): Promise<boolean>;
  mockTracking(options: Object): void;
  stopTracking(): void;
  stopTrackingVerified(): void;
  getTrackingOptions(): Promise<Object>;
  isUsingRemoteTrackingOptions(): Promise<boolean>;
  isTracking(): Promise<boolean>;
  setForegroundServiceOptions(options: Object): void;
  setNotificationOptions(options: Object): void;
  getTripOptions(): Promise<Object>;
  startTrip(options: Object): Promise<Object>;
  completeTrip(): Promise<Object>;
  cancelTrip(): Promise<Object>;
  updateTrip(options: Object): Promise<Object>;
  acceptEvent(eventId: string, verifiedPlaceId: string): void;
  rejectEvent(eventId: string): void;
  getContext(location: Object | null): Promise<Object>;
  searchPlaces(options: Object): Promise<Object>;
  searchGeofences(options: Object): Promise<Object>;
  autocomplete(options: Object): Promise<Object>;
  geocode(options: Object): Promise<Object>;
  reverseGeocode(options: Object | null): Promise<Object>;
  ipGeocode(): Promise<Object>;
  validateAddress(address: Object): Promise<Object>;
  getDistance(options: Object): Promise<Object>;
  getMatrix(options: Object): Promise<Object>;
  logConversion(options: Object): Promise<Object>;
  nativeSdkVersion(): Promise<string>;
  getHost(): Promise<string>;
  getPublishableKey(): Promise<string>;
  showInAppMessage(inAppMessage: Object): void;
  readonly locationEmitter: EventEmitter<LocationEmitter>;
  readonly clientLocationEmitter: EventEmitter<ClientLocationEmitter>;
  readonly errorEmitter: EventEmitter<ErrorEmitter>;
  readonly logEmitter: EventEmitter<LogEmitter>;
  readonly eventsEmitter: EventEmitter<EventsEmitter>;
  readonly tokenEmitter: EventEmitter<TokenEmitter>;
  readonly newInAppMessageEmitter: EventEmitter<NewInAppMessageEmitter>;
  readonly inAppMessageDismissedEmitter: EventEmitter<InAppMessageDismissedEmitter>;
  readonly inAppMessageClickedEmitter: EventEmitter<InAppMessageClickedEmitter>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("RNRadar");
