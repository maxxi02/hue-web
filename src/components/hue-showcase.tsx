"use client";

import { useEffect, useState } from "react";

/* ----------------------------------------------------------------------------
   Hue showcase — the "see it live" section that sits directly under the hero.
   A single phone mockup mirrors the real companion flow (see hue-mobile
   app/index.tsx): the interviewer's question comes in (spoken or typed), then
   Hue streams the drafted answer into the conversation thread as text.

   The animation is a single self-contained state machine (no GSAP, no globals):
   listening → transcribing the question → drafting the answer → your turn,
   then it loops through a short script. Honors prefers-reduced-motion by
   rendering the final frame statically.
---------------------------------------------------------------------------- */

type Phase = "listening" | "transcribing" | "drafting" | "ready";

type Exchange = { q: string; a: string };

const SCRIPT: readonly Exchange[] = [
  {
    q: "Tell me about a time you handled conflicting priorities under a deadline.",
    a: "At Northwind I owned two launches due the same week. I scoped the real blocker, re-cut the timeline with my PM, and shipped both — one a day early.",
  },
  {
    q: "Why do you want this role?",
    a: "Your team ships calm, considered tools — that's exactly the work I do best. I want to bring that same restraint to a product people lean on daily.",
  },
  {
    q: "What would you say is your biggest weakness?",
    a: "I used to over-polish before sharing. Now I ship a rough cut early, gather feedback, and let the work get better in the open instead of in private.",
  },
] as const;

const STEPS: { id: Phase; label: string }[] = [
  { id: "listening", label: "Listening" },
  { id: "transcribing", label: "Transcribing" },
  { id: "drafting", label: "Drafting" },
  { id: "ready", label: "Your turn" },
];

/* timing knobs (ms) */
const T = {
  beforeListen: 650,
  questionWord: 55,
  afterQuestion: 480,
  answerWord: 70,
  hold: 2800,
};

export default function HueShowcase() {
  const [phase, setPhase] = useState<Phase>("listening");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Static, fully-resolved frame — no motion. Scheduled (not synchronous)
      // so it never cascades renders inside the effect body.
      wait(0).then(() => {
        if (cancelled) return;
        setPhase("ready");
        setQuestion(SCRIPT[0].q);
        setAnswer(SCRIPT[0].a);
      });
      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }

    const stream = async (
      text: string,
      apply: (next: string) => void,
      perWord: number
    ) => {
      const words = text.split(" ");
      let acc = "";
      for (let i = 0; i < words.length; i++) {
        if (cancelled) return;
        acc += (i === 0 ? "" : " ") + words[i];
        apply(acc);
        await wait(perWord);
      }
    };

    const run = async () => {
      let i = 0;
      while (!cancelled) {
        const { q, a } = SCRIPT[i % SCRIPT.length];

        setPhase("listening");
        setQuestion("");
        setAnswer("");
        await wait(T.beforeListen);
        if (cancelled) return;

        setPhase("transcribing");
        await stream(q, setQuestion, T.questionWord);
        await wait(T.afterQuestion);
        if (cancelled) return;

        setPhase("drafting");
        await stream(a, setAnswer, T.answerWord);
        if (cancelled) return;

        setPhase("ready");
        await wait(T.hold);
        i++;
      }
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const hearing = phase === "listening" || phase === "transcribing";
  const stateLabel =
    phase === "listening"
      ? "Listening"
      : phase === "transcribing"
        ? "Transcribing"
        : phase === "drafting"
          ? "Drafting"
          : "Ready";

  return (
    <section className="hue-show" aria-label="See Hue draft an answer in real time">
      <div className="hue-show__inner">
        <header className="hue-show__head">
          <div className="hue-eyebrow">Live preview</div>
          <h2 data-split className="hue-show__title">
            Their question to your answer, in real time.
          </h2>
          <p className="hue-show__lead">
            Speak or type the interviewer&rsquo;s question. Hue drafts your reply
            right on your phone, streaming in word by word — text only you read,
            grounded in your résumé.
          </p>
        </header>

        <div data-cell className="hue-show__stage">
          {/* Phone — the device is the whole app */}
          <div className="hue-show__phone">
            <div className="hue-show__phone-notch" aria-hidden="true" />

            <div className="hue-show__phone-bar">
              <span
                className={
                  "hue-show__live-dot" + (hearing ? " is-live" : "")
                }
                aria-hidden="true"
              />
              <span className="hue-show__phone-state">Hue · {stateLabel}</span>
            </div>

            <div className="hue-show__thread">
              {/* Interviewer's question (transcribed or typed) */}
              <div className="hue-show__turn hue-show__turn--them">
                <span className="hue-show__turn-tag">Interviewer</span>
                <p className="hue-show__turn-text">
                  {question || (
                    <span className="hue-show__turn-idle">
                      Waiting for the question…
                    </span>
                  )}
                  {phase === "transcribing" && (
                    <span className="hue-show__caret" aria-hidden="true" />
                  )}
                </p>
              </div>

              {/* Hue's drafted answer, streaming in */}
              {(phase === "drafting" || phase === "ready") && (
                <div
                  className={
                    "hue-show__turn hue-show__turn--hue" +
                    (phase === "drafting" ? " is-drafting" : "")
                  }
                >
                  <span className="hue-show__turn-tag hue-show__turn-tag--hue">
                    Hue · drafted from your résumé
                  </span>
                  <p className="hue-show__turn-text">
                    {answer}
                    {phase === "drafting" && (
                      <span className="hue-show__caret" aria-hidden="true" />
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="hue-show__composer" aria-hidden="true">
              Speak or type the question…
            </div>
          </div>
        </div>

        {/* Phase indicator */}
        <ol className="hue-show__steps" aria-hidden="true">
          {STEPS.map((s) => (
            <li
              key={s.id}
              className={
                "hue-show__step" + (phase === s.id ? " is-active" : "")
              }
            >
              <span className="hue-show__step-tick" />
              {s.label}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
