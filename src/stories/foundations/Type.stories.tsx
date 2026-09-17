import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { getTextStyles } from '../../lib/tokens';
import './foundations.css';

const meta = {
  title: 'Foundations/Type',
  parameters: {
    layout: 'fullscreen',
    // This is a reference page, not a mobile screen, so it isn't bound to
    // the iPhone-width canvas the rest of the product's stories default to.
    viewport: { disable: true },
    docs: {
      description: {
        component:
          'Every named text style under `typography.textStyle` in ' +
          '`tokens/tokens.json`, rendered at its real size, largest to ' +
          'smallest (ties broken by heavier weight first).',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScale: Story = {
  render: () => (
    <div className="foundations-page">
      <div className="type-list">
        {getTextStyles().map((style) => (
          <div className="type-row" key={style.name}>
            <p
              className="type-sample"
              style={{
                fontFamily: `var(${style.cssVars.fontFamily})`,
                fontWeight: `var(${style.cssVars.fontWeight})`,
                fontSize: `var(${style.cssVars.fontSize})`,
                lineHeight: `var(${style.cssVars.lineHeight})`,
                letterSpacing: `var(${style.cssVars.letterSpacing})`,
              }}
            >
              {style.category}/{style.variant}
            </p>
            <div className="type-meta">
              <span className="token-name">{style.name}</span>
              <span className="token-value">
                {style.fontSize} / {style.lineHeight} · weight {style.fontWeight} · tracking{' '}
                {style.letterSpacing}
              </span>
              {style.description ? (
                <span className="token-description">{style.description}</span>
              ) : (
                <span className="token-description token-description--missing">
                  No description in tokens.json
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
