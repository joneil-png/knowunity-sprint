import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { formatValue, getNegativeSpacingScale, getSpacingScale, type TokenEntry } from '../../lib/tokens';
import './foundations.css';

const meta = {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'fullscreen',
    // This is a reference page, not a mobile screen, so it isn't bound to
    // the iPhone-width canvas the rest of the product's stories default to.
    viewport: { disable: true },
    docs: {
      description: {
        component:
          'The `size.space` scale in `tokens/tokens.json`, smallest to ' +
          'largest, each bar drawn at its real width.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SpacingRow({
  token,
  invert = false,
  barColor,
}: {
  token: TokenEntry;
  invert?: boolean;
  barColor?: string;
}) {
  // Negative tokens (size.space.negative-*) can't set a CSS width directly —
  // a negative width is invalid — so the bar negates the same custom
  // property back to a positive length with calc() rather than hardcoding
  // the magnitude a second time.
  const width = invert ? `calc(-1 * var(${token.cssVar}))` : `var(${token.cssVar})`;

  return (
    <div className="spacing-row" key={token.name}>
      <div className="spacing-label">
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
      <div className="spacing-bar-track">
        <div className="spacing-bar" style={{ width, background: barColor }} />
      </div>
    </div>
  );
}

export const SpacingScale: Story = {
  render: () => (
    <div className="foundations-page">
      <section className="foundations-section">
        <h2 className="foundations-section-title">size.space</h2>
        <div className="spacing-list">
          {getSpacingScale().map((token) => (
            <SpacingRow key={token.name} token={token} />
          ))}
        </div>
      </section>

      <section className="foundations-section">
        <h2 className="foundations-section-title">size.space (negative overrides)</h2>
        <div className="spacing-list">
          {getNegativeSpacingScale().map((token) => (
            <SpacingRow
              key={token.name}
              token={token}
              invert
              barColor="var(--color-accent-coral-bold)"
            />
          ))}
        </div>
      </section>
    </div>
  ),
};
