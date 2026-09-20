import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProcessingSkeleton } from './ProcessingSkeleton';

// Written directly — no Figma source exists for this component (see the
// header comment in ProcessingSkeleton.module.css for why).
const COMPONENT_DESCRIPTION = `**WHAT:** The calm "thinking" placeholder shown between stopping a recall answer and Knowie's verdict — voice-ux-reference.md principle 6: "a skeleton/animated state, not a dead spinner." No variant axis. Shape mirrors \`feedbackBanner\` on purpose (same padding, gap, and radius; a title row sized to \`feedbackBanner\`'s iconSlot 250 plus headline-S), because it occupies the exact spot \`feedbackBanner\` fills once the verdict is in.

**USE:** Under the transcript, in the same \`middleContent\` position \`feedbackBanner\` will use, per sprint-context.md's "review, processing and verdict are one screen ... the bottom area swaps from buttons to thinking skeleton to banner." Pass a visually-hidden \`label\` describing the wait for screen readers (the shimmering blocks are \`aria-hidden\`, decorative only).

**DON'T:** Don't reuse this for any other loading state without checking the shape still makes sense — it's built to match feedbackBanner's dimensions specifically, not as a generic spinner replacement.

**GAPS:** No Figma component yet. Shimmer sweep duration (1.6s) has no backing motion token — flagged in ProcessingSkeleton.module.css, same category of gap as Button's spinner and ButtonRecord's pulse rings.`;

const meta = {
  title: 'Components/ProcessingSkeleton',
  component: ProcessingSkeleton,
  parameters: {
    docs: {
      description: {
        component: COMPONENT_DESCRIPTION,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Checking your answer…',
  },
} satisfies Meta<typeof ProcessingSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
