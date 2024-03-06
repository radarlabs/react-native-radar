import { RadarNativeInterface } from "./@types/RadarNativeInterface";

let RadarModule: RadarNativeInterface;

RadarModule = require("./index.native").default;

export default RadarModule;

export { default as RadarRNWeb } from "./index.web";
export { default as Autocomplete } from "./ui/autocomplete";
export { default as Map } from "./ui/map";


export * from "./@types/types";
export * from "./@types/RadarNativeInterface";