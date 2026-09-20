import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent } from 'storybook/test';
import { Button, type ButtonSize, type ButtonVariant } from './Button';

// Verbatim from the `button` component set's Figma description
// (Yummy__Knowie Design System, node 9003:6667) — read with the
// figma-console MCP's figma_get_component tool, "desktop_bridge_plugin"
// source, so this is current as of today, not a paraphrase.
const FIGMA_DESCRIPTION = `**WHAT:** Three visual weights (Primary/Secondary/Tertiary) times three sizes (S/M/L) times four states (Default/Pressed/Disabled/Loading), 36 variants total, plus independent left/right icon toggles and an editable label.

**USE:** Matches real usage. Of the 5 instances found in the example screens, 4 are Primary/L/Default sitting as the one full-width bottom CTA per screen, consistent with the "one primary button per screen" rule already written into interactive/primary's own description. The remaining instance is a small Tertiary/S/Pressed, likely a lower-emphasis inline action. Secondary's real-world usage pattern isn't represented in the examples checked, so treat that gap as unconfirmed.

**DON'T:** Don't place two Primary/Default buttons on one screen. Nothing in the component itself stops you — the one-CTA rule lives in documentation and observed usage, not in anything the component enforces.

---

**Two implementation notes beyond the Figma file itself:**
- The pill has a subtle inset top shadow in Figma (rgba(0,0,0,0.15), no token backs it) — omitted here per the never-invent-a-value rule rather than hardcoded.
- Figma's Pressed overlay is a 10%-white wash (\`interactive/pressed\`) painted on top of the fill for Primary, but on Secondary the same overlay is painted *underneath* the opaque fill in the source file — invisible either way. This component paints the overlay on top for every variant instead of reproducing that stacking bug, so Pressed always gives visible feedback.`;

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['Primary', 'Secondary', 'Tertiary'] },
    size: { control: 'radio', options: ['S', 'M', 'L'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    children: '1/2 words',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma's Pressed state is real `:active` press feedback, not a prop —
// this play function presses and holds the pointer so the story renders
// in a genuine `:active` state instead of faking it with a demo-only class.
async function pressAndHold({ canvasElement }: { canvasElement: HTMLElement }) {
  const button = canvasElement.querySelector('button');
  if (button) {
    await userEvent.pointer({ keys: '[MouseLeft>]', target: button });
  }
}

function variantStory(variant: ButtonVariant, size: ButtonSize, state: 'Default' | 'Pressed' | 'Disabled' | 'Loading'): Story {
  return {
    name: `${variant}/${size}/${state}`,
    args: {
      variant,
      size,
      disabled: state === 'Disabled',
      loading: state === 'Loading',
    },
    play: state === 'Pressed' ? pressAndHold : undefined,
  };
}

// One story per Figma variant (3 variant x 3 size x 4 state = 36), named
// exactly the way Figma names them ("Primary/S/Default", etc).
export const PrimarySDefault: Story = variantStory('Primary', 'S', 'Default');
export const PrimarySPressed: Story = variantStory('Primary', 'S', 'Pressed');
export const PrimarySDisabled: Story = variantStory('Primary', 'S', 'Disabled');
export const PrimarySLoading: Story = variantStory('Primary', 'S', 'Loading');
export const PrimaryMDefault: Story = variantStory('Primary', 'M', 'Default');
export const PrimaryMPressed: Story = variantStory('Primary', 'M', 'Pressed');
export const PrimaryMDisabled: Story = variantStory('Primary', 'M', 'Disabled');
export const PrimaryMLoading: Story = variantStory('Primary', 'M', 'Loading');
export const PrimaryLDefault: Story = variantStory('Primary', 'L', 'Default');
export const PrimaryLPressed: Story = variantStory('Primary', 'L', 'Pressed');
export const PrimaryLDisabled: Story = variantStory('Primary', 'L', 'Disabled');
export const PrimaryLLoading: Story = variantStory('Primary', 'L', 'Loading');

export const SecondarySDefault: Story = variantStory('Secondary', 'S', 'Default');
export const SecondarySPressed: Story = variantStory('Secondary', 'S', 'Pressed');
export const SecondarySDisabled: Story = variantStory('Secondary', 'S', 'Disabled');
export const SecondarySLoading: Story = variantStory('Secondary', 'S', 'Loading');
export const SecondaryMDefault: Story = variantStory('Secondary', 'M', 'Default');
export const SecondaryMPressed: Story = variantStory('Secondary', 'M', 'Pressed');
export const SecondaryMDisabled: Story = variantStory('Secondary', 'M', 'Disabled');
export const SecondaryMLoading: Story = variantStory('Secondary', 'M', 'Loading');
export const SecondaryLDefault: Story = variantStory('Secondary', 'L', 'Default');
export const SecondaryLPressed: Story = variantStory('Secondary', 'L', 'Pressed');
export const SecondaryLDisabled: Story = variantStory('Secondary', 'L', 'Disabled');
export const SecondaryLLoading: Story = variantStory('Secondary', 'L', 'Loading');

export const TertiarySDefault: Story = variantStory('Tertiary', 'S', 'Default');
export const TertiarySPressed: Story = variantStory('Tertiary', 'S', 'Pressed');
export const TertiarySDisabled: Story = variantStory('Tertiary', 'S', 'Disabled');
export const TertiarySLoading: Story = variantStory('Tertiary', 'S', 'Loading');
export const TertiaryMDefault: Story = variantStory('Tertiary', 'M', 'Default');
export const TertiaryMPressed: Story = variantStory('Tertiary', 'M', 'Pressed');
export const TertiaryMDisabled: Story = variantStory('Tertiary', 'M', 'Disabled');
export const TertiaryMLoading: Story = variantStory('Tertiary', 'M', 'Loading');
export const TertiaryLDefault: Story = variantStory('Tertiary', 'L', 'Default');
export const TertiaryLPressed: Story = variantStory('Tertiary', 'L', 'Pressed');
export const TertiaryLDisabled: Story = variantStory('Tertiary', 'L', 'Disabled');
export const TertiaryLLoading: Story = variantStory('Tertiary', 'L', 'Loading');

// Bonus, not a Figma variant: showLeftIcon + showRightIcon together, since
// those are independent boolean properties rather than named variants.
function DemoIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export const WithIcons: Story = {
  name: 'Primary/L/Default (showLeftIcon + showRightIcon)',
  args: {
    variant: 'Primary',
    size: 'L',
    leftIcon: <DemoIcon />,
    rightIcon: <DemoIcon />,
  },
};

// Bonus, not a Figma variant: fullWidth, a code-only prop for screens where
// a Button sits directly under a full-width field (Text alternative's
// Submit) rather than as a standalone content-hugging pill.
export const FullWidth: Story = {
  name: 'Primary/L/Default (fullWidth)',
  args: {
    variant: 'Primary',
    size: 'L',
    fullWidth: true,
    children: 'Submit',
  },
};
