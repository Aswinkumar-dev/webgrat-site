import React, { useState } from 'react'
import styles from './WhatsAppButton.module.css'
import whatsappLogo from '../../assets/whastapp logo.webp'

const WHATSAPP_NUMBER = '918903033920'
const WHATSAPP_MESSAGE = 'Hi Webgrat! I\'d like to know more about your services.'

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={`${styles.tooltip} ${hovered ? styles.tooltipVisible : ''}`}>
        Chat with us
      </span>
      <img src={whatsappLogo} alt="WhatsApp" className={styles.icon} />
    </a>
  )
}
