'use client'

import { useRef } from 'react'
import ChatbotWidget, { type ChatbotWidgetRef } from '@/components/ChatbotWidget'
import ThemeToggle from '@/components/ThemeToggle'
import HeroSection from '@/components/sections/HeroSection'
import TrustSection from '@/components/sections/TrustSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import ChatNudgeSection from '@/components/sections/ChatNudgeSection'
import Footer from '@/components/sections/Footer'

export default function Home() {
  const chatbotRef = useRef<ChatbotWidgetRef>(null)

  const handleOpenChat = (userType?: 'Parent' | 'School') => {
    chatbotRef.current?.openChat(userType)
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Hero Section */}
      <HeroSection onBookDemo={() => handleOpenChat('Parent')} onSchoolPartnership={() => handleOpenChat('School')} />

      {/* Trust Section */}
      <TrustSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Chat Nudge Section */}
      <ChatNudgeSection onTalkToAdvisor={() => handleOpenChat()} />

      {/* Footer */}
      <Footer />

      {/* Chatbot Widget */}
      <ChatbotWidget ref={chatbotRef} />
    </main>
  )
}
