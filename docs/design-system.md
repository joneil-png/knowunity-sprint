# Design system: rules

Companion to `tokens.json`. That file holds every value. This file holds the
rules for reaching for a component, composing a screen, naming something new,
and what not to do. If a rule here and a value in `tokens.json` ever seem to
disagree, `tokens.json` is the values, this is the judgment. Neither
overrides the other, they answer different questions.

This file names tokens and variables but doesn't repeat their values. Look
the value up in `tokens.json`.

Confidence is marked throughout. **Confirmed** means Joneil said so directly
or I traced real usage in the example screens. **Unconfirmed** means the
component exists and is documented, but nothing in the file proves the usage
I'm describing. Where I'm guessing, I say so instead of writing it flat.

Contents:

1. The scaffold: how a screen gets assembled
2. Which component to reach for
3. Naming conventions for the existing system
4. Never do this
5. Components built in the voice recall sprint
6. Conventions for making a new component

---

## 1. The scaffold: how a screen gets assembled

`scaffold` is not a screen, it's a rig for building one. Its own description:
"Used to quickly create screens using our components, making use of Figma
Slots. Allows for quickly testing how designs look on different device
types." Every real screen in the example pages is built inside one.

**Size variant.** 8 device options: iPhone 13 (default), L - 17 Pro Max, XS -
iPhone SE, Tablet S / Tablet S Landscape - iPad Mini, Tablet M Portrait /
Landscape - iPad 13, MacBook Air 13". **Confirmed:** only iPhone 13 and L -
17 Pro Max show up in any real screen. The five tablet and desktop sizes
exist in the component but nothing has been built against them. Treat those
five as scaffolding for a future responsive pass, not as sizes this app is
actually shipping in right now.

**Slots.** Three, plus one conditional:

- **`topNavigation`**: own description: "Placeholder for navigation items,
  such as back buttons, home top nav with streaks & similar." **Confirmed**
  real occupant: a "Status Bar" instance (Mode: Night) sits here on every
  screen that has one, 22 times over. A "Navbar" (5 tabs, no border) also
  occupies this slot on tab-root screens.
- **`middleContent`**: no slot description written for it, and it doesn't
  need one: this is the actual screen content, everything else in this file
  gets composed here. Almost every `iconSlot`, `textBlock`, `chips`,
  `progressIndicator`, and `mascotSlot` instance in the file lives inside
  this slot on some screen.
- **`bottomContent`**: own description: "Placeholder for bottom navigation
  bar, chat input field & similar." **Confirmed** real occupants: a single
  full-width `button` (Primary/L/Default) as the one bottom CTA, a
  `buttonGroup` (Horizontal/L) when there are two bottom actions, or a
  `bottomCta` instance. `bottomCta` isn't one of the ten audited component
  sets. It's real and in use, but I haven't traced its own construction the
  way I have the ten below, so don't take my word for what its `variant` and
  `showCaption` properties do without checking the component itself.
- **`bottomSheetOnly`**: only active when `showBottomSheetBackground` is
  true, and only takes one kind of preferred content. **Unconfirmed** exactly
  what that content resolves to by name (the lookup timed out against the
  live file), but the real screens that turn this slot on show a
  bottom-sheet-specific top bar sitting in it, distinct from the main
  `topNavigation` bar above it. Two instances found, both on screens named
  "bottomSheet."

**Three visibility booleans** (`showTopNavSlot`, `showBottomNavSlot`,
`showBottomSheetBackground`) toggle a slot on or off independent of whether
it has content. Turning a slot off is how you get a full-bleed screen, not by
leaving the slot empty; an empty-but-visible slot's real appearance is
untested (see `appBar`'s own note on this below, it's the same underlying
risk).

**What this means for you:** reach for `scaffold` first, every time, for a
new screen. Decide top/bottom nav on or off, drop the real content into
`middleContent`, and don't hand-build a status bar or a bottom CTA container
from scratch when the slot exists to hold one.

---

## 2. Which component to reach for

