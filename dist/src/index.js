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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = exports.Autocomplete = exports.RadarRNWeb = void 0;
//type RadarInterface = Platform["OS"] extends "web" ? RadarNativeInterface : any;
//type RadarInterface = RadarNativeInterface;
let module;
// if (Platform.OS === "web") {
//   module = require("./index.web").default;
// } else {
module = require("./index.native").default;
//}
exports.default = module;
var index_web_1 = require("./index.web");
Object.defineProperty(exports, "RadarRNWeb", { enumerable: true, get: function () { return __importDefault(index_web_1).default; } });
var autocomplete_1 = require("./ui/autocomplete");
Object.defineProperty(exports, "Autocomplete", { enumerable: true, get: function () { return __importDefault(autocomplete_1).default; } });
var map_1 = require("./ui/map");
Object.defineProperty(exports, "Map", { enumerable: true, get: function () { return __importDefault(map_1).default; } });
__exportStar(require("./@types/types"), exports);
__exportStar(require("./@types/RadarNativeInterface"), exports);
