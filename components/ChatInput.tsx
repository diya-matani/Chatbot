'use client'

import { useState, useEffect } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  validationError?: string | null
  onInputChange?: () => void
}

export default function ChatInput({ onSend, disabled, validationError, onInputChange }: ChatInputProps) {
  const [input, setInput] = useState('')

  // Clear validation error when user starts typing
  useEffect(() => {
    if (input.trim().length > 0 && validationError && onInputChange) {
      onInputChange()
    }
  }, [input, validationError, onInputChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {validationError && (
        <div className="mb-2 text-xs text-red-600 dark:text-red-400 animate-shake">{validationError}</div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Send
        </button>
      </div>
    </form>
  )
}
