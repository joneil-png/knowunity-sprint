'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button/Button';
import { ButtonRecord } from '../ButtonRecord/ButtonRecord';
import { FeedbackBanner, type FeedbackBannerVariant } from '../FeedbackBanner/FeedbackBanner';
import { MascotMoment } from '../MascotMoment/MascotMoment';
import { TextLink } from '../TextLink/TextLink';
import { useRecallSession } from '../../lib/RecallSessionContext';
import type { Verdict } from '../../lib/useRecallTerm';
import styles from './RecallScreen.module.css';

// Placeholder transcript text — real on-device speech-to-text is unverified
// (per the STT-feasibility decision), so this stands in for "what was heard"
// until that's confirmed working in the actual demo browser.
const MOCK_TRANSCRIPT =
  "Chlorophyll takes in sunlight, and that's what starts the whole process going.";

function resultCopy(verdict: Verdict, isRetry: boolean): { variant: FeedbackBannerVariant; title: string; body: string } {
  if (verdict === 'pass') {
    return isRetry
      ? { variant: 'Earned', title: 'You got it!', body: 'And this time nobody told you. That’s the real thing.' }
      : { variant: 'Success', title: 'Nice!', body: "That's exactly it." };
  }
  return isRetry
    ? { variant: 'Partial', title: "This one's going on your revisit list", body: "No penalty — you'll see the lesson content again later." }
    : { variant: 'Partial', title: 'Almost there', body: "You had part of it. Here's the fuller picture:" };
}

export function RecallScreen() {
  const router = useRouter();
  const { term, state, startRecording, stopRecording, discardAndReRecord, send, continueAfterResult } =
    useRecallSession();

  // Continue only stays on this screen when it's queuing a delayed retry
  // (first-miss Partial) — every other outcome (a pass, or a second miss)
  // is the term's fate fully decided, so it heads to session end. Session
  // end itself bounces straight back to "/" if there's nothing to revisit,
  // which is exactly right for a pass: nothing was retired, so there's
  // nothing to show. Not written down anywhere as a rule — see the summary
  // at the end of this build for why this is the decision.
  function handleContinue() {
    const isTerminal = state.verdict === 'pass' || (state.verdict === 'partial' && state.attempt > 0);
    continueAfterResult();
    if (isTerminal) {
      router.push('/session-end');
    }
  }

  const showTranscript =
    state.transcript.length > 0 &&
    (state.status === 'reviewing' || state.status === 'processing' || state.status === 'result');

  const result = state.status === 'result' && state.verdict ? resultCopy(state.verdict, state.isRetry) : null;

  // sprint-context.md: "An always-visible 'I can't talk right now' button" —
  // visible through the whole live attempt (idle, recording, reviewing).
  // Hiding it once a verdict is showing is still right (there's no live
  // attempt left to switch away from at that point), but excluding
  // "recording" was a bug, not a decision: it made this control (and the
  // mic button after it) jump position the moment a take starts, since
  // hiding it freed up space the layout immediately reflowed into.
  const showTextSwitch =
    state.status === 'idle' || state.status === 'recording' || state.status === 'reviewing';

  // First-miss Partial only (attempt 0) — a second miss is retired, not
  // offered another rehearsal (sprint-context: "a first miss reveals the
  // answer, offers an optional unscored say-it-back").
  const showSayItBack = result !== null && state.verdict === 'partial' && state.attempt === 0;

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        {state.isRetry ? <p className={styles.retryBadge}>Previous mistake</p> : null}
        {/* h2, not h1 — feedbackBanner's own title is a fixed h3 (see its
            component docs), so this stays one level above it rather than
            skipping a level. No visual change: this component's font
            styles come from the CSS module by class, not the tag. */}
        <h2 className={styles.prompt}>{term.prompt}</h2>
        <p className={styles.helper}>Doesn't have to be word for word — explain it your way.</p>

        {showTranscript ? (
          <div className={styles.transcriptCard}>
            <p className={styles.transcriptLabel}>You said</p>
            <p className={styles.transcriptText}>{state.transcript}</p>
          </div>
        ) : null}
      </div>

      <div className={styles.answerArea}>
        <AnimatePresence mode="wait" initial={false}>
          {state.status === 'idle' || state.status === 'recording' ? (
            <motion.div key="record" layoutId="answer-surface" className={styles.recordRow}>
              <p className={styles.recordLabel}>
                {state.status === 'recording' ? 'Tap to stop' : 'Tap to record'}
              </p>
              <ButtonRecord
                state={state.status === 'recording' ? 'Recording' : 'Default'}
                onClick={() =>
                  state.status === 'recording' ? stopRecording(MOCK_TRANSCRIPT) : startRecording()
                }
              />
            </motion.div>
          ) : null}

          {state.status === 'reviewing' ? (
            <motion.div key="review" layoutId="answer-surface" className={styles.reviewActions}>
              <Button variant="Primary" size="L" fullWidth onClick={() => send()}>
                Send
              </Button>
              <Button variant="Secondary" size="L" fullWidth onClick={discardAndReRecord}>
                Discard &amp; re-record
              </Button>
            </motion.div>
          ) : null}

          {result ? (
            <motion.div key="result" layoutId="answer-surface" className={styles.fill}>
              <FeedbackBanner
                variant={result.variant}
                title={result.title}
                body={result.body}
                answer={state.verdict === 'partial' ? term.answerReveal : undefined}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Independent of the answer area's own layoutId group on purpose —
          the mic button and review/result actions stay anchored to a
          fixed bottom position (decided with Joneil: he didn't want the
          button moving when recording starts, or the banner/buttons
          floating mid-screen), while the mascot is the one thing that
          should read as centered on the screen. Coupling them into the
          same shared-layout group was fighting those two goals against
          each other. Absolutely positioned + pointer-events: none so it
          never blocks a tap on the button or the text-switch link. */}
      <AnimatePresence mode="wait" initial={false}>
        {state.status === 'recording' || state.status === 'processing' ? (
          <motion.div
            key={state.status}
            className={styles.mascotOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {state.status === 'recording' ? (
              <MascotMoment pose="standby" label="I'm listening…" />
            ) : (
              // announce: this appears asynchronously with no user action
              // right before it, unlike Recording's mascot, which mounts
              // in the same click that already triggers ButtonRecord's
              // own aria-live announcement.
              <MascotMoment pose="thinking" label="Checking your answer…" announce />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {showTextSwitch ? (
        <TextLink className={styles.textSwitch} onClick={() => router.push('/text')}>
          I can't talk right now
        </TextLink>
      ) : null}

      {result ? (
        <div className={styles.actionArea}>
          <Button variant="Primary" size="L" fullWidth onClick={handleContinue}>
            Continue
          </Button>
          {showSayItBack ? (
            <Button variant="Secondary" size="L" fullWidth onClick={() => router.push('/say-it-back')}>
              Say it back
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
