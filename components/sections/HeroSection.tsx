'use client'

interface HeroSectionProps {
  onBookDemo: () => void
  onSchoolPartnership: () => void
}

export default function HeroSection({ onBookDemo, onSchoolPartnership }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-20 px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Future-Ready STEM Learning
            <br />
            <span className="text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              for Your Child
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Empowering students with coding, AI, logical thinking, and problem-solving skills through structured STEM pathways.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={onBookDemo}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
              <span>Book a Free Demo</span>
            </button>
            
            <button
              onClick={onSchoolPartnership}
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🏫</span>
              <span>Explore School Partnerships</span>
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <span>💬</span>
            Or chat with our AI advisor in the bottom-right corner.
          </p>
        </div>
      </div>
    </section>
  )
}
