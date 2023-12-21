import { Platform } from 'react-native';
import { IRadarNative } from './definitions';

type IRadar = Platform["OS"] extends 'web' ? any : IRadarNative;

let module: IRadar;
if (Platform.OS === 'web') {
  module = require('./index.web').default;
} else {
  module = require('./index.native').default;
}
export default module;

export { default as Autocomplete } from './ui/autocomplete';
export { default as Map } from './ui/map';
