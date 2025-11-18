'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatHeader from './ChatHeader'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll automático
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Mensaje de bienvenida
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '0',
      role: 'assistant',
      content:
        '¡Hola! 👋 Bienvenido/a al *Centro de Día Comunitario* de 25 de Mayo.\n\n' +
        'Soy tu asistente virtual y estoy aquí para ayudarte.\n\n' +
        '*¿Qué te gustaría saber?*\n\n' +
        '1️⃣ ¿Qué es el Centro de Día?\n' +
        '2️⃣ Horarios y contacto\n' +
        '3️⃣ Servicios que ofrecemos\n' +
        '4️⃣ Talleres disponibles\n' +
        '5️⃣ Pedir turno con psiquiatra\n' +
        '6️⃣ Ver mis turnos\n' +
        '7️⃣ Pregunta abierta (IA)\n\n' +
        '_Escribí el número de la opción o hacé tu consulta._',
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [])

  // Contador de mensajes no leídos
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant') {
        setUnreadCount((prev) => prev + 1)
      }
    }
  }, [messages, isOpen])

  // Resetear contador al abrir
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content.trim() }),
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Lo siento, hubo un error al procesar tu mensaje. Por favor, intentá nuevamente.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-cdc-green hover:bg-cdc-dark-green text-white rounded-full p-4 shadow-2xl transition-colors duration-300"
          >
            {/* Icono de bot con mensaje */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path d="M16.5 3.5a2 2 0 11-4 0 2 2 0 014 0zm-6 0a2 2 0 11-4 0 2 2 0 014 0z" />
              <path fillRule="evenodd" d="M12 1.5c-2.761 0-5 2.239-5 5v1.5h-1.5A1.5 1.5 0 004 9.5v9A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0018.5 8H17V6.5c0-2.761-2.239-5-5-5zm-3.5 5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5V8h-7V6.5zM8 12a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm4-1a1 1 0 11-2 0 1 1 0 012 0zm-4 4a3 3 0 002.83-2H9.17A3 3 0 0012 15z" clipRule="evenodd" />
            </svg>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Widget de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-cdc-bg rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header con botón cerrar */}
            <div className="relative">
              <ChatHeader />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

