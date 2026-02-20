/**
 * State Machine for WizKlub Chatbot Conversation Flow
 */

export type ConversationState =
  | 'welcome'
  | 'user_type'
  | 'parent_name'
  | 'parent_grade'
  | 'parent_interest'
  | 'parent_city'
  | 'parent_email'
  | 'parent_phone'
  | 'school_name'
  | 'school_role'
  | 'school_strength'
  | 'school_curriculum'
  | 'school_city'
  | 'school_email'
  | 'school_phone'
  | 'recommendation'
  | 'success'

export type UserType = 'Parent' | 'School' | null

export interface StateConfig {
  question: string
  quickReplies?: string[]
  validation?: (input: string) => boolean | string
  nextState: ConversationState | ((input: string, userType: UserType) => ConversationState)
  stepNumber: number
  totalSteps: number
}

export interface ConversationStateMachine {
  [key: string]: StateConfig
}

export const stateMachine: ConversationStateMachine = {
  welcome: {
    question: 'Hi 👋 Welcome to WizKlub!\nAre you:\n1. A Parent\n2. A School Representative',
    quickReplies: ['1. A Parent', '2. A School Representative'],
    validation: (input: string) => {
      const lower = input.toLowerCase()
      return lower.includes('parent') || lower.includes('school') || lower.includes('1') || lower.includes('2')
    },
    nextState: (input: string) => {
      const lower = input.toLowerCase()
      if (lower.includes('parent') || lower.includes('1')) return 'parent_name'
      if (lower.includes('school') || lower.includes('2')) return 'school_name'
      return 'user_type'
    },
    stepNumber: 1,
    totalSteps: 6,
  },

  user_type: {
    question: 'Hi 👋 Welcome to WizKlub!\nAre you:\n1. A Parent\n2. A School Representative',
    quickReplies: ['1. A Parent', '2. A School Representative'],
    validation: (input: string) => {
      const lower = input.toLowerCase()
      return lower.includes('parent') || lower.includes('school') || lower.includes('1') || lower.includes('2')
    },
    nextState: (input: string) => {
      const lower = input.toLowerCase()
      if (lower.includes('parent') || lower.includes('1')) return 'parent_name'
      if (lower.includes('school') || lower.includes('2')) return 'school_name'
      return 'user_type'
    },
    stepNumber: 1,
    totalSteps: 6,
  },

  // Parent Flow
  parent_name: {
    question: "Great! I'd love to help you find the perfect program for your child. What's your full name?",
    validation: (input: string) => {
      const trimmed = input.trim()
      // Accept names with at least 2 characters (can be single name or full name)
      if (trimmed.length < 2) return 'Please enter your name (at least 2 characters)'
      return true
    },
    nextState: 'parent_grade',
    stepNumber: 2,
    totalSteps: 6,
  },

  parent_grade: {
    question: "That's wonderful 😊 Which grade is your child currently studying in?",
    quickReplies: ['Grades 1–2', 'Grades 3–5', 'Grades 6–8', 'Grades 9–10'],
    validation: (input: string) => {
      const validOptions = ['Grades 1–2', 'Grades 3–5', 'Grades 6–8', 'Grades 9–10', '1-2', '3-5', '6-8', '9-10']
      const lower = input.toLowerCase()
      return validOptions.some(option => lower.includes(option.toLowerCase()) || lower.includes(option.replace('–', '-')))
    },
    nextState: 'parent_interest',
    stepNumber: 3,
    totalSteps: 6,
  },

  parent_interest: {
    question: 'Wonderful! Which program are you most interested in for your child?',
    quickReplies: [
      'Robotics & Coding Program',
      'Young Product Designer Program (YPDP)',
      'Higher Order Thinking Skills (HOTS)',
    ],
    validation: (input: string) => {
      const valid = [
        'Robotics & Coding Program',
        'Young Product Designer Program (YPDP)',
        'Higher Order Thinking Skills (HOTS)',
      ]
      return valid.some(v => input.toLowerCase().includes(v.toLowerCase()))
    },
    nextState: 'parent_city',
    stepNumber: 4,
    totalSteps: 6,
  },

  parent_city: {
    question: 'Which city are you located in?',
    validation: (input: string) => {
      if (input.trim().length < 2) return 'Please enter your city'
      return true
    },
    nextState: 'parent_email',
    stepNumber: 5,
    totalSteps: 6,
  },

  parent_email: {
    question: 'Great! What\'s your email address?',
    validation: (input: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input)) return 'Please enter a valid email address'
      return true
    },
    nextState: 'parent_phone',
    stepNumber: 6,
    totalSteps: 6,
  },

  parent_phone: {
    question: 'And your phone number?',
    validation: (input: string) => {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
      if (!phoneRegex.test(input.replace(/\s/g, ''))) {
        return 'Please enter a valid phone number'
      }
      return true
    },
    nextState: 'recommendation',
    stepNumber: 6,
    totalSteps: 6,
  },

  // School Flow
  school_name: {
    question: 'Excellent! I can help you explore partnership opportunities. What\'s your full name?',
    validation: (input: string) => {
      if (input.trim().length < 2) return 'Please enter your full name'
      return true
    },
    nextState: 'school_role',
    stepNumber: 2,
    totalSteps: 6,
  },

  school_role: {
    question: 'What\'s your role at the school?',
    quickReplies: ['Principal', 'Coordinator', 'Teacher', 'Other'],
    validation: (input: string) => {
      const valid = ['Principal', 'Coordinator', 'Teacher', 'Other']
      return valid.some(v => input.toLowerCase().includes(v.toLowerCase()))
    },
    nextState: 'school_strength',
    stepNumber: 3,
    totalSteps: 6,
  },

  school_strength: {
    question: 'How many students are in your school? (e.g., 500, 1000)',
    validation: (input: string) => {
      const strength = parseInt(input.replace(/,/g, ''))
      if (isNaN(strength) || strength < 1) {
        return 'Please enter a valid number of students'
      }
      return true
    },
    nextState: 'school_curriculum',
    stepNumber: 4,
    totalSteps: 6,
  },

  school_curriculum: {
    question: 'Which curriculum does your school follow?',
    quickReplies: ['CBSE', 'ICSE', 'IB', 'State Board', 'Other'],
    validation: (input: string) => {
      const valid = ['CBSE', 'ICSE', 'IB', 'State Board', 'Other']
      return valid.some(v => input.toLowerCase().includes(v.toLowerCase()))
    },
    nextState: 'school_city',
    stepNumber: 5,
    totalSteps: 6,
  },

  school_city: {
    question: 'Which city is your school located in?',
    validation: (input: string) => {
      if (input.trim().length < 2) return 'Please enter your city'
      return true
    },
    nextState: 'school_email',
    stepNumber: 6,
    totalSteps: 6,
  },

  school_email: {
    question: 'What\'s your email address?',
    validation: (input: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input)) return 'Please enter a valid email address'
      return true
    },
    nextState: 'school_phone',
    stepNumber: 7,
    totalSteps: 6,
  },

  school_phone: {
    question: 'And your phone number?',
    validation: (input: string) => {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
      if (!phoneRegex.test(input.replace(/\s/g, ''))) {
        return 'Please enter a valid phone number'
      }
      return true
    },
    nextState: 'recommendation',
    stepNumber: 6,
    totalSteps: 6,
  },

  recommendation: {
    question: '',
    nextState: (input: string) => {
      // Any input in recommendation state moves to success
      return 'success'
    },
    stepNumber: 0,
    totalSteps: 0,
  },

  success: {
    question: '',
    nextState: 'success',
    stepNumber: 0,
    totalSteps: 0,
  },
}

/**
 * Get next state based on current state and input
 */
export function getNextState(
  currentState: ConversationState,
  input: string,
  userType: UserType
): ConversationState {
  const config = stateMachine[currentState]
  if (!config) return currentState

  if (typeof config.nextState === 'function') {
    return config.nextState(input, userType)
  }

  return config.nextState
}

/**
 * Get state configuration
 */
export function getStateConfig(state: ConversationState): StateConfig {
  return stateMachine[state] || stateMachine.welcome
}
