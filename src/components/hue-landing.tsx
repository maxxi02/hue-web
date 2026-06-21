"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import HueShowcase from "./hue-showcase";
import HueStats from "./hue-stats";
import HuePatterns from "./hue-patterns";
import HueFlows from "./hue-flows";
import HueActions from "./hue-actions";
import HueHowItWorks from "./hue-howitworks";
import HueDownload from "./hue-download";
import HueLogo from "./hue-logo";

/* ----------------------------------------------------------------------------
   Hue landing page. The orchestrator owns the warm-stone shell (nav, hero,
   smooth scroll) and the shared reveal system; each content
   section below the hero is its own presentational component that opts into
   that system through data-attributes:

     [data-split]    heading split into words, staggered reveal on scroll
     [data-cell]     fade-up on scroll
     [data-parallax] subtle scroll parallax
     [data-magnetic] cursor-following button

   Section order follows the reference layout: hero → live showcase → stats →
   question patterns → flows → privacy actions → how it works → CTA + footer.
   Honors prefers-reduced-motion throughout.
---------------------------------------------------------------------------- */

const PROVIDERS = [
  "Anthropic",
  "Groq",
  "Deepgram",
  "AssemblyAI",
  "Google",
  "Mistral",
  "Cohere",
];

function MarqueeGroup({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="hue-marquee__group" aria-hidden={ariaHidden || undefined}>
      {PROVIDERS.map((name) => (
        <span key={name} style={{ display: "contents" }}>
          <span className="hue-marquee__item">{name}</span>
          <span className="hue-marquee__sep">◆</span>
        </span>
      ))}
    </div>
  );
}

