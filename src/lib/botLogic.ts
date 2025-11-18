// Lógica del bot - Sistema RAG simplificado (keyword-based para Vercel)

export interface BotState {
  state: 'main' | 'booking_name' | 'booking_contact' | 'booking_confirm'
  booking_data?: {
    name?: string
    contact?: string
  }
}

// Información base del CDC
export const INFO_CENTRO = `*Centro de Día Comunitario – 25 de Mayo*

📍 *Dirección:* Trenel 53, Colonia 25 de Mayo, La Pampa
📞 *Teléfono:* 299 4152668
📧 *Email:* cdc.25demayolp.coordinacion@gmail.com
🌐 *Web:* https://sites.google.com/view/centro-de-da-25-de-mayo/`

export const HORARIOS = `*⏰ Horarios de Verano*

🌅 *Mañana:*
Lunes a viernes: 9:00 a 12:00 hs

🌆 *Tarde:*
• Lunes, miércoles y jueves: 16:00 a 19:00 hs
• Martes y viernes: 17:00 a 20:00 hs`

// Base de conocimientos simplificada
export const KNOWLEDGE_BASE = {
  'que es': `*¿Qué es el Centro de Día Comunitario?*

El CDC es un dispositivo territorial que aborda problemáticas de *salud mental* y *consumos problemáticos* de sustancias.

Es un espacio de:
✅ Encuentro y contención
✅ Recreación y expresión
✅ Formación y capacitación
✅ Prevención y promoción de salud

*¿Quiénes pueden asistir?*
Personas mayores de *13 años* que necesiten acompañamiento, contención y espacios terapéuticos.`,

  'servicios': `*🏥 Servicios del CDC*

*Dispositivos Disponibles:*
1. Acompañamiento para personas en situación de consumos problemáticos
2. Dispositivo grupal quincenal para familiares
3. Talleres con modalidad terapéutica
4. Espacios grupales de salud mental
5. Psicoterapia individual (según evaluación y disponibilidad)

*Atención Profesional:*
• Psicólogos/as
• Psiquiatra (viernes por la mañana)
• Acompañantes terapéuticos
• Talleristas especializados

*Ingreso al Centro:*
Para participar se realiza una *primera escucha* con el equipo profesional (sin turno previo).`,

  'talleres': `*🎨 Talleres Disponibles*

*1. AMOR DE HUERTA* 🌱
Martes, miércoles y viernes
Aprende técnicas de horticultura y trabajo en la tierra.

*2. EXPRESAMENTE* ✍️
Viernes 18:00 a 19:00 hs
Teatro leído, escritura creativa y "La Voz del CDC".

*3. TRANSFORMARTE* ♻️
Lunes y jueves 18:00 a 20:00 hs
Reciclado creativo y expresión artística.

*4. ESPACIO GRUPAL* 👥
Miércoles 14:00 hs
Grupo terapéutico cerrado con inscripción previa.

*5. COLUMNA RADIAL* 📻
Lunes 11:00 hs en radio municipal
Temas de salud mental y consumos problemáticos.

_Todos los talleres son GRATUITOS._`,

  'psiquiatra': `*🩺 Acompañamiento Psiquiátrico*

El psiquiatra del CDC realiza:
• Seguimiento farmacológico
• Evaluaciones
• Prescripciones según necesidad

*Atención:* Viernes por la mañana
*Modalidad:* Con turno previo

La interconsulta psiquiátrica es solicitada por el psicólogo/a del Centro para trabajar de manera articulada.`,

  'preguntas frecuentes': `*❓ Preguntas Frecuentes*

*¿Es gratuito?*
Sí, todos los servicios son completamente gratuitos.

*¿Puedo asistir acompañado/a?*
Sí, entendemos las situaciones familiares y buscamos facilitar el acceso.

*¿Necesito derivación médica?*
No, el CDC funciona con libre demanda.

*¿Y el taller de huerta?*
Es gratuito. El grupo vende lo que produce con fines formativos e integradores.

*¿Tienen columna de radio?*
Sí, todos los lunes a las 11:00 hs en la radio municipal.`,
}

// Menú principal
export const MENU_PRINCIPAL = `*¿Qué te gustaría saber?*

1️⃣ ¿Qué es el Centro de Día?
2️⃣ Horarios y contacto
3️⃣ Servicios que ofrecemos
4️⃣ Talleres disponibles
5️⃣ Pedir turno con psiquiatra
6️⃣ Ver mis turnos
7️⃣ Pregunta abierta (IA)

_Escribí el número de la opción o hacé tu consulta._`

