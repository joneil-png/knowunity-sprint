import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './TextLink.module.css';

export interface TextLinkProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
}

export function TextLink({ children, className, ...rest }: TextLinkProps) {
  return (
    <button type="button" className={[styles.link, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  );
}
