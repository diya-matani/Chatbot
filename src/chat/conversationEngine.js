/**
 * Rule-based conversation engine for WizKlub chatbot.
 * Handles Parent and School flows, qualification, lead capture, and lead scoring.
 */

export const USER_TYPE = { PARENT: 'Parent', SCHOOL: 'School' }

export const STEPS = {
  WELCOME: 'welcome',
  USER_TYPE: 'user_type',
  // Parent
  PARENT_CHILD_AGE: 'parent_child_age',
  PARENT_INTEREST: 'parent_interest',
  // School
  SCHOOL_NAME: 'school_name',
  SCHOOL_ROLE: 'school_role',
  SCHOOL_GRADES: 'school_grades',
  SCHOOL_REACH: 'school_reach',
  // Common
  NAME: 'name',
  PHONE: 'phone',
  EMAIL: 'email',
  CONFIRM_BOOK_DEMO: 'confirm_book_demo',
  COMPLETE: 'complete',
}

const PARENT_INTERESTS = [
  'STEM & Coding (YPDP)',
  'Math & Science (Academic)',
  'Critical Thinking (HOTS)',
  'Not sure yet',
]

const SCHOOL_ROLES = ['Principal', 'Coordinator', 'Teacher', 'Other']
const SCHOOL_GRADES_OPTIONS = ['Primary (1–5)', 'Middle (6–8)', 'Both']
const SCHOOL_REACH_OPTIONS = ['Under 100', '100–500', '500+']

/** Lead score weights for parents */
const PARENT_SCORE = {
  age_6_8: 2,
  age_9_11: 3,
  age_12_15: 2,
  interest_stem: 3,
  interest_math_science: 2,
  interest_hots: 2,
  interest_unsure: 1,
}

/** Lead score weights for schools */
const SCHOOL_SCORE = {
  reach_under_100: 1,
  reach_100_500: 2,
  reach_500_plus: 3,
  grades_both: 2,
  grades_primary_or_middle: 1,
}

export function getInitialState() {
  return {
    step: STEPS.WELCOME,
    userType: null,
    payload: {},
    leadScore: 0,
    maxScore: 0,
  }
}

