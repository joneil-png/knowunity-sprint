# SPEC: Voice recall prototype

A student explains a term out loud (or types it) after revising a section; Knowie judges the answer — mocked, not real — and replies in text only. Built as an interactive prototype, not a mockup: the loop actually runs, on a hardcoded example term, with a scripted judge standing in for the real thing.

## Prototype model

This prototype is the Next.js app in this repo (`src/app/`), not a chat artifact and not a Figma flow. Every screen listed below is a real page with its own route, reached by the student clicking through the app — not a slide in a deck. Storybook (`npm run storybook`) stays the component catalog: every piece a screen uses is a real, documented component under `src/components/`, verified there before it's used on a screen.

All four screens are wired up as real routes today (`/`, `/session-end`, `/text`, `/say-it-back`).

## Screens, build order (easiest first)

| # | Screen | Status | Route |
|---|---|---|---|
| 1 | Session end (revisit list) | **Built** | `/session-end` |
| 2 | Text alternative | **Built** | `/text` |
| 3 | Say it back | **Built** | `/say-it-back` |
| 4 | Recall loop (idle → recording → review → processing → result) | **Built** | `/` |

Also in scope, not yet started: top navigation chrome (close button, progress bar) — see the note after screen 4.

---

### 1. Session end (revisit list)

**Built.** Files: `src/components/SessionEndScreen/` (.tsx + .module.css + .stories.tsx, Storybook: `Screens/SessionEndScreen`), mounted at `/session-end` via `src/app/session-end/page.tsx`. No Figma frame exists for this screen (confirmed live against the file).

**States:**
- Only renders at all if the session has at least one retired term (two misses). Per `docs/sprint-context.md`: "doesn't appear if there are none" — this isn't an empty-state to design, it's a screen the student never reaches on a clean session.
- One populated state: a list of the retired terms from the session.

**Components:** none in Storybook — a minimal plain-row list, tokens-only, the same approach already used for the transcript block on screen 4, rather than a new named component for one list. Logged in `component-gaps.md`.

**What the student can do:** tap a retired term — a real, visually-tappable no-op stub (decided).

**Leads to:** nothing yet. "The existing lesson content sheet" this is meant to open (sprint-context) lives elsewhere in the real Knowunity app, outside this prototype's repo.

**How it's reached:** `RecallScreen`'s Continue routes here on any terminal result (a pass, or a second miss) — not just second misses. A pass has nothing retired, so this screen immediately redirects back to `/`, which is the correct behavior for "doesn't appear if there are none." The retired-terms list itself lives in the new shared context, `src/lib/RecallSessionContext.tsx` (see screen 4).

---

### 2. Text alternative

**Built.** Files: `src/components/TextAlternativeScreen/` (.tsx + .module.css + .stories.tsx, Storybook: `Screens/TextAlternativeScreen`), mounted at `/text` via `src/app/text/page.tsx`. Figma frame: "10. Text alternative" on the "Voice Recall — Draft Screens" canvas — matched for content and structure, not pixel-for-pixel. Differences from the frame: sentence case ("Typing instead"), not the frame's all-caps, per design-system.md §4; Submit uses `Button`'s real Primary styling, not the frame's brand-violet fill, which violates design-system.md §4's restriction on `accent/brand/*`; no top navigation, same scope cut as every other screen. Element order (headline, then the "Typing instead" label, then the field) now matches the frame's actual layout — an earlier version of this line claimed the frame put the field before the headline, which checking the live file's node positions directly showed wasn't true.

**Reached from:** the idle screen or the review screen, via "I can't talk right now" — now wired on both (see screen 4).

**States:** one — typing.

**Components:**
- `TextField` (`src/components/TextField/TextField.tsx`, Storybook: `Components/TextField`) for the input.
- `Button` (`src/components/Button/Button.tsx`, Storybook: `Components/Button`), `variant="Primary" size="L" fullWidth` for Submit, pushed to the bottom of the screen (`margin-top: auto`) rather than sitting right under the field.
- `TextLink` (`src/components/TextLink/TextLink.tsx`, Storybook: `Components/TextLink`) for "Back to speaking" — new, see screen 4.

**What the student can do:** type an answer, submit it, or tap "Back to speaking" to return to the voice path.

**Leads to:** submitting goes straight to processing — no review/confirm step like voice's transcript screen, since typed text has no mishearing risk to protect against. It feeds the same scripted verdict logic as voice (identical treatment, same `outcomes` array, same banner copy) via `useRecallSession`'s `send()`, then returns to `/`. "Back to speaking" also returns to `/` — since `RecallScreen`'s own status (idle vs. reviewing) lives in the shared context and isn't touched by visiting this screen, "/" naturally shows whatever it showed before, voice stays the primary path.

