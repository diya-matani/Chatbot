'use client'

const benefits = [
  {
    icon: '🎯',
    title: 'Builds Logical Thinking',
    description: 'Structured problem-solving frameworks for real-world skills.',
  },
  {
    icon: '💻',
    title: 'Coding & AI Exposure',
    description: 'Hands-on projects that build computational confidence.',
  },
  {
    icon: '🚀',
    title: 'Future-Ready Skills',
    description: 'Preparing students for tomorrow\'s tech-driven world.',
  },
]

export default function BenefitsSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose WizKlub?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
