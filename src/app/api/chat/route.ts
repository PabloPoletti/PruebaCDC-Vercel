import { NextRequest, NextResponse } from 'next/server'
import { botResponse, initRAG, BotState } from '@/lib/botLogic'

// Store de sesiones (en producción, usar Redis o DB)
const sessions = new Map<string, BotState>()

// Inicializar RAG al cargar el módulo
let ragInitialized = false
async function ensureRAGInitialized() {
  if (!ragInitialized) {
    console.log('Inicializando RAG...')
    await initRAG()
    ragInitialized = true
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId = 'default' } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje inválido' },
        { status: 400 }
      )
    }

    // Asegurar que RAG esté inicializado
    await ensureRAGInitialized()

    // Obtener estado de la sesión
    const currentState = sessions.get(sessionId) || {
      step: 'menu',
      mis_turnos: [],
      data: {},
    }

    // Procesar mensaje (pasar sessionId para analytics)
    const { response, newState } = await botResponse(message, currentState, sessionId)

    // Guardar nuevo estado
    sessions.set(sessionId, newState)

    return NextResponse.json({
      response,
      sessionId,
      state: newState.step,
    })
  } catch (error) {
    console.error('Error en /api/chat:', error)
    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'CDC Bot API con IA + RAG',
    version: '2.0',
    features: ['IA conversacional', 'RAG', 'Sistema de turnos', 'Menú interactivo'],
    endpoints: {
      POST: '/api/chat - Enviar mensaje al bot',
    },
  })
}