---

### 3. Say it back

**Built.** Files: `src/components/SayItBackScreen/` (.tsx + .module.css + .stories.tsx, Storybook: `Screens/SayItBackScreen`), mounted at `/say-it-back` via `src/app/say-it-back/page.tsx`. Figma frame: "7. Say it back" on the "Voice Recall — Draft Screens" canvas — matched for content and structure, not pixel-for-pixel. Differences from the frame: "Say it back, no pressure" reads in sentence case, not the frame's all-caps, per design-system.md §4; the frame's "Skip this, next term" escape link is omitted — manual Skip was removed earlier in this build and is explicitly out of scope, so this isn't a new decision, just a frame element that predates it; the quoted text shows the term's full `answerReveal`, not the frame's shortened quote, since there's only one canonical reveal string in the data model. The frame's persistent question headline was missing from the first pass of this build (not caught until a direct Figma comparison) — now added above the transcript card, matching the frame.

Along the way, fixed the gap SPEC.md already flagged: `finishSayItBack` (`src/lib/useRecallTerm.ts`) now actually queues the retry (shares a `queueRetry` helper with `continueAfterResult`'s first-miss branch) instead of just resetting to idle.

**Reached from:** the result screen, only on a first miss (`verdict === 'partial'`, `attempt === 0`) — sprint-context: "a first miss reveals the answer, offers an optional unscored say-it-back." Now wired: `RecallScreen` offers a `Button` (`variant="Secondary" size="L" fullWidth`, "Say it back") next to Continue exactly there.

**States:** one take, no verdict. Recording is local state on this screen (`useState`), not the shared status — `startSayItBack` stays unused by design, so a browser-back mid-take falls back to the last real state (the Partial banner) rather than an unhandled `sayItBack` status on `RecallScreen`.

**Components:** `ButtonRecord` (`src/components/ButtonRecord/ButtonRecord.tsx`, Storybook: `Components/ButtonRecord`), same `Default`/`Recording` states as the main loop's mic button, plus the question headline (`term.prompt`, plain markup styled like `RecallScreen`'s `.prompt`) and a "Tap to record"/"Tap to stop" label above the button.

**What the student can do:** record one take.

**Leads to:** auto-advances after a 700ms beat once the take completes (a judgment call, not specified anywhere) — no verdict UI, no separate Continue tap. Finishing Say it back queues the retry (back to Idle, "Previous mistake" badge shown) and returns to `/`.

---

### 4. Recall loop — idle, recording, review, processing, result

**Built.** Files:
- `src/components/RecallScreen/RecallScreen.tsx` + `.module.css` + `.stories.tsx` (Storybook: `Screens/RecallScreen`)
- `src/lib/useRecallTerm.ts` (the state machine)
- Mounted at `/` via `src/app/page.tsx`, with one hardcoded example term (chlorophyll / photosynthesis, scripted `outcomes: ['partial', 'pass']`), owned by the shared cross-route context — `src/lib/RecallSessionContext.tsx` — not a local hook call. Every screen that needs the current term or its state reads it from there (`useRecallSession()`).

One screen, several internal states — no route change between them. The record button, the review screen's action buttons, and the result banner share one Motion `layoutId` (`"answer-surface"`), so they morph into each other rather than cutting, and anchor to a fixed bottom-ish position (confirmed pixel-identical between Idle and Recording) rather than drifting toward the screen's true center. The mascot (`MascotMoment`, Recording and Processing only) is deliberately **not** part of that shared-layout group — it's an independent, always-centered overlay (`position: absolute`, `pointer-events: none`) over the whole screen, so it can read as dead-center regardless of where the button/actions below it are anchored. Decided directly with Joneil after the two approaches fought each other when combined into one group.

