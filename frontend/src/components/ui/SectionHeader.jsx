import React from 'react'
import styles from './SectionHeader.module.css'
import Badge from './Badge'

export default function SectionHeader({ badge, title, subtitle, align = 'center', className = '' }) {
  return (
    <div className={`${styles.header} ${styles[align]} ${className}`}>
      {badge && (
        <div className={align === 'left' ? styles.badgeLeft : styles.badgeCenter}>
          <Badge>{badge}</Badge>
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
