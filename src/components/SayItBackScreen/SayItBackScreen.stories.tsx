import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useRouter } from 'next/navigation';
import { expect, fn, mocked, userEvent, waitFor } from 'storybook/test';
import { SayItBackScreen } from './SayItBackScreen';
import { EXAMPLE_TERM, RecallSessionProvider } from '../../lib/RecallSessionContext';

// Figma frame: "7. Say it back" on the "Voice Recall — Draft Screens"
// canvas — read live via the figma-console MCP. Matched for content and
// structure, not pixel-for-pixel; see SayItBackScreen.module.css's header
// comment for the specific deviations and why.
const COMPONENT_DESCRIPTION = `**WHAT:** The optional unaided repeat-back after a first miss reveals the answer — sprint-context.md: "a first miss reveals the answer, offers an optional unscored say-it-back." One take, no verdict. Reached from the result screen's first-miss Partial banner.

**USE:** Reads \`term\` and \`finishSayItBack\` from \`useRecallSession()\`. Recording state is local to this screen (\`useState\`), not the shared status — stopping the take auto-advances after a brief beat (700ms, a judgment call, not specified anywhere), calls \`finishSayItBack()\` (which now also queues the retry — see \`useRecallTerm.ts\`), then returns to \`/\`.

**Deviations from the Figma frame:** "Say it back, no pressure" reads in sentence case, not the frame's all-caps — design-system.md §4. The frame's "Skip this, next term" escape link is omitted — manual Skip was removed earlier in this build (superseded by two-miss auto-retirement) and is explicitly out of scope. The quoted text shows the term's full \`answerReveal\`, not the frame's shortened quote — there's only one canonical reveal string in the data model, no separate short version. No top navigation, same scope cut as every other screen.`;

const meta = {
  title: 'Screens/SayItBackScreen',
  component: SayItBackScreen,
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
} satisfies Meta<typeof SayItBackScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText(`“${EXAMPLE_TERM.answerReveal}”`)).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Start recording' })).toBeInTheDocument();
  },
};

export const Recording: Story = {
  play: async ({ canvas }) => {
    const recordButton = await canvas.findByRole('button', { name: 'Start recording' });
    await userEvent.click(recordButton);
    await expect(canvas.getByRole('button', { name: 'Stop recording' })).toBeInTheDocument();
    await expect(canvas.getByText('Tap to stop')).toBeInTheDocument();
  },
};

// Full traversal: record -> stop -> wait out the auto-advance beat ->
// navigates home. Slower than the other stories (waits out the real
// 700ms delay) but it's the only test that proves stopping actually leads
// somewhere, not just that the button toggles.
export const StoppingNavigatesHome: Story = {
  play: async ({ canvas }) => {
    const recordButton = await canvas.findByRole('button', { name: 'Start recording' });
    await userEvent.click(recordButton);
    const stopButton = await canvas.findByRole('button', { name: 'Stop recording' });
    await userEvent.click(stopButton);

    // Nothing in the DOM signals the delayed navigation firing — the
    // button already flips back to Default synchronously on stop, before
    // the 700ms beat elapses — so this polls the mock instead of a query.
    const router = mocked(useRouter)();
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/'), { timeout: 2000 });
  },
};
