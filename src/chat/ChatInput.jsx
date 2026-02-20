import { useState } from 'react'
import styles from './ChatInput.module.css'

export default function ChatInput({ onSend, placeholder }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const v = value.trim()
    if (v) {
      onSend(v)
      setValue('')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      <button type="submit" className={styles.send} aria-label="Send">
        Send
      </button>
    </form>
  )
}
