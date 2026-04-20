import React, { useState, useRef, useEffect } from 'react'
import styles from './FAQAccordion.module.css'

function AccordionItem({ q, a, isOpen, onClick }) {
  const answerRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setHeight(answerRef.current.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [isOpen])

  return (
    <div className={`${styles.item} ${isOpen ? styles.open : ''}`}>
      <button className={styles.question} onClick={onClick} aria-expanded={isOpen}>
        {q}
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div 
        className={styles.answerWrapper} 
        style={{ maxHeight: `${height}px` }}
      >
        <div className={styles.answer} ref={answerRef}>
          {a}
        </div>
      </div>
    </div>
  )
}

export default function FAQAccordion({ questions }) {
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={styles.accordion}>
      {questions.map((item, index) => (
        <AccordionItem 
          key={index}
          q={item.q}
          a={item.a}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  )
}
