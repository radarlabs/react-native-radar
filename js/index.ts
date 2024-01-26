import { Platform } from 'react-native';

let module = {};
if (Platform.OS === 'web') {
  module = require('./index.web').default;
} else {
  module = require('./index.native').default;
}
export default module;

export { default as Autocomplete } from './ui/autocomplete';
export { default as Map } from './ui/map';
