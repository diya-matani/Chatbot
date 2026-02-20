import { useState, useRef, useEffect } from 'react'
import {
  getInitialState,
  getNextStep,
  getBotContent,
  STEPS,
} from './conversationEngine'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import styles from './ChatWidget.module.css'

const DEMO_BOOKING_URL = 'https://wizklub.com/'
const TYPING_DELAY_MS = 600

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState(getInitialState)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const welcomeSent = useRef(false)

  useEffect(() => {
    if (!open) return
    if (messages.length === 0 && !welcomeSent.current) {
      welcomeSent.current = true
      sendBotMessage(getBotContent(state))
    }
  }, [open, messages.length])

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages, typing])

  function sendBotMessage(content, append = true) {
    if (!content?.text) return
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) =>
        append
          ? [...prev, { id: Date.now(), role: 'bot', ...content }]
          : [...prev, { id: Date.now(), role: 'bot', text: content.text, quickReplies: content.quickReplies }]
      )
    }, TYPING_DELAY_MS)
  }

  function handleQuickReply(label) {
    handleSend(label)
  }

  function handleSend(text) {
    if (!text?.trim()) return

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: text.trim() },
    ])

    const nextState = getNextStep(state, text)
    setState(nextState)

    const content = getBotContent(nextState)
    if (content.lead && nextState.step === STEPS.COMPLETE) {
      sendBotMessage({ ...content, quickReplies: [] })
      if (nextState.payload.demoBooked) {
        window.open(DEMO_BOOKING_URL, '_blank')
      }
      return
    }
    sendBotMessage(content)
  }

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <span className={styles.fabIcon}>×</span>
        ) : (
          <span className={styles.fabIcon}>💬</span>
        )}
      </button>

      {open && (
        <div className={styles.widget}>
          <header className={styles.header}>
            <div className={styles.headerAvatar}>W</div>
            <div>
              <strong>WizKlub</strong>
              <span className={styles.headerSub}>Online</span>
            </div>
          </header>

          <MessageList
            ref={listRef}
            messages={messages}
            typing={typing}
            onQuickReply={handleQuickReply}
          />

          {state.step !== STEPS.COMPLETE && (
            <ChatInput onSend={handleSend} placeholder="Type a message..." />
          )}
        </div>
      )}
    </>
  )
}
