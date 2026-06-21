# Publishing the Hue APK

The landing page download buttons serve the APK as a **GitHub Release asset**
(it is too large — ~96 MB — to keep in git or in this `/public` folder). The
buttons link to:

    https://github.com/maxxi02/hue-web/releases/latest/download/hue-latest.apk

GitHub serves that with `Content-Disposition: attachment`, so clicking the
button is a direct file download (no clone, no extract). `latest/download`
always resolves to the newest published release, so you never have to touch the
code for a routine version bump — just publish a new release with the same asset
name.

## To ship a build

1. Build a **signed release APK** (not an `.aab`) from `hue-mobile`:
   - EAS: `eas build --platform android --profile preview` (with `"buildType": "apk"`),
     then download the artifact.
   - or local: `cd android && ./gradlew assembleRelease` →
     `android/app/build/outputs/apk/release/app-release.apk`
2. Rename it to **`hue-latest.apk`**.
3. Publish a GitHub release with the APK attached. From this folder:

       gh release create vX.Y.Z ./hue-latest.apk --repo maxxi02/hue-web \
         --title "Hue vX.Y.Z" --notes "..."

   (Or upload to an existing release: `gh release upload vX.Y.Z ./hue-latest.apk`.)
4. Bump `APK_VERSION` (and `APK_SIZE` if it changed) in
   `src/components/hue-download.tsx` — this only drives the button label/metadata,
   not the download URL.

## Where the URL lives

The release asset URL is referenced in:
- `src/components/hue-download.tsx` (`APK_FILE`)
- `src/components/hue-landing.tsx` (final CTA button)

> Note: `hue-latest.apk` is intentionally gitignored. Do not commit it — keep the
> binary in GitHub Releases (or object storage) only.
