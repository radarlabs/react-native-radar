import { Platform } from 'react-native';
import { IRadarNative } from './definitions';
type IRadar = Platform["OS"] extends 'web' ? any : IRadarNative;
declare let module: IRadar;
export default module;
export { default as Autocomplete } from './ui/autocomplete';
export { default as Map } from './ui/map';
