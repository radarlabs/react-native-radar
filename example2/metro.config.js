// Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');
// const path = require('path');
// const reactNativeSvgTransformer = require.resolve('react-native-svg-transformer');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// module.exports = config;


// new config copied from old project

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const watchFolders = [
    path.resolve(path.join(__dirname, '/node_modules'))
];

const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))];

config.transformer = {
    ...config.transformer,
    getTransformOptions: async () => ({
        transform: {
            experimentalImportSupport: true,
            inlineRequires: true,
        },
    }),
};

config.resolver = {
    ...config.resolver,
    // extraNodeModules,
    nodeModulesPaths,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...config.resolver.sourceExts, 'svg'],
};

config.watchFolders = watchFolders;

module.exports = config;
