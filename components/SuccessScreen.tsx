'use client'

interface SuccessScreenProps {
  leadTemperature: 'HOT' | 'WARM' | 'COLD'
  onReset?: () => void
}

export default function SuccessScreen({ leadTemperature, onReset }: SuccessScreenProps) {
  const temperatureColors = {
    HOT: 'bg-red-100 text-red-800 border-red-300',
    WARM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    COLD: 'bg-blue-100 text-blue-800 border-blue-300',
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
      <div className="mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Success!</h2>
        <p className="text-gray-600 mb-6">
          Your demo request has been shared with our academic team.
          <br />
          You will receive a confirmation within 24 hours.
        </p>
      </div>

      <div className={`px-4 py-2 rounded-lg border ${temperatureColors[leadTemperature]} mb-6`}>
        <span className="text-sm font-semibold">Lead Temperature: {leadTemperature}</span>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Start New Conversation
        </button>
      )}
    </div>
  )
}
