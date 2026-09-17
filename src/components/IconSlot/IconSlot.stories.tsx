import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconSlot, type IconSlotSize } from './IconSlot';

// Verbatim from the `iconSlot` component set's Figma description
// (Yummy__Knowie Design System, node 9003:8809, page "🎨 Mascot & components")
// — read with the figma-console MCP's figma_get_component tool,
// "desktop_bridge_plugin" source. Matches docs/design-system.md §2's
// compressed summary of the same component.
const FIGMA_DESCRIPTION = `**WHAT:** A generic icon container, swap the instance for any icon component, sized via a variant literally named "Size (IGNORE)" with six steps from 100 to 400.

**USE:** The most-used piece in the whole system by far, 165 instances found across the example screens, the standard wrapper anywhere an icon needs a fixed square footprint. Sizes 200, 300 and 250 cover most real usage; 400 is rare, and no instance of the smallest step, 100, was found.

**DON'T:** Don't read "(IGNORE)" as permission to skip setting the size. It's used deliberately and consistently everywhere checked. The name is presumably internal shorthand from whoever built it, not an instruction, worth confirming what it was meant to mean.

---

**Why this exists as its own component now:** \`Button\`, \`ButtonRecord\`, and \`FeedbackBanner\` each originally defined their own copy of this exact sizing wrapper. This is that wrapper, pulled out once and reused by all three, matching how heavily Figma's own \`iconSlot\` gets reused (165 instances). Only the sizing is shared — each component still owns its own icon glyphs.

Figma's variant only lists a size; the actual icon is set by swapping the instance, not a named property. This component's equivalent is \`children\` — pass any icon element.`;

const meta = {
  title: 'Components/IconSlot',
  component: IconSlot,
  parameters: {
    docs: {
      description: {
        component: FIGMA_DESCRIPTION,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['100', '150', '200', '250', '300', '400'] },
  },
} satisfies Meta<typeof IconSlot>;

export default meta;
type Story = StoryObj<typeof meta>;

// A generic placeholder glyph for these demo stories only — IconSlot itself
// is content-agnostic; the real icons live inside the components that use it.
function DemoIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function sizeStory(size: IconSlotSize): Story {
  return {
    args: { size, children: <DemoIcon /> },
  };
}

// One story per Figma variant option, named the way Figma names them.
export const Size100: Story = sizeStory('100');
export const Size150: Story = sizeStory('150');
export const Size200: Story = sizeStory('200');
export const Size250: Story = sizeStory('250');
export const Size300: Story = sizeStory('300');
export const Size400: Story = sizeStory('400');
