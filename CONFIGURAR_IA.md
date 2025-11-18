# 🤖 Configurar IA (Groq API) - Bot CDC Vercel

Tu bot **YA TIENE IA + RAG** implementado. Solo falta configurar la API key de Groq para activarlo.

---

## ⚡ **PASO A PASO (5 MINUTOS)**

### **1️⃣ Crear cuenta en Groq (GRATIS)**

1. Ir a: **https://console.groq.com**
2. Click en **"Sign Up"**
3. Registrarte con Google o email
4. Verificar tu email

> 💚 **Es completamente GRATIS**: 14,400 requests/día (más que suficiente)

---

### **2️⃣ Crear API Key**

1. Una vez dentro, ir a **"API Keys"** (menú lateral)
2. Click en **"Create API Key"**
3. Darle un nombre: `CDC-Bot-Vercel`
4. Click en **"Create"**
5. **COPIAR LA KEY** (solo se muestra una vez)
   - Se ve algo así: `gsk_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789`

> ⚠️ **IMPORTANTE**: Guardá la key en un lugar seguro. No la compartas públicamente.

---

### **3️⃣ Configurar en Vercel**

#### **Opción A: Desde el Dashboard (Recomendado)**

1. Ir a tu proyecto en Vercel: https://vercel.com/dashboard
2. Seleccionar tu proyecto `prueba-cdc-vercel`
3. Ir a **Settings** → **Environment Variables**
4. Click en **"Add New"**
5. Completar:
   - **Key:** `GROQ_API_KEY`
   - **Value:** Tu API key de Groq (la que copiaste)
   - **Environments:** Seleccionar **Production**, **Preview** y **Development** (todas)
6. Click en **"Save"**
7. **IMPORTANTE**: Hacer un **Redeploy** para que tome la nueva variable:
   - Ir a **Deployments**
   - Click en los 3 puntos `⋮` del último deployment
   - Seleccionar **"Redeploy"**
   - Esperar 2-3 minutos

#### **Opción B: Desde la Terminal (Avanzado)**

```bash
# Instalar Vercel CLI (si no lo tenés)
npm i -g vercel

# Login
vercel login

# Agregar variable de entorno
vercel env add GROQ_API_KEY

# Seguir las instrucciones (pegar tu API key cuando te lo pida)

# Redeploy
vercel --prod
```

---

### **4️⃣ Verificar que Funciona**

1. Esperar que termine el redeploy (2-3 min)
2. Ir a tu bot: https://prueba-cdc-vercel.vercel.app/
3. Escribir **"7"** (Pregunta abierta con IA)
4. Hacer una pregunta, por ejemplo:
   - _"¿Qué talleres tienen los lunes?"_
   - _"¿Atienden problemas de ansiedad?"_
   - _"¿Cómo hago para sacar turno?"_

**Si responde con información detallada y relevante** → ✅ **¡IA FUNCIONANDO!**

**Si dice** `"⚠️ El sistema de respuestas inteligentes no está disponible temporalmente."` → ❌ La API key no se configuró bien

---

## 🔍 **TROUBLESHOOTING**

### **❌ Problema: Bot dice "no disponible"**

**Solución:**
1. Verificar que la variable `GROQ_API_KEY` esté en Vercel
2. Verificar que el nombre sea **exactamente** `GROQ_API_KEY` (sin espacios, mayúsculas)
3. Hacer un **Redeploy** después de agregar la variable
4. Esperar 2-3 minutos para que el nuevo deployment esté activo

### **❌ Problema: Error 429 (Rate Limit)**

**Solución:**
- Esperá unos minutos. Groq limita a 30 requests/minuto en el plan gratuito.
- Si necesitás más, considerá el plan pago ($0.27 por 1M tokens)

### **❌ Problema: Error 401 (Unauthorized)**

**Solución:**
- Tu API key es inválida o expiró
- Ir a Groq Console → API Keys → Crear una nueva
- Actualizar en Vercel → Redeploy

---

## 📊 **¿CÓMO FUNCIONA EL RAG?**

### **Sistema Actual:**

```
Usuario pregunta 
   ↓
Búsqueda por keywords en base de conocimientos
   ↓
Selecciona los 3 textos más relevantes
   ↓
Envía contexto + pregunta a Groq (Llama 3.1 8B)
   ↓
Groq genera respuesta basada SOLO en ese contexto
   ↓
Bot responde al usuario
```

