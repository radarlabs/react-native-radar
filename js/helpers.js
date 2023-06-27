import { NativeModules, Platform } from 'react-native';

if (!NativeModules.RNRadar && (Platform.OS === 'ios' || Platform.OS === 'android')) {
  throw new Error('NativeModules.RNRadar is undefined');
}

const getHost = () => (
  NativeModules.RNRadar.host()
);

// export const getHost = () => {
//   return new Promise((resolve, reject) => {
//     NativeModules.RNRadar.host(resolve, reject);
//   });
// };

// export const getPublishableKey = () => {
//   return new Promise((resolve, reject) => {
//     NativeModules.RNRadar.publishableKey(resolve, reject);
//   });
// };

const getPublishableKey = () => (
  NativeModules.RNRadar.publishableKey()
);

export { getHost, getPublishableKey };