| State | Components used | Student can | Leads to |
|---|---|---|---|
| **Idle** | `ButtonRecord` (`state="Default"`) + "Tap to record" label + `TextLink` ("I can't talk right now") | Tap to start recording, or tap the text link. | Recording (same screen), or `/text`. |
| **Recording** | `ButtonRecord` (`state="Recording"`) + "Tap to stop" label + `MascotMoment` (`pose="standby"`, "I'm listening…", in the independent centered overlay, not the button's own row) | Tap to stop. | Reviewing (same screen). |
| **Reviewing** | Plain transcript display (not a library component — see below) + `Button` (`variant="Secondary" size="L"` `fullWidth`, "Discard & re-record") + `Button` (`variant="Primary" size="L"` `fullWidth`, "Send") + `TextLink` ("I can't talk right now") | Discard & re-record, Send, or the text link. | Discard → back to Idle, transcript cleared (originally went straight to Recording, auto-starting the mic with no beat to get ready — fixed). Send → Processing. Text link → `/text`. |
| **Processing** | `MascotMoment` (`src/components/MascotMoment/MascotMoment.tsx`, Storybook: `Components/MascotMoment`, `pose="thinking"`, "Checking your answer…", `announce`), fixed 2.5s — replaces the `ProcessingSkeleton` this state originally shipped with; that component is untouched and still in Storybook, just not used here anymore | none — this state is not interactive. | Result, automatically, after the delay. |
| **Result — pass, first try** | `FeedbackBanner` (`variant="Success"`) + `Button` (`variant="Primary" size="L" fullWidth`, "Continue") | Tap Continue. | `/session-end`, which immediately redirects back to `/` since nothing was retired — the correct behavior for a pass, not a bug. There's still no real "next term" once a real multi-term session exists; today, one term's session simply ends. |
| **Result — pass, after retry** | `FeedbackBanner` (`variant="Earned"`) + Continue | Tap Continue. | Same as above. |
| **Result — partial, first miss** | `FeedbackBanner` (`variant="Partial"`) + Continue + `Button` (`variant="Secondary" size="L" fullWidth`, "Say it back") | Tap Continue, or Say it back. | Continue → queues a retry (back to Idle, badge shown). Say it back → `/say-it-back`, which itself also queues the retry once the take completes — see screen 3. |
| **Result — partial, second miss** | `FeedbackBanner` (`variant="Partial"`, different copy) + Continue | Tap Continue. | Marks the term retired, then `/session-end` (now populated). Originally decided as its own visually-distinct variant ("visually distinct from Partial... no retry offered"); closed instead as reusing `Partial` with different copy — no retry action present on this variant already reads as distinct enough in practice, and a fourth banner treatment wasn't worth building for this prototype. Not a gap. |

The transcript itself (shown from Reviewing onward, "You said" + the text) is not a library component — a plain styled block in `RecallScreen.module.css`. `TextLink` (`src/components/TextLink/TextLink.tsx`, Storybook: `Components/TextLink`) is a real component — a plain underlined escape-action link, matching "esc: I can't talk right now" / "esc: Back to speaking" in the Figma draft screens exactly (plain text layers there too, not a button).

**Top navigation (in scope, not built):** a close button and progress bar were decided in scope for this prototype, not just app chrome to skip. Blocked on two components that exist in Figma but not yet in Storybook — `buttonIcon` and `progressIndicator`. Same path as `TextField` and `ProcessingSkeleton`: build both in Storybook, tokens-only, before wiring them into any screen.

---

## Gaps and cuts

Everything not built as the source material originally showed it, or not built at all, in one place — what it is, why, and whether it's closed or still open.

| What | Type | Reason | Status |
|---|---|---|---|
| Round 1 (multiple choice) | Cut | This prototype starts from a hardcoded example term standing in for a real hand-off. | Closed |
| Entry / first-run primer, mic permission priming, the native permission prompt's own UI, permission-denied routing | Cut | Out of scope for this prototype. | Closed |
| Leaving and resuming a session | Cut | No persistence anywhere in this build. | Closed |
| Summary screen, XP, retention | Cut | The session-end revisit list is the one exception, and it's a minimal list, not a summary. | Closed |
| Hint ladder, pausing/resuming a take, transcript editing, an answer-format settings screen | Cut | Out of scope for this prototype. | Closed |
| The batched "correct the questions you missed" interstitial | Cut | Out of scope for this prototype. | Closed |
| Manual Skip | Cut | Two-miss auto-retirement covers "the student doesn't know this." The Say it back Figma frame still shows a "Skip this, next term" link — confirms this was cut after that frame was drawn, not an oversight when building the screen. | Closed |
| The "Why?" button seen on an earlier draft screen | Cut | Undocumented scope creep that risked the no-tutoring-conversation rule. | Closed |
| Top navigation (close button + progress bar) | Gap | Blocked on `buttonIcon` and `progressIndicator` — real Figma components, not yet built in Storybook. | Open — see the recall loop section |
| Second-miss result banner as its own visually-distinct variant | Deviation | Decided in sprint-context to be visually distinct with no retry offered; closed instead by reusing `Partial` with different copy — no retry action already reads distinct enough, and a fourth banner variant wasn't worth building for this prototype. | Closed |
| Session-end list/row treatment | Gap | No Storybook component exists for a tappable list; built inline from tokens instead. | Open — logged in `component-gaps.md`, single screen so far |
| TextLink escape-action pattern | Gap → resolved | Started as a candidate for the same inline-then-graduate path, but needed on two screens at once while building Text alternative, so it went straight to a real component instead of waiting for a second inline copy. | Closed — `src/components/TextLink/` |

## Open

Nothing outstanding — every item previously listed here (route names, the text-alternative review step, "Back to speaking," Say it back's retry-queueing, the session-end list, Continue-after-pass, and top nav's scope) was decided in conversation and is now reflected in the sections above. Check back here as new gaps surface; treat an empty list as current, not as "nothing was ever open."

## How the mocked recall behaves

Nothing here is real speech-to-text or real judging — the brief calls for that explicitly ("the recall is mocked... you're designing the experience, not building the engine").

- **Verdicts are scripted per term.** Each `RecallTerm` carries an `outcomes: Verdict[]` array — `outcomes[0]` for the first attempt, `outcomes[1]` for the retry. `useRecallTerm`'s `send()` looks up `outcomes[attempt]` after the processing delay; nothing is actually graded.
- **The transcript is a hardcoded placeholder** (`MOCK_TRANSCRIPT` in `RecallScreen.tsx`) shown regardless of what's actually said. Real on-device speech-to-text (the browser's `SpeechRecognition`) was the intended eventual source, but that's unverified — still on you to confirm it works in the actual demo browser before it replaces the placeholder.
- **Processing always takes a fixed 2.5s** (`PROCESSING_DELAY_MS` in `useRecallTerm.ts`) — not randomized, not tied to anything real.
- **Text and voice get identical treatment** — same `outcomes` lookup, same banner copy, both calling the same `send()` on the shared context. Verified: a retry answered by text still resolves to `Earned`, not `Success`, proving the attempt/retry state actually survives the route change to `/text` and back.

