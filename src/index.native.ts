import type { EventSubscription } from "react-native";
import type { RadarNativeInterface } from "./@types/RadarNativeInterface";
import type {
  RadarTrackCallback,
  RadarTrackOnceOptions,
  RadarLocationUpdateCallback,
  RadarPermissionsStatus,
  RadarClientLocationUpdateCallback,
  RadarLocationSource,
  RadarErrorCallback,
  RadarLogUpdateCallback,
  RadarTokenUpdateCallback,
  RadarEventUpdateCallback,
  RadarLogLevel,
  RadarMetadata,
  RadarLocationCallback,
  RadarTrackingOptionsDesiredAccuracy,
  RadarTrackVerifiedCallback,
  RadarTrackVerifiedOptions,
  RadarMockTrackingOptions,
  RadarTrackingOptions,
  RadarVerifiedTrackingOptions,
  RadarContextCallback,
  RadarNotificationOptions,
  RadarStartTripOptions,
  RadarTrackingOptionsForegroundService,
  RadarTripCallback,
  RadarTripOptions,
  RadarUpdateTripOptions,
  RadarAddress,
  RadarAddressCallback,
  RadarAutocompleteOptions,
  RadarGeocodeOptions,
  RadarGetDistanceOptions,
  RadarGetMatrixOptions,
  RadarIPGeocodeCallback,
  RadarLogConversionCallback,
  RadarLogConversionOptions,
  RadarReverseGeocodeOptions,
  RadarRouteCallback,
  RadarRouteMatrix,
  RadarSearchGeofencesCallback,
  RadarSearchGeofencesOptions,
  RadarSearchPlacesCallback,
  RadarSearchPlacesOptions,
  RadarValidateAddressCallback,
  RadarUser,
  Location,
  RadarEvent,
  RadarNewInAppMessageCallback,
  RadarInAppMessageDismissedCallback,
  RadarInAppMessageClickedCallback,
  RadarInAppMessage,
} from "./@types/types";
import { NativeEventEmitter, NativeModules } from "react-native";
import { VERSION } from "./version";
import NativeRadarMod, {
  ClientLocationEmitter,
  ErrorEmitter,
  EventsEmitter,
  LocationEmitter,
  LogEmitter,
  InAppMessageClickedEmitter,
  InAppMessageDismissedEmitter,
  NewInAppMessageEmitter,
  TokenEmitter,
} from "./NativeRadar";

const NativeRadar = NativeRadarMod;
// Comment above and uncomment below for QA logging
// const NativeRadar = new Proxy(NativeRadarMod, {
//   get: function (target, name, receiver) {
//     if (typeof target[name] == "function") {
//       return function () {
//         console.log("rn native:", name, "(", ...arguments, ")");
//         return target[name].apply(target, arguments);
//       };
//     } else {
//       return target[name];
//     }
//   },
// });

const compatEventEmitter =
  NativeRadar.locationEmitter == null
    ? new NativeEventEmitter(NativeModules.RNRadar)
    : null;

type Events =
  | "locationEmitter"
  | "clientLocationEmitter"
  | "errorEmitter"
  | "logEmitter"
  | "eventsEmitter"
  | "tokenEmitter"
  | "newInAppMessageEmitter"
  | "inAppMessageDismissedEmitter"
  | "inAppMessageClickedEmitter";

export function addListener<EventT extends Events>(
  event: EventT,
  handler: Parameters<(typeof NativeRadar)[EventT]>[0]
): EventSubscription {
  if (compatEventEmitter != null) {
    return compatEventEmitter.addListener(event, handler);
  }
  return NativeRadar[event](handler as any);
}

let locationUpdateSubscription: EventSubscription | null = null;
let clientLocationUpdateSubscription: EventSubscription | null = null;
let errorUpdateSubscription: EventSubscription | null = null;
let logUpdateSubscription: EventSubscription | null = null;
let eventsUpdateSubscription: EventSubscription | null = null;
let tokenUpdateSubscription: EventSubscription | null = null;
let newInAppMessageUpdateSubscription: EventSubscription | null = null;
let inAppMessageDismissedUpdateSubscription: EventSubscription | null = null;
let inAppMessageClickedUpdateSubscription: EventSubscription | null = null;

