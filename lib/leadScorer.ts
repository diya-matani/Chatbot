import type { LeadData } from './types'

/**
 * Calculate lead score based on collected data
 */
export function calculateLeadScore(userType: 'Parent' | 'School', leadData: Partial<LeadData>): number {
  let score = 0

  if (userType === 'Parent') {
    // Grade 3–8 → +20
    const grade = parseInt(leadData.grade_or_role || '0')
    if (grade >= 3 && grade <= 8) {
      score += 20
    }

    // Interested in Coding → +15
    if (leadData.interest_or_strength?.toLowerCase().includes('coding')) {
      score += 15
    }

    // Provided Phone → +20
    if (leadData.phone && leadData.phone.trim().length > 0) {
      score += 20
    }
  } else if (userType === 'School') {
    // Role = Principal/Management → +30
    const role = leadData.grade_or_role?.toLowerCase() || ''
    if (role.includes('principal') || role.includes('coordinator') || role.includes('management')) {
      score += 30
    }

    // Strength >1000 → +25
    const strength = parseInt((leadData.interest_or_strength || '0').replace(/,/g, ''))
    if (strength > 1000) {
      score += 25
    }

    // Integrated curriculum interest → +20
    // This would be checked if we had a separate field, for now we'll check curriculum
    if (leadData.curriculum && leadData.curriculum.toLowerCase().includes('integrated')) {
      score += 20
    }
  }

  return score
}

/**
 * Get lead temperature based on score
 */
export function getLeadTemperature(score: number): 'HOT' | 'WARM' | 'COLD' {
  if (score >= 60) return 'HOT'
  if (score >= 30) return 'WARM'
  return 'COLD'
}
