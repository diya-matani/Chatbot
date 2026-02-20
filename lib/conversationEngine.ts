export type UserType = 'Parent' | 'School' | null

export type ConversationStep =
  | 'welcome'
  | 'user_type'
  | 'parent_name'
  | 'parent_grade'
  | 'parent_interest'
  | 'parent_city'
  | 'parent_email'
  | 'parent_phone'
  | 'parent_recommendation'
  | 'school_name'
  | 'school_role'
  | 'school_strength'
  | 'school_curriculum'
  | 'school_city'
  | 'school_email'
  | 'school_phone'
  | 'school_recommendation'
  | 'complete'

export interface LeadData {
  name: string
  userType: string
  grade_or_role: string
  interest_or_strength: string
  curriculum: string
  city: string
  email: string
  phone: string
  leadScore: number
  leadTemperature: string
  timestamp?: string
}

export interface ConversationState {
  step: ConversationStep
  userType: UserType
  leadData: Partial<LeadData>
  messages: Message[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quickReplies?: string[]
}

export const PARENT_INTERESTS = ['Coding', 'Robotics', 'Math', 'Not Sure']
export const SCHOOL_ROLES = ['Principal', 'Coordinator', 'Teacher', 'Other']
export const SCHOOL_CURRICULUM = ['CBSE', 'ICSE', 'IB', 'State Board', 'Other']

/**
 * Calculate lead score based on collected data
 */
export function calculateLeadScore(
  userType: UserType,
  leadData: Partial<LeadData>
): number {
  let score = 0

  if (userType === 'Parent') {
    // Grade 3-8 → +20
    const grade = parseInt(leadData.grade_or_role || '0')
    if (grade >= 3 && grade <= 8) {
      score += 20
    }

    // Interested in Coding → +15
    if (leadData.interest_or_strength === 'Coding') {
      score += 15
    }

    // Provided Phone → +20
    if (leadData.phone && leadData.phone.length > 0) {
      score += 20
    }
  } else if (userType === 'School') {
    // Decision Maker → +30
    if (
      leadData.grade_or_role === 'Principal' ||
      leadData.grade_or_role === 'Coordinator'
    ) {
      score += 30
    }

    // 1000+ students → +25
    const strength = parseInt(leadData.interest_or_strength || '0')
    if (strength >= 1000) {
      score += 25
    }
  }

  return score
}

/**
 * Get lead temperature based on score
 */
export function getLeadTemperature(score: number): string {
  if (score > 60) return 'HOT'
  if (score >= 30) return 'WARM'
  return 'COLD'
}

/**
 * Get next step in conversation flow
 */
export function getNextStep(
  currentStep: ConversationStep,
  userType: UserType,
  userInput?: string
): ConversationStep {
  switch (currentStep) {
    case 'welcome':
      return 'user_type'

    case 'user_type':
      if (userInput?.includes('1') || userInput?.toLowerCase().includes('parent')) {
        return 'parent_name'
      }
      if (userInput?.includes('2') || userInput?.toLowerCase().includes('school')) {
        return 'school_name'
      }
      return 'user_type'

    // Parent flow
    case 'parent_name':
      return 'parent_grade'
    case 'parent_grade':
      return 'parent_interest'
    case 'parent_interest':
      return 'parent_city'
    case 'parent_city':
      return 'parent_email'
    case 'parent_email':
      return 'parent_phone'
    case 'parent_phone':
      return 'parent_recommendation'

    // School flow
    case 'school_name':
      return 'school_role'
    case 'school_role':
      return 'school_strength'
    case 'school_strength':
      return 'school_curriculum'
    case 'school_curriculum':
      return 'school_city'
    case 'school_city':
      return 'school_email'
    case 'school_email':
      return 'school_phone'
    case 'school_phone':
      return 'school_recommendation'

    case 'parent_recommendation':
    case 'school_recommendation':
      return 'complete'

    default:
      return 'complete'
  }
}

/**
 * Get bot message for current step
 */
export function getBotMessage(
  step: ConversationStep,
  userType: UserType,
  leadData: Partial<LeadData>
): { content: string; quickReplies?: string[] } {
  switch (step) {
    case 'welcome':
      return {
        content:
          'Hi 👋 Welcome to WizKlub!\nAre you:\n1. A Parent\n2. A School Representative',
        quickReplies: ['1. A Parent', '2. A School Representative'],
      }

    case 'user_type':
      return {
        content:
          'Hi 👋 Welcome to WizKlub!\nAre you:\n1. A Parent\n2. A School Representative',
        quickReplies: ['1. A Parent', '2. A School Representative'],
      }

    case 'parent_name':
      return {
        content: "Great! I'd love to help you find the perfect program for your child. What's your full name?",
      }

    case 'parent_grade':
      return {
        content: 'Perfect! What grade is your child in? (e.g., 3, 4, 5)',
      }

    case 'parent_interest':
      return {
        content: 'Wonderful! What area interests you most for your child?',
        quickReplies: PARENT_INTERESTS,
      }

    case 'parent_city':
      return {
        content: 'Which city are you located in?',
      }

    case 'parent_email':
      return {
        content: 'Great! What's your email address?',
      }

    case 'parent_phone':
      return {
        content: 'And your phone number?',
      }

    case 'parent_recommendation':
      return {
        content: `Perfect! Based on your child's grade (${leadData.grade_or_role}) and interest in ${leadData.interest_or_strength}, I recommend our personalized STEM program. What would you like to do next?`,
        quickReplies: ['Book Free Demo', 'Talk to Counselor', 'Download Brochure'],
      }

    case 'school_name':
      return {
        content: 'Excellent! I can help you explore partnership opportunities. What\'s your full name?',
      }

    case 'school_role':
      return {
        content: 'What\'s your role at the school?',
        quickReplies: SCHOOL_ROLES,
      }

    case 'school_strength':
      return {
        content: 'How many students are in your school? (e.g., 500, 1000)',
      }

    case 'school_curriculum':
      return {
        content: 'Which curriculum does your school follow?',
        quickReplies: SCHOOL_CURRICULUM,
      }

    case 'school_city':
      return {
        content: 'Which city is your school located in?',
      }

    case 'school_email':
      return {
        content: 'What\'s your email address?',
      }

    case 'school_phone':
      return {
        content: 'And your phone number?',
      }

    case 'school_recommendation':
      return {
        content: `Perfect! Based on your school's needs (${leadData.interest_or_strength} students, ${leadData.curriculum} curriculum), I recommend our Partnership Model. What would you like to do next?`,
        quickReplies: ['Schedule Partnership Call', 'Get Proposal Deck'],
      }

    case 'complete':
      return {
        content: 'Thank you! Our team will reach out to you shortly.',
      }

    default:
      return { content: 'How can I help you?' }
  }
}
