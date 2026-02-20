import styles from './QuickReplies.module.css'

export default function QuickReplies({ options, onSelect }) {
  if (!options?.length) return null

  return (
    <div className={styles.wrap}>
      {options.map((label, i) => (
        <button
          key={i}
          type="button"
          className={styles.btn}
          onClick={() => onSelect(label)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
