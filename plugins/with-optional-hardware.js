// Android assumes an app needs any hardware its settings imply: a portrait screen (from the
// portrait lock), GPS (from asking for location) and a touchscreen. Google Play then hides the app
// from devices without them, such as tablets, Chromebooks and phones without GPS. None of these is
// essential here: the app opens in portrait where it can, location is only for the optional
// check-in at museums and fossil sites, and everything works with a mouse or keyboard. So they are
// all marked optional, and every device can install the app.
const { withAndroidManifest } = require('expo/config-plugins');

const OPTIONAL = [
  'android.hardware.screen.portrait',
  'android.hardware.screen.landscape',
  'android.hardware.location',
  'android.hardware.location.gps',
  'android.hardware.location.network',
  'android.hardware.touchscreen',
];

module.exports = function withOptionalHardware(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest['uses-feature'] = (manifest['uses-feature'] ?? []).filter((f) => !OPTIONAL.includes(f.$['android:name']));
    for (const name of OPTIONAL) manifest['uses-feature'].push({ $: { 'android:name': name, 'android:required': 'false' } });
    return cfg;
  });
};
