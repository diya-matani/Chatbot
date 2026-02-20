import styles from './MessageBubble.module.css'

function formatText(text) {
  if (!text) return ''
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
}

export default function MessageBubble({ role, text }) {
  return (
    <div
      className={
        role === 'user'
          ? `${styles.bubble} ${styles.user}`
          : `${styles.bubble} ${styles.bot}`
      }
    >
      <span className={styles.text}>{formatText(text)}</span>
    </div>
  )
}
