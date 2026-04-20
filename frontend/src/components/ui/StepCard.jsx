import React from 'react'
import styles from './StepCard.module.css'

export default function StepCard({ number, title, description, isLast }) {
  return (
    <div className={`${styles.step}${isLast ? ' ' + styles.stepLast : ''}`}>
      <div className={styles.number}>{number}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  )
}
