import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useRouter } from 'next/navigation';
import { expect, fn, mocked } from 'storybook/test';
import { SessionEndScreen } from './SessionEndScreen';
import {
  EXAMPLE_TERM,
  RecallSessionContext,
  RecallSessionProvider,
  type RecallSessionValue,
} from '../../lib/RecallSessionContext';

// Written directly — no Figma frame exists for this screen (confirmed live
// against the "Voice Recall — Draft Screens" canvas; see the header comment
// in SessionEndScreen.module.css).
const COMPONENT_DESCRIPTION = `**WHAT:** The end-of-session revisit list — every term that was missed twice and retired. One populated state; an empty session redirects to "/" instead of rendering an empty screen (sprint-context.md: "doesn't appear if there are none").

**USE:** Reached from the main recall loop's Continue button on any terminal outcome (a pass, or a second miss) — see \`RecallScreen.tsx\`'s \`handleContinue\`. Reads \`retiredTerms\` from \`useRecallSession()\`; doesn't take props.

**DON'T:** Don't treat a tap on a retired term as going anywhere real yet — it's a decided no-op stub. "The existing lesson content sheet" it's meant to open lives elsewhere in the real Knowunity app, outside this repo.

**GAPS:** No Figma frame. No list/row component in Storybook — this screen's rows are plain tokenized markup, logged in \`component-gaps.md\`. The example term's scripted outcomes (\`partial\`, then \`pass\`) never actually reach "retired," so the populated story below fabricates a context value rather than reaching that state through real interaction — there's currently no way to demo this screen's real content through the actual app without temporarily changing the example term's outcomes.`;

// Fabricated context value — the real provider always starts with an empty
// retiredTerms list, and (see GAPS above) the example term can't naturally
// reach "retired" as currently scripted. This is the only way to exercise
// the populated state in isolation.
const POPULATED_VALUE: RecallSessionValue = {
  term: EXAMPLE_TERM,
  state: {
    status: 'result',
    attempt: 1,
    isRetry: true,
    transcript: '',
    verdict: 'partial',
    retired: true,
  },
  startRecording: fn(),
  stopRecording: fn(),
  discardAndReRecord: fn(),
  send: fn(),
  startSayItBack: fn(),
  finishSayItBack: fn(),
  continueAfterResult: fn(),
  retiredTerms: [{ id: EXAMPLE_TERM.prompt, prompt: EXAMPLE_TERM.prompt }],
};

const meta = {
  title: 'Screens/SessionEndScreen',
  component: SessionEndScreen,
  parameters: {
    docs: { description: { component: COMPONENT_DESCRIPTION } },
  },
  tags: ['autodocs'],
  // next/navigation is auto-mocked globally (.storybook/preview.tsx) — this
  // screen calls useRouter().replace() when the retired-terms list is
  // empty, which otherwise throws outside a real Next.js app router.
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
} satisfies Meta<typeof SessionEndScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = {
  decorators: [
    (Story) => (
      <RecallSessionContext.Provider value={POPULATED_VALUE}>
        <Story />
      </RecallSessionContext.Provider>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(canvas.getByText(EXAMPLE_TERM.prompt)).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: EXAMPLE_TERM.prompt })).toBeInTheDocument();
  },
};

// A fresh session has nothing retired yet, so this redirects immediately
// and renders nothing — the real provider's natural starting state already
// demonstrates this without any fabricated value.
export const EmptyRedirects: Story = {
  decorators: [
    (Story) => (
      <RecallSessionProvider>
        <Story />
      </RecallSessionProvider>
    ),
  ],
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
  },
};
