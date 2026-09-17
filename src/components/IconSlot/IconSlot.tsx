import type { ReactNode } from 'react';
import styles from './IconSlot.module.css';

export type IconSlotSize = '100' | '150' | '200' | '250' | '300' | '400';

export interface IconSlotProps {
  /** Matches the Figma `Size (IGNORE)` property — despite the name, it's set deliberately everywhere, not skippable. */
  size: IconSlotSize;
  /** The icon to display. Matches Figma's instance-swap: any icon can be placed here. */
  children: ReactNode;
  className?: string;
}

const SIZE_CLASS: Record<IconSlotSize, string> = {
  '100': styles.size100,
  '150': styles.size150,
  '200': styles.size200,
  '250': styles.size250,
  '300': styles.size300,
  '400': styles.size400,
};

export function IconSlot({ size, children, className }: IconSlotProps) {
  return (
    <span className={[styles.iconSlot, SIZE_CLASS[size], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
