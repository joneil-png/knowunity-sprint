'use client';

// Shared state across routes — without this, navigating to a separate
// screen (text alternative, say it back, session end) would start a fresh
// useRecallTerm() call and lose the current attempt/retry state. See
// SPEC.md and the session/text/say-it-back implementation plan.

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useRecallTerm, type RecallTerm } from './useRecallTerm';

// One example term, standing in for a real round-1 hand-off (out of scope
// for this build). Scripted to miss once, then pass on the retry, so the
// full loop — including the "Previous mistake" badge and the Earned
// banner — is reachable from a single term.
export const EXAMPLE_TERM: RecallTerm = {
  prompt: 'What role does chlorophyll play in photosynthesis?',
  answerReveal:
    'Chlorophyll absorbs sunlight, which powers the conversion of CO2 and water into glucose and oxygen.',
  outcomes: ['partial', 'pass'],
};

export interface RetiredTermSummary {
  id: string;
  prompt: string;
}

type UseRecallTermReturn = ReturnType<typeof useRecallTerm>;

export interface RecallSessionValue extends UseRecallTermReturn {
  retiredTerms: RetiredTermSummary[];
}

export const RecallSessionContext = createContext<RecallSessionValue | null>(null);

export function RecallSessionProvider({ children }: { children: ReactNode }) {
  const recall = useRecallTerm(EXAMPLE_TERM);
  const [retiredTerms, setRetiredTerms] = useState<RetiredTermSummary[]>([]);

  // Wraps the hook's own continueAfterResult so the retired-terms list
  // updates in the same synchronous event as the state transition — a
  // useEffect watching state.retired would risk /session-end's first
  // render reading the list before the effect had run.
  function continueAfterResult() {
    const isSecondMiss = recall.state.verdict === 'partial' && recall.state.attempt > 0;
    if (isSecondMiss) {
      setRetiredTerms((prev) => [...prev, { id: recall.term.prompt, prompt: recall.term.prompt }]);
    }
    recall.continueAfterResult();
  }

  return (
    <RecallSessionContext.Provider value={{ ...recall, retiredTerms, continueAfterResult }}>
      {children}
    </RecallSessionContext.Provider>
  );
}

export function useRecallSession(): RecallSessionValue {
  const value = useContext(RecallSessionContext);
  if (!value) {
    throw new Error('useRecallSession must be used within a RecallSessionProvider');
  }
  return value;
}
