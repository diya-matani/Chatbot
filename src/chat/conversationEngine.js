/**
 * WizKlub AI Enrollment Assistant
 * 
 * Goal: Identify visitor type, collect structured lead details, qualify leads,
 * recommend suitable programs, and guide toward demo booking or sales conversation.
 * 
 * Conversation Rules:
 * - Warm, professional, and concise
 * - Ask one question at a time
 * - Handle objections smartly
 * - Keep tone supportive and aspirational
 * - Always guide conversation toward conversion
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
  HANDLE_OBJECTION: 'handle_objection',
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

/**
 * Lead Scoring System
 * Hot Lead: >60 | Warm: 30-60 | Cold: <30
 */

// Parent Lead Scoring
const PARENT_SCORE = {
  grade_3_8: 20,        // Grade between 3-8
  coding_interest: 15,  // Interested in coding
  demo_intent: 30,      // Wants to book demo
  phone_provided: 20,   // Phone number provided
}

// School Lead Scoring
const SCHOOL_SCORE = {
  decision_maker: 30,           // Is decision maker
  students_1000_plus: 25,        // 1000+ students
  integrated_curriculum: 20,     // Wants integrated curriculum
}

/**
 * Get lead quality label based on score
 */
export function getLeadQuality(score) {
  if (score > 60) return { label: 'Hot', color: 'hot' }
  if (score >= 30) return { label: 'Warm', color: 'warm' }
  return { label: 'Cold', color: 'cold' }
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
      // Grade 3-8 gets +20 points
      const ageNum = parseInt(userMessage.match(/\d+/)?.[0] || '0')
      const gradeNum = userMessage.toLowerCase().includes('grade') 
        ? parseInt(userMessage.match(/grade\s*(\d+)/i)?.[1] || '0')
        : 0
      if ((ageNum >= 8 && ageNum <= 11) || (gradeNum >= 3 && gradeNum <= 8) || 
          msg.includes('grade 3') || msg.includes('grade 4') || msg.includes('grade 5') || 
          msg.includes('grade 6') || msg.includes('grade 7') || msg.includes('grade 8') ||
          msg.includes('9') || msg.includes('10') || msg.includes('11')) {
        next.leadScore = (next.leadScore || 0) + PARENT_SCORE.grade_3_8
      }
      return next

    case STEPS.PARENT_CURRICULUM:
      next.payload.curriculum = userMessage.trim()
      next.step = STEPS.PARENT_INTEREST
      return next

    case STEPS.PARENT_INTEREST:
      next.payload.interest = userMessage.trim()
      next.step = STEPS.PARENT_MODE
      // Coding interest gets +15 points
      if (msg.includes('coding')) {
        next.leadScore = (next.leadScore || 0) + PARENT_SCORE.coding_interest
      }
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
      // Decision maker gets +30 points
      if (msg.includes('yes') || msg.includes('i am')) {
        next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.decision_maker
      }
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
      // 1000+ students gets +25 points
      const reachNum = parseInt(userMessage.match(/\d+/)?.[0] || '0')
      if (reachNum >= 1000 || msg.includes('1000') || msg.includes('1000+')) {
        next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.students_1000_plus
      }
      return next

    case STEPS.SCHOOL_CURRICULUM:
      next.payload.curriculum = userMessage.trim()
      next.step = STEPS.SCHOOL_PROGRAM_TYPE
      return next

    case STEPS.SCHOOL_PROGRAM_TYPE:
      next.payload.programType = userMessage.trim()
      next.step = STEPS.NAME
      // Integrated curriculum gets +20 points
      if (msg.includes('integrated') || msg.includes('both')) {
        next.leadScore = (next.leadScore || 0) + SCHOOL_SCORE.integrated_curriculum
      }
      return next

    case STEPS.NAME:
      next.payload.name = userMessage.trim()
      next.step = STEPS.PHONE
      return next

    case STEPS.PHONE:
      next.payload.phone = userMessage.trim()
      next.step = STEPS.EMAIL
      // Phone provided gets +20 points (for parents)
      if (userType === USER_TYPE.PARENT && userMessage.trim().length > 0) {
        next.leadScore = (next.leadScore || 0) + PARENT_SCORE.phone_provided
      }
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
      next.payload.demoBooked = msg.includes('book') || msg.includes('yes') || msg === '1' || msg.includes('demo')
      // Demo intent gets +30 points (for parents)
      if (userType === USER_TYPE.PARENT && next.payload.demoBooked) {
        next.leadScore = (next.leadScore || 0) + PARENT_SCORE.demo_intent
      }
      return next

    default:
      return next
  }
}

/**
 * Recommends a program based on child's grade/age
 */
