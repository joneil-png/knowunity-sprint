import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FeedbackBanner } from './FeedbackBanner';

// Verbatim from the `feedbackBanner` component set's Figma description
// (Yummy__Knowie Design System, node 13643:5223, page "Components") — read
// with the figma-console MCP's figma_get_component tool,
// "desktop_bridge_plugin" source. Matches docs/design-system.md §5.2
// exactly, confirmed word-for-word against the live file.
const FIGMA_DESCRIPTION = `**WHAT:** The inline result card under the student's transcript after Knowie judges a recall answer. One axis, variant: Success, Earned, Partial. Text properties: title, body, answer (Partial only).

**USE:** Pick the variant by what happened. Success: correct first try. Earned: correct on the delayed retry. Partial: any miss, including the final miss after a retry (change the copy, not the variant). Set the instance to fill its slot. Motion and reading order are in the annotations.

**DON'T:** Don't hide or swap the tone icon. It's what separates Success from Partial without color.

**GAPS:** Body text styles have 1.33 line height, below the 1.4 minimum in platform constraints. Icons are Phosphor.

---

**Two implementation notes beyond the Figma file itself:**
- **Width**: the 358px shown in Figma is \`Layout/Content Width\` resolved for a 390px screen — this component is fluid (\`width: 100%\`) per the "fill its slot" instruction above, not locked to that pixel value. The stories below wrap it in the same 16px side margins the real screens use, so it renders at that width here too.
- **Tone icons**: the real Phosphor "check-circle" and "info" vectors aren't retrievable through the Figma API — these are simple hand-built stand-ins, not the real assets.

The 1.33 line-height gap in GAPS is inherited from the \`body/sRegular\` and \`body/sBold\` text styles this component reuses as-is — it isn't something to override here without changing those tokens.`;

const meta = {
  title: 'Components/FeedbackBanner',
  component: FeedbackBanner,
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['Success', 'Earned', 'Partial'] },
  },
  decorators: [
    // Demonstrates the real screen context: 16px side margins (the same
    // margin the 358px Layout/Content Width figure comes from on a 390px
    // screen), with the banner filling the space between them.
    (Story) => (
      <div style={{ padding: 'var(--size-space-400)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeedbackBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Per-variant Dev Mode annotations, verbatim from Figma.
const SUCCESS_ANNOTATION = `**Success: correct on the first try** (flow state 8)

- Sits in \`middleContent\` under the transcript card, replacing the thinking state in place. No navigation.
- Entrance: \`duration/standard\` + \`easing/decelerate\`. Under reduced motion, fade only.
- Screen reader order: title, body, then the next action (Continue in \`bottomContent\`). Announce the banner when it appears.
- Instance width: fill the slot.`;

const EARNED_ANNOTATION = `**Earned: correct on the delayed retry** (flow state 11)

- The proof-of-mastery moment, so it uses the bold fill. Body text is \`feedback/success/onBold\`, not \`text/primary\` (which fails contrast on this fill at 2.08:1).
- Same placement, entrance and reading order as Success. Next action: Continue.`;

const PARTIAL_ANNOTATION = `**Partial: any miss** (flow states 9 and 12)

- State 9, first miss: reveal the answer, then offer Say it back + Continue (\`buttonGroup\` Vertical in \`bottomContent\`).
- State 12, missed again on the retry: same variant, bail-out copy, Continue only. Change the copy, not the variant.
- Label the miss "Partial", never "Wrong" or "Incorrect". The info icon plus the title separate it from Success without color.
- Screen reader order: title, body, answer, then the next action.
- Same entrance as Success.`;

// One story per Figma variant, named exactly the way Figma names them.
// Copy is Figma's own example content for each variant.
export const Success: Story = {
  args: {
    variant: 'Success',
    title: 'Nice!',
    body: "That's exactly it, chlorophyll absorbing sunlight is what kicks the whole reaction off.",
  },
  parameters: {
    docs: { description: { story: SUCCESS_ANNOTATION } },
  },
};

export const Earned: Story = {
  args: {
    variant: 'Earned',
    title: 'You got it!',
    body: 'And this time nobody told you. That’s the real thing.',
  },
  parameters: {
    docs: { description: { story: EARNED_ANNOTATION } },
  },
};

export const Partial: Story = {
  args: {
    variant: 'Partial',
    title: 'Almost there',
    body: "You had the sunlight part. Here's the fuller picture:",
    answer:
      'Chlorophyll absorbs sunlight, which powers the conversion of CO2 and water into glucose and oxygen.',
  },
  parameters: {
    docs: { description: { story: PARTIAL_ANNOTATION } },
  },
};
