module.exports = function (api) {
  api.cache(true);
  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
    'module:metro-react-native-babel-preset',
  ];
  return {
    presets,
  };
};
