import { forwardRef } from 'react'
import MessageBubble from './MessageBubble'
import QuickReplies from './QuickReplies'
import styles from './MessageList.module.css'

const MessageList = forwardRef(function MessageList(
  { messages, typing, onQuickReply },
  ref
) {
  let lastQuickReplies = null
  const lastBot = [...messages].reverse().find((m) => m.role === 'bot')

  return (
    <div ref={ref} className={styles.list}>
      {messages.map((msg) => {
        const showQuickReplies =
          msg.role === 'bot' &&
          msg.quickReplies?.length > 0 &&
          msg === lastBot
        if (showQuickReplies) lastQuickReplies = msg.quickReplies

        return (
          <div key={msg.id}>
            <MessageBubble role={msg.role} text={msg.text} />
          </div>
        )
      })}
      {typing && (
        <div className={styles.typingWrap}>
          <span className={styles.typing}>WizKlub is typing...</span>
        </div>
      )}
      {!typing && lastQuickReplies && lastQuickReplies.length > 0 && (
        <QuickReplies
          options={lastQuickReplies}
          onSelect={onQuickReply}
        />
      )}
    </div>
  )
})

export default MessageList
