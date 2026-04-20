import React from 'react'
import { Link } from 'react-router-dom'
import styles from './ServiceCard.module.css'

export default function ServiceCard({ icon, title, description, linkTo }) {
  return (
    <Link to={linkTo} className={styles.card}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.link}>
        Learn more 
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </Link>
  )
}
