import type { ActionButtonStyle } from "./components/ActionButton";
import type { Actions } from "./actions";

export type PanelAction = {
  title: string;
  action: keyof Actions;
  variant?: ActionButtonStyle;
};

export type Panel = {
  title: string;
  initiallyExpanded?: boolean;
  // Search panel also renders the <Autocomplete> component.
  showAutocomplete?: boolean;
  actions: PanelAction[];
};

// Panel names follow the native example apps. Button titles are referenced by PR test plans; keep them stable.
export const PANELS: Panel[] = [
  {
    title: "Tracking",
    initiallyExpanded: true,
    actions: [
      { title: "getLocation", action: "getLocation" },
      { title: "trackOnce", action: "trackOnce" },
      { title: "trackOnce manual", action: "trackOnceManual", variant: "secondary" },
      { title: "trackOnce manual with beacons", action: "trackOnceManualWithBeacons", variant: "secondary" },
      { title: "startTrackingEfficient", action: "startTrackingEfficient" },
      { title: "startTrackingResponsive", action: "startTrackingResponsive" },
      { title: "startTrackingContinuous", action: "startTrackingContinuous" },
      { title: "startTrackingCustom", action: "startTrackingCustom" },
      { title: "mockTracking", action: "mockTracking", variant: "secondary" },
      { title: "stopTracking", action: "stopTracking", variant: "destructive" },
      { title: "isTracking", action: "isTracking", variant: "secondary" },
      { title: "getTrackingOptions", action: "getTrackingOptions", variant: "secondary" },
      { title: "isUsingRemoteTrackingOptions", action: "isUsingRemoteTrackingOptions", variant: "secondary" },
      { title: "getContext", action: "getContext", variant: "secondary" },
      { title: "setForegroundServiceOptions", action: "setForegroundServiceOptions", variant: "secondary" },
      { title: "setNotificationOptions", action: "setNotificationOptions", variant: "secondary" },
      { title: "runAll", action: "runAll", variant: "secondary" },
    ],
  },
  {
    title: "Permissions",
    actions: [
      { title: "getPermissionsStatus", action: "getPermissionsStatus", variant: "secondary" },
      { title: "requestPermissionsForeground", action: "requestPermissionsForeground" },
      { title: "requestPermissionsBackground", action: "requestPermissionsBackground" },
      { title: "requestBluetoothPermissions", action: "requestBluetoothPermissions" },
    ],
  },
  {
    title: "Trips",
    actions: [
      { title: "getTripOptions", action: "getTripOptions", variant: "secondary" },
      { title: "startTrip", action: "startTrip" },
      { title: "startTrip with tracking options", action: "startTripWithTrackingOptions" },
      { title: "updateTrip", action: "updateTrip", variant: "secondary" },
      { title: "completeTrip", action: "completeTrip" },
      { title: "cancelTrip", action: "cancelTrip", variant: "destructive" },
      { title: "acceptEvent", action: "acceptEvent", variant: "secondary" },
      { title: "rejectEvent", action: "rejectEvent", variant: "secondary" },
    ],
  },
  {
    title: "Verified",
    actions: [
      { title: "trackVerified", action: "trackVerified" },
      { title: "getVerifiedLocationToken", action: "getVerifiedLocationToken", variant: "secondary" },
      { title: "clearVerifiedLocationToken", action: "clearVerifiedLocationToken", variant: "destructive" },
      { title: "startTrackingVerified", action: "startTrackingVerified" },
      { title: "isTrackingVerified", action: "isTrackingVerified", variant: "secondary" },
      { title: "stopTrackingVerified", action: "stopTrackingVerified", variant: "destructive" },
      { title: "revealRisk", action: "revealRisk" },
      { title: "setExpectedAddress", action: "setExpectedAddress" },
      { title: "clearExpectedAddress", action: "clearExpectedAddress", variant: "destructive" },
      { title: "trackVerifiedExpectedAddress", action: "trackVerifiedExpectedAddress" },
      { title: "startRangingBeacons", action: "startRangingBeacons" },
      { title: "stopRangingBeacons", action: "stopRangingBeacons", variant: "destructive" },
      { title: "isSharing", action: "isSharing", variant: "secondary" },
      { title: "clearSharing", action: "clearSharing", variant: "destructive" },
    ],
  },
  {
    title: "Insights & Events",
    actions: [
      { title: "trackOnceLocationInsights", action: "trackOnceLocationInsights" },
      { title: "listenForEventTypes", action: "listenForEventTypes", variant: "secondary" },
    ],
  },
  {
    title: "Search & Geocoding",
    showAutocomplete: true,
    actions: [
      { title: "searchPlaces", action: "searchPlaces" },
      { title: "searchGeofences", action: "searchGeofences" },
      { title: "autocomplete", action: "autocomplete" },
      { title: "geocode", action: "geocode" },
      { title: "reverseGeocode", action: "reverseGeocode" },
      { title: "ipGeocode", action: "ipGeocode" },
      { title: "validateAddress", action: "validateAddress" },
    ],
  },
  {
    title: "Routing & Distance",
    actions: [
      { title: "getDistance", action: "getDistance" },
      { title: "getMatrix", action: "getMatrix" },
    ],
  },
  {
    title: "Conversions",
    actions: [
      { title: "logConversion", action: "logConversion" },
      { title: "logConversion with revenue", action: "logConversionWithRevenue" },
    ],
  },
  {
    title: "User & SDK",
    actions: [
      { title: "getUserId", action: "getUserId", variant: "secondary" },
      { title: "getDescription", action: "getDescription", variant: "secondary" },
      { title: "getMetadata", action: "getMetadata", variant: "secondary" },
      { title: "getProduct", action: "getProduct", variant: "secondary" },
      { title: "setTags", action: "setTags" },
      { title: "getTags", action: "getTags", variant: "secondary" },
      { title: "addTags", action: "addTags" },
      { title: "removeTags", action: "removeTags", variant: "destructive" },
      { title: "setUserLanguage (es-PR)", action: "setUserLanguage" },
      { title: "getUserLanguage", action: "getUserLanguage", variant: "secondary" },
      { title: "clearUserLanguage", action: "clearUserLanguage", variant: "destructive" },
      { title: "nativeSdkVersion", action: "nativeSdkVersion", variant: "secondary" },
      { title: "rnSdkVersion", action: "rnSdkVersion", variant: "secondary" },
      { title: "getHost", action: "getHost", variant: "secondary" },
      { title: "getPublishableKey", action: "getPublishableKey", variant: "secondary" },
    ],
  },
];
