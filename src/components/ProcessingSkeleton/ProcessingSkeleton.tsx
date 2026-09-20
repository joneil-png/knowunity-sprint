import styles from './ProcessingSkeleton.module.css';

export interface ProcessingSkeletonProps {
  /**
   * Screen-reader announcement while this is visible — visually hidden. The
   * shimmering blocks carry the visual status; this carries it for screen
   * readers, matching feedbackBanner's role="status" pattern in the same
   * screen position.
   */
  label: string;
  className?: string;
}

function bone(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export function ProcessingSkeleton({ label, className }: ProcessingSkeletonProps) {
  return (
    <div role="status" className={[styles.skeleton, className].filter(Boolean).join(' ')}>
      <span className={styles.visuallyHidden}>{label}</span>
      <div className={styles.titleRow} aria-hidden="true">
        <span className={bone(styles.bone, styles.iconBone)} />
        <span className={bone(styles.bone, styles.titleBone)} />
      </div>
      <span className={bone(styles.bone, styles.bodyBoneFull)} aria-hidden="true" />
      <span className={bone(styles.bone, styles.bodyBoneShort)} aria-hidden="true" />
    </div>
  );
}
