/* ----------------------------------------------------------------------------
   Hue patterns — the "Find your words in seconds" section. Mirrors the
   reference's row of mobile screens, but each phone shows a different class of
   interview question with the opener Hue would draft. These are static frames
   on purpose: the live streaming animation lives once, in HueShowcase. Here the
   only motion is a gentle scroll reveal (data-cell) from the parent effect.
---------------------------------------------------------------------------- */

type Pattern = { tag: string; q: string; a: string };

const PATTERNS: readonly Pattern[] = [
  {
    tag: "Behavioral",
    q: "Tell me about a time you failed.",
    a: "I shipped a feature that flopped. I owned it, read the data, and turned it into the redesign that doubled retention.",
  },
  {
    tag: "System design",
    q: "Design a URL shortener.",
    a: "Start from the read/write ratio, pick a hashing scheme, then put a cache in front of the datastore…",
  },
  {
    tag: "Compensation",
    q: "What are your salary expectations?",
    a: "Given the scope and the market for this role I'm targeting the upper band — happy to walk through the reasoning.",
  },
  {
    tag: "Culture fit",
    q: "Why this team?",
    a: "You ship calm, considered tools. That restraint is exactly the kind of work I do my best in.",
  },
] as const;

export default function HuePatterns() {
  return (
    <section className="hue-patterns" aria-label="The questions Hue is ready for">
      <div className="hue-patterns__inner">
        <header className="hue-patterns__head">
          <div className="hue-eyebrow">Every kind of question</div>
          <h2 data-split className="hue-patterns__title">
            Find your words in seconds.
          </h2>
          <p className="hue-patterns__lead">
            Behavioral, system design, salary, culture fit — Hue drafts a
            grounded opener for whatever the room throws, the moment it lands.
          </p>
        </header>

        <ul className="hue-patterns__grid">
          {PATTERNS.map((p) => (
            <li key={p.tag} data-cell className="hue-pat">
              <div className="hue-pat__phone">
                <div className="hue-pat__head">
                  <span className="hue-pat__live" />
                  {p.tag}
                </div>
                <div className="hue-pat__q">
                  <span className="hue-pat__q-tag">Interviewer</span>
                  <p className="hue-pat__q-line">{p.q}</p>
                </div>
                <div className="hue-pat__a">
                  <span className="hue-pat__a-tag">Hue · drafted</span>
                  <p className="hue-pat__a-line">{p.a}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
