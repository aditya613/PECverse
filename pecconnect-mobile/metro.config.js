const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ignore build artifacts that cause ENOENT watcher crashes on Windows
config.resolver.blockList = [
  /android\/app\/build\/.*/,
  /node_modules\/lightningcss-darwin-x64\/.*/,
];

module.exports = config;
