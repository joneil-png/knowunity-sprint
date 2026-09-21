'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecallSession } from '../../lib/RecallSessionContext';
import styles from './SessionEndScreen.module.css';

export function SessionEndScreen() {
  const { retiredTerms } = useRecallSession();
  const router = useRouter();

  // "Doesn't appear if there are none" (sprint-context.md) — a session with
  // nothing retired has no reason to land here, so it bounces straight back
  // rather than rendering an empty list.
  useEffect(() => {
    if (retiredTerms.length === 0) {
      router.replace('/');
    }
  }, [retiredTerms, router]);

  if (retiredTerms.length === 0) {
    return null;
  }

  return (
    <div className={styles.screen}>
      <h1 className={styles.heading}>Terms to revisit</h1>
      <p className={styles.helper}>
        These didn&apos;t land this time — no penalty, just something to look at again.
      </p>
      <ul className={styles.list}>
        {retiredTerms.map((term) => (
          <li key={term.id}>
            <button
              type="button"
              className={styles.row}
              onClick={() => {
                // No-op stub — this is meant to open "the existing lesson
                // content sheet" elsewhere in the real Knowunity app, which
                // doesn't exist in this repo. Decided: still a real,
                // tappable target, just with nowhere to go yet.
              }}
            >
              {term.prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
