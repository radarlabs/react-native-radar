"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishableKey = exports.getHost = void 0;
const react_native_1 = require("react-native");
if (!react_native_1.NativeModules.RNRadar && (react_native_1.Platform.OS === 'ios' || react_native_1.Platform.OS === 'android')) {
    throw new Error('NativeModules.RNRadar is undefined');
}
const getHost = () => (react_native_1.NativeModules.RNRadar.getHost());
exports.getHost = getHost;
const getPublishableKey = () => (react_native_1.NativeModules.RNRadar.getPublishableKey());
exports.getPublishableKey = getPublishableKey;