## Verification

**What you can check today**, with the app running (`npm run dev`, then open the app):

1. Land on `/` — see the example term's prompt and an idle mic button.
2. Tap the mic → button switches to Recording (pulse ring). Tap again → lands on the review screen with a transcript and Send / Discard & re-record.
3. Tap Discard & re-record → back to Idle, transcript cleared. Tap the mic again when ready to re-record.
4. Tap Send → Processing (shimmering skeleton) for ~2.5s → a `Partial` banner ("Almost there") with the revealed answer, since the example term's first scripted outcome is `partial`.
5. Tap Continue → back to idle, now showing the "Previous mistake" badge (confirms the retry-queueing logic ran).
6. Record → stop → Send again → after another ~2.5s, an `Earned` banner this time (second scripted outcome is `pass`, and `isRetry` is now true) — confirms the retry path resolves differently from a first-try pass.
7. Tap Continue on that Earned banner → routes to `/session-end`, which immediately redirects back to `/` since a pass never retired anything — that's correct, not a bug. To see `/session-end` actually populated, temporarily change the example term's `outcomes` to `['partial', 'partial']` and miss twice instead.
8. From idle, tap "I can't talk right now" → lands on `/text`. Submit a typed answer → back on `/`, already mid-processing, resolving to the same banners as voice. Tap "Back to speaking" instead → back on `/` unchanged.
9. On a fresh first-miss Partial banner, tap "Say it back" instead of Continue → lands on `/say-it-back`. Record and stop → after ~700ms, auto-advances back to `/`, now showing the idle prompt with the "Previous mistake" badge (confirms `finishSayItBack` actually queued the retry).

**Automated checks**, same tooling used throughout this build: open Storybook (`npm run storybook`) and check `Screens/RecallScreen`, `Screens/SessionEndScreen`, `Screens/TextAlternativeScreen`, `Screens/SayItBackScreen`, and each component under `Components/*`. `RecallScreen`'s `FullLoopReachesFirstMissResult` story exercises steps 2–4 above automatically, with an accessibility pass (zero violations as of this spec). Re-run these after any change to `RecallScreen.tsx`, its CSS module, `RecallSessionContext.tsx`, or `useRecallTerm.ts`.

**All four screens are built**, so the full loop is now walkable end to end: idle → record → review → send → processing → partial result → say it back (or Continue) → retry with the badge → pass or another miss → session end (populated only if something was retired) → back out to the existing lesson content (a decided no-op stub, since that destination doesn't exist in this repo).
