// Lógica del bot CDC con IA + RAG + Analytics

import Groq from 'groq-sdk'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { logConversation, detectTopics, analyzeSentiment, formatTimestamp } from './analytics'

// =====================================================
// TIPOS
// =====================================================

export interface BotState {
  step: 'menu' | 'talleres_menu' | 'turno' | 'turno_fecha' | 'turno_hora' | 'turno_nombre' | 'turno_dni' | 'turno_motivo' | 'turno_primera_vez' | 'rag'
  mis_turnos: Array<{
    nombre: string
    fecha: string
    hora: string
    motivo: string
  }>
  data: {
    viernes_disponibles?: string[]
    fecha?: string
    horarios_disponibles?: string[]
    hora?: string
    nombre?: string
    dni?: string
    motivo?: string
  }
}

// =====================================================
// CONFIGURACIÓN
// =====================================================

const INFO_CENTRO = `El Centro de Día Comunitario – 25 de Mayo es un dispositivo territorial comunitario 
que brinda atención en salud mental y adicciones. Depende de la Subsecretaría de Salud Mental y 
Adicciones del Gobierno de La Pampa, la Municipalidad de 25 de Mayo y SEDRONAR.

¿Quiénes pueden asistir?
Personas mayores de 13 años que necesiten acompañamiento, contención y espacios terapéuticos.`

const HORARIOS = `HORARIOS DE VERANO:
• Lunes a viernes (mañana): 9:00 a 12:00 hs
• Lunes, miércoles y jueves (tarde): 16:00 a 19:00 hs
• Martes y viernes (tarde): 17:00 a 20:00 hs`

const DIRECCION = 'Trenel 53, Colonia 25 de Mayo, La Pampa'
const TELEFONO = '299 4152668'
const EMAIL = 'cdc.25demayolp.coordinacion@gmail.com'

// Datos base para RAG
const DOC_TEXTS = [
  { title: 'Centro de Día Comunitario', content: INFO_CENTRO },
  { title: 'Horarios', content: HORARIOS },
  { title: 'Contacto', content: `Dirección: ${DIRECCION}\nTeléfono: ${TELEFONO}\nEmail: ${EMAIL}` },
  {
    title: 'Fundación',
    content: `El Centro de Día Comunitario se puso en funcionamiento el 5 de octubre de 2021 
    como parte del trabajo conjunto entre la municipalidad, provincia y nación para dar respuesta específica en materia 
    de consumos problemáticos y salud mental en 25 de Mayo.`,
  },
  {
    title: 'Ingreso al Centro de Día',
    content: `Para participar de las actividades se realiza una primera escucha con el equipo profesional.
    Luego de esta entrevista inicial se asignan turnos según disponibilidad para:
    - Psicoterapia individual
    - Talleres terapéuticos
    - Dispositivos grupales
    - Acompañamiento en salud mental comunitaria`,
  },
  {
    title: 'Dispositivos disponibles',
    content: `Dispositivos del CDC:
    - Acompañamiento para personas en situación de consumos problemáticos
    - Dispositivo grupal quincenal para familiares de personas con consumos
    - Talleres con modalidad terapéutica
    - Espacios grupales de salud mental
    - Psicoterapia individual según evaluación y disponibilidad`,
  },
  {
    title: 'Psiquiatría',
    content: `El psiquiatra del Centro de Día realiza el seguimiento y acompañamiento farmacológico de quienes lo necesitan.
    La interconsulta psiquiátrica es solicitada por el psicólogo/a del Centro, para trabajar de manera articulada en espacios individuales, grupales o talleres.
    Atención: Viernes por la mañana (requiere turno previo)`,
  },
  {
    title: 'Talleres',
    content: `Talleres disponibles en el CDC:
    1. TransformArte (reciclado creativo): Lunes y jueves 18:00 a 20:00 hs
    2. Amor de Huerta (horticultura): Martes y viernes 18:30 a 20:30 hs, Miércoles 10:30 a 12:30 hs
       El taller es gratuito. Como parte del circuito productivo, el grupo vende lo que produce (plantas y aromáticas) con fines formativos e integradores.
    3. Teatro Leído y Escritura: Viernes 18:00 a 19:00 hs
    4. Espacio Grupal (terapia grupal): Miércoles 14:00 hs
    5. Columna Radial: Todos los lunes a las 11:00 hs en la radio municipal. Se abordan temas de salud mental, promoción de salud comunitaria y consumos problemáticos.`,
  },
  {
    title: 'Preguntas frecuentes',
    content: `¿Puedo asistir con compañía o con mi hijo si no tengo con quién dejarlo?
    Sí. Podés asistir acompañado/a. Entendemos las situaciones familiares y buscamos facilitar el acceso.
    
    ¿Las actividades tienen costo?
    No. Todas las actividades del Centro de Día son gratuitas.`,
  },
]

