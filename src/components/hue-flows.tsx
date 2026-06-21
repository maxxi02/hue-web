/* ----------------------------------------------------------------------------
   Hue flows — the two modes Hue actually runs (see hue-mobile HueMode):
   Companion drafts a text answer to the interviewer's question; Interviewer
   runs a spoken mock interview. Scroll reveal via data-cell.
---------------------------------------------------------------------------- */

type Flow = { tag: string; title: string; desc: string; glyph: string };

const FLOWS: readonly Flow[] = [
  {
    tag: "Companion",
    title: "Draft in the moment.",
    desc: "Speak or type the interviewer's question and Hue drafts your answer as text only you can read — first person, grounded in your résumé, never spoken aloud.",
    glyph: "◳",
  },
  {
    tag: "Interviewer",
    title: "Rehearse out loud.",
    desc: "Flip Hue around and it runs a mock interview, asking one question at a time aloud — device speech or Groq's expressive voice — so the real room feels like a rerun.",
    glyph: "◉",
  },
] as const;

export default function HueFlows() {
  return (
    <section className="hue-flows" aria-label="The two modes Hue runs">
      <div className="hue-flows__inner">
        <header className="hue-flows__head">
          <div className="hue-eyebrow">Two ways to use it</div>
          <h2 data-split className="hue-flows__title">
            One copilot, two modes.
          </h2>
        </header>

        <div className="hue-flows__grid">
          {FLOWS.map((f) => (
            <article key={f.tag} data-cell className="hue-flow">
              <div className="hue-flow__visual" aria-hidden="true">
                <span className="hue-flow__glyph">{f.glyph}</span>
              </div>
              <div className="hue-flow__body">
                <span className="hue-flow__tag">{f.tag}</span>
                <h3 className="hue-flow__title">{f.title}</h3>
                <p className="hue-flow__desc">{f.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
