# Component gaps

A running list of things built inline, from tokens, inside a screen — instead of as a real Storybook component — because nothing in the library covered them. Read this before building a new screen; if the same gap shows up twice, that's the signal to build it properly instead of copying the inline version again.

- **List/row treatment for a tappable list of terms.** Screen: Session end. Plain `<ul>`/`<li>`/`<button>` markup in `SessionEndScreen.module.css` — background/surface fill, radius/200, a pressed overlay borrowed from Button's own technique. No list/row component exists anywhere in the library (Figma or Storybook) to reach for instead.
- **Underlined text-link escape action** ("I can't talk right now", "Back to speaking"). Screens: the recall loop (idle, reviewing) and Text alternative — needed in both at once while building Text alternative, so this one skipped the usual "log it inline, graduate it the second time" step and went straight to a real component: `src/components/TextLink/TextLink.tsx` (Storybook: `Components/TextLink`). Matches the Figma draft's own "esc: ..." text layers, which are plain text, not a button.
