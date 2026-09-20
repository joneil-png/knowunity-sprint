'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ButtonRecord } from '../ButtonRecord/ButtonRecord';
import { useRecallSession } from '../../lib/RecallSessionContext';
import styles from './SayItBackScreen.module.css';

// Brief beat before advancing, not the full processing delay — this has no
// verdict to wait for, just long enough to register the take landed.
// Not specified anywhere; a judgment call made building this screen.
const ADVANCE_DELAY_MS = 700;

export function SayItBackScreen() {
  const { term, finishSayItBack } = useRecallSession();
  const [recording, setRecording] = useState(false);
  const router = useRouter();

  function handleToggle() {
    if (recording) {
      setRecording(false);
      setTimeout(() => {
        finishSayItBack();
        router.push('/');
      }, ADVANCE_DELAY_MS);
    } else {
      setRecording(true);
    }
  }

  return (
    <div className={styles.screen}>
      <h1 className={styles.prompt}>{term.prompt}</h1>

      <div className={styles.transcriptCard}>
        <p className={styles.label}>Say it back, no pressure</p>
        <p className={styles.answerText}>“{term.answerReveal}”</p>
      </div>

      <div className={styles.recordArea}>
        <p className={styles.helper}>{recording ? 'Tap to stop' : 'Tap to record'}</p>
        <ButtonRecord state={recording ? 'Recording' : 'Default'} onClick={handleToggle} />
      </div>
    </div>
  );
}
