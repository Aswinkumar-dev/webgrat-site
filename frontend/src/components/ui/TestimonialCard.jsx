import React from 'react'
import styles from './TestimonialCard.module.css'

export default function TestimonialCard({ quote, name, company, resultBadge }) {
  return (
    <div className={styles.card}>
      <p className={styles.quote}>"{quote}"</p>
      <div className={styles.author}>
        <div className={styles.name}>{name}</div>
        <div className={styles.company}>{company}</div>
      </div>
      {resultBadge && (
        <div className={styles.badge}>{resultBadge}</div>
      )}
    </div>
  )
}
