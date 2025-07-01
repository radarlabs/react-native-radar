import { RadarNativeInterface } from "./@types/RadarNativeInterface";
import { Platform } from "react-native";

let nativeModule: RadarNativeInterface;

nativeModule =
  Platform.OS === "web"
    ? require("./index.web").default
    : require("./index.native").default;

export default nativeModule;

let RadarRNWeb = Platform.OS === "web" ? require("./index.web").default : {};

export { RadarRNWeb };

let Autocomplete =
  Platform.OS !== "web" ? require("./ui/autocomplete").default : {};
export { Autocomplete };

let Map = Platform.OS !== "web" ? require("./ui/map").default : {};
export { Map };

export * from "./@types/types";
export * from "./@types/RadarNativeInterface";
