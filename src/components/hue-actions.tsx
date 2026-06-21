/* ----------------------------------------------------------------------------
   Hue actions — the "From their question to your answer" section. Mirrors the
   reference's three small "From inspiration to creation" cards (Copy to Figma /
   Save / Comment). Maps to the three promises that make Hue safe to lean on:
   your key, your résumé, your privacy. Scroll reveal via data-cell.
---------------------------------------------------------------------------- */

type Action = { n: string; title: string; desc: string };

const ACTIONS: readonly Action[] = [
  {
    n: "01",
    title: "Bring your own key",
    desc: "Your provider key is encrypted in the Android Keystore and never leaves your phone. Calls go straight to the model.",
  },
  {
    n: "02",
    title: "Grounded in your résumé",
    desc: "Every answer is drafted from your real, uploaded experience — actual projects, real numbers. Hue is built not to fabricate employers, projects, or metrics.",
  },
  {
    n: "03",
    title: "Text only, never spoken",
    desc: "In companion mode Hue's reply is shown as text for you to read — never read aloud — so it's never overheard on the call. No backend, no account, nothing logged.",
  },
] as const;

export default function HueActions() {
  return (
    <section className="hue-actions" aria-label="How Hue stays safe to lean on">
      <div className="hue-actions__inner">
        <header className="hue-actions__head">
          <div className="hue-eyebrow">From their question to your answer</div>
          <h2 data-split className="hue-actions__title">
            Confident, honest, and only yours.
          </h2>
        </header>

        <div className="hue-actions__grid">
          {ACTIONS.map((a) => (
            <article key={a.n} data-cell className="hue-action">
              <span className="hue-action__n">{a.n}</span>
              <h3 className="hue-action__title">{a.title}</h3>
              <p className="hue-action__desc">{a.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
