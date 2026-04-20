import React from 'react'
import styles from './HeroGrowthVisual.module.css'

export default function HeroGrowthVisual() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.glow} aria-hidden />
      <div className={styles.frame}>
        <div className={styles.gridLines} aria-hidden />
        <div className={styles.diamond} aria-hidden />
        <span className={`${styles.dot} ${styles.dot1}`} aria-hidden />
        <span className={`${styles.dot} ${styles.dot2}`} aria-hidden />
        <span className={`${styles.dot} ${styles.dot3}`} aria-hidden />

        <div className={styles.hub}>
          <svg className={styles.hubIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m4 14 5-5 4 4 7-7" />
          </svg>
        </div>

        <svg className={styles.chartSvg} viewBox="0 0 320 100" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className={styles.areaFill}
            d="M 0 88 L 40 72 L 88 78 L 140 48 L 190 56 L 240 28 L 280 36 L 320 12 L 320 100 L 0 100 Z"
            fill="url(#heroAreaGrad)"
          />
          <polyline
            className={styles.growthLine}
            points="0,88 40,72 88,78 140,48 190,56 240,28 280,36 320,12"
          />
        </svg>

        <svg className={styles.waves} viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden>
          <g className={styles.waveGroup1}>
            <path
              className={`${styles.wavePath} ${styles.wave1}`}
              d="M -40 88 Q 60 72 160 88 T 360 82 T 520 90"
            />
          </g>
          <g className={styles.waveGroup2}>
            <path
              className={`${styles.wavePath} ${styles.wave2}`}
              d="M -20 102 Q 100 92 220 100 T 440 94 T 620 100"
            />
          </g>
        </svg>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statRow}>
          <div className={styles.statBadge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
          <div>
            <div className={styles.statValue}>970%</div>
            <p className={styles.statLabel}>Average ROI delivered for Webgrat partners</p>
          </div>
        </div>
      </div>
    </div>
  )
}