function getProgramRecommendation(childAge) {
  if (!childAge) return "our personalized STEM program"
  
  const ageLower = childAge.toLowerCase()
  const ageNum = parseInt(childAge.match(/\d+/)?.[0] || '0')
  
  // Age-based recommendations
  if (ageLower.includes('6') || ageLower.includes('7') || ageLower.includes('8') || (ageNum >= 6 && ageNum <= 8)) {
    return "our **Grade 1–3 Foundation STEM** program"
  } else if (ageLower.includes('9') || ageLower.includes('10') || ageLower.includes('11') || (ageNum >= 9 && ageNum <= 11)) {
    return "our **Grade 4–6 Computational Thinking** program"
  } else if (ageLower.includes('12') || ageLower.includes('13') || ageLower.includes('14') || ageLower.includes('15') || (ageNum >= 12 && ageNum <= 15)) {
    return "our **Grade 7–9 Advanced Coding & Robotics** program"
  }
  
  // Grade-based recommendations
  if (ageLower.includes('grade 1') || ageLower.includes('grade 2') || ageLower.includes('grade 3')) {
    return "our **Grade 1–3 Foundation STEM** program"
  } else if (ageLower.includes('grade 4') || ageLower.includes('grade 5') || ageLower.includes('grade 6')) {
    return "our **Grade 4–6 Computational Thinking** program"
  } else if (ageLower.includes('grade 7') || ageLower.includes('grade 8') || ageLower.includes('grade 9')) {
    return "our **Grade 7–9 Advanced Coding & Robotics** program"
  }
  
  return "our personalized STEM program"
}