// =====================================================
// INICIALIZACIÓN DE IA
// =====================================================

let groqClient: Groq | null = null
let knowledgeBase: string[] = []

export async function initRAG() {
  try {
    // Inicializar Groq
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.warn('⚠️ GROQ_API_KEY no configurada')
      return { groqClient: null, knowledgeBase: [] }
    }

    groqClient = new Groq({ apiKey })

    // Crear base de conocimiento
    knowledgeBase = DOC_TEXTS.map((doc) => doc.content)

    // Cargar archivos de data si existen
    const dataFiles = ['info_cdc.txt', 'talleres.txt', 'preguntas_frecuentes.txt']

    for (const filename of dataFiles) {
      try {
        const filepath = join(process.cwd(), 'data', filename)
        const content = await readFile(filepath, 'utf-8')
        knowledgeBase.push(content)
      } catch (error) {
        // Archivo no existe o no se puede leer, continuar
        console.log(`📄 ${filename} no encontrado (opcional)`)
      }
    }

    console.log('✅ Sistema RAG inicializado correctamente')
    return { groqClient, knowledgeBase }
  } catch (error) {
    console.error('❌ Error inicializando RAG:', error)
    return { groqClient: null, knowledgeBase: [] }
  }
}

// =====================================================
// FUNCIONES AUXILIARES RAG MEJORADO
// =====================================================

const SPANISH_STOPWORDS = [
  'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no',
  'haber', 'por', 'con', 'su', 'para', 'como', 'estar', 'tener',
  'le', 'lo', 'todo', 'pero', 'más', 'hacer', 'o', 'poder', 'decir',
  'este', 'ya', 'ir', 'otro', 'ese', 'si', 'me', 'mi', 'porque'
]

const SYNONYMS: Record<string, string[]> = {
  // Profesionales
  'psicólogo': ['terapeuta', 'psicóloga', 'psicologo', 'psicologa', 'psicoterapia', 'terapia', 'profesional', 'doc', 'doctor'],
  'psiquiatra': ['psikiatra', 'sikiatra', 'medico', 'médico'],
  
  // Talleres y actividades
  'taller': ['actividad', 'espacio', 'grupo', 'encuentro', 'clase', 'tayer', 'taler', 'activida'],
  'huerta': ['cultivo', 'plantas', 'horticultura', 'jardín', 'jardin', 'verduras', 'uerta', 'guerta'],
  'reciclaje': ['reciclado', 'transformarte', 'reutilizar', 'reciclar', 'reusar', 'reciklaje', 'resiclar'],
  'teatro': ['obra', 'actuación', 'actuacion', 'drama', 'teátro'],
  'radio': ['columna', 'programa', 'emisora', 'radial'],
  
  // Tiempo y horarios
  'horario': ['hora', 'cuándo', 'cuando', 'día', 'dia', 'tiempo', 'schedule', 'orario', 'q dia', 'ke dia', 'k dia'],
  'mañana': ['manana', 'matutino', 'temprano', 'am', 'antes del mediodia', 'maña'],
  'tarde': ['tardesita', 'pm', 'despues del mediodia', 'x la tarde'],
  
  // Ayuda y consultas
  'ayuda': ['apoyo', 'asistencia', 'acompañamiento', 'acompaña', 'soporte', 'auxilio', 'ayudar', 'ayudenme'],
  'adicción': ['consumo', 'sustancias', 'dependencia', 'drogas', 'adicciones', 'vicio', 'problema'],
  'consulta': ['consultar', 'preguntar', 'pregunta', 'info', 'información', 'informacion', 'konsulta'],
  
  // Costos y acceso
  'gratis': ['gratuito', 'free', 'sin costo', 'no pago', 'no se paga', 'gratiz'],
  'turno': ['cita', 'hora', 'reserva', 'agendar', 'pedir hora', 'sacar turno'],
  
  // Ubicación
  'dónde': ['donde', 'ubicación', 'ubicacion', 'dirección', 'direccion', 'como llego', 'adonde', 'a donde'],
  'cómo': ['como', 'de que forma', 'de q forma', 'de ke forma'],
}

