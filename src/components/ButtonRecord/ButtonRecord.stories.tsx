import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ButtonRecord } from './ButtonRecord';

// Verbatim from the `buttonRecord` component set's Figma description
// (Yummy__Knowie Design System, node 13638:5990, page "Components") — read
// with the figma-console MCP's figma_get_component tool,
// "desktop_bridge_plugin" source. Matches docs/design-system.md §5.1
// exactly, confirmed word-for-word against the live file.
const FIGMA_DESCRIPTION = `**WHAT:** The mic button for answering out loud (voice, microphone, push-to-talk). One axis, state: Default (light, microphone glyph) and Recording (brand violet, stop glyph). 88px, from the Icon/400 icon plus Space/700 padding.

**USE:** One per screen, in the lower half, wherever a student answers by voice: the prompt, the delayed retry prompt, Say it back. Tap in Default starts recording, tap in Recording stops it. Accessibility, press and motion specs are in the annotations on each variant.

**DON'T:** Don't swap the glyph or fill by hand. Violet plus the stop glyph together tell a student it's recording, so both have to follow the state.

**GAPS:** No Pressed variant: press feedback is a scale-down in code, and the press scale has no token. Pulse rings and loop duration have no tokens either. The 88px size depends on iconSlot 400 staying 32px tall. Icons are Phosphor.

---

**This component is presentational only** — it renders whatever \`state\` you pass and calls your \`onClick\`; it doesn't touch the microphone or manage recording itself. The parent decides when \`state\` actually changes to \`"Recording"\`.

**Three implementation notes beyond the Figma file itself, all from the GAPS line above, and all flagged in \`ButtonRecord.module.css\`:**
- **Press scale**: Figma specifies a scale-down on press with no token for the amount. Uses \`0.96\`, a placeholder pick.
- **Pulse rings** (Recording only): Figma's own annotation says sizes, opacity, and loop duration have no tokens yet and to *"agree them before building"* — built anyway as a flagged placeholder (2s loop, un-tokenized) per Joneil's call, not real values.
- **Icon glyphs**: the real Phosphor "microphone" and "stop" vectors aren't retrievable through the Figma API — these are simple hand-built stand-ins, not the real assets.`;

const meta = {
  title: 'Components/ButtonRecord',
  component: ButtonRecord,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'radio', options: ['Default', 'Recording'] },
  },
} satisfies Meta<typeof ButtonRecord>;

export default meta;
type Story = StoryObj<typeof meta>;

// Per-variant Dev Mode annotations, verbatim from Figma — the component
// description above only covers the shared WHAT/USE/DON'T/GAPS; these are
// the state-specific accessibility/press/motion specs each variant carries
// on its own layer.
const DEFAULT_ANNOTATION = `**Default: ready to record**

- Accessible label: "Start recording" (role: button)
- Tap: starts recording, switches to \`state=Recording\` (\`duration/standard\`, \`easing/standard\`)
- Press feedback: subtle scale down on press, back on release (\`duration/quick\`). No color change. Scale value has no token yet.
- Minimum touch target is met at 88px`;

const RECORDING_ANNOTATION = `**Recording: mic is live**

- Fill \`accent/brand/bold\`, glyph \`accent/brand/onBold\`. Violet here means Knowie is listening; the stop glyph carries the same meaning without color.
- Accessible label: "Stop recording". Announce the change to recording.
- Tap: stops the take and moves to Stop, review, send.
- Press feedback: same scale down as Default, no color change.
- Pulse rings (code only, not drawn): two outline rings centered on the button, \`accent/brand/bold\` stroke at \`Stroke/Border\`, looping. Sizes, opacity and loop duration have **no tokens yet**, agree them before building. Screens leave 56px clearance around the button.
- Reduced motion: rings don't animate. Violet fill and stop glyph carry the status.`;

// One story per Figma variant, named exactly the way Figma names them.
export const Default: Story = {
  args: { state: 'Default' },
  parameters: {
    docs: { description: { story: DEFAULT_ANNOTATION } },
  },
};

export const Recording: Story = {
  args: { state: 'Recording' },
  parameters: {
    docs: { description: { story: RECORDING_ANNOTATION } },
  },
};
