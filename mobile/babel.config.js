module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            // '@utils': './src',
            '@assets': './assets',
            '@navigation': './src/navigation',
            // '@services': './src/services',
            // '@hooks': './src/hooks',
            // '@schemas': './src/schemas',
          },
        },
      ],
    ],
  };
};