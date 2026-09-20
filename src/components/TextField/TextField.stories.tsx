import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { TextField } from './TextField';

// Written directly — no Figma source exists for this component (see the
// header comment in TextField.module.css for why).
const COMPONENT_DESCRIPTION = `**WHAT:** A multi-line text field for typing a recall answer instead of speaking it. No variant axis — one visual treatment, with a real \`:focus-visible\` state. There's no separate "filled" look: typed text simply replaces the placeholder.

**USE:** The text-alternative screen (reached via "I can't talk right now"), and the review screen's text-switch affordance. Pass a visually-hidden \`label\` for the accessible name — the visible surface is placeholder-only, matching the text-alternative draft screen. Controlled: pass \`value\` and \`onChange\`.

**DON'T:** Don't add a visible label above this field without checking with Joneil first — placeholder-only is a decision, not an oversight.

**GAPS:** No Figma component yet. No Disabled state — nothing in the current flow ever disables this field, matching \`buttonRecord\`'s "no state that isn't real" rule. No error/success validation states either, though \`color.border.error\`, \`color.border.success\`, and \`color.text.error\` already exist in \`tokens.json\` anticipating one — flagged as unbuilt, not forgotten.`;

const meta = {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    docs: {
      description: {
        component: COMPONENT_DESCRIPTION,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Your answer',
    placeholder: 'Type your answer…',
    value: '',
    onChange: fn(),
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Typed: Story = {
  args: {
    value:
      'Chlorophyll absorbs sunlight, which powers the conversion of CO2 and water into glucose and oxygen.',
  },
};

// Confirms typing actually reaches the consumer — this component is
// controlled, so the story itself won't visually update on each keystroke,
// but the callback firing is the real contract to verify.
export const TypingCallsOnChange: Story = {
  play: async ({ canvas, args }) => {
    const field = canvas.getByLabelText('Your answer');
    await userEvent.type(field, 'Hi');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Focused: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Your answer');
    await userEvent.click(field);
  },
};
