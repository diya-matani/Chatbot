import { useState } from 'react'
import ChatWidget from './chat/ChatWidget'
import Dashboard from './Dashboard'
import styles from './App.module.css'

export default function App() {
  const [view, setView] = useState('landing')

  return (
    <div className={styles.app}>
      <nav className={styles.nav}>
        <span className={styles.logo}>WizKlub</span>
        <div className={styles.navLinks}>
          <button
            type="button"
            className={view === 'landing' ? styles.navActive : ''}
            onClick={() => setView('landing')}
          >
            Home
          </button>
          <button
            type="button"
            className={view === 'dashboard' ? styles.navActive : ''}
            onClick={() => setView('dashboard')}
          >
            Leads
          </button>
        </div>
      </nav>

      {view === 'landing' ? (
        <main className={styles.landing}>
          <h1>STEM & critical thinking for kids</h1>
          <p>
            WizKlub helps K–8 students build higher-order thinking, coding, and
            problem-solving skills with live classes and certified instructors.
          </p>
          <div className={styles.cta}>
            <strong>Try the chatbot</strong> — click the button below to see how
            we qualify parents and schools and drive demo bookings.
          </div>
        </main>
      ) : (
        <Dashboard />
      )}

      <ChatWidget />
    </div>
  )
}
