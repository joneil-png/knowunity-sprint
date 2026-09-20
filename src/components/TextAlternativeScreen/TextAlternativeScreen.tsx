'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button';
import { TextField } from '../TextField/TextField';
import { TextLink } from '../TextLink/TextLink';
import { useRecallSession } from '../../lib/RecallSessionContext';
import styles from './TextAlternativeScreen.module.css';

export function TextAlternativeScreen() {
  const { term, send } = useRecallSession();
  const [value, setValue] = useState('');
  const router = useRouter();

  function handleSubmit() {
    send(value);
    router.push('/');
  }

  function handleBackToSpeaking() {
    router.push('/');
  }

  return (
    <div className={styles.screen}>
      <h1 className={styles.prompt}>{term.prompt}</h1>
      <p className={styles.label}>Typing instead</p>
      <TextField
        label="Your answer"
        placeholder="Type your answer…"
        value={value}
        onChange={setValue}
      />
      <Button variant="Primary" size="L" fullWidth className={styles.submit} onClick={handleSubmit}>
        Submit
      </Button>
      <TextLink className={styles.backToSpeaking} onClick={handleBackToSpeaking}>
        Back to speaking
      </TextLink>
    </div>
  );
}
