/* ----------------------------------------------------------------------------
   Hue stats — the credibility band. Every number here is verifiable from the
   app itself (see hue-mobile): the count of LLM providers you can bring a key
   for, the two modes Hue runs, and the number of servers your words touch (zero,
   because there's no backend). Purely presentational — the scroll reveal comes
   from the parent GSAP effect via data-split/data-cell.
---------------------------------------------------------------------------- */

const STATS = [
  { value: "5", label: "LLM providers — bring your own key" },
  { value: "2", label: "modes: draft answers, or practice aloud" },
  { value: "0", label: "servers your words ever touch" },
] as const;

export default function HueStats() {
  return (
    <section className="hue-stats" aria-label="What Hue is built for">
      <div className="hue-stats__inner">
        <div className="hue-eyebrow hue-stats__eyebrow">Built for the moment</div>
        <h2
          data-split
          className="hue-stats__lead"
          dangerouslySetInnerHTML={{
            __html:
              'A copilot tuned for the <span class="accent">few seconds</span> that decide an interview.',
          }}
        />
        <dl className="hue-stats__grid">
          {STATS.map((s) => (
            <div key={s.label} data-cell className="hue-stats__item">
              <dt className="hue-stats__value">{s.value}</dt>
              <dd className="hue-stats__label">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
