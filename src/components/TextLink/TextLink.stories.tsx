import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { TextLink } from './TextLink';

const COMPONENT_DESCRIPTION = `**WHAT:** A plain underlined text link for a low-stakes escape action — matches the "esc: ..." text layers in the Figma draft screens ("I can't talk right now" on the prompt screen, "Back to speaking" on the text-alternative screen) exactly. No variant axis, no fill, no border — just text/tertiary, underlined.

**USE:** Anywhere a screen offers a way out that isn't the primary or secondary action — switching input modes, backing out of a lighter flow. Not for anything that should look like a button; use \`Button\` (Tertiary) for that instead.

**DON'T:** Don't add a background or border to make it look more like a button — the Figma source draws this as plain text on purpose, distinct from the pill-shaped button lookalikes on the same screens.

**GAPS:** No Figma component yet — these are plain TEXT layers in Figma, not a component instance, so there's nothing to instantiate from.`;

const meta = {
  title: 'Components/TextLink',
  component: TextLink,
  parameters: {
    docs: { description: { component: COMPONENT_DESCRIPTION } },
  },
  tags: ['autodocs'],
  args: {
    children: "I can't talk right now",
    onClick: fn(),
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BackToSpeaking: Story = {
  args: {
    children: 'Back to speaking',
  },
};

export const ClickCallsOnClick: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: "I can't talk right now" }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
