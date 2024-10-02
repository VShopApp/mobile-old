// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// See https://gist.github.com/parshap/e3063d9bf6058041b34b26b7166fd6bd
config.resolver.extraNodeModules = require("node-libs-react-native");

module.exports = config;
