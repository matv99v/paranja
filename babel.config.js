module.exports = function (api) {
  api.cache(true);

  const presets = ['@babel/preset-env'];
  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-transform-runtime', { regenerator: true }],
  ];

  return {
    presets,
    plugins,
  };
};
