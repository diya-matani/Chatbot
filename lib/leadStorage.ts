import type { LeadData } from './types'

/**
 * Store lead data
 */
export function saveLead(leadData: LeadData): void {
  try {
    const existing = localStorage.getItem('wizklub_leads')
    const leads = existing ? JSON.parse(existing) : []
    leads.push(leadData)
    localStorage.setItem('wizklub_leads', JSON.stringify(leads))
    console.log('✅ Lead saved:', leadData)
  } catch (error) {
    console.error('Failed to save lead:', error)
  }
}

/**
 * Get all leads
 */
export function getLeads(): LeadData[] {
  try {
    const existing = localStorage.getItem('wizklub_leads')
    return existing ? JSON.parse(existing) : []
  } catch (error) {
    console.error('Failed to get leads:', error)
    return []
  }
}
