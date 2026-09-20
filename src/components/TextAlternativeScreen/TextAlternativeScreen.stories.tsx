import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useRouter } from 'next/navigation';
import { expect, fn, mocked, userEvent } from 'storybook/test';
import { TextAlternativeScreen } from './TextAlternativeScreen';
import { EXAMPLE_TERM, RecallSessionProvider } from '../../lib/RecallSessionContext';

// Figma frame: "10. Text alternative" on the "Voice Recall — Draft
// Screens" canvas — read live via the figma-console MCP. Matched for
// content and structure, not pixel-for-pixel; see TextAlternativeScreen.module.css's
// header comment for the specific deviations and why.
const COMPONENT_DESCRIPTION = `**WHAT:** The text-fallback screen — typing an answer instead of speaking it. One state: typing. Reached from the main recall loop's "I can't talk right now" (idle and reviewing).

**USE:** Reads \`term\` and \`send\` from \`useRecallSession()\`. Submitting calls the same \`send()\` voice uses — no review step, since typed text has no mishearing risk to protect against — then returns to \`/\`, which is already mid-flow (processing, then a verdict) by the time it renders.

**Deviations from the Figma frame:** label reads "Typing instead" in sentence case, not the frame's all-caps "TYPING INSTEAD" — design-system.md §4's sentence-case rule overrides the draft. The question headline comes before the text field, not after, matching this app's own established reading order (see RecallScreen) rather than the draft's field-before-headline arrangement, which isn't addressed in any decision doc. Submit uses \`Button\`'s real Primary styling (interactive/primary), not the draft's brand-violet fill — brand violet on an interactive control outside \`buttonRecord\`'s Recording state violates design-system.md §4. No top navigation, matching every other screen built so far.`;

const meta = {
  title: 'Screens/TextAlternativeScreen',
  component: TextAlternativeScreen,
  parameters: {
    docs: { description: { component: COMPONENT_DESCRIPTION } },
  },
  tags: ['autodocs'],
  beforeEach: () => {
    mocked(useRouter).mockReturnValue({
      push: fn(),
      replace: fn(),
      back: fn(),
      forward: fn(),
      prefetch: fn(),
      refresh: fn(),
    } as unknown as ReturnType<typeof useRouter>);
  },
  decorators: [
    (Story) => (
      <RecallSessionProvider>
        <Story />
      </RecallSessionProvider>
    ),
  ],
} satisfies Meta<typeof TextAlternativeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText(EXAMPLE_TERM.prompt)).toBeInTheDocument();
    await expect(canvas.getByLabelText('Your answer')).toBeInTheDocument();
  },
};

export const SubmitNavigatesHome: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Your answer');
    await userEvent.type(field, 'Chlorophyll absorbs sunlight.');
    const submit = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submit);
    const router = mocked(useRouter)();
    await expect(router.push).toHaveBeenCalledWith('/');
  },
};

export const BackToSpeakingNavigatesHome: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('button', { name: 'Back to speaking' });
    await userEvent.click(link);
    const router = mocked(useRouter)();
    await expect(router.push).toHaveBeenCalledWith('/');
  },
};