// Función principal del bot
export function processMessage(
  message: string,
  state: BotState = { state: 'main' }
): { response: string; newState: BotState } {
  const msg = message.toLowerCase().trim()

  // Comando para volver al menú
  if (['0', 'menu', 'volver', 'inicio'].includes(msg)) {
    return {
      response: `${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  // Estados de reserva de turno
  if (state.state === 'booking_name') {
    return {
      response: `Perfecto, *${message}*. Ahora necesito tu número de teléfono o email de contacto:`,
      newState: {
        state: 'booking_contact',
        booking_data: { name: message },
      },
    }
  }

  if (state.state === 'booking_contact') {
    const name = state.booking_data?.name || 'Usuario'
    return {
      response: `✅ *Turno registrado con éxito*

*Nombre:* ${name}
*Contacto:* ${message}
*Día:* Viernes por la mañana (próxima disponibilidad)

📞 Te contactaremos para confirmar el horario exacto al ${message}.

*Recordá:*
• La atención psiquiátrica es con turno previo
• Si tenés alguna duda, llamá al 299 4152668

¿Necesitás algo más?

${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  // Respuestas del menú principal
  if (msg === '1' || msg.includes('que es')) {
    return {
      response: `${KNOWLEDGE_BASE['que es']}\n\n${INFO_CENTRO}\n\n¿Querés saber algo más?\n\n${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  if (msg === '2' || msg.includes('horario') || msg.includes('contacto')) {
    return {
      response: `${HORARIOS}\n\n${INFO_CENTRO}\n\n¿Querés saber algo más?\n\n${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  if (msg === '3' || msg.includes('servicio')) {
    return {
      response: `${KNOWLEDGE_BASE['servicios']}\n\n¿Querés saber algo más?\n\n${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  if (msg === '4' || msg.includes('taller')) {
    return {
      response: `${KNOWLEDGE_BASE['talleres']}\n\n¿Querés saber algo más?\n\n${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  if (msg === '5' || msg.includes('turno') || msg.includes('psiquiatra')) {
    return {
      response: `${KNOWLEDGE_BASE['psiquiatra']}\n\n*📝 Para reservar tu turno*, escribí tu nombre completo:`,
      newState: { state: 'booking_name' },
    }
  }

  if (msg === '6' || msg.includes('mis turno')) {
    return {
      response: `📅 *Tus turnos registrados:*

No tenés turnos registrados en este momento.

Para pedir un turno con el psiquiatra, elegí la opción *5️⃣*.

${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  if (msg === '7' || msg.includes('pregunta')) {
    return {
      response: `💬 *Pregunta abierta*

Hacé tu consulta y te responderé con la información que tengo sobre el CDC.

_Por ejemplo: "¿atienden adicciones?", "¿puedo ir sin turno?", etc._

Para volver al menú, escribí *0* o *menu*.`,
      newState: { state: 'main' },
    }
  }

  // Búsqueda por palabras clave
  if (msg.includes('adicc') || msg.includes('consumo')) {
    return {
      response: `*🔹 Consumos Problemáticos*

El CDC está especializado en el abordaje de consumos problemáticos de sustancias (alcohol, tabaco, drogas, medicamentos, etc.).

Ofrecemos:
• Atención profesional individual
• Acompañamientos terapéuticos
• Dispositivo grupal para familiares
• Espacios de contención

📞 Contactanos al 299 4152668 para más información.

${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  if (msg.includes('familia') || msg.includes('familiar')) {
    return {
      response: `*👨‍👩‍👧‍👦 Atención a Familias*

El CDC ofrece:
• Dispositivo grupal quincenal para familiares
• Orientación y apoyo
• Espacios de escucha
• Herramientas para el acompañamiento

Todas las actividades son gratuitas y confidenciales.

${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  if (msg.includes('gratis') || msg.includes('costo') || msg.includes('pagar')) {
    return {
      response: `*💚 Servicios Gratuitos*

✅ TODOS los servicios del CDC son completamente GRATUITOS:
• Atención psicológica
• Atención psiquiátrica
• Talleres
• Acompañamientos terapéuticos
• Materiales para talleres

No hay ningún costo para los participantes.

${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  // Saludo inicial
  if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas')) {
    return {
      response: `¡Hola! 👋 Bienvenido/a al *Centro de Día Comunitario* de 25 de Mayo.

${MENU_PRINCIPAL}`,
      newState: { state: 'main' },
    }
  }

  // Respuesta por defecto
  return {
    response: `No entendí tu consulta. 

${MENU_PRINCIPAL}`,
    newState: { state: 'main' },
  }
}

