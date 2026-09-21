@AGENTS.md

# Project

Prototype of a voice-based active-recall study step for Knowunity, built in this customized Next.js app.

## Hard rules

- Design values and component rules: `docs/design-system.md` is law; `tokens/tokens.json` is the only source of values. Never invent either. Run `npm run check:tokens` after building or editing any screen or component — it fails and names the file/line if a raw hex color leaked into `src/`.
- Product constraints for the feature (voice-in/text-out, push-to-talk, mobile-iOS-only, mocked recall, etc.): `docs/design-brief.md`, "Hard constraints".
- Voice-UX principles to apply to any recall-loop screen: `docs/voice-ux-reference.md`.
- Recall-loop decisions already made: `docs/sprint-context.md`. Treat as settled, not open for redesign.
- Four skills live in `.claude/skills/` (interactive-prototype, ui-designer, ux-designer, ux-motion), each owning its domain. Read the matching `SKILL.md` before doing that kind of work; each one states its own handoffs to the others.
- The UI font is Greed VF, loaded via `next/font/local` in the root layout — never treat it as an installed system font.

## Never

- Never invent a token, component, or value outside `tokens/tokens.json` — full banned-moves list in `docs/design-system.md` §4.
- Never give Knowie a voice, auto-detect end of speech, or branch into tutoring conversation — `docs/design-brief.md`, "Hard constraints".
- Never trap the student with no way forward (always leave skip / text fallback) — `docs/design-brief.md` and `docs/voice-ux-reference.md` principle 5.
- Never label a recall miss "Wrong"/"Incorrect", never grey out a control as the only response to something a student can't do — `docs/design-system.md` §4.
- Never edit or strip the `nextjs-agent-rules` block in `AGENTS.md` — `next dev` regenerates it.
- Never hand-edit `next-env.d.ts` — Next regenerates it.
- Never hand-edit `build/css/tokens.css` — it's generated. Edit `tokens/tokens.json` and run `npm run tokens`.

## Component library

When working on UI, use the storybook tools to read the component library before answering or writing anything. Never assume a component prop exists. Query the documentation, and use only props that are documented or shown in a story. If a prop isn't there, stop and ask me.

`component-gaps.md` (repo root) is a running list of things built inline during a screen build instead of as a real component — read it before building a new screen.

## File map

**Root config** — read only when touching build/lint/TS setup:
- `package.json`, `package-lock.json` — deps, scripts (`dev`/`build`/`start`/`lint`/`tokens`)
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts` — framework config
- `style-dictionary.config.mjs` — turns `tokens/tokens.json` into `build/css/tokens.css`; run via `npm run tokens`
- `README.md` — stock create-next-app text, not project-specific

**`.claude/skills/`** — read the relevant `SKILL.md` before that kind of work:
- `interactive-prototype/` — building interactive React/Motion prototypes
- `ui-designer/` — visual design craft and systems
- `ux-designer/` — UX strategy, flows, psychology
- `ux-motion/` — motion/animation implementation
- each skill's `references/*.md` — that skill's own supporting detail; its `SKILL.md` points to the right one per task

**`docs/`** — sprint source material:
- `design-brief.md` — problem, bet, success metrics, hard constraints, open mandate; read before designing any new flow
- `voice-ux-reference.md` — voice-UX principles + states-to-design checklist; read before designing the recording/recall loop
- `sprint-context.md` — recall-loop decisions already locked in; read before touching that loop
- `design-system.md` — which component to reach for, naming rules, what never to do; read before building or styling any screen
- `reference/` — 58 screenshots of the existing app flow (onboarding → quiz results); read the numbered screen(s) matching the flow you're building

**`tokens/`** — design token source, in DTCG format (a shared JSON standard for design tokens):
- `tokens.json` — every design token value; look values up here, never guess. More token files may join this folder later.

**`build/`** — generated output, do not hand-edit; regenerate with `npm run tokens`:
- `css/tokens.css` — every token in `tokens/tokens.json`, as a CSS custom property (e.g. `--color-interactive-primary`)

**`public/`**:
- `images/` — Knowie's reaction art (excited, giggling, laughing, overIt, sad, standby, thinking); read when a screen shows Knowie's mood
- `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — unused create-next-app demo icons, referenced only by the placeholder `page.tsx`

**`src/app/`**:
- `layout.tsx` — root HTML shell, fonts; read before changing global page structure
- `page.tsx` — home page, still the default create-next-app placeholder; read/replace when building the real UI
- `globals.css` — Tailwind entry point, light/dark CSS variables
- `favicon.ico` — site favicon
