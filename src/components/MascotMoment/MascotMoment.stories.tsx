import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MascotMoment } from './MascotMoment';

const COMPONENT_DESCRIPTION = `**WHAT:** A mascot reaction image plus a caption, for a moment in the recall loop that calls for Knowie's personality rather than a plain status message. No Figma component — \`mascotSlot\` (design-system.md §2) is fixed to the "standby" pose with no confirmed instance-swap, and nothing under that name exists in Storybook, so this reaches for the raw reaction art under \`public/images/\` directly. Graduated from two inline copies (RecallScreen's Processing and Recording states) per this project's inline-then-graduate convention.

**USE:** Pick \`pose\` by what Knowie's reacting to, write a \`label\` that says what's happening. Pass \`announce\` when the moment appears asynchronously with no preceding user action in the same interaction (e.g. Processing, after a delay) — it adds \`role="status"\` so screen readers pick it up. Skip it when something else in the same interaction already announces the state change (e.g. Recording, where ButtonRecord's own aria-live already covers it) to avoid a duplicate announcement.

**DON'T:** Don't reach for this as a generic image-plus-caption layout — it's specifically for a mascot reaction moment, not a general pattern.`;

const meta = {
  title: 'Components/MascotMoment',
  component: MascotMoment,
  parameters: {
    docs: {
      description: {
        component: COMPONENT_DESCRIPTION,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    pose: { control: 'radio', options: ['thinking', 'standby'] },
    announce: { control: 'boolean' },
  },
} satisfies Meta<typeof MascotMoment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Thinking: Story = {
  args: {
    pose: 'thinking',
    label: 'Checking your answer…',
    announce: true,
  },
};

export const Standby: Story = {
  args: {
    pose: 'standby',
    label: "I'm listening…",
  },
};
