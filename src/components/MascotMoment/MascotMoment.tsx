import styles from './MascotMoment.module.css';

export type MascotPose = 'thinking' | 'standby';

const MASCOT_SRC: Record<MascotPose, string> = {
  thinking: '/images/thinking.png',
  standby: '/images/standby.svg',
};

export interface MascotMomentProps {
  /** Which reaction art to show. Matches the filenames under public/images/. */
  pose: MascotPose;
  /** Visible caption under the mascot. */
  label: string;
  /**
   * Adds role="status" so screen readers announce this moment as it
   * appears asynchronously (e.g. Processing, which arrives after a delay
   * with no user action). Recording's own aria-live announcement on
   * ButtonRecord already covers that state change, so this defaults to
   * false there to avoid a duplicate announcement.
   */
  announce?: boolean;
}

export function MascotMoment({ pose, label, announce = false }: MascotMomentProps) {
  return (
    <div className={styles.mascotMoment} role={announce ? 'status' : undefined}>
      <img src={MASCOT_SRC[pose]} alt="" className={styles.image} />
      <p className={styles.label}>{label}</p>
    </div>
  );
}
