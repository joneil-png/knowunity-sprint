---
name: build-screen
description: "Applies when building or editing any screen in this prototype — the voice recall app in this repo. Triggers on: 'Build [screen name]', 'build the X screen', 'implement the X page', editing an existing screen's states or actions, or any work that produces or changes a real route under src/app/. Also applies when a screen's behavior, states, or component usage need to be reconciled against SPEC.md, the Figma file, design-brief.md, or voice-ux-reference.md. Do NOT use this for editing a single reusable component in isolation (that's ui-designer / ux-motion territory) or for pure Storybook/story work with no route attached — a screen only counts as built once it exists as a real page at its own route, not as a story."
---

# Building a screen in this prototype

This is the one procedure every screen in this app gets built through. One screen at a time, on command ("Build [screen name]"), never speculatively, never several at once.

## Where screens live

Every screen is a page in `src/app/`, at its own route, reached by clicking from the screen before it — per SPEC.md's "Prototype model" section. Storybook is the component catalog only. A screen that exists as a Storybook story but has no route under `src/app/` is not built, no matter how finished the story looks. If you're tempted to call a screen done because its story renders cleanly, it isn't — check for the route.

State that needs to survive between screens (which term, which attempt, the transcript) comes from the shared session context (`src/lib/RecallSessionContext.tsx`, `useRecallSession()`), not a fresh local call to `useRecallTerm()`. A screen that quietly starts its own independent state loses the retry mechanic the moment a student crosses a route boundary — this has already bitten this project once (see SPEC.md and the session/text/say-it-back implementation plan).

## The method

1. **Read SPEC.md for this screen's states and components.** SPEC.md is the plan — what states it has, which real components it names, what the student can do, where each action leads. Don't re-derive this from the design docs; SPEC.md already did that work. If SPEC.md is silent or wrong about something you hit while building, that's real information — see step 9 and the two closing branches below.

2. **Check whether this screen has a frame in the Figma file, because some do and some don't, and it changes what you do.** The connected file is "Yummy__Knowie Design System"; the relevant canvas is "Voice Recall — Draft Screens (lookalike, Inter substituted)." Use the figma-console MCP tools (`figma_list_open_files`, `figma_get_file_data` on that canvas) to see what's there, and match by name/number to the screen you're building. Not finding a frame there isn't a failure state — several decided screens (session end, for one) were never drawn. Confirm absence by actually checking, don't assume from memory of an earlier session; the file can change.

3. **Query the Storybook MCP for every component you'll use, and never assume a prop.** `docs-list` first, then `docs-show` on each component's real ID. This applies even to components you've used on other screens already — check again, don't build from memory of what a prop was last time.

4. **Compose from what's in Storybook. That's the only place to look for something to reuse.** Most of the Figma component library (`appBar`, `chips`, `snackbar`, `textBlock`, `buttonGroup`, and others in `docs/design-system.md` §2) was never built in code. A component existing in Figma is not a reason to assume it exists here — check Storybook, not the Figma file, for what you can reuse.

5. **When something you need isn't in Storybook, build it inside the screen from tokens, and add a line to `component-gaps.md`** (repo root — create it if it doesn't exist) saying what it was and which screen it was for. Don't stop to ask. This matches how the transcript card and retry badge on the main recall screen were already handled: plain markup, styled from tokens, local to the screen file, not a new named system component. **If the same gap is already on that list from an earlier screen, that's the signal it's real — build it properly as a component with a Storybook story instead of a second inline copy**, and update `component-gaps.md` to note it graduated.

6. **Every value from the generated tokens (`build/css/tokens.css`, sourced from `tokens/tokens.json`). No raw hex, no raw px.** This holds even for the inline-from-tokens pieces in step 5 — "not a named system component" doesn't mean "not tokenized." If a value doesn't exist as a token, that's a real gap to flag (in `component-gaps.md` or directly to Joneil if it blocks the screen entirely), not a reason to hardcode one.

7. **Mobile only, 390px, dark mode.** Match the existing screen shell pattern (`RecallScreen.module.css`'s `.screen` class: `max-width: 390px`, centered, `--size-space-400` side margins, `--color-background-page` background, `min-height: 100vh`). Repeat this small block of CSS per screen rather than extracting a shared wrapper component — that's the established convention here (see `.visuallyHidden`, duplicated across four component CSS modules rather than shared), not an oversight to fix.

8. **Build every state listed for the screen, including the failure ones.** A screen with only its happy path is not the screen SPEC.md describes. If SPEC.md lists a state you can't make sense of once you're actually building it, that's exactly the kind of gap to surface in the closing summary (see below), not to quietly skip.

9. **Every action on the screen goes where SPEC.md says it goes. A button that leads nowhere means the screen isn't finished.** Wire real navigation (`next/navigation`'s `useRouter`, or `next/link` for plain declarative taps) to the real destination route. A visually complete screen with a dead-end tap is not done.

## When you're done

**If the screen has a Figma frame:** match it — layout, spacing, copy, the works. Then list every difference between what you built and the frame, plainly, even small ones. Silence on a deviation is the same as claiming there wasn't one.

**If it doesn't:** read `docs/design-brief.md` and `docs/voice-ux-reference.md` for how the state should behave — the hard constraints and the voice-UX principles, not just SPEC.md's summary of them. Then tell me what you had to decide that wasn't written down anywhere. A screen built from a gap in the source material still makes decisions; the difference is just that nobody reviewed them yet. Say what they were.

Either way: report what's now in `component-gaps.md` because of this screen, and confirm the route is real and every action on the screen resolves somewhere per SPEC.md — not just that it renders.
