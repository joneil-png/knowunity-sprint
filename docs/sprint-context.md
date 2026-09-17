# Sprint context: Knowunity voice recall

Voice-based active recall for Knowunity: a student speaks (or types) an answer, Knowie replies in text only.
Prototype is iOS only, 390px wide, dark mode. Speech recognition and judging are mocked.

**Concept:** A recall-focused mock exam where round 1 is multiple choice across the term set and round 2 is voice recall on only the terms answered right in round 1.

**Where it lives:** Replaces the existing post-quiz "Explain it to Knowie" tile.

## Decisions

- Only round 1 passes reach the mic, because recall can't check a memory that was never formed.
- Feedback is immediate in both rounds, because nothing is graded and the payoff moment is the point.
- A first miss reveals the answer, offers an optional unscored say-it-back, and queues one retry later in round 2, because spacing the retry makes it a real memory check.
- A second miss retires the term for the session with a gentle bail-out and no further attempts, because two misses is the clearest "not known yet" signal.
- A retry prompt shows the app's existing "Previous mistake" tag, because the app already marks retries that way.
- Correct-after-retry gets its own feedback beat and copy, distinct from a first-try correct, because it's the proof-of-mastery moment.
- Misses are labeled "Partial", never "Wrong" or "Incorrect", because a false wrong is especially demoralizing here.
- Session end lists bailed-out terms only, each opening the existing lesson content sheet, and doesn't appear if there are none, because the bail-out message needs a real destination.
- No transcript while recording, because watching your words appear distracts from recalling.
- After stop, the transcript is view-only with Re-record and Send, because it catches mis-hearings before a false verdict without reintroducing keyboard friction.
- Review, processing and verdict are one screen: transcript stays up, the bottom area swaps from buttons to thinking skeleton to banner, because a screen per verdict is too much navigation.
- Say it back is its own light screen, one take, no verdict, because it re-engages the mic.
- An always-visible "I can't talk right now" button swaps that question to a text box, because typed recall is still recall and a settings screen would undercut voice as the default.
- Recording screen is Direction A, a centered mic button with a pulse ring, because the alternatives implied live audio analysis or repurposed tokens.

## Not building

- Entry, first-run primer, mic permission handling, leaving and resuming a session.
- Summary screen, XP, retention (the revisit list is the only exception).
- Hint ladder, pausing and resuming a take, transcript editing, an answer-format settings screen.
- The batched "correct the questions you missed" interstitial.
