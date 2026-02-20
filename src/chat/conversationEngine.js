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
  PARENT_CURRICULUM: 'parent_curriculum',
  PARENT_INTEREST: 'parent_interest',
  PARENT_MODE: 'parent_mode',
  // School
  SCHOOL_NAME: 'school_name',
  SCHOOL_ROLE: 'school_role',
  SCHOOL_DECISION_MAKER: 'school_decision_maker',
  SCHOOL_GRADES: 'school_grades',
  SCHOOL_REACH: 'school_reach',
  SCHOOL_CURRICULUM: 'school_curriculum',
  SCHOOL_PROGRAM_TYPE: 'school_program_type',
  // Common
  NAME: 'name',
  PHONE: 'phone',
  EMAIL: 'email',
  CITY: 'city',
  CONFIRM_BOOK_DEMO: 'confirm_book_demo',
  COMPLETE: 'complete',
}

const PARENT_CURRICULUM_OPTIONS = ['CBSE', 'ICSE', 'IB', 'State Board', 'Other']
const PARENT_INTERESTS = [
  'Coding',
  'Robotics',
  'Math',
  'Full Program',
]
const PARENT_MODE_OPTIONS = ['Online', 'Offline', 'Both']

const SCHOOL_ROLES = ['Principal', 'Coordinator', 'Teacher', 'Other']
const SCHOOL_DECISION_MAKER_OPTIONS = ['Yes, I am', 'No, but I can connect you', 'Not sure']
const SCHOOL_GRADES_OPTIONS = ['Primary (1–5)', 'Middle (6–8)', 'Both']
const SCHOOL_REACH_OPTIONS = ['Under 100', '100–500', '500+']
const SCHOOL_CURRICULUM_OPTIONS = ['CBSE', 'ICSE', 'IB', 'State Board', 'Other']
const SCHOOL_PROGRAM_TYPE_OPTIONS = ['After-school program', 'Integrated curriculum', 'Both']

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
    case STEPS.WELCOME: {
      // Check user's response directly from welcome message
      if (msg.includes('stem') || msg.includes('child') || msg.includes('parent') || msg === '1') {
        next.userType = USER_TYPE.PARENT
        next.step = STEPS.PARENT_CHILD_AGE
      } else if (msg.includes('school') || msg.includes('partnership') || msg === '2') {
        next.userType = USER_TYPE.SCHOOL
        next.step = STEPS.SCHOOL_NAME
      } else {
        // If unclear, ask again
        next.step = STEPS.USER_TYPE
      }
      return next
    }

    case STEPS.USER_TYPE: {
      if (msg.includes('stem') || msg.includes('child') || msg.includes('parent') || msg === '1') {
        next.userType = USER_TYPE.PARENT
        next.step = STEPS.PARENT_CHILD_AGE
      } else if (msg.includes('school') || msg.includes('partnership') || msg === '2') {
        next.userType = USER_TYPE.SCHOOL
        next.step = STEPS.SCHOOL_NAME
      } else {
        next.step = STEPS.USER_TYPE
      }
      return next
    }

    case STEPS.PARENT_CHILD_AGE:
      next.payload.childAge = userMessage.trim()
      next.step = STEPS.PARENT_CURRICULUM
      if (msg.includes('6') || msg.includes('7') || msg.includes('8')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.age_6_8
      else if (msg.includes('9') || msg.includes('10') || msg.includes('11')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.age_9_11
      else if (msg.includes('12') || msg.includes('13') || msg.includes('14') || msg.includes('15')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.age_12_15
      next.maxScore = (next.maxScore || 0) + 3
      return next

    case STEPS.PARENT_CURRICULUM:
      next.payload.curriculum = userMessage.trim()
      next.step = STEPS.PARENT_INTEREST
      return next

    case STEPS.PARENT_INTEREST:
      next.payload.interest = userMessage.trim()
      next.step = STEPS.PARENT_MODE
      if (msg.includes('coding') || msg.includes('robotics')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.interest_stem
      else if (msg.includes('math')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.interest_math_science
      else if (msg.includes('full')) next.leadScore = (next.leadScore || 0) + PARENT_SCORE.interest_stem
      else next.leadScore = (next.leadScore || 0) + PARENT_SCORE.interest_unsure
      next.maxScore = (next.maxScore || 0) + 3
      return next

    case STEPS.PARENT_MODE:
      next.payload.preferredMode = userMessage.trim()
      next.step = STEPS.NAME
      return next

    case STEPS.SCHOOL_NAME:
      next.payload.schoolName = userMessage.trim()
      next.step = STEPS.SCHOOL_ROLE
      return next

    case STEPS.SCHOOL_ROLE:
      next.payload.role = userMessage.trim()
      next.step = STEPS.SCHOOL_DECISION_MAKER
      return next

    case STEPS.SCHOOL_DECISION_MAKER:
      next.payload.decisionMaker = userMessage.trim()
      next.step = STEPS.SCHOOL_GRADES
      if (msg.includes('yes') || msg.includes('i am')) next.leadScore = (next.leadScore || 0) + 3
      else if (msg.includes('connect')) next.leadScore = (next.leadScore || 0) + 2
      next.maxScore = (next.maxScore || 0) + 3
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
      next.step = STEPS.SCHOOL_CURRICULUM
      if (msg.includes('500') || msg.includes('500+')) next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.reach_500_plus
      else if (msg.includes('100') && !msg.includes('under')) next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.reach_100_500
      else next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.reach_under_100
      next.maxScore = (next.maxScore || 0) + 3
      return next

    case STEPS.SCHOOL_CURRICULUM:
      next.payload.curriculum = userMessage.trim()
      next.step = STEPS.SCHOOL_PROGRAM_TYPE
      return next

    case STEPS.SCHOOL_PROGRAM_TYPE:
      next.payload.programType = userMessage.trim()
      next.step = STEPS.NAME
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
      next.step = STEPS.CITY
      return next

    case STEPS.CITY:
      next.payload.city = userMessage.trim()
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
        text: "Hi 👋 Are you looking for **STEM programs for your child** or exploring **school partnerships**?",
        quickReplies: ['STEM programs for my child', 'School partnerships'],
      }

    case STEPS.USER_TYPE:
      return {
        text: "Are you looking for **STEM programs for your child** or exploring **school partnerships**?",
        quickReplies: ['STEM programs for my child', 'School partnerships'],
      }

    case STEPS.PARENT_CHILD_AGE:
      return {
        text: "Perfect! To recommend the best **STEM program** for your child, what's their age or grade? (e.g. 8 years, Grade 3)",
        quickReplies: ['6–8 years', '9–11 years', '12–15 years'],
      }

    case STEPS.PARENT_CURRICULUM:
      return {
        text: "Got it! Which **curriculum** does your child follow? (This helps us align our programs)",
        quickReplies: PARENT_CURRICULUM_OPTIONS,
      }

    case STEPS.PARENT_INTEREST:
      return {
        text: "Great! What are you most interested in for your child?",
        quickReplies: PARENT_INTERESTS,
      }

    case STEPS.PARENT_MODE:
      return {
        text: "Perfect! What's your **preferred mode** of learning?",
        quickReplies: PARENT_MODE_OPTIONS,
      }

    case STEPS.SCHOOL_NAME:
      return {
        text: "Excellent! We'd love to explore a **partnership** with your school. What's your school name?",
        quickReplies: [],
      }

    case STEPS.SCHOOL_ROLE:
      return {
        text: "Thanks! What's your **role** at the school?",
        quickReplies: SCHOOL_ROLES,
      }

    case STEPS.SCHOOL_DECISION_MAKER:
      return {
        text: "Are you the **decision maker** for partnership programs, or can you connect us with the right person?",
        quickReplies: SCHOOL_DECISION_MAKER_OPTIONS,
      }

    case STEPS.SCHOOL_GRADES:
      return {
        text: "Which **grade levels** would you like to offer WizKlub programs to?",
        quickReplies: SCHOOL_GRADES_OPTIONS,
      }

    case STEPS.SCHOOL_REACH:
      return {
        text: "Perfect! Approximately how many **students** would benefit from our partnership?",
        quickReplies: SCHOOL_REACH_OPTIONS,
      }

    case STEPS.SCHOOL_CURRICULUM:
      return {
        text: "Which **curriculum** does your school follow?",
        quickReplies: SCHOOL_CURRICULUM_OPTIONS,
      }

    case STEPS.SCHOOL_PROGRAM_TYPE:
      return {
        text: "Great! Are you looking for an **after-school program** or **integrated curriculum**?",
        quickReplies: SCHOOL_PROGRAM_TYPE_OPTIONS,
      }

    case STEPS.NAME:
      return {
        text: userType === USER_TYPE.PARENT
          ? "Almost there! To book your **free demo** and get a personalized plan, what's your name?"
          : "Great! To connect you with our **partnership team**, what's your name?",
        quickReplies: [],
      }

    case STEPS.PHONE:
      return {
        text: userType === USER_TYPE.PARENT
          ? "What's the best **phone number** to reach you for the demo?"
          : "What's the best **phone number** to reach you about the partnership?",
        quickReplies: [],
      }

    case STEPS.EMAIL:
      return {
        text: userType === USER_TYPE.PARENT
          ? "And your **email address**? We'll send demo details there."
          : "And your **email address**? We'll send partnership information there.",
        quickReplies: [],
      }

    case STEPS.CITY:
      return {
        text: userType === USER_TYPE.PARENT
          ? "Which **city** are you located in? (Helps us connect you with local resources)"
          : "Which **city** is your school located in?",
        quickReplies: [],
      }

    case STEPS.CONFIRM_BOOK_DEMO: {
      const scoreLabel = maxScore > 0 ? ` (Lead score: ${leadScore}/${maxScore})` : ''
      const cta = userType === USER_TYPE.SCHOOL
        ? "Perfect! One of our **partnership managers** will reach out within 24 hours to discuss how WizKlub can benefit your students. Would you like to **book a partnership demo** now?"
        : "Thanks, " + (payload.name || 'there') + "! Based on your child's age and interests, we'll create a **personalized STEM learning plan**. Book a **free 1:1 demo** to see it in action?" + scoreLabel
      return {
        text: cta,
        quickReplies: userType === USER_TYPE.SCHOOL 
          ? ['Yes, book partnership demo', 'Just call me']
          : ['Yes, book a demo', 'Just call me'],
      }
    }

    case STEPS.COMPLETE: {
      const lead = buildLead(state)
      saveLead(lead)
      let msg
      if (payload.demoBooked) {
        msg = userType === USER_TYPE.SCHOOL
          ? "🎉 **Partnership demo booked!** We'll send a calendar link to your email and our partnership manager will call you to confirm. Looking forward to partnering with " + (payload.schoolName || 'your school') + "!"
          : "🎉 **Demo booked!** We'll send a calendar link to your email and call you to confirm. Can't wait to show you the perfect STEM program for your child!"
      } else {
        msg = userType === USER_TYPE.SCHOOL
          ? "Perfect! We've noted your partnership inquiry. Our **partnership team** will call you within 24 hours to discuss how WizKlub can benefit your students. Have a great day!"
          : "Perfect! We've noted your details. Our team will call you within 24 hours to discuss the best **STEM program** for your child. Have a great day!"
      }
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
    city: payload.city,
    ...(userType === USER_TYPE.PARENT && {
      childGrade: payload.childAge, // Child's grade/age
      curriculum: payload.curriculum, // CBSE/ICSE/IB/State Board
      interest: payload.interest, // Coding/Robotics/Math/Full Program
      preferredMode: payload.preferredMode, // Online/Offline/Both
    }),
    ...(userType === USER_TYPE.SCHOOL && {
      schoolName: payload.schoolName,
      role: payload.role, // School role (Principal, Coordinator, etc.)
      decisionMaker: payload.decisionMaker, // Yes/No/Can connect
      grades: payload.grades, // Primary/Middle/Both
      schoolSize: payload.reach, // Student strength (Under 100, 100-500, 500+)
      curriculum: payload.curriculum, // CBSE/ICSE/IB/State Board
      programType: payload.programType, // After-school/Integrated/Both
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
