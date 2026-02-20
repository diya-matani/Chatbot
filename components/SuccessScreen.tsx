'use client'

interface SuccessScreenProps {
  leadTemperature: 'HOT' | 'WARM' | 'COLD'
  onReset?: () => void
}

export default function SuccessScreen({ leadTemperature, onReset }: SuccessScreenProps) {
  const temperatureColors = {
    HOT: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
    WARM: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    COLD: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
      <div className="mb-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🎉 Success!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
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
          className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
        >
          Start New Conversation
        </button>
      )}
    </div>
  )
}
