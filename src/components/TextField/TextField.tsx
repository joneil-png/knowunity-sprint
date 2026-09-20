import { useId, type ChangeEvent } from 'react';
import styles from './TextField.module.css';

export interface TextFieldProps {
  /**
   * Accessible name for the field, rendered as a visually-hidden <label>.
   * The visible placeholder carries the visual label — there's no visible
   * label on screen, matching the text-alternative draft screen.
   */
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  /**
   * Visible rows for the multi-line field. A typed recall answer is a
   * sentence or two, so this defaults short rather than growing unbounded.
   */
  rows?: number;
  className?: string;
}

export function TextField({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  className,
}: TextFieldProps) {
  const id = useId();

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={styles.visuallyHidden}>
        {label}
      </label>
      <textarea
        id={id}
        className={styles.textarea}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        rows={rows}
      />
    </div>
  );
}
