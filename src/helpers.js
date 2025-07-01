import Radar from './index.native';

const getHost = () => (
  Radar.getHost()
);

const getPublishableKey = () => (
  Radar.getPublishableKey()
);

export { getHost, getPublishableKey };
