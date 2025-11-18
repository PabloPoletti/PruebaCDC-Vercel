import { motion } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  // Formatear el mensaje (soporte para *negrita*, _cursiva_, etc.)
  const formatMessage = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Negrita con *texto*
        line = line.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
        // Cursiva con _texto_
        line = line.replace(/_(.*?)_/g, '<em>$1</em>')
        return <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
      })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-2 shadow-md ${
          isUser
            ? 'bg-cdc-light-green text-gray-800'
            : 'bg-white text-gray-800'
        }`}
      >
        <div className="text-sm whitespace-pre-wrap break-words">
          {formatMessage(message.content)}
        </div>
        <div className={`text-[10px] mt-1 ${isUser ? 'text-gray-600' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </motion.div>
  )
}