export function getBotContent(state) {
  const { step, userType, payload, leadScore = 0, maxScore = 0 } = state

  switch (step) {
    case STEPS.WELCOME:
      return {
        text: "Hello! 👋 I'm WizKlub's AI Enrollment Assistant. I'm here to help you find the perfect STEM learning solution. Are you exploring **programs for your child** or interested in **school partnerships**?",
        quickReplies: ['Programs for my child', 'School partnerships'],
      }

    case STEPS.USER_TYPE:
      return {
        text: "I'd love to help! Are you exploring **programs for your child** or interested in **school partnerships**?",
        quickReplies: ['Programs for my child', 'School partnerships'],
      }

    case STEPS.PARENT_CHILD_AGE:
      return {
        text: "Wonderful! To recommend the perfect program for your child, could you share their age or grade? (e.g., 8 years or Grade 3)",
        quickReplies: ['6–8 years', '9–11 years', '12–15 years'],
      }

    case STEPS.PARENT_CURRICULUM:
      return {
        text: "Perfect! Which curriculum does your child follow? This helps us align our programs perfectly with their learning journey.",
        quickReplies: PARENT_CURRICULUM_OPTIONS,
      }

    case STEPS.PARENT_INTEREST:
      return {
        text: "Excellent! What area interests you most for your child's growth?",
        quickReplies: PARENT_INTERESTS,
      }

    case STEPS.PARENT_MODE:
      return {
        text: "Great! What's your preferred learning mode? We offer flexible options to fit your schedule.",
        quickReplies: PARENT_MODE_OPTIONS,
      }

    case STEPS.SCHOOL_NAME:
      return {
        text: "Wonderful! I'd love to explore how WizKlub can partner with your school. What's your school name?",
        quickReplies: [],
      }

    case STEPS.SCHOOL_ROLE:
      return {
        text: "Thank you! To better understand your needs, what's your role at the school?",
        quickReplies: SCHOOL_ROLES,
      }

    case STEPS.SCHOOL_DECISION_MAKER:
      return {
        text: "Perfect! Are you the decision maker for partnership programs, or would you be able to connect us with the right person?",
        quickReplies: SCHOOL_DECISION_MAKER_OPTIONS,
      }

    case STEPS.SCHOOL_GRADES:
      return {
        text: "Excellent! Which grade levels would you like to offer WizKlub programs to?",
        quickReplies: SCHOOL_GRADES_OPTIONS,
      }

    case STEPS.SCHOOL_REACH:
      return {
        text: "That's great! Approximately how many students would benefit from our partnership?",
        quickReplies: SCHOOL_REACH_OPTIONS,
      }

    case STEPS.SCHOOL_CURRICULUM:
      return {
        text: "Perfect! Which curriculum does your school follow? This helps us align our programs seamlessly.",
        quickReplies: SCHOOL_CURRICULUM_OPTIONS,
      }

    case STEPS.SCHOOL_PROGRAM_TYPE:
      return {
        text: "Wonderful! Are you looking for an after-school program or integrated curriculum?",
        quickReplies: SCHOOL_PROGRAM_TYPE_OPTIONS,
      }

    case STEPS.NAME:
      return {
        text: userType === USER_TYPE.PARENT
          ? "Perfect! We're almost done. To create your personalized learning plan and schedule your free demo, may I have your full name?"
          : "Excellent! To connect you with our partnership team, may I have your full name?",
        quickReplies: [],
      }

    case STEPS.PHONE:
      return {
        text: userType === USER_TYPE.PARENT
          ? "Thank you! What's the best phone number to reach you? We'll call to confirm your demo time."
          : "Thank you! What's the best phone number to reach you? Our partnership manager will call to discuss next steps.",
        quickReplies: [],
      }

    case STEPS.EMAIL:
      return {
        text: userType === USER_TYPE.PARENT
          ? "Great! And your email address? We'll send demo details and program information there."
          : "Perfect! And your email address? We'll send partnership details and program information there.",
        quickReplies: [],
      }

    case STEPS.CITY:
      return {
        text: userType === USER_TYPE.PARENT
          ? "Wonderful! Which city are you located in? This helps us connect you with local resources and instructors."
          : "Perfect! Which city is your school located in?",
        quickReplies: [],
      }

    case STEPS.CONFIRM_BOOK_DEMO: {
      let cta
      if (userType === USER_TYPE.SCHOOL) {
        const schoolInfo = payload.schoolName ? ` for ${payload.schoolName}` : ''
        cta = `Perfect! Based on your school's needs (${payload.grades || 'selected grades'}, ${payload.reach || 'student strength'}), we recommend our **${payload.programType || 'partnership'} program**. Would you like to book a **FREE 30-min partnership demo this week** to see how WizKlub can benefit your students${schoolInfo}?`
      } else {
        const programRec = getProgramRecommendation(payload.childAge)
        const name = payload.name ? `, ${payload.name}` : ''
        cta = `Thanks${name}! Based on your child's grade and interests, we recommend ${programRec}. Would you like to book a **FREE 30-min live demo this week** to see it in action?`
      }
      return {
        text: cta,
        quickReplies: userType === USER_TYPE.SCHOOL 
          ? ['Yes, book FREE demo', 'Just call me', 'Not sure yet']
          : ['Yes, book FREE demo', 'Just call me', 'Not sure yet'],
      }
    }

    case STEPS.HANDLE_OBJECTION: {
      const objectionMsg = (userMessage || '').toLowerCase()
      let response
      
      if (objectionMsg.includes('expensive') || objectionMsg.includes('cost') || objectionMsg.includes('price') || objectionMsg.includes('afford')) {
        response = userType === USER_TYPE.PARENT
          ? "I completely understand! We offer flexible payment plans and scholarships. The FREE demo shows you exactly what your child will learn—no commitment. Plus, many parents find our programs more affordable than private tutoring. Would you like to see the demo first?"
          : "I understand budget is important! We offer competitive partnership rates and flexible payment options. The FREE demo helps you see the ROI—improved student engagement and academic performance. Would you like to explore this further?"
      } else if (objectionMsg.includes('time') || objectionMsg.includes('busy') || objectionMsg.includes('schedule')) {
        response = userType === USER_TYPE.PARENT
          ? "I hear you! We offer flexible scheduling—weekday evenings and weekends. Our programs are designed to fit busy families. The demo is just 30 minutes and can be scheduled at your convenience. Would that work?"
          : "Absolutely! We work around your school's schedule. Our programs can be integrated into existing timetables or run as after-school. The demo is just 30 minutes—we can schedule it whenever works for you."
      } else if (objectionMsg.includes('think') || objectionMsg.includes('later') || objectionMsg.includes('not sure')) {
        response = userType === USER_TYPE.PARENT
          ? "That's perfectly fine! Many parents feel the same way initially. The FREE demo is no-obligation—just 30 minutes to see if it's the right fit. No pressure, just valuable insights. Would you like to schedule it?"
          : "I understand! Partnership decisions take time. The FREE demo is just 30 minutes with no commitment—it helps you make an informed decision. Would you like to see what we offer?"
      } else {
        response = userType === USER_TYPE.PARENT
          ? "I understand your concern! The FREE demo is just 30 minutes with no obligation. It's a great way to see if our program fits your child's needs. Many parents find it really helpful. Would you like to give it a try?"
          : "I appreciate your consideration! The FREE demo is just 30 minutes—no commitment. It's a great opportunity to see how WizKlub can benefit your students. Would you like to schedule it?"
      }
      
      return {
        text: response,
        quickReplies: ['Yes, let\'s do it', 'Just call me', 'Maybe later'],
      }
    }

    case STEPS.COMPLETE: {
      const lead = buildLead(state)
      saveLead(lead)
      let msg
      if (payload.demoBooked) {
        msg = userType === USER_TYPE.SCHOOL
          ? "🎉 **FREE 30-min partnership demo booked!** We'll send a calendar link to your email and our partnership manager will call you this week to confirm. Looking forward to partnering with " + (payload.schoolName || 'your school') + "!"
          : "🎉 **FREE 30-min demo booked!** We'll send a calendar link to your email and call you this week to confirm. Can't wait to show you " + getProgramRecommendation(payload.childAge) + "!"
      } else {
        msg = userType === USER_TYPE.SCHOOL
          ? "Perfect! We've noted your partnership inquiry. Our **partnership team** will call you within 24 hours to schedule your FREE demo. Have a great day!"
          : "Perfect! We've noted your details. Our team will call you within 24 hours to schedule your **FREE 30-min demo** for " + getProgramRecommendation(payload.childAge) + ". Have a great day!"
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
  const { userType, payload, leadScore = 0 } = state
  // Use raw score (not normalized) - Hot: >60, Warm: 30-60, Cold: <30
  const quality = getLeadQuality(leadScore)
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
    leadScore: leadScore, // Raw score
    leadQuality: quality.label, // Hot/Warm/Cold
    leadQualityColor: quality.color,
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
