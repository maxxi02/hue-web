/* ----------------------------------------------------------------------------
   Hue how-it-works — a factual setup walkthrough that replaces the old
   illustrative testimonials. Every step describes something the app actually
   does today (see hue-mobile): bring-your-own-key into the Android Keystore,
   optional on-device résumé parsing, the two real modes (companion / interviewer),
   and the live draft. Scroll reveal via data-cell from the parent GSAP effect.
---------------------------------------------------------------------------- */

type Step = { n: string; title: string; desc: string };

const STEPS: readonly Step[] = [
  {
    n: "01",
    title: "Add your own key",
    desc: "Drop in a provider key — Anthropic, Gemini, Groq, Mistral, or Cohere. It's saved in the Android Keystore and calls go straight to the model. No account, no backend, no login.",
  },
  {
    n: "02",
    title: "Add your résumé",
    desc: "Optionally upload a PDF, DOCX, or TXT. Hue parses it on-device into a summary and grounds every answer in your real experience — never inventing employers, projects, or numbers.",
  },
  {
    n: "03",
    title: "Pick a mode",
    desc: "Companion drafts an answer to the interviewer's question as text only you read. Interviewer flips it around and runs a spoken mock interview, one question at a time.",
  },
  {
    n: "04",
    title: "Speak or type",
    desc: "Say or type the question and Hue streams your answer in real time — a few natural sentences you can start saying the moment the first one lands.",
  },
] as const;

export default function HueHowItWorks() {
  return (
    <section className="hue-how" aria-label="How Hue works">
      <div className="hue-how__inner">
        <header className="hue-how__head">
          <div className="hue-eyebrow">How it works</div>
          <h2 data-split className="hue-how__title">
            Your key, your résumé, your answer.
          </h2>
          <p className="hue-how__lead">
            No sign-up and no server in the middle. Four steps from install to a
            drafted answer.
          </p>
        </header>

        <ol className="hue-how__grid">
          {STEPS.map((s) => (
            <li key={s.n} data-cell className="hue-how__step">
              <span className="hue-how__n">{s.n}</span>
              <h3 className="hue-how__step-title">{s.title}</h3>
              <p className="hue-how__step-desc">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
