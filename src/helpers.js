import { Platform } from 'react-native';

// For our simplified TurboModule implementation, we provide stub implementations
// of these helper functions since we're only implementing core functionality
const getHost = () => {
  console.warn('getHost() is not implemented in the simplified TurboModule version');
  return Promise.resolve('https://api.radar.io');
};

const getPublishableKey = () => {
  console.warn('getPublishableKey() is not implemented in the simplified TurboModule version');
  return Promise.resolve('');
};

export { getHost, getPublishableKey };