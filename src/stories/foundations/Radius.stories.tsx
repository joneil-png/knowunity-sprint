import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { formatValue, getRadiusScale } from '../../lib/tokens';
import './foundations.css';

const meta = {
  title: 'Foundations/Radius',
  parameters: {
    layout: 'fullscreen',
    // This is a reference page, not a mobile screen, so it isn't bound to
    // the iPhone-width canvas the rest of the product's stories default to.
    viewport: { disable: true },
    docs: {
      description: {
        component:
          'The `size.radius` scale in `tokens/tokens.json`, smallest to ' +
          'largest, each box drawn with its real corner radius applied.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const RadiusScale: Story = {
  render: () => (
    <div className="foundations-page">
      <section className="foundations-section">
        <h2 className="foundations-section-title">size.radius</h2>
        <div className="radius-grid">
          {getRadiusScale().map((token) => (
            <div className="radius-card" key={token.name}>
              <div
                className="radius-box"
                style={{ borderRadius: `var(${token.cssVar})` }}
              />
              <div>
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
          ))}
        </div>
      </section>
    </div>
  ),
};