Ten component sets exist outside the scaffold, plus `buttonRecord` and
`feedbackBanner`, added in the voice recall sprint. Short version of each,
with confidence marked. Full descriptions (what / when / don't) live on the
components themselves in Figma; this is the compressed, cross-referenced
version. The two sprint components are documented in full in section 5.

| Situation | Reach for | Confidence |
|---|---|---|
| A focused secondary screen needs a stripped-down top bar | `appBar` | **Unconfirmed usage.** Confirmed concept (Joneil: "a simple nav bar so they can focus on the specific screen"), but zero real instances anywhere in the file. See the naming flag below, a *different*, undocumented component called "App Bar" (with a space) is the one actually used once, and it is not the same component. |
| One primary action on a screen | `button`, Primary/L/Default | **Confirmed.** 4 of 5 real instances are exactly this, sitting as the one full-width bottom CTA. Matches `interactive/primary`'s own "one primary button per screen" rule. Nothing in the component stops you from placing two, that rule lives in usage, not enforcement. |
| A lower-emphasis inline action | `button`, Tertiary/S | **Confirmed**, one real instance, state Pressed. Secondary's real-world usage isn't represented anywhere, don't assume its context from the component alone. |
| An icon-only action, no label | `buttonIcon` | **Confirmed, narrowly.** All 6 real instances are Secondary/Default at M or L. No Primary, Tertiary, Pressed, Disabled, or Loading instance exists to check against. It has no label fallback, so don't use it where the icon alone might be ambiguous. |
| Start and stop a voice answer | `buttonRecord` | **Built in the voice recall sprint, not yet placed in a screen.** See section 5. |
| Show Knowie's verdict on a recall answer | `feedbackBanner` | **Built in the voice recall sprint, not yet placed in a screen.** See section 5. |
| Two bottom actions together | `buttonGroup` | **Confirmed** for Horizontal/L only (all 4 real instances). It is built from exactly two child button slots, not a list, adding a third means rebuilding the component. Vertical and M are documented, unused. |
| A filter or category tag | `chips` | **Confirmed for Primary/inactive only.** All 11 real instances are `active=False, color=Primary`. Zero instances of `active=True` or `color=pro` exist anywhere, so don't assume a selected or pro-colored chip has been checked against real content before you use it that way. |
| Any icon needing a fixed square footprint | `iconSlot` | **Confirmed, heavily.** 165 real instances, the most-used piece in the system. Sizes 200/250/300 cover most usage, 400 is rare, 100 has zero instances. Each size variant binds only its width to an `Icon/*` variable; the height is not bound. `buttonRecord`'s size depends on the 400 variant's height staying as it is. |
| A sizing wrapper around Homie | `mascotSlot` | **Confirmed** at 2XL/3XL, matching `mascot/primary`'s documented "full-screen mascot-hero moments" role. XL is documented, unused. It has no instance-swap, the pose inside is fixed to "standby." Separate loose instances named "excited," "giggling," "approving," "overIt" exist elsewhere in the file and look like other Homie poses, but swapping the expression isn't wired into this component. Confirm with whoever built it before assuming that's a one-step swap. |
| A progress bar for a recall session | `progressIndicator` | **Confirmed, narrowly.** All 7 real instances are Primary/thickness-16, at 0% or 25%. Coral and thickness-24 are documented, unused. It only has five fixed steps (0/25/50/75/100), it can't show an arbitrary in-between percentage, a 7-question session doesn't map cleanly onto it as built. |
| A toast / transient system message | `snackbar` | **Confirmed concept** (Joneil: "looks like a toast"). Zero real instances anywhere. Its action slot is built from a `chips` instance, not a `button`, don't assume it taps like a button without checking that's intentional. |
| A header, sized to the content's importance | `textBlock` | **Confirmed concept** (Joneil: "basically like the header variations depending on the type of information, importance maybe"). Zero real instances anywhere, so the specific size-to-content mapping (which of XL/L/M/S for which kind of content) isn't decided. Don't guess that mapping without checking with Joneil first. In practice it's commonly paired with an `iconSlot` or an illustration sitting beside the title, that pairing shows up repeatedly even without a confirmed `textBlock` instance itself. |

Three components here (`appBar`, `snackbar`, `textBlock`) have a confirmed
real-world concept but zero confirmed real-world instance. That gap is real,
not a documentation failure, it means the next screen that needs one of
these is the first place its actual behavior gets tested.

---

## 3. Naming conventions for the existing system

For anything new, section 6 is the full set of conventions. This section
covers the names already in the file.

**Component sets:** one word or camelCase, no spaces: `button`, `chips`,
`snackbar`, `buttonIcon`, `buttonGroup`, `buttonRecord`, `feedbackBanner`,
`iconSlot`, `mascotSlot`, `progressIndicator`, `textBlock`, `scaffold`.

**Variant properties:** lowercase, camelCase: `variant`, `size`, `state`,
`active`, `thickness`, `progress`. Boolean properties that toggle visibility
are consistently prefixed `show`: `showLeftIcon`, `showRightIcon`,
`showText`, `showCaption`, `showTopNavSlot`.

**Tokens:** lowercase, slash-delimited, group/subgroup: `background/page`,
`interactive/primary`, `accent/coral/bold`. Full list and values live in
`tokens.json`. In Figma, size variables use Title Case groups (`Space/400`,
`Radius/Full`, `Icon/300`, `Layout/Content Width`); they map to the `size`
group in `tokens.json` in lowercase kebab-case (`size.space.400`,
`size.radius.full`, `size.icon.300`, `size.layout.content-width`).

**Known inconsistencies in the file, named so you don't copy them forward:**

- State suffixes aren't consistent. `interactive/primaryHover` smushes the
  state onto the end with no separator, while `interactive/pressed` treats
  the state as its own word. Match `pressed`'s pattern going forward, not
  `Hover`'s.
- `interactive/pressed` and `interactive/pressedInverse` may have swapped
  descriptions. Check both values in `tokens.json`: `pressed` is described
  for "light or vivid surfaces" but doesn't show on the light
  `interactive/primary` fill, and `pressedInverse` is described for "dark
  surfaces," where it wouldn't show. As a result `button` and `buttonIcon`
  Primary Pressed look identical to Default. Unconfirmed which description
  is wrong; check with Joneil before building another pressed state on
  either.
- `interactive/primary` and `mascot/primary` both use the word "primary" for
  two unrelated ideas, the main CTA color and the mascot's signature color.
  Don't reuse a word from one naming domain (interaction) in another
  (mascot) just because it happens to fit.
- Color-ramp numbering isn't consistent across families. Most ramps step
  50 to 950. Navy and neutral instead use 0, 800, 900, 950. The number
  doesn't mean the same lightness across families, check the actual color,
  don't infer it from the number.
- Anything named in Title Case with spaces, or prefixed with an underscore
  (`App Bar`, `Status Bar`, `Navbar`, `_Keys - iPhone`, `_Accessory Bar -
  iPhone - Toolbar`, `Liquid Glass - Regular - Small`) is imported system
  chrome (status bars, keyboard, OS-level pieces), not a component this
  design system owns. Don't treat it as available inventory the way you
  would `button` or `chips`, and don't pattern-match its naming for
  anything new.
- `App Bar` (with a space, one real instance, a `Trailing` property) and
  `appBar` (this system's own component, documented above, zero real
  instances) are two different things that happen to be named almost
  identically. This is a live trap, not a hypothetical one, flag it before
  building on either.
- A text layer and the property bound to it sometimes have different names
  (`textBlock`'s "Header" layer is bound to `title`). New components name the
  layer the same as its property.
- The body and caption text styles' line heights (see `typography.textStyle`
  in `tokens.json`) fall below the 1.4 minimum in the platform constraints.
  Components that use them inherit the gap.
- The older icons in the file are Untitled UI (`microphone-01`, `x-close`,
  `thumbs-up`, `square`, their own `check-circle` and others). Their main
  components are missing from the file, so they don't appear in Assets.
  `square` is the default placeholder inside `iconSlot`; an `iconSlot` still
  showing `square` has not had its icon set.

---

## 4. Never do this

- Never invent a value that isn't in `tokens.json`. If something is
  missing, say so instead of filling the gap.
- Never use a CSS fallback value like `var(--token, #333)`. If a token
  resolves to nothing that's a bug to fix, not to hide.
- Sentence case on every label, button and heading. Capitals only for
  proper nouns.
- Never put an appearance word in a semantic name. A word that describes
  how a color looks belongs in the primitive layer only.
- Never read a primitive directly. Components consume the semantic layer,
  and the semantic layer references the primitives.
- Never build something new when a component in this system already does
  the job. Look at what exists before you make anything.
- Never invent a component to fill a gap. This is a real system that gets
  extended on purpose, so say what's missing and what you'd call it, and
  let Joneil decide.
- Never assume two similarly-named things are the same component. Check
  the actual node, not just the label (see `App Bar` vs `appBar` above).
- Never treat "documented" as "tested." A component with a confirmed
  concept but zero real instances (`appBar`, `snackbar`, `textBlock`) hasn't
  actually been proven against real content yet, say that plainly rather
  than describing it as settled.
- Never grey out a control as the only response to something the student
  can't do (like a denied mic). Show why and give them another way through.
- Never use brand violet (`accent/brand/*`) on an interactive control
  without a written reason. The one approved case is `buttonRecord`
  Recording.
- Never label a recall miss "Wrong" or "Incorrect," and never use
  `feedbackBanner` for system errors. A miss is Partial; a failed recording
  is not a verdict.

---

## 5. Components built in the voice recall sprint

All of these live on the **"Components"** page of the Figma file, each in a
section named after it. Descriptions and state notes below are quoted from
Figma exactly as written (component descriptions and Dev Mode annotations).
If they ever differ from this file, Figma is current and this file needs
updating. The reasoning behind each decision is in `component-plans.md`.

### 5.1 `buttonRecord`

**What it is:** the start/stop control for answering out loud.

**States and options:** one variant axis, `state`.

| `state` | What it means (Figma annotation, verbatim) |
|---|---|
| `Default` | **Default: ready to record**<br>- Accessible label: "Start recording" (role: button)<br>- Tap: starts recording, switches to `state=Recording` (`duration/standard`, `easing/standard`)<br>- Press feedback: subtle scale down on press, back on release (`duration/quick`). No color change. Scale value has no token yet.<br>- Minimum touch target is met at 88px |
| `Recording` | **Recording: mic is live**<br>- Fill `accent/brand/bold`, glyph `accent/brand/onBold`. Violet here means Knowie is listening; the stop glyph carries the same meaning without color.<br>- Accessible label: "Stop recording". Announce the change to recording.<br>- Tap: stops the take and moves to Stop, review, send.<br>- Press feedback: same scale down as Default, no color change.<br>- Pulse rings (code only, not drawn): two outline rings centered on the button, `accent/brand/bold` stroke at `Stroke/Border`, looping. Sizes, opacity and loop duration have **no tokens yet**, agree them before building. Screens leave 56px clearance around the button.<br>- Reduced motion: rings don't animate. Violet fill and stop glyph carry the status. |

There is no Pressed and no Disabled state, on purpose. See the description's
GAPS line and `component-plans.md`.

**Other properties:** none. No text, boolean, instance swap or slot
properties. The glyph and fill are tied to `state`.

**Description in Figma (verbatim):**

> WHAT: The mic button for answering out loud (voice, microphone, push-to-talk). One axis, state: Default (light, microphone glyph) and Recording (brand violet, stop glyph). 88px, from the Icon/400 icon plus Space/700 padding.
> USE: One per screen, in the lower half, wherever a student answers by voice: the prompt, the delayed retry prompt, Say it back. Tap in Default starts recording, tap in Recording stops it. Accessibility, press and motion specs are in the annotations on each variant.
> DON'T: Don't swap the glyph or fill by hand. Violet plus the stop glyph together tell a student it's recording, so both have to follow the state.
> GAPS: No Pressed variant: press feedback is a scale-down in code, and the press scale has no token. Pulse rings and loop duration have no tokens either. The 88px size depends on iconSlot 400 staying 32px tall. Icons are Phosphor.

**When to reach for it:** the USE line above.

**What not to do:** the DON'T line above, plus the "Never do this" rules on
greying out a control and on brand violet (section 4).

**Anatomy and tokens** (values in `tokens.json`):

```
state=Default | Recording          padding, gap: Space/0
  Button                           fill: interactive/primary (Default), accent/brand/bold (Recording)
                                   stroke: border/default at Stroke/Border
                                   radius: Radius/Full; padding: Space/700; gap: Space/0
    Center Icon Container          padding, gap: Space/0
      iconSlot                     Size 400 (Icon/400)
                                   icon: microphone (Default), stop (Recording)
                                   glyph: interactive/onPrimary (Default), accent/brand/onBold (Recording)
```

The size is not set directly: it comes from the icon size plus the padding.

### 5.2 `feedbackBanner`

**What it is:** the inline verdict card under the student's transcript after
Knowie judges an answer.

**States and options:** one variant axis, `variant`, named by what happened.

| `variant` | What it means (Figma annotation, verbatim) |
|---|---|
| `Success` | **Success: correct on the first try** (flow state 8)<br>- Sits in `middleContent` under the transcript card, replacing the thinking state in place. No navigation.<br>- Entrance: `duration/standard` + `easing/decelerate`. Under reduced motion, fade only.<br>- Screen reader order: title, body, then the next action (Continue in `bottomContent`). Announce the banner when it appears.<br>- Instance width: fill the slot. |
| `Earned` | **Earned: correct on the delayed retry** (flow state 11)<br>- The proof-of-mastery moment, so it uses the bold fill. Body text is `feedback/success/onBold`, not `text/primary` (which fails contrast on this fill at 2.08:1).<br>- Same placement, entrance and reading order as Success. Next action: Continue. |
| `Partial` | **Partial: any miss** (flow states 9 and 12)<br>- State 9, first miss: reveal the answer, then offer Say it back + Continue (`buttonGroup` Vertical in `bottomContent`).<br>- State 12, missed again on the retry: same variant, bail-out copy, Continue only. Change the copy, not the variant.<br>- Label the miss "Partial", never "Wrong" or "Incorrect". The info icon plus the title separate it from Success without color.<br>- Screen reader order: title, body, answer, then the next action.<br>- Same entrance as Success. |

Flow state numbers refer to `recall-loop-state-list.md`.

**Other properties:**

| Property | Type | Layer it drives | Used in |
|---|---|---|---|
| `title` | Text | `Title` | all variants |
| `body` | Text | `Body` | all variants |
| `answer` | Text | `Answer` | Partial only (Figma still lists it on every variant) |

No boolean, instance swap or slot properties. The tone icon is fixed per
variant.

**Description in Figma (verbatim):**

> WHAT: The inline result card under the student's transcript after Knowie judges a recall answer. One axis, variant: Success, Earned, Partial. Text properties: title, body, answer (Partial only).
> USE: Pick the variant by what happened. Success: correct first try. Earned: correct on the delayed retry. Partial: any miss, including the final miss after a retry (change the copy, not the variant). Set the instance to fill its slot. Motion and reading order are in the annotations.
> DON'T: Don't hide or swap the tone icon. It's what separates Success from Partial without color.
> GAPS: Body text styles have 1.33 line height, below the 1.4 minimum in platform constraints. Icons are Phosphor.

**When to reach for it:** the USE line above.

**What not to do:** the DON'T line above, plus the "Never do this" rule on
labelling misses and on system errors (section 4).

**Anatomy and tokens** (values in `tokens.json`):

```
variant=Success | Earned | Partial   width: Layout/Content Width; padding, gap: Space/0
  Banner                             fill: feedback/success/subtle (Success), feedback/success/bold (Earned),
                                           feedback/partial/subtle (Partial)
                                     radius: Radius/400; padding: Space/400; gap: Space/300
    Title Container                  gap: Space/200; padding: Space/0
      iconSlot                       Size 250 (Icon/250)
                                     icon: check-circle (Success, Earned), info (Partial)
                                     glyph: same token as Title
      Title                          text style: Greed/Headline S
                                     color: feedback/success/onSubtle (Success), feedback/success/onBold (Earned),
                                            feedback/partial/onSubtle (Partial)
    Body                             text style: Greed/Body S Regular
                                     color: text/primary (Success, Partial), feedback/success/onBold (Earned)
    Answer                           Partial only. text style: Greed/Body S Bold; color: feedback/partial/onSubtle
```

`Layout/Content Width` is a Figma variable added in this sprint. In
`tokens.json` it is `size.layout.content-width`.

### 5.3 Icons

All in the "Icons" section, frame "Phosphor". One component per icon, no
variants. Place them through `iconSlot`'s instance swap, never loose.

| Icon | Description in Figma (verbatim) | Layer | Used by |
|---|---|---|---|
| `microphone` | microphone, mic, voice, audio, record, speak | `Icon (Stroke)` | `buttonRecord` Default |
| `stop` | stop, end, finish, recording, square | `Icon (Solid)` | `buttonRecord` Recording |
| `check-circle` | check, tick, confirm, correct, success, circle | `Icon (Stroke)` | `feedbackBanner` Success, Earned |
| `info` | info, information, help, hint, partial, circle | `Icon (Stroke)` | `feedbackBanner` Partial |
| `x` | x, close, cancel, dismiss, remove, exit | `Icon (Stroke)` | Nothing yet. Intended for close and cancel actions. |

---

## 6. Conventions for making a new component

Follow these when adding anything to the system. They describe how
`buttonRecord`, `feedbackBanner` and the Phosphor icons were built.

### Before building

- Check section 2 and the file first. Don't build what already exists.
- Every color, size, spacing, radius and stroke value must come from an
  existing variable, bound to the property. If a value has no variable,
  stop and ask Joneil. Don't hardcode it, and don't borrow a variable from
  an unrelated group because its number happens to match (for example,
  an `Illustration/*` size for a layout width).
- A value can be reached by combining variables when that's what the
  variables are for: `buttonRecord`'s size is an `Icon/*` icon plus
  `Space/*` padding, with no fixed width.
- Only build a state that is real and visibly different. If the only
  difference is motion (press scale, pulse), put it in an annotation, not a
  variant. If a state would trap the student (a greyed-out mic), design the
  screen-level answer instead.
- If Joneil approves a new variable, add it to the right Figma collection
  with a description and the narrowest scope, then add it to `tokens.json`
  in the same group structure (see section 3, Tokens).

### Naming

- **Component set:** camelCase, family word first when it belongs to a
  family: `buttonRecord` sits with `button`, `buttonIcon`, `buttonGroup`.
- **Variant axes:** lowercase camelCase. Use `state` for interaction or
  status states (`Default`, `Recording`) and `variant` for kinds or
  outcomes (`Success`, `Earned`, `Partial`), matching `button` and
  `snackbar`. Prefer one axis. Two axes are only allowed when every
  combination is real.
- **Variant values:** Title Case, single words, describing what happened or
  what the thing is. Never an appearance word (`Bold`, `Violet`, `Light`).
- **Variant component names:** `axis=Value`, e.g. `state=Recording`,
  `variant=Partial`, so the axis comes out right when combined.
- **Text properties:** lowercase single words (`title`, `body`, `answer`).
  The text layer they drive has the same name in Title Case (`Title`,
  `Body`, `Answer`).
- **Boolean properties:** prefix `show`. Don't add one if turning it on or
  off can produce an invalid combination.
- **Layers:** Title Case with spaces. The variant root holds one main frame
  named for its role (`Button`, `Banner`). Grouping frames are named
  `<Thing> Container` (`Center Icon Container`, `Title Container`). Icon
  instances keep the name `iconSlot`. No default names like `Frame 123`.
- **Icons:** lowercase kebab-case, named after the Phosphor source file
  without the weight suffix (`check-circle`, not `check-circle-bold`).
  Avoid names that clash with the old Untitled UI icons listed in section 3.

### Structure

- **Variant root:** a component with auto layout and padding and gap bound
  to `Space/0`. It holds the main frame. When text inside needs to wrap, the
  root's width is bound to a layout variable (`Layout/Content Width`) and
  instances are set to fill their slot.
- **Main frame:** auto layout, with fill, stroke, radius, padding and gap all
  bound. Strokes are excluded from layout so they don't change the size.
- **Icons:** always an `iconSlot` instance at an `Icon/*` size, with its
  instance swapped to the icon component. The glyph color is overridden and
  bound to the same semantic token as the text or content next to it. The
  icon choice is tied to the variant, not exposed as a property.
- **Text:** a Greed text style from the file, a bound color, fill width,
  auto height, and linked to its text property.
- **Properties:** add text, boolean, instance swap or slot properties to
  each variant component before combining them into a set.
- **Component set layout:** auto layout, variants side by side, padding and
  gap bound to `Space/600`, corner radius bound to `Radius/150`.

### Icons

- Family: **Phosphor**, from `Yummy Labs AI Sprint/SVGs`. Bold weight for
  line icons, fill weight only where the glyph must be solid. Don't restore
  or build new Untitled UI icons, and don't mix families in one component.
- Build: strokes outlined and merged into one vector; component frame width
  and height bound to `Icon/300`; one vector layer named `Icon (Stroke)` or
  `Icon (Solid)`; glyph fill bound to `background/inverse` (the parent
  component overrides it); vector constraints Scale.
- Description: lowercase, comma-separated search keywords.

### Canvas

- New components go on the **"Components"** page, one section per
  component, named exactly after the component set, with its fill bound to
  `background/page`. The section name is the label; no title text layers.
- All icons share one "Icons" section.
- Test instances go in a screen or a scratch page, not loose on the
  Components page.
- The 10 original sets stay on "🎨 Mascot & components" for now.

### Documentation

- **Component description** (short, in this order, one line each):
  WHAT (what it is, its axis and values, any text properties), USE (where
  and when, what tapping does, a pointer to the annotations), DON'T (one
  thing, with the reason), GAPS (missing tokens, known dependencies, icon
  family).
- **Dev Mode annotation on every variant:** what that state means, its
  accessible label, what tapping does, press and motion behavior with
  motion tokens, placement in the scaffold, reading order, and anything
  that exists only in code. No raw values for anything that has no token;
  say it has no token yet.
- **`component-plans.md`:** the decisions and why. Don't copy the Figma
  description there; Figma is the source for how to use a component.
- **This file:** add a row to section 2 and a full entry to section 5,
  quoting the Figma description and annotations verbatim.
- **`tokens.json`:** re-export whenever a variable is added or changed.
