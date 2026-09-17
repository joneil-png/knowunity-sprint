import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { formatValue, getColorGroups, type TokenEntry } from '../../lib/tokens';
import './foundations.css';

const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
    // This is a reference page, not a mobile screen, so it isn't bound to
    // the iPhone-width canvas the rest of the product's stories default to.
    viewport: { disable: true },
    docs: {
      description: {
        component:
          'Every semantic color token in `tokens/tokens.json`, grouped the ' +
          'way the file groups them (`color.background`, `color.interactive`, ' +
          '...). `color.primitive.*` is the raw palette these are built from, ' +
          "not a semantic group meant for direct use — see docs/design-system.md §3.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ColorSwatch({ token }: { token: TokenEntry }) {
  return (
    <div className="color-card">
      <div className="color-swatch">
        <div
          className="color-swatch-fill"
          style={{ background: `var(${token.cssVar})` }}
        />
      </div>
      <div className="color-card-body">
        <span className="token-name">{token.name}</span>
        <span className="token-css-var">{token.cssVar}</span>
        <span className="token-value">{formatValue(token.resolvedValue)}</span>
        {token.description ? (
          <span className="token-description">{token.description}</span>
        ) : (
          <span className="token-description token-description--missing">
            No description in tokens.json
          </span>
        )}
      </div>
    </div>
  );
}

export const AllColors: Story = {
  render: () => (
    <div className="foundations-page">
      {getColorGroups().map(({ group, tokens }) => (
        <section className="foundations-section" key={group}>
          <h2 className="foundations-section-title">color.{group}</h2>
          <div className="color-grid">
            {tokens.map((token) => (
              <ColorSwatch key={token.name} token={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
