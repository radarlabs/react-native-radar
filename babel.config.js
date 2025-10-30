module.exports = function (api) {
  api.cache(true);
  const presets = [
    '@react-native/babel-preset',
    '@babel/preset-typescript',
  ];
  return {
    presets,
    plugins: [
      ["@babel/plugin-transform-class-properties", { "loose": true }],
      ["@babel/plugin-transform-private-methods", { "loose": true }],
      ["@babel/plugin-transform-private-property-in-object", { "loose": true }]
    ]
  };
};
