import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  to,
  href,
  onClick,
  className = '',
  style,
  type = 'button',
  disabled = false,
}) {
  const classes = `${styles.button} ${styles[variant]} ${styles[size] || ''} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} style={style}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
