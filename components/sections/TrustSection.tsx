export default function TrustSection() {
  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">500+</span>
            <span className="text-lg">Schools</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">10,000+</span>
            <span className="text-lg">Students Empowered</span>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Trusted by educators and parents nationwide
        </p>
      </div>
    </section>
  )
}
