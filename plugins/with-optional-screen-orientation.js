// The app is laid out for portrait, but a portrait lock makes Android assume a portrait screen is
// required (android.hardware.screen.portrait), which Google Play treats as hiding the app from
// tablets, Chromebooks and other devices. This marks portrait (and landscape) as optional features,
// so every device can install the app; it still opens in portrait where the device allows.
const { withAndroidManifest } = require('expo/config-plugins');

const FEATURES = ['android.hardware.screen.portrait', 'android.hardware.screen.landscape'];

module.exports = function withOptionalScreenOrientation(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest['uses-feature'] = (manifest['uses-feature'] ?? []).filter((f) => !FEATURES.includes(f.$['android:name']));
    for (const name of FEATURES) manifest['uses-feature'].push({ $: { 'android:name': name, 'android:required': 'false' } });
    return cfg;
  });
};
