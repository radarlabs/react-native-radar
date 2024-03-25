import { RadarNativeInterface } from "./@types/RadarNativeInterface";
import {Platform} from "react-native";

let module: RadarNativeInterface;

module = require("./index.native").default;

export default module;

let RadarRNWeb =  Platform.OS === 'web'?  require("./index.web").default: {};

export { RadarRNWeb };

export { default as Autocomplete } from "./ui/autocomplete";
export { default as Map } from "./ui/map";


export * from "./@types/types";
export * from "./@types/RadarNativeInterface";