"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = exports.Autocomplete = void 0;
const react_native_1 = require("react-native");
let module;
if (react_native_1.Platform.OS === 'web') {
    module = require('./index.web').default;
}
else {
    module = require('./index.native').default;
}
exports.default = module;
var autocomplete_1 = require("./ui/autocomplete");
Object.defineProperty(exports, "Autocomplete", { enumerable: true, get: function () { return __importDefault(autocomplete_1).default; } });
var map_1 = require("./ui/map");
Object.defineProperty(exports, "Map", { enumerable: true, get: function () { return __importDefault(map_1).default; } });
