const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */


config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'lottie'
);

/* const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, "lottie"],
  },
};
 */
module.exports = config