// Normalizar texto de WhatsApp/coloquial
function normalizeWhatsAppText(text: string): string {
  let normalized = text.toLowerCase()
  
  // Correcciones ortográficas comunes
  const corrections: Record<string, string> = {
    // k/q por que/qué
    'q ': 'que ', 'k ': 'que ', 'qe ': 'que ', 'ke ': 'que ',
    ' q ': ' que ', ' k ': ' que ',
    'xq': 'porque', 'xk': 'porque', 'porq': 'porque', 'pork': 'porque',
    
    // Abreviaturas de tiempo
    'tmb': 'también', 'tb': 'también', 'tbn': 'también',
    'dsp': 'después', 'desp': 'después',
    'bn': 'bien', 'mñn': 'mañana', 'mñana': 'mañana',
    
    // h inicial
    'ola': 'hola', 'ora': 'hora', 'orario': 'horario',
    'ay': 'hay',
    
    // Números por letras
    'x': 'por', 
    'd ': 'de ', 
    
    // Mayúsculas todo
    'TODO': 'todo',
    
    // Repetición de letras (emoción)
    'holaaa': 'hola',
    'siiii': 'si',
    'nooo': 'no',
  }
  
  // Aplicar correcciones
  Object.entries(corrections).forEach(([wrong, correct]) => {
    normalized = normalized.replace(new RegExp(wrong, 'gi'), correct)
  })
  
  // Quitar signos de interrogación/exclamación múltiples
  normalized = normalized.replace(/[?!]+/g, ' ')
  
  // Quitar puntos suspensivos múltiples
  normalized = normalized.replace(/\.{2,}/g, ' ')
  
  // Normalizar espacios
  normalized = normalized.replace(/\s+/g, ' ').trim()
  
  return normalized
}

function filterStopwords(words: string[]): string[] {
  return words.filter(word =>
    word.length > 2 && !SPANISH_STOPWORDS.includes(word.toLowerCase()) // Cambié de 3 a 2
  )
}

function expandWithSynonyms(query: string): string[] {
  // Primero normalizar el texto
  const normalizedQuery = normalizeWhatsAppText(query)
  const words = normalizedQuery.split(/\s+/)
  const expanded: Set<string> = new Set(words)

  words.forEach(word => {
    // Buscar si la palabra tiene sinónimos
    Object.entries(SYNONYMS).forEach(([key, synonyms]) => {
      if (key === word || synonyms.includes(word)) {
        expanded.add(key)
        synonyms.forEach(syn => expanded.add(syn))
      }
    })
  })

  return Array.from(expanded)
}

// =====================================================
// FUNCIÓN RAG MEJORADA
// =====================================================

