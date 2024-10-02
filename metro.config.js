/* eslint-disable */

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Needed for https-browsify
config.resolver.extraNodeModules = {
  http: require.resolve("@tradle/react-native-http"),
  url: require.resolve("url"),
  stream: require.resolve("stream-browserify"),
  util: require.resolve("util"),
  events: require.resolve("events"),
};

module.exports = config;
