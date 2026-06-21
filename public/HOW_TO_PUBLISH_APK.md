# Publishing the Hue APK

The landing page download buttons serve the APK directly from this `/public`
folder. To ship a build:

1. Build a **signed release APK** (not an `.aab`) from `hue-mobile`:
   - EAS: `eas build --platform android --profile preview` (with `"buildType": "apk"`),
     then download the artifact.
   - or local: `cd android && ./gradlew assembleRelease` →
     `android/app/build/outputs/apk/release/app-release.apk`
2. Copy that file here and name it exactly **`hue-latest.apk`**.
3. Bump `APK_VERSION` (and `APK_SIZE` if it changed) in
   `src/components/hue-download.tsx`. The same version string drives the
   download button label.

The path `/hue-latest.apk` is referenced in:
- `src/components/hue-download.tsx` (`APK_FILE`)
- `src/components/hue-landing.tsx` (final CTA button)

> Note: APKs are large binaries — consider keeping `hue-latest.apk` out of git
> (add it to `.gitignore`) and uploading it as part of your deploy/CI step
> instead of committing it.