export function getNextStep(state, userMessage) {
  const msg = (userMessage || '').trim().toLowerCase()
  const { step, userType, payload } = state
  let next = { ...state }
  next.payload = { ...payload }

  switch (step) {
    case STEPS.WELCOME:
      next.step = STEPS.USER_TYPE
      return next

    case STEPS.USER_TYPE: {
      if (msg.includes('parent') || msg === '1') {
        next.userType = USER_TYPE.PARENT
        next.step = STEPS.PARENT_CHILD_AGE
      } else if (msg.includes('school') || msg === '2') {
        next.userType = USER_TYPE.SCHOOL
        next.step = STEPS.SCHOOL_NAME
      } else {
        next.step = STEPS.USER_TYPE
      }
      return next
    }

    case STEPS.PARENT_CHILD_AGE:
      next.payload.childAge = userMessage.trim()
      next.step = STEPS.PARENT_INTEREST
      if (msg.includes('6') || msg.includes('7') || msg.includes('8')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.age_6_8
      else if (msg.includes('9') || msg.includes('10') || msg.includes('11')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.age_9_11
      else if (msg.includes('12') || msg.includes('13') || msg.includes('14') || msg.includes('15')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.age_12_15
      next.maxScore = (next.maxScore || 0) + 3
      return next

    case STEPS.PARENT_INTEREST:
      next.payload.interest = userMessage.trim()
      next.step = STEPS.NAME
      if (msg.includes('stem') || msg.includes('coding') || msg.includes('ypdp')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.interest_stem
      else if (msg.includes('math') || msg.includes('science')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.interest_math_science
      else if (msg.includes('critical') || msg.includes('hots') || msg.includes('thinking')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.interest_hots
      else next.leadScore = (next.leadScore || 0) + PARENT_SCORE.interest_unsure
      next.maxScore = (next.maxScore || 0) + 3
      return next

    case STEPS.SCHOOL_NAME:
      next.payload.schoolName = userMessage.trim()
      next.step = STEPS.SCHOOL_ROLE
      return next

    case STEPS.SCHOOL_ROLE:
      next.payload.role = userMessage.trim()
      next.step = STEPS.SCHOOL_GRADES
      return next

    case STEPS.SCHOOL_GRADES:
      next.payload.grades = userMessage.trim()
      next.step = STEPS.SCHOOL_REACH
      if (msg.includes('both')) next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.grades_both
      else next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.grades_primary_or_middle
      next.maxScore = (next.maxScore || 0) + 2
      return next

    case STEPS.SCHOOL_REACH:
      next.payload.reach = userMessage.trim()
      next.step = STEPS.NAME
      if (msg.includes('500') || msg.includes('500+')) next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.reach_500_plus
      else if (msg.includes('100') && !msg.includes('under')) next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.reach_100_500
      else next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.reach_under_100
      next.maxScore = (next.maxScore || 0) + 3
      return next

    case STEPS.NAME:
      next.payload.name = userMessage.trim()
      next.step = STEPS.PHONE
      return next

    case STEPS.PHONE:
      next.payload.phone = userMessage.trim()
      next.step = STEPS.EMAIL
      return next

    case STEPS.EMAIL:
      next.payload.email = userMessage.trim()
      next.step = STEPS.CONFIRM_BOOK_DEMO
      return next

    case STEPS.CONFIRM_BOOK_DEMO:
      next.step = STEPS.COMPLETE
      next.payload.demoBooked = msg.includes('book') || msg.includes('yes') || msg === '1'
      return next

    default:
      return next
  }
}

export function getBotContent(state) {
  const { step, userType, payload, leadScore = 0, maxScore = 0 } = state

  switch (step) {
    case STEPS.WELCOME:
      return {
        text: "Hi! 👋 Welcome to **WizKlub**. We help kids build STEM skills and critical thinking. Are you here as a **Parent** exploring programs for your child, or a **School** interested in partnership?",
        quickReplies: ['Parent', 'School'],
      }

    case STEPS.USER_TYPE:
      return {
        text: "Are you a **Parent** or a **School** representative?",
        quickReplies: ['Parent', 'School'],
      }

    case STEPS.PARENT_CHILD_AGE:
      return {
        text: "That's great! What's your child's age or grade? (e.g. 8 years, Grade 3)",
        quickReplies: ['6–8 years', '9–11 years', '12–15 years'],
      }

    case STEPS.PARENT_INTEREST:
      return {
        text: "Which area interests you most?",
        quickReplies: PARENT_INTERESTS,
      }

    case STEPS.SCHOOL_NAME:
      return {
        text: "Wonderful! What's your school name?",
        quickReplies: [],
      }

    case STEPS.SCHOOL_ROLE:
      return {
        text: "What's your role at the school?",
        quickReplies: SCHOOL_ROLES,
      }

    case STEPS.SCHOOL_GRADES:
      return {
        text: "Which grades would you like to offer WizKlub to?",
        quickReplies: SCHOOL_GRADES_OPTIONS,
      }

    case STEPS.SCHOOL_REACH:
      return {
        text: "Roughly how many students would you want to reach?",
        quickReplies: SCHOOL_REACH_OPTIONS,
      }

    case STEPS.NAME:
      return {
        text: userType === USER_TYPE.PARENT
          ? "Almost there! What's your name?"
          : "What's your name?",
        quickReplies: [],
      }

    case STEPS.PHONE:
      return {
        text: "What's the best phone number to reach you?",
        quickReplies: [],
      }

    case STEPS.EMAIL:
      return {
        text: "And your email address?",
        quickReplies: [],
      }

    case STEPS.CONFIRM_BOOK_DEMO: {
      const scoreLabel = maxScore > 0 ? ` (Lead score: ${leadScore}/${maxScore})` : ''
      const cta = userType === USER_TYPE.SCHOOL
        ? "One of our **partnership managers** will reach out within 24 hours. Would you like to **book a partnership demo** now?"
        : "Thanks, " + (payload.name || 'there') + "! We'll create a **personalized plan** for your child. Book a **free 1:1 demo** now?" + scoreLabel
      return {
        text: cta,
        quickReplies: ['Yes, book a demo', 'Just call me'],
      }
    }

    case STEPS.COMPLETE: {
      const lead = buildLead(state)
      saveLead(lead)
      const msg = payload.demoBooked
        ? "🎉 Demo requested! We'll send a calendar link to your email and call you to confirm. Have a great day!"
        : "We've noted your details. Our team will call you within 24 hours. Have a great day!"
      return {
        text: msg,
        quickReplies: [],
        lead,
      }
    }

    default:
      return { text: "How can I help?", quickReplies: [] }
  }
}

function buildLead(state) {
  const { userType, payload, leadScore = 0, maxScore = 0 } = state
  const scoreNormalized = maxScore > 0 ? Math.round((leadScore / maxScore) * 100) : 0
  return {
    userType,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    ...(userType === USER_TYPE.PARENT && {
      childAge: payload.childAge,
      interest: payload.interest,
    }),
    ...(userType === USER_TYPE.SCHOOL && {
      schoolName: payload.schoolName,
      role: payload.role,
      grades: payload.grades,
      reach: payload.reach,
    }),
    demoBooked: payload.demoBooked,
    leadScore: scoreNormalized,
    createdAt: new Date().toISOString(),
  }
}

const STORAGE_KEY = 'wizklub_leads'

export function saveLead(lead) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    list.push(lead)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wizklub-lead-saved'))
    }
  } catch (_) {}
}

export function getLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (_) {
    return []
  }
}
