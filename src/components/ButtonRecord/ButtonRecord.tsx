import type { ButtonHTMLAttributes } from 'react';
import { IconSlot } from '../IconSlot/IconSlot';
import styles from './ButtonRecord.module.css';

export type ButtonRecordState = 'Default' | 'Recording';

export interface ButtonRecordProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Matches the Figma `state` property. No Pressed or Disabled — see the component docs. */
  state?: ButtonRecordState;
}

// Simple geometric stand-ins for the two Phosphor icons this component
// uses ("microphone" / Icon (Stroke), "stop" / Icon (Solid)) — the real
// vectors aren't retrievable through the Figma API (see ButtonRecord.stories.tsx).
function MicrophoneIcon() {
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
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <line x1="12" y1="17" x2="12" y2="20" />
      <line x1="9" y1="20" x2="15" y2="20" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

const LABELS: Record<ButtonRecordState, string> = {
  Default: 'Start recording',
  Recording: 'Stop recording',
};

export function ButtonRecord({ state = 'Default', className, ...rest }: ButtonRecordProps) {
  const stateClass = state === 'Recording' ? styles.recording : styles.default;

  return (
    <>
      <button
        type="button"
        className={[styles.button, stateClass, className].filter(Boolean).join(' ')}
        aria-label={LABELS[state]}
        {...rest}
      >
        <IconSlot size="400">{state === 'Recording' ? <StopIcon /> : <MicrophoneIcon />}</IconSlot>
      </button>
      {/* "Accessible label: 'Stop recording'. Announce the change to
          recording." (Recording annotation, verbatim) — a live region
          rather than the aria-label swap alone, since a label change on an
          unfocused element isn't reliably announced by itself. */}
      <span className={styles.visuallyHidden} aria-live="polite">
        {state === 'Recording' ? 'Recording' : ''}
      </span>
    </>
  );
}