export default function HueLanding() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const state = {
      dead: false,
      reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };

    const rafIds: number[] = [];
    const cleanups: Array<() => void> = [];

    /* ---------- theme toggle ---------- */
    const htmlEl = document.documentElement;
    const toggleBtn = root.querySelector<HTMLButtonElement>("#themeToggle");
    const icon = root.querySelector<HTMLElement>("#themeIcon");
    const syncIcon = () => {
      if (icon) icon.textContent = htmlEl.classList.contains("dark") ? "☾" : "☀";
    };
    syncIcon();
    const onToggle = () => {
      htmlEl.classList.toggle("dark");
      syncIcon();
    };
    if (toggleBtn) {
      toggleBtn.addEventListener("click", onToggle);
      cleanups.push(() => toggleBtn.removeEventListener("click", onToggle));
    }

    /* ---------- GSAP / Lenis ---------- */
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    if (!state.reduce) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const lenisRaf = (time: number) => {
        if (state.dead) return;
        lenis?.raf(time);
        rafIds.push(requestAnimationFrame(lenisRaf));
      };
      rafIds.push(requestAnimationFrame(lenisRaf));
    }

    // split headings into word/letter spans (operates on opaque innerHTML nodes)
    const splitWords = (el: Element) => {
      const walk = (node: Node) => {
        Array.from(node.childNodes).forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            (n.textContent || "").split(/(\s+)/).forEach((tok) => {
              if (tok.trim() === "") {
                frag.appendChild(document.createTextNode(tok));
                return;
              }
              const w = document.createElement("span");
              w.className = "w";
              const inner = document.createElement("span");
              inner.textContent = tok;
              w.appendChild(inner);
              frag.appendChild(w);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1) {
            const w = document.createElement("span");
            w.className = "w";
            n.parentNode?.replaceChild(w, n);
            const inner = document.createElement("span");
            inner.appendChild(n);
            w.appendChild(inner);
          }
        });
      };
      walk(el);
    };

    const splitEls = Array.from(root.querySelectorAll<HTMLElement>("[data-split]"));
    splitEls.forEach((h) => splitWords(h));

    // staggered reveals
    splitEls.forEach((h) => {
      const inners = h.querySelectorAll(".w > span");
      if (!inners.length) return;
      if (state.reduce) {
        gsap.set(inners, { y: 0, opacity: 1 });
        return;
      }
      gsap.set(inners, { yPercent: 115, opacity: 0 });
      ScrollTrigger.create({
        trigger: h,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(inners, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.045,
          }),
      });
    });

    // generic fade-up for hero bits
    const fadeEls = root.querySelectorAll(
      "[data-hero-eyebrow],[data-hero-sub],[data-hero-trust],[data-hero-cta]"
    );
    if (state.reduce) {
      gsap.set(fadeEls, { opacity: 1, y: 0 });
    } else {
      gsap.set(fadeEls, { opacity: 0, y: 20 });
      gsap.to(fadeEls, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.35,
      });
    }

    // parallax + cell reveals
    if (!state.reduce) {
      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((p) => {
        gsap.to(p, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: p,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      root.querySelectorAll<HTMLElement>("[data-cell]").forEach((c) => {
        gsap.from(c, {
          opacity: 0,
          y: 26,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: c, start: "top 88%", once: true },
        });
      });
    }

    /* ---------- magnetic buttons ---------- */
    if (!state.reduce) {
      root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
        const strength = 0.35;
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * strength;
          const y = (e.clientY - r.top - r.height / 2) * strength;
          gsap.to(btn, { x, y, duration: 0.4, ease: "power3.out" });
        };
        const onLeave = () =>
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    ScrollTrigger.refresh();

    /* ---------- cleanup ---------- */
    return () => {
      state.dead = true;
      rafIds.forEach((id) => cancelAnimationFrame(id));
      cleanups.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="hue-root">
      <div className="hue-grain" data-grain aria-hidden="true" />

      {/* NAV — unchanged */}
      <nav className="hue-nav">
        <a href="#top" className="hue-nav__brand">
          <HueLogo size={30} className="hue-nav__mark" title="" />
          <span className="hue-logo">Hue</span>
        </a>
        <div className="hue-nav__links">
          <a href="#how" className="hue-nav__link">
            How it works
          </a>
          <a href="#privacy" className="hue-nav__link">
            Privacy
          </a>
          <button
            id="themeToggle"
            className="hue-theme-toggle"
            aria-label="Toggle light or dark theme"
            type="button"
          >
            <span id="themeIcon">☾</span>
          </button>
          <a href="#get" data-magnetic className="hue-btn hue-btn--nav">
            Get Hue
          </a>
        </div>
      </nav>

      {/* 1 · HERO — unchanged */}
      <section id="top" className="hue-hero">
        <div className="hue-hero__inner">
          <div data-hero-eyebrow className="hue-hero__eyebrow">
            <span className="rule" />
            Real-time interview copilot · Android
            <span className="rule" />
          </div>
          <h1
            data-split
            className="hue-hero__title"
            dangerouslySetInnerHTML={{
              __html:
                'Your real-time <span class="accent">interview</span> copilot',
            }}
          />
          <p data-hero-sub className="hue-hero__sub">
            Speak or type the interviewer&rsquo;s question and Hue drafts your
            answer in real time — first person, grounded in your résumé, shown as
            text only you can read. Or flip it around and let Hue run a mock
            interview out loud.
          </p>
          <div data-hero-trust className="hue-hero__trust">
            Bring your own key · No backend · No login
          </div>
          <div data-hero-cta className="hue-hero__cta">
            <a href="#get" data-magnetic className="hue-btn hue-btn--lg">
              Get Hue — Android <span style={{ fontSize: 16 }}>→</span>
            </a>
            <a href="#how" data-magnetic className="hue-btn--ghost hue-btn--lg">
              See how it works
            </a>
          </div>
        </div>
        <div data-scrollcue className="hue-scrollcue">
          <span className="hue-scrollcue__label">Scroll</span>
          <span className="hue-scrollcue__track">
            <span className="hue-scrollcue__dot" />
          </span>
        </div>
      </section>

      {/* 1.5 · SHOWCASE — live device preview with streaming draft animation */}
      <div id="how">
        <HueShowcase />
      </div>

      {/* 2 · STATS — credibility band */}
      <HueStats />

      {/* 3 · PATTERNS — "find your words in seconds" phone grid */}
      <HuePatterns />

      {/* 4 · FLOWS — the two modes Hue actually runs */}
      <HueFlows />

      {/* 5 · ACTIONS — the privacy / grounding promises */}
      <div id="privacy">
        <HueActions />
      </div>

      {/* 6 · HOW IT WORKS — factual setup walkthrough */}
      <HueHowItWorks />

      {/* 6.5 · DOWNLOAD — real APK button + sideload guide (nav "Get Hue" target) */}
      <HueDownload />

      {/* 7 · PROVIDERS — logo cloud above the CTA */}
      <section className="hue-providers">
        <div className="hue-providers__head">
          <div className="hue-eyebrow hue-providers__eyebrow">
            Bring your own model
          </div>
          <p className="hue-providers__lead">
            Plug in the providers you already trust.
          </p>
        </div>
        <div className="hue-marquee-mask">
          <div data-marquee className="hue-marquee">
            <MarqueeGroup />
            <MarqueeGroup ariaHidden />
          </div>
        </div>
      </section>

      {/* 8 · CTA + FOOTER */}
      <section className="hue-cta">
        <div className="hue-cta__inner">
          <div className="hue-cta__eyebrow">Free · open · Android-first</div>
          <h2 data-split className="hue-cta__title">
            Never freeze again.
          </h2>
          <a
            href="/hue-latest.apk"
            download
            data-magnetic
            className="hue-btn hue-btn--xl"
          >
            Download Hue — Android <span style={{ fontSize: 17 }}>↓</span>
          </a>
          <div className="hue-cta__fine">Your key · your device · your data</div>
        </div>

        <footer className="hue-footer">
          <div className="hue-footer__top">
            <div className="hue-footer__brand">
              <HueLogo size={24} className="hue-footer__mark" title="" />
              <span className="hue-footer__logo">Hue</span>
              <span className="hue-footer__tag">
                Your real-time interview copilot.
              </span>
            </div>
            <div className="hue-footer__cols">
              <div className="hue-footer__col">
                <span className="hue-footer__col-head">Product</span>
                <a href="#how">How it works</a>
                <a href="#privacy">Privacy</a>
                <a href="#get">Get Hue</a>
              </div>
              <div className="hue-footer__col">
                <span className="hue-footer__col-head">Models</span>
                <a href="#">Providers</a>
                <a href="#">Bring your own key</a>
                <a href="#">Practice mode</a>
              </div>
              <div className="hue-footer__col">
                <span className="hue-footer__col-head">Company</span>
                <a href="#">GitHub</a>
                <a href="#">Changelog</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </div>
          <div className="hue-footer__bottom">
            <span className="hue-footer__copy">
              © 2026 Hue · No servers, by design.
            </span>
            <span className="hue-footer__copy">Built for the moment.</span>
          </div>
        </footer>
      </section>
    </div>
  );
}
