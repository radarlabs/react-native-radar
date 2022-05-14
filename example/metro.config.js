// https://github.com/facebook/react-native/issues/24065#issuecomment-537489786

const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = {
  resolver: {
    blocklist: exclusionList([
      /node_modules\/.*\/node_modules\/react-native\/.*/,
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
