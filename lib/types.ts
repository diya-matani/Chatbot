export interface LeadData {
  id: string
  name: string
  userType: 'Parent' | 'School'
  grade_or_role: string
  interest_or_strength: string
  curriculum: string
  city: string
  email: string
  phone: string
  leadScore: number
  leadTemperature: 'HOT' | 'WARM' | 'COLD'
  analytics: {
    startedAt: string
    completedAt: string
    demoClicked: boolean
  }
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quickReplies?: string[]
}

export interface ConversationContext {
  state: string
  userType: 'Parent' | 'School' | null
  leadData: Partial<LeadData>
  messages: Message[]
}