export async function ragAnswer(query: string, sessionId: string = 'anonymous'): Promise<string> {
  const startTime = Date.now()
  let modelUsed = 'llama-3.1-8b-instant'
  let errorOccurred = false
  let errorMessage = ''
  let contextRelevance = 0
  let normalizedQuery = query // Inicializar con query original
  
  // Validación inicial
  if (!groqClient) {
    console.error('❌ groqClient no inicializado')
    errorOccurred = true
    errorMessage = 'groqClient no inicializado'
    
    // Log error
    await logConversation({
      timestamp: formatTimestamp(),
      sessionId,
      userMessage: query,
      botResponse: '⚠️ Sistema no disponible',
      ragUsed: false,
      modelUsed: 'none',
      responseTime: Date.now() - startTime,
      errorOccurred: true,
      errorMessage,
    }).catch(() => {}) // No bloquear si falla
    
    return '⚠️ El sistema de respuestas inteligentes no está disponible. Podés contactarnos al 299 4152668.'
  }
  
  if (knowledgeBase.length === 0) {
    console.error('❌ knowledgeBase vacía')
    errorOccurred = true
    errorMessage = 'knowledgeBase vacía'
    
    await logConversation({
      timestamp: formatTimestamp(),
      sessionId,
      userMessage: query,
      botResponse: '⚠️ Base de conocimientos no cargada',
      ragUsed: false,
      modelUsed: 'none',
      responseTime: Date.now() - startTime,
      errorOccurred: true,
      errorMessage,
    }).catch(() => {})
    
    return '⚠️ La base de conocimientos no está cargada. Podés contactarnos al 299 4152668.'
  }

  try {
    // 1. Normalizar y expandir query
    normalizedQuery = normalizeWhatsAppText(query) // Actualizar la variable ya declarada
    console.log('📝 Query original:', query)
    console.log('✏️ Query normalizada:', normalizedQuery)
    
    const expandedWords = expandWithSynonyms(query)
    console.log('🔍 Query expandida:', expandedWords.slice(0, 10))

    // 2. Filtrar stopwords
    const filteredWords = filterStopwords(expandedWords)
    console.log('📝 Palabras clave:', filteredWords.slice(0, 8))

    // 3. Buscar documentos relevantes
    const relevantTexts: Array<{ matches: number; text: string; coverage: number }> = []

    for (const text of knowledgeBase) {
      const textLower = text.toLowerCase()
      
      // Contar coincidencias
      const matches = filteredWords.filter(word => textLower.includes(word)).length
      
      // Calcular cobertura (% de palabras clave encontradas)
      const coverage = matches / Math.max(filteredWords.length, 1)
      
      if (matches > 0) {
        relevantTexts.push({ matches, text, coverage })
      }
    }

    // 4. Ordenar por relevancia (matches + coverage)
    relevantTexts.sort((a, b) => {
      const scoreA = a.matches * 2 + a.coverage * 10
      const scoreB = b.matches * 2 + b.coverage * 10
      return scoreB - scoreA
    })

    // Log de relevancia
    console.log('📊 Top 3 relevancia:', relevantTexts.slice(0, 3).map(r => 
      `matches: ${r.matches}, coverage: ${(r.coverage * 100).toFixed(0)}%`
    ))

    // 5. Tomar top 3 documentos
    const context = relevantTexts
      .slice(0, 3)
      .map(item => item.text)
      .join('\n\n')

    // 6. Si no hay contexto relevante, usar info general
    const finalContext = context || `${INFO_CENTRO}\n\n${HORARIOS}\n\nDirección: ${DIRECCION}\nTeléfono: ${TELEFONO}`

    // 7. Prompt adaptado a lenguaje coloquial
    const prompt = `Sos Sofía del Centro de Día de 25 de Mayo. Hablás simple y cercano.

INFORMACIÓN:
${finalContext}

IMPORTANTE:
- Respondé DIRECTO, sin rodeos
- Si pregunta por horarios, decí día + hora + dirección (Trenel 53)
- Todo es GRATIS y sin inscripción
- Si no sabés algo: "Llamá al 299 4152668 que te ayudan"
- Máximo 3 líneas

PREGUNTA (puede tener errores de ortografía, es normal):
${query}

TU RESPUESTA (simple y clara):`

    // 8. Llamar a la IA con modelo mejorado
    console.log('🤖 Llamando a Groq/Llama 70B...')
    
    // Intentar con timeout
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: La IA tardó demasiado en responder')), 30000)
    )
    
    const apiPromise = groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant', // 👈 Modelo más rápido y con mayor límite diario (14.4K vs 1K)
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 600,
      top_p: 0.9,
    })
    
    const response = await Promise.race([apiPromise, timeoutPromise])

    const answer = response.choices[0]?.message?.content || 'No pude generar una respuesta.'
    
    // Calcular relevancia del contexto (estimación basada en matches)
    contextRelevance = relevantTexts.length > 0 ? relevantTexts[0].coverage : 0
    
    // Log para debugging
    console.log('✅ Respuesta generada:', answer.substring(0, 100) + '...')
    
    // Log analytics
    await logConversation({
      timestamp: formatTimestamp(),
      sessionId,
      userMessage: query,
      userMessageNormalized: normalizedQuery,
      botResponse: answer,
      ragUsed: true,
      modelUsed,
      responseTime: Date.now() - startTime,
      errorOccurred: false,
      contextRelevance,
    }).catch(() => {})
    
    return answer

  } catch (error: any) {
    console.error('❌ Error en RAG:', error)
    console.error('❌ Error detalle:', error?.message || 'Sin mensaje')
    console.error('❌ Error stack:', error?.stack || 'Sin stack')
    
    // Detectar tipo de error
    if (error?.message?.includes('rate_limit') || error?.message?.includes('429')) {
      return '⚠️ El servicio de IA está temporalmente ocupado. Por favor intentá en unos segundos o escribí *0* para volver al menú.'
    }
    
    if (error?.message?.includes('API key') || error?.message?.includes('401')) {
      return '⚠️ Error de configuración del servicio. Contactanos al 299 4152668 para asistencia inmediata.'
    }
    
    // Intentar fallback con modelo más simple (8B)
    try {
      console.log('🔄 Intentando fallback con Llama 8B...')
      
      // Buscar contexto (mismo código de arriba)
      const expandedWords = expandWithSynonyms(query)
      const filteredWords = filterStopwords(expandedWords)
      const relevantTexts: Array<{ matches: number; text: string; coverage: number }> = []
      
      for (const text of knowledgeBase) {
        const textLower = text.toLowerCase()
        const matches = filteredWords.filter(word => textLower.includes(word)).length
        const coverage = matches / Math.max(filteredWords.length, 1)
        if (matches > 0) {
          relevantTexts.push({ matches, text, coverage })
        }
      }
      
      relevantTexts.sort((a, b) => {
        const scoreA = a.matches * 2 + a.coverage * 10
        const scoreB = b.matches * 2 + b.coverage * 10
        return scoreB - scoreA
      })
      
      const context = relevantTexts.slice(0, 3).map(item => item.text).join('\n\n')
      const finalContext = context || `${INFO_CENTRO}\n\n${HORARIOS}\n\nDirección: ${DIRECCION}\nTeléfono: ${TELEFONO}`
      
      const simplePrompt = `Respondé brevemente usando esta información:

${finalContext}

Pregunta: ${query}

Respuesta (máximo 3 oraciones):`
      
      const fallbackResponse = await groqClient.chat.completions.create({
        model: 'llama-3.1-8b-instant', // Modelo más simple como fallback
        messages: [{ role: 'user', content: simplePrompt }],
        temperature: 0.3,
        max_tokens: 400,
      })
      
      const fallbackAnswer = fallbackResponse.choices[0]?.message?.content || ''
      if (fallbackAnswer) {
        console.log('✅ Fallback exitoso con Llama 8B')
        modelUsed = 'llama-8b-fallback'
        
        // Log analytics del fallback
        await logConversation({
          timestamp: formatTimestamp(),
          sessionId,
          userMessage: query,
          userMessageNormalized: normalizedQuery,
          botResponse: fallbackAnswer,
          ragUsed: true,
          modelUsed,
          responseTime: Date.now() - startTime,
          errorOccurred: false,
          errorMessage: 'Llama 70B failed, used 8B fallback',
        }).catch(() => {})
        
        return fallbackAnswer
      }
    } catch (fallbackError) {
      console.error('❌ Fallback también falló:', fallbackError)
      errorMessage += ' | Fallback failed: ' + (fallbackError as Error).message
    }
    
    // Último recurso: responder con info básica sin IA
    const basicInfo = `${INFO_CENTRO}\n\n${HORARIOS}\n\nDirección: ${DIRECCION}\nTeléfono: ${TELEFONO}`
    const finalResponse = `⚠️ No pude conectar con el servicio de respuestas inteligentes, pero aquí está la información básica:\n\n${basicInfo}\n\nPara consultas específicas, llamá al ${TELEFONO} o escribí *0* para volver al menú.`
    
    // Log analytics del error final
    await logConversation({
      timestamp: formatTimestamp(),
      sessionId,
      userMessage: query,
      userMessageNormalized: normalizedQuery,
      botResponse: finalResponse,
      ragUsed: false,
      modelUsed: 'fallback-no-ai',
      responseTime: Date.now() - startTime,
      errorOccurred: true,
      errorMessage,
    }).catch(() => {})
    
    return finalResponse
  }
}

