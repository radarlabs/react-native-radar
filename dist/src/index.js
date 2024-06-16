"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = exports.Autocomplete = exports.RadarRNWeb = void 0;
const react_native_1 = require("react-native");
let module;
module = require("./index.native").default;
exports.default = module;
let RadarRNWeb = react_native_1.Platform.OS === "web" ? require("./index.web").default : {};
exports.RadarRNWeb = RadarRNWeb;
let Autocomplete = react_native_1.Platform.OS !== "web" ? require("./ui/autocomplete").default : {};
exports.Autocomplete = Autocomplete;
let Map = react_native_1.Platform.OS !== "web" ? require("./ui/map").default : {};
exports.Map = Map;
__exportStar(require("./@types/types"), exports);
__exportStar(require("./@types/RadarNativeInterface"), exports);
