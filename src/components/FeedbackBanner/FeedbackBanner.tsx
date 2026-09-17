import { IconSlot } from '../IconSlot/IconSlot';
import styles from './FeedbackBanner.module.css';

export type FeedbackBannerVariant = 'Success' | 'Earned' | 'Partial';

export interface FeedbackBannerProps {
  /** Matches the Figma `variant` property. */
  variant?: FeedbackBannerVariant;
  /** Matches the Figma `title` text property. */
  title: string;
  /** Matches the Figma `body` text property. */
  body: string;
  /**
   * Matches the Figma `answer` text property. Figma lists this property on
   * every variant, but the Answer layer only exists in the Partial
   * variant's actual structure — passed for Success/Earned, it's ignored.
   */
  answer?: string;
  className?: string;
}

// Simple geometric stand-ins for the two Phosphor icons this component
// uses ("check-circle" / Success, Earned; "info" / Partial) — the real
// vectors aren't retrievable through the Figma API (see the stories file).
function CheckCircleIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5 5.5-6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="7.5" x2="12" y2="7.5" />
    </svg>
  );
}

const VARIANT_CLASS: Record<FeedbackBannerVariant, string> = {
  Success: styles.success,
  Earned: styles.earned,
  Partial: styles.partial,
};

export function FeedbackBanner({
  variant = 'Success',
  title,
  body,
  answer,
  className,
}: FeedbackBannerProps) {
  const isPartial = variant === 'Partial';

  return (
    // "Announce the banner when it appears" (Success annotation, verbatim,
    // and referenced by Earned/Partial as the same behavior) — role="status"
    // gets this for free (implicit aria-live="polite", aria-atomic="true").
    <div
      role="status"
      className={[styles.banner, VARIANT_CLASS[variant], className].filter(Boolean).join(' ')}
    >
      <div className={styles.titleRow}>
        <IconSlot size="250" className={styles.icon}>
          {isPartial ? <InfoIcon /> : <CheckCircleIcon />}
        </IconSlot>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <p className={styles.body}>{body}</p>
      {isPartial && answer ? <p className={styles.answer}>{answer}</p> : null}
    </div>
  );
}
