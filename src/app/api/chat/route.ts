import { NextRequest, NextResponse } from 'next/server'
import { processMessage, BotState } from '@/lib/botLogic'

// Store de sesiones (en producción, usar Redis o DB)
const sessions = new Map<string, BotState>()

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId = 'default' } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje inválido' },
        { status: 400 }
      )
    }

    // Obtener estado de la sesión
    const currentState = sessions.get(sessionId) || { state: 'main' }

    // Procesar mensaje
    const { response, newState } = processMessage(message, currentState)

    // Guardar nuevo estado
    sessions.set(sessionId, newState)

    return NextResponse.json({
      response,
      sessionId,
      state: newState.state,
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
    service: 'CDC Bot API',
    endpoints: {
      POST: '/api/chat - Enviar mensaje al bot',
    },
  })
}

