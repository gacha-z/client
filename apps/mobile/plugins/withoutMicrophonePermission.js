const { withInfoPlist } = require('expo/config-plugins');

// expo-camera always adds NSMicrophoneUsageDescription, but recording is always muted (no mic use).
const withoutMicrophonePermission = (config) =>
  withInfoPlist(config, (config) => {
    delete config.modResults.NSMicrophoneUsageDescription;
    return config;
  });

module.exports = withoutMicrophonePermission;