const Radar: RadarNativeInterface = {
  initialize: (publishableKey: string, fraud?: boolean) => {
    NativeRadar.initialize(publishableKey, !!fraud);
    Radar.onNewInAppMessage((inAppMessage) => {
      console.log("inAppMessage displayed from callback", inAppMessage);
      Radar.showInAppMessage(inAppMessage);
    });
    return;
  },

  trackOnce: async (options?: RadarTrackOnceOptions) => {
    return NativeRadar.trackOnce(
      options || null
    ) as Promise<RadarTrackCallback>;
  },

  onLocationUpdated: (callback: RadarLocationUpdateCallback | null) => {
    // Clear any existing subscription
    if (locationUpdateSubscription) {
      locationUpdateSubscription.remove();
    }

    if (!callback) {
      return;
    }

    locationUpdateSubscription = addListener(
      "locationEmitter",
      (event: LocationEmitter) => {
        try {
          const locationUpdate = {
            location: event.location as Location,
            user: event.user as RadarUser,
          };
          callback(locationUpdate);
        } catch (error) {
          console.error("[Radar] Error in location update callback:", error);
        }
      }
    );
  },

  onClientLocationUpdated: (
    callback: RadarClientLocationUpdateCallback | null
  ) => {
    if (clientLocationUpdateSubscription) {
      clientLocationUpdateSubscription.remove();
      clientLocationUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    clientLocationUpdateSubscription = addListener(
      "clientLocationEmitter",
      (event: ClientLocationEmitter) => {
        const clientLocationUpdate = {
          location: event.location as Location,
          stopped: event.stopped,
          source: event.source as RadarLocationSource,
        };
        callback(clientLocationUpdate);
      }
    );
  },

  onError: (callback: RadarErrorCallback | null) => {
    if (errorUpdateSubscription) {
      errorUpdateSubscription.remove();
      errorUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    errorUpdateSubscription = addListener(
      "errorEmitter",
      (event: ErrorEmitter) => {
        const errorUpdate = {
          status: event.status,
        };
        callback(errorUpdate.status);
      }
    );
  },

  onLog: (callback: RadarLogUpdateCallback | null) => {
    if (logUpdateSubscription) {
      logUpdateSubscription.remove();
      logUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    logUpdateSubscription = addListener("logEmitter", (event: LogEmitter) => {
      callback(event.message);
    });
  },

  onEventsReceived: (callback: RadarEventUpdateCallback | null) => {
    if (eventsUpdateSubscription) {
      eventsUpdateSubscription.remove();
      eventsUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    eventsUpdateSubscription = addListener(
      "eventsEmitter",
      (event: EventsEmitter) => {
        const eventUpdate = {
          user: event.user as RadarUser,
          events: event.events as RadarEvent[],
        };
        callback(eventUpdate);
      }
    );
  },

  onTokenUpdated: (callback: RadarTokenUpdateCallback | null) => {
    if (tokenUpdateSubscription) {
      tokenUpdateSubscription.remove();
      tokenUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    tokenUpdateSubscription = addListener(
      "tokenEmitter",
      (event: TokenEmitter) => {
        callback(event.token);
      }
    );
  },

  onNewInAppMessage: (callback: RadarNewInAppMessageCallback | null) => {
    if (newInAppMessageUpdateSubscription) {
      newInAppMessageUpdateSubscription.remove();
      newInAppMessageUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    newInAppMessageUpdateSubscription = addListener(
      "newInAppMessageEmitter",
      (event: NewInAppMessageEmitter) => {
        callback(event.inAppMessage as RadarInAppMessage);
      }
    );
  },

  onInAppMessageDismissed: (callback: RadarInAppMessageDismissedCallback | null) => {
    if (inAppMessageDismissedUpdateSubscription) {
      inAppMessageDismissedUpdateSubscription.remove();
      inAppMessageDismissedUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    inAppMessageDismissedUpdateSubscription = addListener(
      "inAppMessageDismissedEmitter",
      (event: InAppMessageDismissedEmitter) => {
        callback(event.inAppMessage as RadarInAppMessage);
      }
    );
  },

  onInAppMessageClicked: (callback: RadarInAppMessageClickedCallback | null) => {
    if (inAppMessageClickedUpdateSubscription) {
      inAppMessageClickedUpdateSubscription.remove();
      inAppMessageClickedUpdateSubscription = null;
    }

    if (!callback) {
      return;
    }

    inAppMessageClickedUpdateSubscription = addListener(
      "inAppMessageClickedEmitter",
      (event: InAppMessageClickedEmitter) => {
        callback(event.inAppMessage as RadarInAppMessage);
      }
    );
  },

  showInAppMessage: (inAppMessage: RadarInAppMessage) => {
    return NativeRadar.showInAppMessage(inAppMessage);
  },

  requestPermissions: (background: boolean) => {
    return NativeRadar.requestPermissions(
      background
    ) as Promise<RadarPermissionsStatus>;
  },
  setLogLevel: function (level: RadarLogLevel): void {
    return NativeRadar.setLogLevel(level);
  },
  setUserId: function (userId: string): void {
    return NativeRadar.setUserId(userId);
  },
  getUserId: function (): Promise<string> {
    return NativeRadar.getUserId();
  },
  setDescription: function (description: string): void {
    return NativeRadar.setDescription(description);
  },
  getDescription: function (): Promise<string> {
    return NativeRadar.getDescription();
  },
  setMetadata: function (metadata: RadarMetadata): void {
    return NativeRadar.setMetadata(metadata);
  },
  getMetadata: function (): Promise<RadarMetadata> {
    return NativeRadar.getMetadata() as Promise<RadarMetadata>;
  },
  setTags: function (tags: string[]): void {
    return NativeRadar.setTags(tags);
  },
  getTags: function (): Promise<string[]> {
    return NativeRadar.getTags() as Promise<string[]>;
  },
  addTags: function (tags: string[]): void {
    return NativeRadar.addTags(tags);
  },
  removeTags: function (tags: string[]): void {
    return NativeRadar.removeTags(tags);
  },
  setProduct: function (product: string): void {
    return NativeRadar.setProduct(product);
  },
  getProduct: function (): Promise<string> {
    return NativeRadar.getProduct();
  },
  setAnonymousTrackingEnabled: function (enabled: boolean): void {
    return NativeRadar.setAnonymousTrackingEnabled(enabled);
  },
  getPermissionsStatus: function (): Promise<RadarPermissionsStatus> {
    return NativeRadar.getPermissionsStatus() as Promise<RadarPermissionsStatus>;
  },
  getLocation: function (
    desiredAccuracy?: RadarTrackingOptionsDesiredAccuracy
  ): Promise<RadarLocationCallback> {
    return NativeRadar.getLocation(
      desiredAccuracy || null
    ) as Promise<RadarLocationCallback>;
  },
  trackVerified: function (
    options?: RadarTrackVerifiedOptions
  ): Promise<RadarTrackVerifiedCallback> {
    return NativeRadar.trackVerified(
      options || null
    ) as Promise<RadarTrackVerifiedCallback>;
  },
  getVerifiedLocationToken: function (): Promise<RadarTrackVerifiedCallback> {
    return NativeRadar.getVerifiedLocationToken() as Promise<RadarTrackVerifiedCallback>;
  },
  clearVerifiedLocationToken: function (): void {
    return NativeRadar.clearVerifiedLocationToken();
  },
  startTrackingEfficient: function (): void {
    return NativeRadar.startTrackingEfficient();
  },
  startTrackingResponsive: function (): void {
    return NativeRadar.startTrackingResponsive();
  },
  startTrackingContinuous: function (): void {
    return NativeRadar.startTrackingContinuous();
  },
  startTrackingCustom: function (options: RadarTrackingOptions): void {
    return NativeRadar.startTrackingCustom(options);
  },
  startTrackingVerified: function (
    options?: RadarVerifiedTrackingOptions
  ): void {
    return NativeRadar.startTrackingVerified(options || null);
  },
  isTrackingVerified: function (): Promise<boolean> {
    return NativeRadar.isTrackingVerified();
  },
  mockTracking: function (options: RadarMockTrackingOptions): void {
    return NativeRadar.mockTracking(options);
  },
  stopTracking: function (): void {
    return NativeRadar.stopTracking();
  },
  stopTrackingVerified: function (): void {
    return NativeRadar.stopTrackingVerified();
  },
  getTrackingOptions: function (): Promise<RadarTrackingOptions> {
    return NativeRadar.getTrackingOptions() as Promise<RadarTrackingOptions>;
  },
  isUsingRemoteTrackingOptions: function (): Promise<boolean> {
    return NativeRadar.isUsingRemoteTrackingOptions();
  },
  isTracking: function (): Promise<boolean> {
    return NativeRadar.isTracking();
  },
  setForegroundServiceOptions: function (
    options: RadarTrackingOptionsForegroundService
  ): void {
    return NativeRadar.setForegroundServiceOptions(options);
  },
  setNotificationOptions: function (options: RadarNotificationOptions): void {
    return NativeRadar.setNotificationOptions(options);
  },
  getTripOptions: function (): Promise<RadarTripOptions> {
    return NativeRadar.getTripOptions() as Promise<RadarTripOptions>;
  },
  startTrip: function (
    options: RadarStartTripOptions
  ): Promise<RadarTripCallback> {
    return NativeRadar.startTrip(options) as Promise<RadarTripCallback>;
  },
  completeTrip: function (): Promise<RadarTripCallback> {
    return NativeRadar.completeTrip() as Promise<RadarTripCallback>;
  },
  cancelTrip: function (): Promise<RadarTripCallback> {
    return NativeRadar.cancelTrip() as Promise<RadarTripCallback>;
  },
  updateTrip: function (
    options: RadarUpdateTripOptions
  ): Promise<RadarTripCallback> {
    return NativeRadar.updateTrip(options) as Promise<RadarTripCallback>;
  },
  acceptEvent: function (eventId: string, verifiedPlaceId: string): void {
    return NativeRadar.acceptEvent(eventId, verifiedPlaceId);
  },
  rejectEvent: function (eventId: string): void {
    return NativeRadar.rejectEvent(eventId);
  },
  getContext: function (location?: Location): Promise<RadarContextCallback> {
    return NativeRadar.getContext(
      location || null
    ) as Promise<RadarContextCallback>;
  },
  searchPlaces: function (
    options: RadarSearchPlacesOptions
  ): Promise<RadarSearchPlacesCallback> {
    return NativeRadar.searchPlaces(
      options
    ) as Promise<RadarSearchPlacesCallback>;
  },
  searchGeofences: function (
    options: RadarSearchGeofencesOptions
  ): Promise<RadarSearchGeofencesCallback> {
    return NativeRadar.searchGeofences(
      options
    ) as Promise<RadarSearchGeofencesCallback>;
  },
  autocomplete: function (
    options: RadarAutocompleteOptions
  ): Promise<RadarAddressCallback> {
    return NativeRadar.autocomplete(options) as Promise<RadarAddressCallback>;
  },
  geocode: function (
    options: RadarGeocodeOptions
  ): Promise<RadarAddressCallback> {
    return NativeRadar.geocode(options) as Promise<RadarAddressCallback>;
  },
  reverseGeocode: function (
    options?: RadarReverseGeocodeOptions
  ): Promise<RadarAddressCallback> {
    return NativeRadar.reverseGeocode(
      options || null
    ) as Promise<RadarAddressCallback>;
  },
  ipGeocode: function (): Promise<RadarIPGeocodeCallback> {
    return NativeRadar.ipGeocode() as Promise<RadarIPGeocodeCallback>;
  },
  validateAddress: function (
    address: RadarAddress
  ): Promise<RadarValidateAddressCallback> {
    return NativeRadar.validateAddress(
      address
    ) as Promise<RadarValidateAddressCallback>;
  },
  getDistance: function (
    option: RadarGetDistanceOptions
  ): Promise<RadarRouteCallback> {
    return NativeRadar.getDistance(option) as Promise<RadarRouteCallback>;
  },
  getMatrix: function (
    option: RadarGetMatrixOptions
  ): Promise<RadarRouteMatrix> {
    return NativeRadar.getMatrix(option) as Promise<RadarRouteMatrix>;
  },
  logConversion: function (
    options: RadarLogConversionOptions
  ): Promise<RadarLogConversionCallback> {
    return NativeRadar.logConversion(
      options
    ) as Promise<RadarLogConversionCallback>;
  },

  nativeSdkVersion: function (): Promise<string> {
    return NativeRadar.nativeSdkVersion();
  },
  rnSdkVersion: function (): string {
    return VERSION;
  },
  getHost: function (): Promise<string> {
    return NativeRadar.getHost();
  },
  getPublishableKey: function (): Promise<string> {
    return NativeRadar.getPublishableKey();
  },
};

export default Radar;
