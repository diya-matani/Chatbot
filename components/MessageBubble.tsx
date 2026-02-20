'use client'

import { type Message } from '@/lib/types'

interface MessageBubbleProps {
  message: Message
  onQuickReply?: (reply: string) => void
}

export default function MessageBubble({ message, onQuickReply }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? 'bg-blue-600 dark:bg-blue-700 text-white rounded-br-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        {message.quickReplies &&
          message.quickReplies.length > 0 &&
          !isUser &&
          onQuickReply && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="px-4 py-2 text-xs font-medium bg-white border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                  onClick={() => onQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
