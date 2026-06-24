import Radar from './index.native';

const getHost = () => (
  Radar.getHost()
);

const getPublishableKey = () => (
  Radar.getPublishableKey()
);

const getMobileOrigin = () => (
  Radar.getMobileOrigin()
);

export { getHost, getPublishableKey, getMobileOrigin };
