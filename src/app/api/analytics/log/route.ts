import { NextRequest, NextResponse } from 'next/server'

// API endpoint para guardar logs en Google Sheets
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar que tenemos los datos necesarios
    if (!data.timestamp || !data.sessionId || !data.userMessage) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Preparar datos para Google Sheets
    const rowData = [
      data.timestamp,
      data.sessionId,
      data.userMessage,
      data.userMessageNormalized || '',
      data.botResponse || '',
      data.ragUsed ? 'Sí' : 'No',
      data.modelUsed || 'unknown',
      data.responseTime || 0,
      data.errorOccurred ? 'Sí' : 'No',
      data.errorMessage || '',
      data.menuOption || '',
      data.contextRelevance || 0,
      data.userAgent || '',
      data.wasHelpful || '',
    ]

    // Enviar a Google Sheets usando Google Apps Script Web App
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL

    if (GOOGLE_SCRIPT_URL) {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheet: 'Conversaciones',
          data: rowData,
        }),
      })
    } else {
      // Si no hay webhook, guardar en archivo local (desarrollo)
      console.log('📊 Analytics (local):', {
        timestamp: data.timestamp,
        session: data.sessionId,
        user: data.userMessage.substring(0, 50),
        bot: data.botResponse?.substring(0, 50),
        model: data.modelUsed,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en analytics:', error)
    // No fallar la request del usuario si falla el logging
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 200 })
  }
}

