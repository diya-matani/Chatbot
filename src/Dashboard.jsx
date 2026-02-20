import { useState, useEffect } from 'react'
import { getLeads } from './chat/conversationEngine'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [leads, setLeads] = useState([])

  function refresh() {
    setLeads(getLeads())
  }

  useEffect(() => {
    refresh()
    const handler = () => refresh()
    window.addEventListener('wizklub-lead-saved', handler)
    return () => window.removeEventListener('wizklub-lead-saved', handler)
  }, [])

  return (
    <main className={styles.dashboard}>
      <h1>Leads</h1>
      <p className={styles.subtitle}>
        Captured via chatbot (stored in browser for prototype). In production,
        these would sync to your CRM.
      </p>

      {leads.length === 0 ? (
        <div className={styles.empty}>
          No leads yet. Open the chat and complete a flow to see entries here.
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Score</th>
                <th>Demo</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {[...leads].reverse().map((lead, i) => (
                <tr key={i}>
                  <td>
                    <span
                      className={
                        lead.userType === 'School'
                          ? styles.badgeSchool
                          : styles.badgeParent
                      }
                    >
                      {lead.userType}
                    </span>
                  </td>
                  <td>{lead.name || '—'}</td>
                  <td>{lead.phone || '—'}</td>
                  <td>{lead.email || '—'}</td>
                  <td>
                    <span
                      className={
                        lead.leadScore >= 70
                          ? styles.scoreHigh
                          : lead.leadScore >= 40
                            ? styles.scoreMid
                            : styles.scoreLow
                      }
                    >
                      {lead.leadScore}%
                    </span>
                  </td>
                  <td>{lead.demoBooked ? 'Yes' : 'No'}</td>
                  <td>
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
