'use client'

interface ChatNudgeSectionProps {
  onTalkToAdvisor: () => void
}

export default function ChatNudgeSection({ onTalkToAdvisor }: ChatNudgeSectionProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 text-center border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Our AI advisor can recommend the right STEM pathway in under 2 minutes.
          </p>
          <button
            onClick={onTalkToAdvisor}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <span>💬</span>
            Talk to AI Advisor
          </button>
        </div>
      </div>
    </section>
  )
}
