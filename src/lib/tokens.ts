// Reads design tokens straight from tokens/tokens.json — the single source
// of values (see CLAUDE.md) — and resolves alias references (e.g.
// "{color.primitive.color.navy.950}") down to their primitive value. Also
// derives each token's generated CSS custom property name using the same
// path-to-kebab-case rule Style Dictionary's "css" transform group applies,
// so displayed names always match build/css/tokens.css.
//
// This file has no story of its own; the Foundations stories import it.

import rawTokens from '../../tokens/tokens.json';

interface TokenLeaf {
  $value: string | number | number[];
  $type: string;
  $description?: string;
}

interface TokenTree {
  [key: string]: TokenTree | TokenLeaf | string | undefined;
  $description?: string;
}

function isLeaf(node: unknown): node is TokenLeaf {
  return (
    typeof node === 'object' &&
    node !== null &&
    '$value' in (node as Record<string, unknown>)
  );
}

const root = rawTokens as unknown as TokenTree;

function getNode(path: string[]): TokenTree | TokenLeaf | undefined {
  let node: TokenTree | TokenLeaf | string | undefined = root;
  for (const key of path) {
    if (node === undefined || typeof node === 'string' || isLeaf(node)) {
      return undefined;
    }
    node = (node as TokenTree)[key];
  }
  return node as TokenTree | TokenLeaf | undefined;
}

const ALIAS_PATTERN = /^\{([^}]+)\}$/;

/** Chases "{a.b.c}" alias references down to the final primitive value. */
function resolveValue(value: TokenLeaf['$value']): TokenLeaf['$value'] {
  if (typeof value === 'string') {
    const match = value.match(ALIAS_PATTERN);
    if (match) {
      const refNode = getNode(match[1].split('.'));
      if (refNode && isLeaf(refNode)) {
        return resolveValue(refNode.$value);
      }
    }
  }
  return value;
}

/**
 * Mirrors Style Dictionary's "css" transform group: join the token's path
 * with hyphens, then kebab-case the camelCase segments (e.g. "onPrimary"
 * -> "on-primary", "textStyle" -> "text-style").
 */
