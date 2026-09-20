// The recall-loop "engine" for a single term: what mode it's in right now,
// and the actions that move it between modes. Deliberately small — one
// term's own machine, not a multi-term session (no queue, no term list).
// That layer gets added once there's an actual reason to juggle more than
// one example term at a time.

import { useCallback, useRef, useState } from 'react';

export type TermStatus = 'idle' | 'recording' | 'reviewing' | 'processing' | 'result' | 'sayItBack';

export type Verdict = 'pass' | 'partial';

export interface RecallTerm {
  prompt: string;
  answerReveal: string;
  /** One scripted outcome per attempt — outcomes[0] is the first try, outcomes[1] the retry. */
  outcomes: Verdict[];
}

export interface RecallTermState {
  status: TermStatus;
  attempt: number;
  /** True once this is a delayed-retry attempt — drives the "Previous mistake" badge. */
  isRetry: boolean;
  transcript: string;
  verdict: Verdict | null;
  /** True after a second miss — the term is done for the session. */
  retired: boolean;
}

// Fixed delay, not randomized — matches the "processing delay" decision.
const PROCESSING_DELAY_MS = 2500;

// Shared by continueAfterResult's first-miss branch and finishSayItBack —
// both mean the same thing: this term's first miss is done, and it goes
// back to idle as a queued retry with the "Previous mistake" badge.
function queueRetry(s: RecallTermState): RecallTermState {
  return { ...s, status: 'idle', attempt: 1, isRetry: true, transcript: '', verdict: null };
}

export function useRecallTerm(term: RecallTerm) {
  const [state, setState] = useState<RecallTermState>({
    status: 'idle',
    attempt: 0,
    isRetry: false,
    transcript: '',
    verdict: null,
    retired: false,
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRecording = useCallback(() => {
    setState((s) => ({ ...s, status: 'recording' }));
  }, []);

  const stopRecording = useCallback((transcript: string) => {
    setState((s) => ({ ...s, status: 'reviewing', transcript }));
  }, []);

  // Back to idle, not straight into a new take — discarding and
  // auto-starting the mic in one tap doesn't give the student a beat to
  // get ready, the same reason the very first take always starts from an
  // explicit tap rather than auto-recording on arrival.
  const discardAndReRecord = useCallback(() => {
    setState((s) => ({ ...s, status: 'idle', transcript: '' }));
  }, []);

  // Same entry point for a spoken or typed answer — text and voice get
  // identical verdict treatment, so both just call send() with their text.
  const send = useCallback(
    (transcript?: string) => {
      setState((s) => ({ ...s, status: 'processing', transcript: transcript ?? s.transcript }));
      timeoutRef.current = setTimeout(() => {
        setState((s) => ({ ...s, status: 'result', verdict: term.outcomes[s.attempt] ?? 'partial' }));
      }, PROCESSING_DELAY_MS);
    },
    [term],
  );

  const startSayItBack = useCallback(() => {
    setState((s) => ({ ...s, status: 'sayItBack' }));
  }, []);

  // Say it back is only ever reached on a first miss (attempt === 0,
  // verdict === 'partial' — see SPEC.md), so queuing the retry here is
  // always the right transition, same as continueAfterResult's first-miss
  // branch below. No verdict here on purpose — auto-advances after a beat,
  // so finishing this already IS "moving on," with no separate Continue
  // tap required afterward.
  const finishSayItBack = useCallback(() => {
    setState((s) => queueRetry(s));
  }, []);

  const continueAfterResult = useCallback(() => {
    setState((s) => {
      if (s.verdict === 'pass') return s; // done — the caller decides what "done" means
      // Partial: first miss queues a retry, second miss retires the term.
      if (s.attempt === 0) {
        return queueRetry(s);
      }
      return { ...s, retired: true };
    });
  }, []);

  return {
    term,
    state,
    startRecording,
    stopRecording,
    discardAndReRecord,
    send,
    startSayItBack,
    finishSayItBack,
    continueAfterResult,
  };
}
