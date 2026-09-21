import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useRouter } from 'next/navigation';
import { expect, fn, mocked, userEvent } from 'storybook/test';
import { RecallScreen } from './RecallScreen';
import { EXAMPLE_TERM, RecallSessionProvider } from '../../lib/RecallSessionContext';

const COMPONENT_DESCRIPTION = `**WHAT:** The core per-term recall loop — idle, recording, reviewing, processing, result — for one term, wired to \`useRecallSession\` (the shared cross-route context, not a local \`useRecallTerm\` call). No Figma component (it's a screen composition, not a design-system component), and only a partial slice of the full loop by deliberate scope choice.

**Deliberately not covered here:** top navigation (close button, progress bar) — a known next step. Session end, the text-fallback toggle, and Say it back **are all wired** — a terminal result (a pass, or a second miss) routes to \`/session-end\` on Continue, "I can't talk right now" (idle and reviewing only) routes to \`/text\`, and a first-miss Partial result offers "Say it back" alongside Continue, routing to \`/say-it-back\` — but none of those three destination screens are part of this component.

**Motion:** the record button, the review screen's Send/Discard buttons, the processing skeleton, and the result banner all share one \`layoutId\`, so Motion morphs the bounding box between whichever is mounted — matching the "single persistent component, shared-layout animation" decision.`;

const meta = {
  title: 'Screens/RecallScreen',
  component: RecallScreen,
  parameters: {
    docs: { description: { component: COMPONENT_DESCRIPTION } },
  },
  tags: ['autodocs'],
  // next/navigation is auto-mocked globally (.storybook/preview.tsx) —
  // useRouter() otherwise throws outside a real Next.js app router. Give it
  // a real push implementation so RecallScreen's Continue handler doesn't
  // crash on a terminal result.
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
  // RecallScreen reads its term from RecallSessionContext, not props —
  // every story needs the real provider mounted around it.
  decorators: [
    (Story) => (
      <RecallSessionProvider>
        <Story />
      </RecallSessionProvider>
    ),
  ],
} satisfies Meta<typeof RecallScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const TextSwitchNavigatesToText: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('button', { name: "I can't talk right now" });
    await userEvent.click(link);
    const router = mocked(useRouter)();
    await expect(router.push).toHaveBeenCalledWith('/text');
  },
};

export const Recording: Story = {
  play: async ({ canvas }) => {
    const recordButton = await canvas.findByRole('button', { name: 'Start recording' });
    await userEvent.click(recordButton);
    await expect(canvas.getByRole('button', { name: 'Stop recording' })).toBeInTheDocument();
  },
};

export const Reviewing: Story = {
  play: async ({ canvas }) => {
    const recordButton = await canvas.findByRole('button', { name: 'Start recording' });
    await userEvent.click(recordButton);
    const stopButton = await canvas.findByRole('button', { name: 'Stop recording' });
    await userEvent.click(stopButton);
    await expect(canvas.getByText(/You said/i)).toBeInTheDocument();
    // findByRole, not getByRole — the record row and review actions are
    // different layoutId-keyed elements under AnimatePresence mode="wait",
    // so Send doesn't mount until the outgoing element's exit animation
    // finishes. Real timing, not a fixed delay to wait out.
    await expect(await canvas.findByRole('button', { name: 'Send' })).toBeInTheDocument();
  },
};

// Full traversal: record -> stop -> send -> wait out the scripted processing
// delay -> verdict banner. Slower than the other stories (waits out the real
// ~2.5s processing delay) but it's the only test that proves the loop
// actually reaches a result, not just each state in isolation.
export const FullLoopReachesFirstMissResult: Story = {
  play: async ({ canvas }) => {
    const recordButton = await canvas.findByRole('button', { name: 'Start recording' });
    await userEvent.click(recordButton);
    const stopButton = await canvas.findByRole('button', { name: 'Stop recording' });
    await userEvent.click(stopButton);
    const sendButton = await canvas.findByRole('button', { name: 'Send' });
    await userEvent.click(sendButton);

    // Not findByRole('status') — ProcessingSkeleton is role="status" too, so
    // that query would resolve instantly against the skeleton rather than
    // waiting for it to be replaced. Not findByRole('heading') either — the
    // term prompt itself is an <h2>, present from the start. Waiting for
    // the banner's exact title text is the only unambiguous signal that
    // the verdict actually landed.
    const bannerTitle = await canvas.findByText('Almost there', undefined, { timeout: 4000 });
    await expect(bannerTitle).toBeInTheDocument();
    await expect(canvas.getByText(EXAMPLE_TERM.answerReveal)).toBeInTheDocument();
  },
};

// Same traversal to a first-miss result, then confirms "Say it back" is
// offered there specifically (not on a pass, not on a second miss) and
// navigates correctly.
export const SayItBackOfferedOnFirstMiss: Story = {
  play: async ({ canvas }) => {
    const recordButton = await canvas.findByRole('button', { name: 'Start recording' });
    await userEvent.click(recordButton);
    const stopButton = await canvas.findByRole('button', { name: 'Stop recording' });
    await userEvent.click(stopButton);
    const sendButton = await canvas.findByRole('button', { name: 'Send' });
    await userEvent.click(sendButton);

    await canvas.findByText('Almost there', undefined, { timeout: 4000 });
    const sayItBackButton = await canvas.findByRole('button', { name: 'Say it back' });
    await userEvent.click(sayItBackButton);
    const router = mocked(useRouter)();
    await expect(router.push).toHaveBeenCalledWith('/say-it-back');
  },
};
