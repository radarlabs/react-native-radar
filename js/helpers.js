import { NativeModules, Platform } from 'react-native';

if (!NativeModules.RNRadar && (Platform.OS === 'ios' || Platform.OS === 'android')) {
  throw new Error('NativeModules.RNRadar is undefined');
}

const getHost = () => (
  NativeModules.RNRadar.host()
);

const getPublishableKey = () => (
  NativeModules.RNRadar.publishableKey()
);

export { getHost, getPublishableKey };
