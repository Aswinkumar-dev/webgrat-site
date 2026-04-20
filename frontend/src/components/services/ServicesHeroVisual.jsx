import React from 'react'
import styles from './ServicesHeroVisual.module.css'

/* 6 service nodes arranged in a circle around center (210, 185)
   Angles: 270°(top), 330°, 30°, 90°(bottom), 150°, 210° — radius 115 */
const cx = 210, cy = 185, r = 115
const nodes = [
  { id: 'ai',      label: 'AI',      angle: 270, color: 'primary',   icon: 'M12 2a5 5 0 0 1 0 10M9 9h6M7 17h10M12 12v5' },
  { id: 'seo',     label: 'SEO',     angle: 330, color: 'secondary',  icon: 'M11 11m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0M21 21l-4.35-4.35' },
  { id: 'ppc',     label: 'PPC',     angle: 30,  color: 'primary',   icon: 'M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3zM13 13l6 6' },
  { id: 'social',  label: 'Social',  angle: 90,  color: 'secondary',  icon: 'M18 5a3 3 0 1 0 0-1M6 12a3 3 0 1 0 0-1M18 19a3 3 0 1 0 0-1M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49' },
  { id: 'content', label: 'Content', angle: 150, color: 'primary',   icon: 'M14 2H6a2 2 0 0 0-2 2v16h16V8zM14 2v6h6M16 13H8M16 17H8' },
  { id: 'web',     label: 'Web',     angle: 210, color: 'secondary',  icon: 'M16 18l6-6-6-6M8 6L2 12l6 6' },
]

function toRad(deg) { return (deg * Math.PI) / 180 }
function nodePos(angle) {
  return {
    x: Math.round(cx + r * Math.cos(toRad(angle))),
    y: Math.round(cy + r * Math.sin(toRad(angle))),
  }
}

export default function ServicesHeroVisual() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.glow} />
      <div className={styles.frame}>
        <div className={styles.gridLines} />

        <svg className={styles.network} viewBox="0 0 420 370" fill="none">
          <defs>
            <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="var(--color-primary)"   stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-secondary)"  stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Spoke lines from center to each node */}
          {nodes.map((n, i) => {
            const p = nodePos(n.angle)
            return (
              <line
                key={n.id + '-line'}
                className={`${styles.spoke} ${styles['s' + i]}`}
                x1={cx} y1={cy} x2={p.x} y2={p.y}
              />
            )
          })}

          {/* Outer hub ring (slow pulse) */}
          <circle className={styles.outerRing} cx={cx} cy={cy} r="46" />

          {/* Central hub */}
          <circle className={styles.hubCore} cx={cx} cy={cy} r="34" fill="url(#hubGrad)" />

          {/* "W" Webgrat monogram in center */}
          <text
            x={cx} y={cy + 7}
            className={styles.hubLabel}
            textAnchor="middle"
            fontSize="18"
            fontWeight="800"
            fill="#ffffff"
            fontFamily="Montserrat, sans-serif"
          >WG</text>

          {/* Data packets travelling each spoke */}
          {nodes.map((n, i) => {
            const p = nodePos(n.angle)
            return (
              <circle
                key={n.id + '-pkt'}
                className={`${styles.packet} ${styles['pkt' + i]}`}
                r="3.5"
                cx={cx} cy={cy}
              >
                <animateMotion
                  dur={`${2.2 + i * 0.28}s`}
                  begin={`${i * 0.45}s`}
                  repeatCount="indefinite"
                  path={`M0,0 L${p.x - cx},${p.y - cy}`}
                  keyTimes="0;0.55;1"
                  keyPoints="0;1;1"
                  calcMode="linear"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.08;0.5;0.6"
                  dur={`${2.2 + i * 0.28}s`}
                  begin={`${i * 0.45}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )
          })}

          {/* Service nodes */}
          {nodes.map((n, i) => {
            const p = nodePos(n.angle)
            const isPrimary = n.color === 'primary'
            const strokeColor = isPrimary ? 'var(--color-primary)' : 'var(--color-secondary)'
            const glowId = `nodeGlow${i}`
            return (
              <g key={n.id} className={`${styles.serviceNode} ${styles['nd' + i]}`}>
                {/* Pulse ring */}
                <circle
                  className={`${styles.pulseRing} ${styles['pr' + i]}`}
                  cx={p.x} cy={p.y} r="22"
                  stroke={strokeColor}
                />
                {/* Node circle */}
                <circle
                  cx={p.x} cy={p.y} r="22"
                  fill={isPrimary ? 'rgba(46,247,142,0.12)' : 'rgba(30,95,161,0.18)'}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
                {/* Service icon (scaled to fit ~14px viewbox centered on node) */}
                <g transform={`translate(${p.x - 7}, ${p.y - 7}) scale(0.583)`}
                   stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {n.id === 'ai' && <>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v7M12 15v7M22 12h-7M9 12H2"/>
                  </>}
                  {n.id === 'seo' && <>
                    <circle cx="11" cy="11" r="6"/>
                    <line x1="19" y1="19" x2="15.5" y2="15.5"/>
                  </>}
                  {n.id === 'ppc' && <>
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
                    <path d="M13 13l4 4"/>
                  </>}
                  {n.id === 'social' && <>
                    <circle cx="18" cy="5" r="3"/>
                    <circle cx="6" cy="12" r="3"/>
                    <circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </>}
                  {n.id === 'content' && <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </>}
                  {n.id === 'web' && <>
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </>}
                </g>
                {/* Label */}
                <text
                  x={p.x} y={p.y + 34}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={strokeColor}
                  fontFamily="Poppins, sans-serif"
                  opacity="0.85"
                >{n.label}</text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
