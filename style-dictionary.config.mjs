// Style Dictionary reads our design tokens (tokens/tokens.json) and writes
// them out as CSS custom properties (build/css/tokens.css) so the app can
// use `var(--color-interactive-primary)` instead of hardcoded values.
//
// Run with `npm run tokens`. This file only configures the pipeline — it
// never contains token values itself; those all live in tokens/tokens.json.

const config = {
  // Where to read token definitions from.
  source: ['tokens/tokens.json'],

  hooks: {
    fileHeaders: {
      // The comment block written at the top of every generated file.
      'tokens-generated-banner': () => [
        'GENERATED FILE — DO NOT EDIT BY HAND.',
        'Source of truth: tokens/tokens.json',
        'Regenerate with: npm run tokens',
      ],
    },
  },

  // Each entry under "platforms" is one output format. We only need CSS
  // variables today, but more (e.g. a "js" or "ios" platform) could be
  // added here later without touching tokens/tokens.json.
  platforms: {
    css: {
      // "css" transformGroup converts DTCG token types (color, dimension,
      // fontWeight, cubicBezier, duration, ...) into values CSS understands,
      // and turns each token's path (e.g. color.interactive.primary) into a
      // kebab-case variable name (--color-interactive-primary).
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            // Keep aliases as var() references (e.g. a semantic color
            // pointing at var(--color-primitive-...)) instead of flattening
            // them to raw values, so the relationships in tokens.json still
            // show up in the generated CSS.
            outputReferences: true,
            fileHeader: 'tokens-generated-banner',
          },
        },
      ],
    },
  },
};

export default config;