### **Fuentes de Información:**
- ✅ `data/info_cdc.txt` (204 líneas)
- ✅ `data/talleres.txt` (216 líneas)
- ✅ `data/preguntas_frecuentes.txt` (180 líneas)
- ✅ Datos hardcodeados en `botLogic.ts`

**Total:** ~15,000 palabras de información del CDC

---

## 💰 **COSTOS**

### **Plan Gratuito de Groq:**
- ✅ **14,400 requests/día** (600/hora)
- ✅ **~$0 por mes**
- ✅ Modelo: Llama 3.1 8B Instant (muy rápido)

### **Si excedés el plan gratuito:**
- 💰 **$0.05 por 1M tokens de input**
- 💰 **$0.08 por 1M tokens de output**
- 💰 **Estimado para el CDC:** ~$1-2/mes (con uso moderado)

**Ejemplo de costo:**
- 1,000 consultas/día = ~$0.50/mes
- 5,000 consultas/día = ~$2.50/mes

---

## 🎯 **VENTAJAS DE USAR IA + RAG**

### **vs. Sistema Keyword-Based (anterior):**

| Característica | Keyword | **IA + RAG** |
|----------------|---------|---------------|
| **Entiende preguntas complejas** | ❌ | ✅ |
| **Respuestas contextualizadas** | ❌ | ✅ |
| **Tolerancia a errores de tipeo** | ❌ | ✅ |
| **Respuestas naturales** | ❌ | ✅ |
| **Costo** | $0 | ✅ $0 (plan gratuito) |
| **Velocidad** | ⚡ 50ms | ⚡ 300ms |

---

## 🚀 **PRÓXIMOS PASOS (OPCIONAL)**

Una vez que tengas IA funcionando, podés:

1. ✅ **Agregar más información** en los archivos `.txt` de `data/`
2. ✅ **Personalizar el prompt** en `botLogic.ts` (línea 198)
3. ✅ **Ajustar temperatura** para respuestas más creativas o más precisas
4. ✅ **Integrar Google Sheets** para gestión real de turnos
5. ✅ **Analytics** para ver qué preguntas hace la gente

---

## 📝 **MODIFICAR LA IA**

Si querés cambiar cómo responde la IA:

### **1. Cambiar el prompt** (`src/lib/botLogic.ts`, línea ~198)

```typescript
const prompt = `Sos un asistente del Centro de Día Comunitario de 25 de Mayo.
Respondé la pregunta usando SOLO esta información:

${finalContext}

Pregunta: ${query}

Respuesta (máximo 3 oraciones, directo al punto):`
```

**Podés modificar:**
- Estilo de respuesta (formal, casual, técnico)
- Longitud de respuesta
- Tono (empático, directo, motivacional)

### **2. Cambiar modelo de IA** (mismo archivo, línea ~210)

```typescript
const response = await groqClient.chat.completions.create({
  model: 'llama-3.1-8b-instant',  // Cambiar aquí
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.3,  // 0 = preciso, 1 = creativo
  max_tokens: 500,
})
```

**Modelos disponibles en Groq:**
- `llama-3.1-8b-instant` - Rápido y balanceado (recomendado)
- `llama-3.1-70b-versatile` - Más inteligente, más lento
- `mixtral-8x7b-32768` - Contexto largo

---

## 🔗 **LINKS ÚTILES**

- 🌐 **Groq Console:** https://console.groq.com
- 📚 **Docs de Groq:** https://console.groq.com/docs
- 🤖 **Modelos disponibles:** https://console.groq.com/docs/models
- 💰 **Pricing:** https://groq.com/pricing
- 📊 **Usage dashboard:** https://console.groq.com/usage

---

## ✅ **RESUMEN**

```
1. Crear cuenta en Groq (2 min)
2. Crear API Key (1 min)
3. Agregar variable en Vercel (1 min)
4. Redeploy (2 min)
5. ¡IA funcionando! 🎉
```

**Tiempo total: 5 minutos**  
**Costo: $0**

---

¿Tenés dudas? Revisá el troubleshooting arriba o contactá al soporte de Groq.

Desarrollado con 💚 para el CDC 25 de Mayo