export function cssVarName(path: string[]): string {
  const kebab = path
    .join('-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `--${kebab}`;
}

export interface TokenEntry {
  path: string[];
  /** Dot-delimited path exactly as it appears in tokens.json, e.g. "color.background.page". */
  name: string;
  /** The generated custom property, e.g. "--color-background-page". */
  cssVar: string;
  type: string;
  resolvedValue: TokenLeaf['$value'];
  description?: string;
}

function collectLeaves(
  node: TokenTree | TokenLeaf,
  path: string[],
  out: TokenEntry[],
) {
  if (isLeaf(node)) {
    out.push({
      path,
      name: path.join('.'),
      cssVar: cssVarName(path),
      type: node.$type,
      resolvedValue: resolveValue(node.$value),
      description: node.$description,
    });
    return;
  }
  for (const key of Object.keys(node)) {
    // "$description" etc. are metadata siblings on composite groups
    // (e.g. typography.textStyle.display.l), not child token groups.
    if (key.startsWith('$')) continue;
    const child = (node as TokenTree)[key];
    if (child === undefined || typeof child === 'string') continue;
    collectLeaves(child, [...path, key], out);
  }
}

/** All leaf tokens under a path, e.g. getTokenEntries(['size', 'space']). */
export function getTokenEntries(path: string[]): TokenEntry[] {
  const node = getNode(path);
  if (!node || typeof node === 'string') return [];
  const out: TokenEntry[] = [];
  collectLeaves(node, path, out);
  return out;
}

/** Renders any resolved token value as display text. */
export function formatValue(value: TokenLeaf['$value']): string {
  if (Array.isArray(value)) return `[${value.join(', ')}]`;
  return String(value);
}

// --- Colors ---------------------------------------------------------------

// The semantic groups under color.*, in the order tokens.json declares them.
// "primitive" is deliberately excluded: it's the raw palette these are built
// from, not a semantic group meant for direct use (docs/design-system.md §3).
export const SEMANTIC_COLOR_GROUPS = [
  'background',
  'interactive',
  'text',
  'border',
  'mascot',
  'pro',
  'accent',
  'feedback',
  'highlight',
] as const;

export interface ColorGroup {
  group: string;
  tokens: TokenEntry[];
}

export function getColorGroups(): ColorGroup[] {
  return SEMANTIC_COLOR_GROUPS.map((group) => ({
    group,
    tokens: getTokenEntries(['color', group]),
  })).filter((g) => g.tokens.length > 0);
}

// --- Typography -------------------------------------------------------------

export interface TextStyleEntry {
  category: string;
  variant: string;
  name: string;
  description?: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  cssVars: {
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
  };
}

export function getTextStyles(): TextStyleEntry[] {
  const textStyleRoot = getNode(['typography', 'textStyle']);
  if (!textStyleRoot || typeof textStyleRoot === 'string' || isLeaf(textStyleRoot)) {
    return [];
  }

  const entries: TextStyleEntry[] = [];

  for (const category of Object.keys(textStyleRoot)) {
    const categoryNode = textStyleRoot[category];
    if (!categoryNode || typeof categoryNode === 'string' || isLeaf(categoryNode)) continue;

    for (const variant of Object.keys(categoryNode)) {
      const variantNode = categoryNode[variant];
      if (!variantNode || typeof variantNode === 'string' || isLeaf(variantNode)) continue;

      const path = ['typography', 'textStyle', category, variant];
      const prop = (key: string) => {
        const leaf = variantNode[key];
        if (!leaf || typeof leaf === 'string' || !isLeaf(leaf)) {
          throw new Error(`Expected a leaf token at ${[...path, key].join('.')}`);
        }
        return {
          resolved: resolveValue(leaf.$value),
          cssVar: cssVarName([...path, key]),
        };
      };

      const fontFamily = prop('fontFamily');
      const fontWeight = prop('fontWeight');
      const fontSize = prop('fontSize');
      const lineHeight = prop('lineHeight');
      const letterSpacing = prop('letterSpacing');

      entries.push({
        category,
        variant,
        name: path.join('.'),
        description: variantNode.$description,
        fontFamily: formatValue(fontFamily.resolved),
        fontWeight: Number(fontWeight.resolved),
        fontSize: formatValue(fontSize.resolved),
        lineHeight: formatValue(lineHeight.resolved),
        letterSpacing: formatValue(letterSpacing.resolved),
        cssVars: {
          fontFamily: fontFamily.cssVar,
          fontWeight: fontWeight.cssVar,
          fontSize: fontSize.cssVar,
          lineHeight: lineHeight.cssVar,
          letterSpacing: letterSpacing.cssVar,
        },
      });
    }
  }

  // "In scale order": biggest to smallest, ties broken by heavier weight first
  // (e.g. headline.xsBold before headline.xsRegular, which share a size).
  entries.sort((a, b) => {
    const sizeDiff = parseFloat(b.fontSize) - parseFloat(a.fontSize);
    return sizeDiff !== 0 ? sizeDiff : b.fontWeight - a.fontWeight;
  });

  return entries;
}

// --- Spacing & radius -------------------------------------------------------------

function byResolvedPx(a: TokenEntry, b: TokenEntry): number {
  return parseFloat(formatValue(a.resolvedValue)) - parseFloat(formatValue(b.resolvedValue));
}

/** The positive spacing scale, smallest to largest. */
export function getSpacingScale(): TokenEntry[] {
  return getTokenEntries(['size', 'space'])
    .filter((t) => !t.path[t.path.length - 1].startsWith('negative'))
    .sort(byResolvedPx);
}

/** The negative spacing overrides, each a mirror of a positive scale step. */
export function getNegativeSpacingScale(): TokenEntry[] {
  return getTokenEntries(['size', 'space'])
    .filter((t) => t.path[t.path.length - 1].startsWith('negative'))
    .sort(byResolvedPx);
}

/** The radius scale, smallest to largest, with "full" (a pill) sorted last. */
export function getRadiusScale(): TokenEntry[] {
  return getTokenEntries(['size', 'radius']).sort((a, b) => {
    const key = (t: TokenEntry) => t.path[t.path.length - 1];
    const rank = (t: TokenEntry) =>
      key(t) === 'full' ? Number.POSITIVE_INFINITY : parseFloat(formatValue(t.resolvedValue));
    return rank(a) - rank(b);
  });
}
