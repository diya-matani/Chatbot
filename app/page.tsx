import ChatbotWidget from '@/components/ChatbotWidget'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to WizKlub
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Empowering kids with STEM skills and critical thinking through
          innovative programs.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Try Our Chatbot</h2>
          <p className="text-gray-600">
            Click the chat button in the bottom-right corner to get started!
          </p>
        </div>
      </div>
      <ChatbotWidget />
    </main>
  )
}
