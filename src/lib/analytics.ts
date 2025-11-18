// Sistema de Analytics para el Bot CDC
// Registra todas las interacciones en Google Sheets

interface ConversationLog {
  timestamp: string
  sessionId: string
  userMessage: string
  userMessageNormalized?: string
  botResponse: string
  ragUsed: boolean
  modelUsed: string // 'llama-70b', 'llama-8b', 'fallback'
  responseTime: number // en ms
  errorOccurred: boolean
  errorMessage?: string
  menuOption?: string
  contextRelevance?: number // score de relevancia del contexto RAG
  userAgent?: string
  wasHelpful?: boolean // opcional, para feedback
}

interface SessionMetrics {
  sessionId: string
  startTime: string
  endTime?: string
  totalMessages: number
  userMessages: number
  botMessages: number
  errorsCount: number
  avgResponseTime: number
  menuOptionsUsed: string[]
  ragQueriesCount: number
  topics: string[] // talleres, horarios, contacto, etc.
}

interface DailyStats {
  date: string
  totalSessions: number
  totalMessages: number
  uniqueUsers: number
  avgMessagesPerSession: number
  avgResponseTime: number
  errorRate: number
  topQuestions: Array<{ question: string; count: number }>
  topTopics: Array<{ topic: string; count: number }>
  peakHours: Array<{ hour: number; count: number }>
}

// =====================================================
// FUNCIONES DE LOGGING
// =====================================================

export async function logConversation(data: ConversationLog): Promise<void> {
  try {
    // Enviar directamente a Google Sheets Webhook (evitar problemas de URL relativa en servidor)
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    
    if (!webhookUrl) {
      console.warn('⚠️ GOOGLE_SHEETS_WEBHOOK_URL no configurada. Analytics deshabilitados.')
      return
    }

    // Formatear datos como array (formato esperado por Google Apps Script)
    const rowData = [
      data.timestamp,
      data.sessionId,
      data.userMessage,
      data.userMessageNormalized || data.userMessage,
      data.botResponse,
      data.ragUsed ? 'Sí' : 'No',
      data.modelUsed,
      data.responseTime,
      data.errorOccurred ? 'Sí' : 'No',
      data.errorMessage || '',
      data.menuOption || '',
      data.contextRelevance ? (data.contextRelevance * 100).toFixed(2) + '%' : '',
      data.userAgent || '',
      data.wasHelpful === true ? 'Sí' : data.wasHelpful === false ? 'No' : ''
    ]

    // Enviar en formato esperado por el webhook
    const payload = {
      sheet: 'Conversaciones',
      data: rowData
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('Error en webhook:', response.status, await response.text())
    } else {
      console.log('✅ Log enviado a Google Sheets')
    }
  } catch (error) {
    console.error('Error logging conversation:', error)
    // No bloquear la conversación si falla el logging
  }
}

export async function logSessionEnd(sessionId: string, metrics: SessionMetrics): Promise<void> {
  try {
    await fetch('/api/analytics/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, metrics }),
    })
  } catch (error) {
    console.error('Error logging session:', error)
  }
}

// =====================================================
// DETECCIÓN DE TÓPICOS
// =====================================================

export function detectTopics(message: string): string[] {
  const normalizedMessage = message.toLowerCase()
  const topics: string[] = []

  const topicKeywords = {
    talleres: ['taller', 'actividad', 'grupo', 'clase', 'huerta', 'teatro', 'reciclaje', 'transformarte'],
    horarios: ['horario', 'hora', 'cuándo', 'cuando', 'día', 'tiempo', 'abre', 'cierra'],
    contacto: ['dónde', 'donde', 'dirección', 'teléfono', 'email', 'ubicación', 'contacto', 'llegar'],
    ayuda: ['ayuda', 'problema', 'adicción', 'consumo', 'depresión', 'ansiedad', 'necesito'],
    turnos: ['turno', 'cita', 'reserva', 'psiquiatra', 'psicólogo', 'consulta'],
    costos: ['gratis', 'costo', 'pagar', 'precio', 'gratuito'],
    requisitos: ['requisito', 'inscripción', 'registro', 'documento', 'edad'],
  }

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => normalizedMessage.includes(keyword))) {
      topics.push(topic)
    }
  })

  return topics.length > 0 ? topics : ['general']
}

// =====================================================
// ANÁLISIS DE SENTIMIENTO SIMPLE
// =====================================================

export function analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
  const normalizedMessage = message.toLowerCase()

  const positiveWords = ['gracias', 'excelente', 'bueno', 'perfecto', 'genial', 'bien', 'útil', 'ayuda']
  const negativeWords = ['mal', 'error', 'problema', 'no funciona', 'no entiendo', 'malo', 'confuso']

  const positiveCount = positiveWords.filter(word => normalizedMessage.includes(word)).length
  const negativeCount = negativeWords.filter(word => normalizedMessage.includes(word)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

// =====================================================
// UTILIDADES
// =====================================================

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatTimestamp(): string {
  // Crear fecha en timezone de Argentina (UTC-3)
  const now = new Date()
  const argentinaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }))
  
  // Formatear como ISO pero mostrando hora local
  const year = argentinaTime.getFullYear()
  const month = String(argentinaTime.getMonth() + 1).padStart(2, '0')
  const day = String(argentinaTime.getDate()).padStart(2, '0')
  const hours = String(argentinaTime.getHours()).padStart(2, '0')
  const minutes = String(argentinaTime.getMinutes()).padStart(2, '0')
  const seconds = String(argentinaTime.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (UTC-3)`
}

export function getUserAgent(): string {
  if (typeof window !== 'undefined') {
    return window.navigator.userAgent
  }
  return 'unknown'
}

