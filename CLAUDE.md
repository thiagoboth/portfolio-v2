# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Response Style (apply to every reply)

- Answer directly. No preamble, filler, affirmations, or trailing summary clauses.
- Use plain prose or tight lists. No decorative headers for short answers.
- Do not use Extended Thinking or web search unless the prompt is explicitly complex or time-sensitive.
- If a task is simple (formatting, grammar, short translation), note once that Haiku may suffice.
- At 11+ messages, offer once to summarize key context for a fresh chat.
- If a correction is requested, note once that editing the last message saves tokens.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # TypeScript check + Vite build
npm run lint      # ESLint
npm run preview   # preview production build
```

## Tech Stack

React 19, TypeScript, Vite 6, Framer Motion, GSAP + ScrollTrigger, Lenis smooth scroll, Three.js / React Three Fiber, Zustand, Lucide React.

## Architecture

Single-page portfolio with 5 scroll-based sections: **Hero → Sobre → Serviços → Projetos → Contato**.

### Magnetic Snap Scroll System

The core scroll mechanic is a **sticky viewport + overlapping sections** pattern spread across several files — understanding all of them together is required to modify scroll behavior:

- **`src/store/`** — Zustand `scrollStore` is the central source of truth: scroll phase (`IDLE | READING | TRANSITIONING`), per-section DOM metrics, active section index, and transition progress split as `outProgress` / `inProgress` at the 50% midpoint.
- **`src/hooks/useLenis.ts`** — Initializes Lenis smooth scroll, integrates it with the GSAP ticker (`gsap.ticker.add`), and exposes the `lenis` instance globally so other hooks can call `lenis.scrollTo`.
- **`src/hooks/useScrollMachine.ts`** — The snap engine. Uses a `ResizeObserver` to track live section heights and builds a scroll track where sections overlap by ~300px (transition zones). When scroll velocity approaches zero inside a transition zone, it auto-snaps forward (if >30% threshold crossed) or rolls back. Updates `scrollStore` on every frame.
- **`src/hooks/useSectionTransition.ts`** — Consumes `scrollStore` state and returns per-section `{ opacity, y, pointerEvents }` values that sections apply via inline styles to animate in/out during transitions.
- **`src/hooks/useSimulatedScroll.ts`** — Maps raw `scrollY` pixels to legacy 0–1 progress ranges per section (used by older animation code that predates the scroll machine).

### Section & Component Layout

```
src/
├── components/
│   ├── sections/       # Hero, Sobre, Servicos, Projetos, Contato
│   ├── layout/         # Navbar (theme toggle, mobile menu, active section highlight)
│   ├── animations/     # ParticlesBg (canvas physics), ScrollTypewriter
│   └── ui/             # Loader (Framer Motion AnimatePresence), FigmaSelectableBlock
├── hooks/              # scroll machine, lenis, theme, section helpers
├── store/              # Zustand scrollStore
└── styles/             # globals.css
```

`src/App.tsx` is the composition root — it mounts all sections and wires the scroll hooks.
