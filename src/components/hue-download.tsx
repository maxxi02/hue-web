/* ----------------------------------------------------------------------------
   Hue download — the real "get it on your phone" section. Hue ships as a
   sideloaded Android APK (no Play Store), so this section does two jobs:

     1. A direct download button that serves the APK from /public.
     2. A step-by-step guide for sideloading it safely on Android, plus a short
        pointer into the first-run setup (which the How-it-works section details).

   To publish a build: drop the signed APK into hue-web/public as `hue-latest.apk`
   (or change APK_FILE below) and bump APK_VERSION. Scroll reveal comes from the
   parent GSAP effect via data-split / data-cell. Honors prefers-reduced-motion.
---------------------------------------------------------------------------- */

// The APK is served as a GitHub Release asset (kept out of git — too large).
// `releases/latest/download/...` always resolves to the newest published
// release, so a new version just needs a fresh release with the same asset
// name. GitHub serves it with Content-Disposition: attachment, so the button
// triggers a direct file download (no clone, no extract).
const APK_FILE =
  "https://github.com/maxxi02/hue-web/releases/latest/download/hue-latest.apk";
const APK_VERSION = "v1.1.0";
const APK_SIZE = "~100 MB";
const ANDROID_MIN = "Android 8.0+";

type Step = { n: string; title: string; desc: string };

const INSTALL_STEPS: readonly Step[] = [
  {
    n: "01",
    title: "Download the APK",
    desc: "Tap the download button above on your Android phone. The file (hue.apk) lands in your Downloads folder. Downloading on a desktop? Move the file to your phone first, or open this page on the phone itself.",
  },
  {
    n: "02",
    title: "Allow this install",
    desc: "Open the file. Android will ask to allow installs from this source the first time — tap Settings, enable “Allow from this source”, then go back. This is the normal sideload prompt for any app outside the Play Store.",
  },
  {
    n: "03",
    title: "Install & open",
    desc: "Tap Install, wait a few seconds, then Open. If Play Protect shows a notice for an unknown developer, choose “Install anyway” — it appears because Hue isn't distributed through the store, not because anything is wrong.",
  },
  {
    n: "04",
    title: "Set up & go",
    desc: "On first launch, add your own provider key and (optionally) your résumé, then pick a mode. The full walkthrough is in How it works above — you're answering questions in under a minute.",
  },
] as const;

export default function HueDownload() {
  return (
    <section id="get" className="hue-dl" aria-label="Download Hue">
      <div className="hue-dl__inner">
        <header className="hue-dl__head">
          <div className="hue-eyebrow">Download · Android</div>
          <h2 data-split className="hue-dl__title">
            Get Hue on your phone.
          </h2>
          <p className="hue-dl__lead">
            Hue installs straight from a download — no Play Store, no account.
            Grab the APK, follow the four steps, and you&rsquo;re set.
          </p>
        </header>

        {/* download card */}
        <div data-cell className="hue-dl__card">
          <div className="hue-dl__card-main">
            <a
              href={APK_FILE}
              download
              data-magnetic
              className="hue-btn hue-btn--xl hue-dl__btn"
            >
              Download Hue {APK_VERSION}
              <span aria-hidden="true" style={{ fontSize: 17 }}>
                ↓
              </span>
            </a>
          </div>
          <dl className="hue-dl__meta">
            <div className="hue-dl__meta-item">
              <dt>Version</dt>
              <dd>{APK_VERSION}</dd>
            </div>
            <div className="hue-dl__meta-item">
              <dt>Size</dt>
              <dd>{APK_SIZE}</dd>
            </div>
            <div className="hue-dl__meta-item">
              <dt>Requires</dt>
              <dd>{ANDROID_MIN}</dd>
            </div>
          </dl>
        </div>

        {/* step-by-step guide */}
        <ol className="hue-dl__steps">
          {INSTALL_STEPS.map((s) => (
            <li key={s.n} data-cell className="hue-dl__step">
              <span className="hue-dl__n">{s.n}</span>
              <h3 className="hue-dl__step-title">{s.title}</h3>
              <p className="hue-dl__step-desc">{s.desc}</p>
            </li>
          ))}
        </ol>

        <p className="hue-dl__fine">
          Only install APKs from sources you trust. Hue runs entirely on your
          device with your own key — no servers, no login.
        </p>
      </div>
    </section>
  );
}
