/**
 * Analytics tracking utilities
 */

export type AnalyticsEvent =
  | 'conversation_started'
  | 'user_type_selected'
  | 'lead_completed'
  | 'demo_clicked'
  | 'counselor_clicked'
  | 'brochure_downloaded'
  | 'partnership_call_clicked'
  | 'proposal_deck_clicked'

export interface AnalyticsData {
  event: AnalyticsEvent
  timestamp: string
  userType?: string
  leadScore?: number
  leadTemperature?: string
  [key: string]: any
}

// In-memory analytics store
const analyticsStore: AnalyticsData[] = []

/**
 * Track analytics event
 */
export function trackEvent(event: AnalyticsEvent, data?: Record<string, any>) {
  const analyticsData: AnalyticsData = {
    event,
    timestamp: new Date().toISOString(),
    ...data,
  }

  analyticsStore.push(analyticsData)

  // Console log for debugging
  console.log('📊 Analytics Event:', analyticsData)

  // Store in localStorage for persistence
  try {
    const existing = localStorage.getItem('wizklub_analytics')
    const events = existing ? JSON.parse(existing) : []
    events.push(analyticsData)
    localStorage.setItem('wizklub_analytics', JSON.stringify(events))
  } catch (error) {
    console.error('Failed to store analytics:', error)
  }
}

/**
 * Get all analytics events
 */
export function getAnalytics(): AnalyticsData[] {
  return analyticsStore
}
