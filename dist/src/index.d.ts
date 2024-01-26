import { Platform } from "react-native";
import { RadarNativeInterface } from "./@types/RadarNativeInterface";
type RadarInterface = Platform["OS"] extends "web" ? any : RadarNativeInterface;
declare let module: RadarInterface;
export default module;
export { default as Autocomplete } from "./ui/autocomplete";
export { default as Map } from "./ui/map";
export * from "./@types/types";
export * from "./@types/RadarNativeInterface";