// =====================================================
// MENÚ PRINCIPAL
// =====================================================

export function menuPrincipal(): string {
  return `
📋 *Menú principal*
Elegí una opción:

1️⃣ ¿Qué es el Centro de Día?
2️⃣ Horarios y Contacto
3️⃣ Servicios que ofrecemos
4️⃣ Talleres disponibles
5️⃣ Pedir turno con psiquiatra
6️⃣ Ver mis turnos
7️⃣ Pregunta abierta (IA)

👉 Escribí el número de la opción.
`
}

// =====================================================
// FUNCIÓN PRINCIPAL DEL BOT
// =====================================================

export async function botResponse(raw: string, state: BotState): Promise<{ response: string; newState: BotState }> {
  const msg = raw.trim().toLowerCase()

  // Comando para volver al menú
  if (['0', 'menu', 'menú', 'volver', 'inicio'].includes(msg)) {
    return {
      response: menuPrincipal(),
      newState: { ...state, step: 'menu' },
    }
  }

  // Detección automática de preguntas
  const questionKeywords = ['qué', 'que', 'cómo', 'como', 'cuándo', 'cuando', 'dónde', 'donde', 'por qué', 'porque', 'cuál', 'cual', 'quién', 'quien', 'horario', 'taller', 'turno', 'atencion', 'ayuda']

  const isQuestion = raw.includes('?') || questionKeywords.some((kw) => msg.includes(kw))

  // MENÚ PRINCIPAL
  if (state.step === 'menu') {
    if (msg === 'hola' || !raw) {
      return {
        response: `👋 *Bienvenido/a al Centro de Día Comunitario 25 de Mayo*${menuPrincipal()}`,
        newState: state,
      }
    }

    if (['1', 'uno'].includes(msg)) {
      return {
        response: `${INFO_CENTRO}\n\n_Escribí *0* o *menú* para volver al menú principal._`,
        newState: state,
      }
    }

    if (['2', 'dos'].includes(msg)) {
      return {
        response: `📍 *Ubicación y Contacto*\n\n🏠 Dirección: ${DIRECCION}\n📞 Teléfono: ${TELEFONO}\n📧 Email: ${EMAIL}\n\n⏰ *Horarios:*\n${HORARIOS}\n\n💡 Podés acercarte sin turno para primera consulta.\n\n_Escribí *0* o *menú* para volver al menú principal._`,
        newState: state,
      }
    }

    if (['3', 'tres'].includes(msg)) {
      return {
        response: `🏥 *Servicios y Dispositivos del CDC:*

✅ Acompañamiento para personas en situación de consumos problemáticos
✅ Dispositivo grupal quincenal para familiares de personas con consumos
✅ Talleres con modalidad terapéutica
✅ Espacios grupales de salud mental
✅ Psicoterapia individual según evaluación y disponibilidad
✅ Acompañamiento psiquiátrico (viernes por la mañana)
✅ Primera escucha con el equipo profesional

📌 Todos los servicios son gratuitos
📌 No se necesita derivación médica
📌 Atención para mayores de 13 años

_Escribí *0* o *menú* para volver al menú principal._`,
        newState: state,
      }
    }

    if (['4', 'cuatro'].includes(msg)) {
      return {
        response: `🎨 *Talleres del CDC*

1️⃣ *TransformArte* - Reciclado creativo
   📅 Lunes y Jueves 18:00-20:00 hs
   ♻️ Transformamos materiales reciclables en arte

2️⃣ *Amor de Huerta* - Horticultura
   📅 Martes y Viernes 18:30-20:30 hs
   📅 Miércoles 10:30-12:30 hs
   🌱 Cultivamos alimentos y bienestar

3️⃣ *Teatro Leído y Escritura*
   📅 Viernes 18:00-19:00 hs
   🎭 Expresión a través del arte escénico

4️⃣ *Espacio Grupal* - Terapia grupal
   📅 Miércoles 14:00 hs
   💬 Acompañamiento terapéutico grupal

5️⃣ *Columna Radial*
   📻 Radio municipal - Lunes 11:00 hs

👉 Escribí el número para más información, o *0* para volver al menú.`,
        newState: { ...state, step: 'talleres_menu' },
      }
    }

    if (['5', 'cinco'].includes(msg)) {
      return {
        response: '📅 *Sistema de turnos con psiquiatra*\n\nLos turnos son los viernes por la mañana.\n\n⚠️ Sistema de turnos simplificado. Para agendar, contactá al 299 4152668.\n\n_Escribí *0* o *menú* para volver al menú principal._',
        newState: state,
      }
    }

    if (['6', 'seis'].includes(msg)) {
      if (state.mis_turnos.length > 0) {
        const turnosText = state.mis_turnos
          .map((t, idx) => `${idx + 1}. 📅 ${t.fecha} - ${t.hora} hs\n   👤 ${t.nombre}\n   🧠 ${t.motivo}`)
          .join('\n\n')
        return {
          response: `📋 *Tus turnos:*\n\n${turnosText}\n\n_Escribí *0* o *menú* para volver al menú principal._`,
          newState: state,
        }
      } else {
        return {
          response: '❌ No tenés turnos registrados.\n\n_Escribí *0* o *menú* para volver al menú principal._',
          newState: state,
        }
      }
    }

    if (['7', 'siete'].includes(msg) || isQuestion) {
      if (isQuestion && !['7', 'siete'].includes(msg)) {
        // Responder directamente
        const answer = await ragAnswer(raw)
        return {
          response: `🤖 ${answer}\n\n_Escribí *0* o *menú* para volver al menú principal._`,
          newState: state,
        }
      } else {
        return {
          response: '🧠 *Pregunta abierta con IA*\n\nEscribí tu pregunta sobre el Centro de Día y te responderé usando toda la información disponible.\n\n_Escribí *0* para cancelar y volver al menú._',
          newState: { ...state, step: 'rag' },
        }
      }
    }

    return {
      response: '❌ Opción inválida. Elegí un número del 1 al 7.\n\n_Escribí *0* o *menú* para volver al menú principal._',
      newState: state,
    }
  }

  // MODO RAG
  if (state.step === 'rag') {
    const answer = await ragAnswer(raw)
    return {
      response: `🤖 ${answer}\n\n_Escribí *0* o *menú* para volver al menú principal._`,
      newState: { ...state, step: 'menu' },
    }
  }

  // SUBMENÚ DE TALLERES
  if (state.step === 'talleres_menu') {
    if (['1', 'uno'].includes(msg)) {
      return {
        response: `🎨 *TransformArte*

♻️ *¿Qué es?*
Taller de reciclado creativo donde transformamos materiales descartables en obras de arte y objetos útiles. Trabajamos con cartón, plásticos, telas y otros materiales.

📅 *Horarios:*
• Lunes 18:00 a 20:00 hs
• Jueves 18:00 a 20:00 hs

👥 *¿Para quién?*
Abierto a toda la comunidad. No se requiere experiencia previa.

💚 *Beneficios:*
• Desarrollo de la creatividad
• Conciencia ambiental
• Espacio de encuentro y socialización
• Gratuito y sin inscripción

📍 Te esperamos en Trenel 53, 25 de Mayo.

_Escribí *0* o *menú* para volver._`,
        newState: { ...state, step: 'menu' },
      }
    }

    if (['2', 'dos'].includes(msg)) {
      return {
        response: `🌱 *Amor de Huerta*

🥬 *¿Qué es?*
Taller de horticultura donde aprendemos a cultivar nuestros propios alimentos de forma orgánica. Armamos almácigos, cuidamos plantas y cosechamos verduras.

📅 *Horarios:*
• Martes 18:30 a 20:30 hs
• Miércoles 10:30 a 12:30 hs
• Viernes 18:30 a 20:30 hs

👥 *¿Para quién?*
Familias, adultos mayores, jóvenes. Todos pueden participar.

💚 *Beneficios:*
• Conexión con la naturaleza
• Alimentación saludable
• Trabajo en equipo
• Actividad física al aire libre
• Gratuito y sin inscripción

🥕 ¡Llevate tus propias verduras a casa!

_Escribí *0* o *menú* para volver._`,
        newState: { ...state, step: 'menu' },
      }
    }

    if (['3', 'tres'].includes(msg)) {
      return {
        response: `🎭 *Teatro Leído y Escritura*

📖 *¿Qué es?*
Espacio de expresión artística donde leemos obras de teatro y creamos nuestros propios textos. Exploramos personajes, emociones y narrativas.

📅 *Horarios:*
• Viernes 18:00 a 19:00 hs

👥 *¿Para quién?*
Personas interesadas en el teatro, la lectura y la escritura creativa. No se requiere experiencia.

💚 *Beneficios:*
• Desarrollo de la expresión oral
• Estímulo de la creatividad
• Espacio de reflexión
• Trabajo colaborativo
• Gratuito y sin inscripción

🎬 ¡Animate a explorar nuevas formas de expresión!

_Escribí *0* o *menú* para volver._`,
        newState: { ...state, step: 'menu' },
      }
    }

    if (['4', 'cuatro'].includes(msg)) {
      return {
        response: `💬 *Espacio Grupal*

🤝 *¿Qué es?*
Dispositivo terapéutico grupal coordinado por profesionales de salud mental. Es un espacio de escucha, contención y acompañamiento mutuo.

📅 *Horarios:*
• Miércoles 14:00 hs

👥 *¿Para quién?*
Personas que estén transitando procesos personales y busquen apoyo grupal.

💚 *Beneficios:*
• Acompañamiento profesional
• Contención emocional
• Aprendizaje compartido
• Espacio confidencial y seguro
• Gratuito

🧠 La participación es voluntaria y requiere continuidad.

_Escribí *0* o *menú* para volver._`,
        newState: { ...state, step: 'menu' },
      }
    }

    if (['5', 'cinco'].includes(msg)) {
      return {
        response: `📻 *Columna Radial*

🎙️ *¿Qué es?*
Espacio de difusión en la radio municipal donde hablamos sobre salud mental, consumos problemáticos y actividades del CDC.

📡 *¿Cuándo escucharnos?*
📅 **Todos los lunes a las 11:00 hs**
📻 Radio municipal de 25 de Mayo

💚 *Temas que abordamos:*
• Salud mental
• Promoción de salud comunitaria
• Consumos problemáticos
• Actividades del CDC
• Desestigmatización

🗣️ ¡Podés participar! Acercate al CDC.

_Escribí *0* o *menú* para volver._`,
        newState: { ...state, step: 'menu' },
      }
    }

    return {
      response: '❌ Opción inválida. Escribí un número del 1 al 5, o *0* para volver al menú.',
      newState: state,
    }
  }

  // Default
  return {
    response: '❌ No entendí tu mensaje.\n\n_Escribí *0* o *menú* para volver al menú principal._',
    newState: state,
  }
}
