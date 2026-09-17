import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { IconSlot, type IconSlotSize } from '../IconSlot/IconSlot';
import styles from './Button.module.css';

export type ButtonVariant = 'Primary' | 'Secondary' | 'Tertiary';
export type ButtonSize = 'S' | 'M' | 'L';

// Matches Figma's Left/Right/Center Icon Container sizes for each button size.
const ICON_SIZE: Record<ButtonSize, IconSlotSize> = { S: '200', M: '250', L: '300' };

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual weight. Matches the Figma `variant` property. */
  variant?: ButtonVariant;
  /** Matches the Figma `size` property. */
  size?: ButtonSize;
  /**
   * Matches the Figma `state=Loading` variant: hides the label and side
   * icons, shows a centered spinner, and forces the button non-interactive.
   * `state=Pressed` isn't a prop — it's real `:active` press feedback —
   * and `state=Disabled` is the standard HTML `disabled` prop.
   */
  loading?: boolean;
  /** Shown left of the label. Matches Figma's `showLeftIcon` (visible whenever an icon is passed). */
  leftIcon?: ReactNode;
  /** Shown right of the label. Matches Figma's `showRightIcon` (visible whenever an icon is passed). */
  rightIcon?: ReactNode;
  /** The button's label. Matches Figma's `CTA` text property. */
  children: ReactNode;
}

function Spinner() {
  return (
    <svg
      className={styles.spinner}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 360) / 8;
        return (
          <line
            key={angle}
            x1="12"
            y1="3"
            x2="12"
            y2="7"
            strokeWidth="2"
            strokeLinecap="round"
            opacity={1 - i / 8}
            transform={`rotate(${angle} 12 12)`}
          />
        );
      })}
    </svg>
  );
}

export function Button({
  variant = 'Primary',
  size = 'S',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const variantClass = {
    Primary: styles.primary,
    Secondary: styles.secondary,
    Tertiary: styles.tertiary,
  }[variant];

  const sizeClass = {
    S: styles.sizeS,
    M: styles.sizeM,
    L: styles.sizeL,
  }[size];

  const pillClasses = [
    styles.pill,
    variantClass,
    sizeClass,
    disabled && styles.isDisabled,
    loading && styles.loading,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = ICON_SIZE[size];

  return (
    <button
      type="button"
      className={[styles.hitArea, className].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span className={pillClasses}>
        {loading ? (
          <>
            <IconSlot size={iconSize}>
              <Spinner />
            </IconSlot>
            <span className={styles.visuallyHidden}>{children}</span>
          </>
        ) : (
          <span className={styles.content}>
            {leftIcon ? <IconSlot size={iconSize}>{leftIcon}</IconSlot> : null}
            {children}
            {rightIcon ? <IconSlot size={iconSize}>{rightIcon}</IconSlot> : null}
          </span>
        )}
      </span>
    </button>
  );
}
