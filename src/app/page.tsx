'use client'

import { useState, useEffect, useRef } from 'react'
import ChatHeader from '@/components/ChatHeader'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import TypingIndicator from '@/components/TypingIndicator'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll automático al final
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
      content: '¡Hola! 👋 Bienvenido/a al *Centro de Día Comunitario* de 25 de Mayo.\n\n' +
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

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Simular "escribiendo..."
    setIsTyping(true)

    try {
      // Llamar a la API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content.trim() }),
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data = await response.json()

      // Agregar respuesta del bot
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
    <main className="flex flex-col h-screen bg-cdc-bg">
      {/* Header */}
      <ChatHeader />

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de chat */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </main>
  )
}

