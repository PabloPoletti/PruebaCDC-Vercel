'use client'

import { useState, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        {/* Input de texto */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribí tu mensaje..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-cdc-green disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{ maxHeight: '120px' }}
        />

        {/* Botón de enviar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            input.trim() && !disabled
              ? 'bg-cdc-green hover:bg-cdc-dark-green text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}

