'use client'

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import {
  type ConversationState,
  type UserType,
  getNextState,
  getStateConfig,
  stateMachine,
} from '@/lib/stateMachine'
import { calculateLeadScore, getLeadTemperature } from '@/lib/leadScorer'
import { saveLead } from '@/lib/leadStorage'
import { trackEvent } from '@/lib/analytics'
import type { Message, LeadData } from '@/lib/types'
import WizklubLogo from '@/components/WizklubLogo'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import ProgressBar from './ProgressBar'
import SuccessScreen from './SuccessScreen'

export interface ChatbotWidgetRef {
  openChat: (userType?: 'Parent' | 'School') => void
}

const ChatbotWidget = forwardRef<ChatbotWidgetRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationStartTime = useRef<Date | null>(null)

  const [state, setState] = useState<ConversationState>('welcome')
  const [userType, setUserType] = useState<UserType>(null)
  const [leadData, setLeadData] = useState<Partial<LeadData>>({})
  const [messages, setMessages] = useState<Message[]>([])
  const [leadTemperature, setLeadTemperature] = useState<'HOT' | 'WARM' | 'COLD'>('COLD')

  const addMessage = (
    role: 'user' | 'assistant',
    content: string,
    quickReplies?: string[]
  ) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      timestamp: new Date(),
      quickReplies,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openChat: (userType?: 'Parent' | 'School') => {
      setIsOpen(true)
      if (userType) {
        // Reset state for new conversation
        setMessages([])
        setLeadData({})
        setValidationError(null)
        
        // Set user type and skip to appropriate flow
        setUserType(userType)
        const nextState = userType === 'Parent' ? 'parent_name' : 'school_name'
        setState(nextState)
        conversationStartTime.current = new Date()
        trackEvent('conversation_started', { userType })
        trackEvent('user_type_selected', { userType })
        
        // Show first question directly
        setTimeout(() => {
          const firstQuestion = getStateConfig(nextState)
          addMessage('assistant', firstQuestion.question, firstQuestion.quickReplies)
        }, 300)
      }
    },
  }))

  useEffect(() => {
    if (isOpen && messages.length === 0 && !userType) {
      conversationStartTime.current = new Date()
      const config = getStateConfig('welcome')
      addMessage('assistant', config.question, config.quickReplies)
      trackEvent('conversation_started')
    }
  }, [isOpen, userType, messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const updateLeadData = (field: keyof LeadData, value: string) => {
    setLeadData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return

    const currentConfig = getStateConfig(state)
    setValidationError(null)

    const normalisedInput = input.toLowerCase()

    // Validate input if validation function exists
    if (currentConfig.validation) {
      const validationResult = currentConfig.validation(input)
      if (validationResult !== true) {
        setValidationError(validationResult as string)
        return
      }
    }

    // Add user message
    addMessage('user', input)

    // Update lead data based on current state
    const isParentInterestNotSure =
      state === 'parent_interest' && normalisedInput.includes('not sure')

    switch (state) {
      case 'welcome':
      case 'user_type':
        if (normalisedInput.includes('parent') || normalisedInput.includes('1')) {
          setUserType('Parent')
          trackEvent('user_type_selected', { userType: 'Parent' })
        } else if (normalisedInput.includes('school') || normalisedInput.includes('2')) {
          setUserType('School')
          trackEvent('user_type_selected', { userType: 'School' })
        }
        break

      case 'parent_name':
        updateLeadData('name', input)
        break
      case 'parent_grade':
        updateLeadData('grade_or_role', input)
        break
      case 'parent_interest':
        updateLeadData('interest_or_strength', input)
        break
      case 'parent_city':
        updateLeadData('city', input)
        break
      case 'parent_email':
        updateLeadData('email', input)
        break
      case 'parent_phone':
        updateLeadData('phone', input)
        break

      case 'school_name':
        updateLeadData('name', input)
        break
      case 'school_role':
        updateLeadData('grade_or_role', input)
        break
      case 'school_strength':
        updateLeadData('interest_or_strength', input)
        break
      case 'school_curriculum':
        updateLeadData('curriculum', input)
        break
      case 'school_city':
        updateLeadData('city', input)
        break
      case 'school_email':
        updateLeadData('email', input)
        break
      case 'school_phone':
        updateLeadData('phone', input)
        break

      case 'recommendation':
        if (input.includes('Demo') || input.includes('demo') || input.includes('Live Demo')) {
          trackEvent('demo_clicked')
          updateLeadData('analytics', { demoClicked: true } as any)
        } else if (input.includes('Counselor') || input.includes('counselor')) {
          trackEvent('counselor_clicked')
        } else if (input.includes('Brochure') || input.includes('brochure')) {
          trackEvent('brochure_downloaded')
        } else if (input.includes('Partnership Call') || input.includes('partnership')) {
          trackEvent('partnership_call_clicked')
        } else if (input.includes('Proposal') || input.includes('proposal')) {
          trackEvent('proposal_deck_clicked')
        }
        break
    }

    // Get next state
    const nextState = getNextState(state, input, userType)
    const nextConfig = getStateConfig(nextState)

    // Handle recommendation state - show recommendation if we're entering it
    if (nextState === 'recommendation' && state !== 'recommendation') {
      let recommendationText = ''
      let quickReplies: string[] = []

      if (userType === 'Parent') {
        const grade = leadData.grade_or_role || 'your child\'s grade'
        recommendationText = `Based on ${grade}, our Computational Thinking + Coding pathway is ideal for your child. What would you like to do next?`
        quickReplies = ['Book FREE Live Demo', 'Talk to Academic Counselor', 'Download Brochure']
      } else if (userType === 'School') {
        recommendationText = `Based on your school's needs, I recommend our Integrated STEM Curriculum Partnership Model. What would you like to do next?`
        quickReplies = ['Schedule Partnership Call', 'Get Proposal Deck']
      }

      setState(nextState)
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addMessage('assistant', recommendationText, quickReplies)
      }, 800)
      return
    }

    // Handle success state
    if (nextState === 'success') {
      const finalLeadData: LeadData = {
        id: Date.now().toString(),
        name: leadData.name || '',
        userType: userType!,
        grade_or_role: leadData.grade_or_role || '',
        interest_or_strength: leadData.interest_or_strength || '',
        curriculum: leadData.curriculum || '',
        city: leadData.city || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        leadScore: calculateLeadScore(userType!, leadData),
        leadTemperature: getLeadTemperature(calculateLeadScore(userType!, leadData)),
        analytics: {
          startedAt: conversationStartTime.current?.toISOString() || new Date().toISOString(),
          completedAt: new Date().toISOString(),
          demoClicked: (leadData as any).analytics?.demoClicked || false,
        },
      }

      setLeadTemperature(finalLeadData.leadTemperature)
      saveLead(finalLeadData)
      trackEvent('lead_completed', {
        userType: userType!,
        leadScore: finalLeadData.leadScore,
        leadTemperature: finalLeadData.leadTemperature,
      })

      setState(nextState)
      return
    }

    // Update state
    setState(nextState)

    // Show typing indicator
    setIsTyping(true)

    // Get bot response
    setTimeout(() => {
      setIsTyping(false)
      const botMsg = getStateConfig(nextState)

      let content = botMsg.question
      const quickReplies = botMsg.quickReplies

      // If parent clicked "Not Sure" on interest, first explain key programs,
      // then ask the next question.
      if (isParentInterestNotSure) {
        const overview =
          'No worries — here’s a quick overview of our core STEM programs:\n\n' +
          '• Robotics & Coding Program (Grades 1–9) – Hands-on coding and robotics projects integrated into the school curriculum.\n' +
          '• Young Product Designer Program (YPDP) (Grades 3–9) – Kids design and build real tech products using hardware kits and block-based coding.\n' +
          '• Higher Order Thinking Skills (HOTS) (Grades 1–8) – Strengthens critical thinking, logical reasoning, and problem-solving.\n\n'

        content = overview + content
      }

      addMessage('assistant', content, quickReplies)
    }, 800)
  }

  const handleReset = () => {
    setState('welcome')
    setUserType(null)
    setLeadData({})
    setMessages([])
    setValidationError(null)
    conversationStartTime.current = new Date()
    const config = getStateConfig('welcome')
    addMessage('assistant', config.question, config.quickReplies)
    trackEvent('conversation_started')
  }

  const currentConfig = getStateConfig(state)
  const showProgressBar = state !== 'welcome' && state !== 'success' && state !== 'recommendation'
  const isComplete = state === 'success'

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <WizklubLogo variant="mark" className="w-7 h-7" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <WizklubLogo variant="mark" className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-semibold">WizKlub Assistant</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            {state !== 'success' && (
              <button
                onClick={handleReset}
                className="text-white/80 hover:text-white text-sm underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {showProgressBar && (
            <ProgressBar
              currentStep={currentConfig.stepNumber}
              totalSteps={currentConfig.totalSteps}
            />
          )}

          {/* Messages or Success Screen */}
          {isComplete ? (
            <SuccessScreen leadTemperature={leadTemperature} onReset={handleReset} />
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onQuickReply={handleUserInput}
                  />
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm animate-fade-in">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span>WizKlub is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <ChatInput
                onSend={handleUserInput}
                disabled={isTyping || isComplete}
                validationError={validationError}
                onInputChange={() => setValidationError(null)}
              />
            </>
          )}
        </div>
      )}
    </>
  )
})

ChatbotWidget.displayName = 'ChatbotWidget'

export default ChatbotWidget
