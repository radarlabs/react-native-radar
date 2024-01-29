//import { Platform } from "react-native";
import { RadarNativeInterface } from "./@types/RadarNativeInterface";

//type RadarInterface = Platform["OS"] extends "web" ? RadarNativeInterface : any;
//type RadarInterface = RadarNativeInterface;

let module: RadarNativeInterface;
// if (Platform.OS === "web") {
//   module = require("./index.web").default;
// } else {
  module = require("./index.native").default;
//}
export default module;

export { default as RadarRNWeb } from "./index.web";
export { default as Autocomplete } from "./ui/autocomplete";
export { default as Map } from "./ui/map";


export * from "./@types/types";
export * from "./@types/RadarNativeInterface";