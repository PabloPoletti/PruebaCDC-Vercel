# 🤖 GUÍA COMPLETA: LLM Y RAG EN EL BOT CDC

## 📋 TABLA DE CONTENIDOS

1. [¿Qué LLM está usando el bot?](#qué-llm-está-usando-el-bot)
2. [¿Cómo funciona la IA actualmente?](#cómo-funciona-la-ia-actualmente)
3. [¿Qué es RAG y cómo está implementado?](#qué-es-rag-y-cómo-está-implementado)
4. [Arquitectura completa del sistema](#arquitectura-completa-del-sistema)
5. [Cómo mejorar el RAG](#cómo-mejorar-el-rag)
6. [Alternativas de LLM](#alternativas-de-llm)
7. [Ejemplos prácticos](#ejemplos-prácticos)

---

## 🧠 ¿QUÉ LLM ESTÁ USANDO EL BOT?

### **Modelo actual: Llama 3.1 8B Instant (via Groq)**

```typescript
// En: src/lib/botLogic.ts línea 192
const response = await groqClient.chat.completions.create({
  model: 'llama-3.1-8b-instant',  // 👈 AQUÍ
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.3,
  max_tokens: 500,
})
```

### **Detalles del modelo:**

| Característica | Valor |
|----------------|-------|
| **Proveedor** | Groq (API gratuita) |
| **Modelo base** | Meta Llama 3.1 8B |
| **Velocidad** | ⚡ Ultra-rápido (optimizado por Groq) |
| **Parámetros** | 8 mil millones |
| **Contexto** | 128K tokens (~96,000 palabras) |
| **Costo** | 🆓 GRATIS (con límites) |
| **Límites gratuitos** | ~30 req/min, 6000 tokens/min |

### **¿Por qué Llama 3.1 8B?**

✅ **Ventajas:**
- ✅ **Totalmente GRATIS** (no como OpenAI)
- ✅ **Muy rápido** (Groq optimiza con hardware especial)
- ✅ **Español nativo** (entrenado en múltiples idiomas)
- ✅ **Open source** (puedes correrlo local si querés)
- ✅ **Suficiente para chatbots** (8B parámetros es más que adecuado)

❌ **Limitaciones:**
- ❌ Menos "inteligente" que GPT-4 (pero GPT-4 es pago)
- ❌ Límites de rate (pero generosos para uso normal)

---

## ⚙️ ¿CÓMO FUNCIONA LA IA ACTUALMENTE?

### **Flujo completo:**

```mermaid
graph TD
    A[Usuario escribe mensaje] --> B{¿Es comando del menú?}
    B -->|Sí 1-6| C[Respuesta predefinida]
    B -->|Sí 7| D[Modo IA activado]
    B -->|No, es pregunta| E[Detección automática]
    
    D --> F[Usuario hace pregunta]
    E --> F
    
    F --> G[Sistema RAG]
    G --> H[Buscar contexto relevante]
    H --> I[Base de conocimiento]
    
    I --> J{¿Encontró información?}
    J -->|Sí| K[Contexto relevante]
    J -->|No| L[Información general]
    
    K --> M[Crear prompt para IA]
    L --> M
    
    M --> N[Enviar a Groq/Llama]
    N --> O[IA genera respuesta]
    O --> P[Respuesta al usuario]
```

### **Ejemplo real paso a paso:**

#### **PASO 1: Usuario pregunta**
```
Usuario: "¿Cuándo puedo ir al taller de huerta?"
```

#### **PASO 2: Detección de pregunta**
```typescript
// src/lib/botLogic.ts línea 242-244
const questionKeywords = ['qué', 'que', 'cómo', 'como', 'cuándo', 'cuando', ...]
const isQuestion = raw.includes('?') || questionKeywords.some(kw => msg.includes(kw))
// Detecta "cuándo" → isQuestion = true
```

#### **PASO 3: Buscar contexto (RAG simple)**
```typescript
// src/lib/botLogic.ts línea 159-177
const queryLower = query.toLowerCase() // "¿cuándo puedo ir al taller de huerta?"
const relevantTexts = []

// Recorre la base de conocimiento
for (const text of knowledgeBase) {
  const queryWords = queryLower.split(/\s+/) // ["cuándo", "puedo", "taller", "huerta"]
  const matches = queryWords.filter(word => 
    word.length > 3 && text.toLowerCase().includes(word)
  ).length
  
  // Si encuentra "taller" y "huerta" en el texto de talleres → matches = 2
  if (matches > 0) {
    relevantTexts.push({ matches, text })
  }
}

// Ordena por relevancia y toma top 3
relevantTexts.sort((a, b) => b.matches - a.matches)
const context = relevantTexts.slice(0, 3).map(item => item.text).join('\n\n')
```

**Contexto encontrado:**
```
Talleres disponibles en el CDC:
...
2️⃣ Amor de Huerta (horticultura):
   📅 Martes y Viernes 18:30-20:30 hs
   📅 Miércoles 10:30-12:30 hs
   🌱 Cultivamos alimentos y bienestar
...
```

#### **PASO 4: Crear prompt para IA**
```typescript
// src/lib/botLogic.ts línea 182-189
const prompt = `Sos un asistente del Centro de Día Comunitario de 25 de Mayo.
Respondé la pregunta usando SOLO esta información:

${context} // 👈 Aquí va el contexto encontrado

Pregunta: ¿Cuándo puedo ir al taller de huerta?

Respuesta (máximo 3 oraciones, directo al punto):`
```

#### **PASO 5: Enviar a Groq (Llama 3.1)**
```typescript
// src/lib/botLogic.ts línea 191-196
const response = await groqClient.chat.completions.create({
  model: 'llama-3.1-8b-instant',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.3,  // 👈 Baja creatividad = más exacto
  max_tokens: 500,   // 👈 Respuestas cortas
})
```

#### **PASO 6: Respuesta de IA**
```
🤖 El taller de Amor de Huerta se realiza los martes y viernes de 18:30 a 20:30 hs,
y los miércoles de 10:30 a 12:30 hs. Podés asistir sin inscripción previa.

_Escribí *0* o *menú* para volver al menú principal._
```

---

## 🔍 ¿QUÉ ES RAG Y CÓMO ESTÁ IMPLEMENTADO?

### **¿Qué es RAG?**

**RAG = Retrieval-Augmented Generation**  
(Generación Aumentada por Recuperación)

Es una técnica que combina:
1. **Búsqueda de información** (Retrieval) en una base de conocimiento
2. **Generación de texto** (Generation) con un LLM

### **¿Por qué RAG?**

Sin RAG, la IA puede:
- ❌ Inventar información (alucinaciones)
- ❌ Dar datos desactualizados
- ❌ No conocer información específica del CDC

Con RAG:
- ✅ Solo responde con información verificada
- ✅ Siempre actualizada (si actualizás la base de conocimiento)
- ✅ Específica del CDC

---

## 📁 ARQUITECTURA COMPLETA DEL SISTEMA

### **Estructura de archivos:**

```
vercel/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts          ← Endpoint API (recibe mensajes)
│   ├── lib/
│   │   └── botLogic.ts               ← CEREBRO: IA + RAG
│   └── components/
│       └── FloatingChatBot.tsx       ← UI del chat
├── data/                              ← BASE DE CONOCIMIENTO
│   ├── info_cdc.txt                  ← Info general del CDC
│   ├── talleres.txt                  ← Info de talleres
│   └── preguntas_frecuentes.txt      ← FAQ
├── .env.local                         ← GROQ_API_KEY aquí
└── package.json                       ← Dependencias
```

### **Flujo de datos:**

```
┌─────────────────────────────────────────────────────────────┐
│  1. FRONTEND (FloatingChatBot.tsx)                          │
│     Usuario escribe: "¿Cuándo es el taller de huerta?"     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ POST /api/chat
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. API ROUTE (route.ts)                                    │
│     - Recibe mensaje                                         │
│     - Inicializa RAG si no está inicializado                │
│     - Llama a botResponse()                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. BOT LOGIC (botLogic.ts)                                 │
│     ┌─────────────────────────────────────────┐            │
│     │ A. Detección de intención               │            │
│     │    - ¿Es comando (1-7)?                 │            │
│     │    - ¿Es pregunta?                      │            │
│     └─────────────────┬───────────────────────┘            │
│                       ▼                                      │
│     ┌─────────────────────────────────────────┐            │
│     │ B. Sistema RAG (si es pregunta)         │            │
│     │    1. Buscar keywords en base           │            │
│     │    2. Ranquear por relevancia           │            │
│     │    3. Tomar top 3 textos                │            │
│     └─────────────────┬───────────────────────┘            │
│                       ▼                                      │
│     ┌─────────────────────────────────────────┐            │
│     │ C. Construcción de prompt               │            │
│     │    - Contexto encontrado                │            │
│     │    - Pregunta del usuario               │            │
│     │    - Instrucciones para IA              │            │
│     └─────────────────┬───────────────────────┘            │
│                       ▼                                      │
│     ┌─────────────────────────────────────────┐            │
│     │ D. Llamada a Groq                       │            │
│     │    Model: llama-3.1-8b-instant          │            │
│     │    Temperature: 0.3                     │            │
│     │    Max tokens: 500                      │            │
│     └─────────────────┬───────────────────────┘            │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        │ Respuesta de IA
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  4. RESPUESTA AL USUARIO                                    │
│     "🤖 El taller de Amor de Huerta se realiza los martes  │
│     y viernes de 18:30 a 20:30 hs..."                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 BASE DE CONOCIMIENTO ACTUAL

### **1. Datos embebidos en el código** (`botLogic.ts`)

```typescript
// Línea 34-103
const DOC_TEXTS = [
  { title: 'Centro de Día Comunitario', content: INFO_CENTRO },
  { title: 'Horarios', content: HORARIOS },
  { title: 'Contacto', content: '...' },
  { title: 'Fundación', content: '...' },
  { title: 'Ingreso al Centro', content: '...' },
  { title: 'Dispositivos', content: '...' },
  { title: 'Psiquiatría', content: '...' },
  { title: 'Talleres', content: '...' },
  { title: 'Preguntas frecuentes', content: '...' },
]
```

**Tamaño:** ~3000 palabras

### **2. Archivos en `/data/`**

```
data/
├── info_cdc.txt             ← Info institucional
├── talleres.txt             ← Detalles de talleres
└── preguntas_frecuentes.txt ← FAQ
```

**Carga automática:**
```typescript
// Línea 126-138
for (const filename of dataFiles) {
  const filepath = join(process.cwd(), 'data', filename)
  const content = await readFile(filepath, 'utf-8')
  knowledgeBase.push(content)  // 👈 Se agrega a la base
}
```

---

## 🚀 CÓMO MEJORAR EL RAG

### **Nivel 1: RAG Básico (ACTUAL)** ✅

**Método:** Búsqueda por keywords

```typescript
// Busca palabras que coincidan
const matches = queryWords.filter(word => 
  word.length > 3 && textLower.includes(word)
).length
```

**Pros:**
- ✅ Simple
- ✅ Rápido
- ✅ No requiere librerías adicionales

**Contras:**
- ❌ No entiende sinónimos ("psicólogo" vs "terapeuta")
- ❌ No entiende contexto ("taller" puede ser cualquiera)

---

### **Nivel 2: RAG con Embeddings** 🎯 RECOMENDADO

**¿Qué son embeddings?**

Son representaciones numéricas del significado del texto.

```
"taller de huerta" → [0.23, -0.45, 0.67, ...] (384 números)
"cultivo de plantas" → [0.21, -0.43, 0.69, ...] (similar!)
```

**Beneficio:** Entiende que "huerta" y "cultivo" son similares.

#### **Implementación con Sentence Transformers:**

**1. Instalar:**
```bash
npm install @xenova/transformers
```

**2. Código:**

```typescript
// src/lib/embeddings.ts (NUEVO ARCHIVO)

import { pipeline } from '@xenova/transformers'

let embedder: any = null

export async function initEmbeddings() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embedder
}

export async function getEmbedding(text: string): Promise<number[]> {
  const embedder = await initEmbeddings()
  const output = await embedder(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  return dotProduct // Ya están normalizados
}
```

**3. Modificar RAG:**

```typescript
// src/lib/botLogic.ts

import { getEmbedding, cosineSimilarity } from './embeddings'

// Al inicializar, crear embeddings de todos los documentos
let docEmbeddings: Array<{ text: string; embedding: number[] }> = []

export async function initRAG() {
  // ... código existente ...
  
  // Crear embeddings
  for (const text of knowledgeBase) {
    const embedding = await getEmbedding(text)
    docEmbeddings.push({ text, embedding })
  }
}

// Buscar con embeddings
export async function ragAnswer(query: string): Promise<string> {
  const queryEmbedding = await getEmbedding(query)
  
  // Calcular similitud con cada documento
  const similarities = docEmbeddings.map(doc => ({
    text: doc.text,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding)
  }))
  
  // Ordenar por similitud
  similarities.sort((a, b) => b.similarity - a.similarity)
  
  // Tomar top 3
  const context = similarities.slice(0, 3)
    .map(s => s.text)
    .join('\n\n')
  
  // ... resto del código (crear prompt, llamar a IA)
}
```

**Ventajas:**
- ✅ Entiende sinónimos
- ✅ Busca por significado, no solo palabras
- ✅ Resultados más relevantes

**Desventajas:**
- ❌ Más lento (pero no tanto)
- ❌ Más complejo

---

### **Nivel 3: RAG con Vector Database** 🔥 PROFESIONAL

Para bases de conocimiento GRANDES (100+ documentos).

#### **Opción A: ChromaDB**

Ya está en el `package.json`!

```typescript
// src/lib/vectordb.ts (NUEVO ARCHIVO)

import { ChromaClient } from 'chromadb'
import { getEmbedding } from './embeddings'

let client: ChromaClient
let collection: any

export async function initVectorDB() {
  client = new ChromaClient()
  
  // Crear/obtener colección
  collection = await client.getOrCreateCollection({
    name: 'cdc_knowledge',
    metadata: { 'hnsw:space': 'cosine' }
  })
  
  return collection
}

export async function addDocuments(docs: Array<{ id: string; text: string }>) {
  const embeddings = await Promise.all(docs.map(d => getEmbedding(d.text)))
  
  await collection.add({
    ids: docs.map(d => d.id),
    embeddings: embeddings,
    documents: docs.map(d => d.text)
  })
}

export async function searchSimilar(query: string, topK = 3) {
  const queryEmbedding = await getEmbedding(query)
  
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK
  })
  
  return results.documents[0] // Array de textos relevantes
}
```

**Uso:**

```typescript
// Inicializar una sola vez
await initVectorDB()
await addDocuments([
  { id: '1', text: 'Info del CDC...' },
  { id: '2', text: 'Talleres...' },
  // ...
])

// Buscar
const relevantDocs = await searchSimilar('taller de huerta')
```

**Ventajas:**
- ✅ Ultra rápido para muchos documentos
- ✅ Escala a millones de documentos
- ✅ Búsqueda optimizada

**Desventajas:**
- ❌ Más setup
- ❌ Requiere almacenamiento persistente

---

## 🔄 ALTERNATIVAS DE LLM

### **Comparación de modelos:**

| Modelo | Proveedor | Costo | Velocidad | Calidad | Español |
|--------|-----------|-------|-----------|---------|---------|
| **Llama 3.1 8B** (actual) | Groq | 🆓 Gratis | ⚡⚡⚡ | ⭐⭐⭐ | ✅ Excelente |
| **Llama 3.1 70B** | Groq | 🆓 Gratis | ⚡⚡ | ⭐⭐⭐⭐ | ✅ Excelente |
| **Mixtral 8x7B** | Groq | 🆓 Gratis | ⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ Excelente |
| **GPT-3.5 Turbo** | OpenAI | 💰 $0.50/1M | ⚡⚡ | ⭐⭐⭐⭐ | ✅ Muy bueno |
| **GPT-4o** | OpenAI | 💰 $2.50/1M | ⚡ | ⭐⭐⭐⭐⭐ | ✅ Excelente |
| **Claude 3 Haiku** | Anthropic | 💰 $0.25/1M | ⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ Muy bueno |
| **Gemini 1.5 Flash** | Google | 🆓 Gratis* | ⚡⚡ | ⭐⭐⭐⭐ | ✅ Excelente |

\* Con límites generosos

---

### **Cómo cambiar de modelo:**

#### **1. Usar Llama 3.1 70B (más inteligente, gratis):**

```typescript
// src/lib/botLogic.ts línea 192
model: 'llama-3.1-70b-versatile',  // ← Cambiar aquí
```

#### **2. Usar Mixtral (excelente balance):**

```typescript
model: 'mixtral-8x7b-32768',
```

#### **3. Usar GPT-4o (mejor calidad, pago):**

```bash
npm install openai
```

```typescript
// src/lib/botLogic.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',  // Más barato que GPT-4
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.3,
  max_tokens: 500,
})
```

#### **4. Usar Gemini (gratis, muy bueno):**

```bash
npm install @google/generative-ai
```

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const result = await model.generateContent(prompt)
const response = result.response.text()
```

---

## 💡 EJEMPLOS PRÁCTICOS

### **Ejemplo 1: Agregar más documentos a la base**

**Archivo:** `data/eventos.txt`

```
EVENTOS ESPECIALES DEL CDC

Festival de Primavera
Fecha: 21 de septiembre
Actividades: Muestra de talleres, huerta abierta, obra de teatro
Horario: 10:00 a 18:00 hs
Entrada libre y gratuita

Jornada de Salud Mental
Fecha: 10 de octubre
Charlas sobre prevención de adicciones y salud mental comunitaria
Horario: 15:00 a 19:00 hs
```

**Carga automática:**
```typescript
// src/lib/botLogic.ts línea 127
const dataFiles = [
  'info_cdc.txt', 
  'talleres.txt', 
  'preguntas_frecuentes.txt',
  'eventos.txt'  // ← Agregar aquí
]
```

¡Listo! El bot ahora puede responder sobre eventos.

---

### **Ejemplo 2: Ajustar la temperatura de la IA**

```typescript
// src/lib/botLogic.ts línea 194

temperature: 0.1,  // Muy preciso, menos creativo
temperature: 0.3,  // ← ACTUAL: Balance ideal
temperature: 0.7,  // Más creativo, menos preciso
temperature: 1.0,  // Muy creativo, puede inventar
```

**Recomendación:** Para un bot de información, mantener entre 0.1-0.4.

---

### **Ejemplo 3: Respuestas más largas**

```typescript
max_tokens: 200,   // Respuestas muy cortas
max_tokens: 500,   // ← ACTUAL: Respuestas medianas
max_tokens: 1000,  // Respuestas largas y detalladas
```

---

### **Ejemplo 4: Prompt mejorado**

```typescript
// src/lib/botLogic.ts línea 182-189

const prompt = `Sos Sofía, asistente virtual del Centro de Día Comunitario de 25 de Mayo.

Tu rol es brindar información clara, empática y precisa sobre el CDC.

INFORMACIÓN DISPONIBLE:
${finalContext}

INSTRUCCIONES:
- Respondé usando SOLO la información proporcionada
- Si no sabés algo, decí "No tengo esa información, podés llamar al 299 4152668"
- Sé empático/a y cálido/a
- Usá un lenguaje simple y accesible
- Si mencionás horarios, siempre incluí la dirección

PREGUNTA DEL USUARIO: ${query}

RESPUESTA (máximo 4 oraciones):`
```

---

## 🎯 RESUMEN EJECUTIVO

### **Estado actual:**

✅ **LLM:** Llama 3.1 8B Instant (Groq)  
✅ **RAG:** Búsqueda por keywords (simple pero efectivo)  
✅ **Base de conocimiento:** ~3000 palabras + archivos en `/data/`  
✅ **Costo:** $0 (100% gratis)  
✅ **Funciona:** ✅ Sí, muy bien para el uso actual

### **Próximos pasos recomendados:**

1. **Corto plazo (1-2 días):**
   - Agregar más contenido a `/data/` (eventos, FAQ extendido)
   - Mejorar prompts para respuestas más empáticas

2. **Mediano plazo (1 semana):**
   - Implementar RAG con embeddings (Nivel 2)
   - Considerar Llama 3.1 70B o Mixtral para mejor calidad

3. **Largo plazo (1 mes):**
   - Vector database si la base de conocimiento crece mucho
   - Dashboard para agregar/editar conocimiento sin tocar código

---

## 📊 DIAGRAMA FINAL: TODO EL SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
│                 "¿Cuándo es el taller?"                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  FloatingChatBot.tsx                                     │  │
│  │  - UI del chat                                           │  │
│  │  - Gestión de estado de mensajes                        │  │
│  │  - Animaciones                                           │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │ fetch('/api/chat', ...)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API ENDPOINT                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/chat/route.ts                                      │  │
│  │  - Recibe mensaje                                        │  │
│  │  - Gestiona sesiones                                     │  │
│  │  - Inicializa RAG                                        │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LÓGICA DEL BOT                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  botLogic.ts - botResponse()                             │  │
│  │                                                           │  │
│  │  1. Detección de intención                              │  │
│  │     - ¿Comando del menú? (1-7)                          │  │
│  │     - ¿Pregunta? (keywords, ?)                          │  │
│  │                                                           │  │
│  │  2. Si es pregunta → RAG                                │  │
│  │     ├─ Buscar en knowledgeBase                          │  │
│  │     ├─ Ranquear por relevancia                          │  │
│  │     └─ Extraer top 3 contextos                          │  │
│  │                                                           │  │
│  │  3. Construir prompt                                     │  │
│  │     ├─ Instrucciones para IA                            │  │
│  │     ├─ Contexto relevante                               │  │
│  │     └─ Pregunta del usuario                             │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    INICIALIZACIÓN RAG                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  initRAG()                                               │  │
│  │                                                           │  │
│  │  1. Crear cliente Groq                                   │  │
│  │     const groqClient = new Groq({                        │  │
│  │       apiKey: process.env.GROQ_API_KEY                   │  │
│  │     })                                                    │  │
│  │                                                           │  │
│  │  2. Cargar base de conocimiento                         │  │
│  │     knowledgeBase = [                                    │  │
│  │       DOC_TEXTS (código),                               │  │
│  │       ...archivos de /data/                             │  │
│  │     ]                                                    │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BASE DE CONOCIMIENTO                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  knowledgeBase: string[]                                 │  │
│  │                                                           │  │
│  │  [0] "El CDC es un dispositivo..."                      │  │
│  │  [1] "Horarios: Lunes a viernes..."                     │  │
│  │  [2] "Talleres disponibles: TransformArte..."           │  │
│  │  [3] "Psiquiatría: viernes por la mañana..."            │  │
│  │  [4] ... (contenido de info_cdc.txt)                    │  │
│  │  [5] ... (contenido de talleres.txt)                    │  │
│  │  [6] ... (contenido de preguntas_frecuentes.txt)        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LLAMADA A GROQ                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  groqClient.chat.completions.create()                    │  │
│  │                                                           │  │
│  │  {                                                        │  │
│  │    model: 'llama-3.1-8b-instant',                        │  │
│  │    messages: [{                                          │  │
│  │      role: 'user',                                       │  │
│  │      content: [PROMPT CON CONTEXTO]                      │  │
│  │    }],                                                    │  │
│  │    temperature: 0.3,                                     │  │
│  │    max_tokens: 500                                       │  │
│  │  }                                                        │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │ API Request
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GROQ CLOUD                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🧠 Llama 3.1 8B Instant                                │  │
│  │                                                           │  │
│  │  Hardware: LPU (Language Processing Unit)               │  │
│  │  Velocidad: ~500 tokens/segundo                         │  │
│  │  Contexto: 128K tokens                                   │  │
│  │                                                           │  │
│  │  Procesamiento:                                          │  │
│  │  1. Analiza el prompt                                    │  │
│  │  2. Genera respuesta basada en contexto                 │  │
│  │  3. Limita a 500 tokens                                  │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │ Respuesta
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPUESTA PROCESADA                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  "El taller de Amor de Huerta se realiza los martes     │  │
│  │   y viernes de 18:30 a 20:30 hs, y los miércoles de     │  │
│  │   10:30 a 12:30 hs. Podés asistir sin inscripción."     │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESPUESTA AL USUARIO                          │
│                                                                  │
│  🤖 El taller de Amor de Huerta se realiza los martes          │
│  y viernes de 18:30 a 20:30 hs, y los miércoles de             │
│  10:30 a 12:30 hs. Podés asistir sin inscripción.              │
│                                                                  │
│  _Escribí *0* o *menú* para volver al menú principal._          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 VARIABLES DE ENTORNO

```env
# .env.local

# ============================================
# GROQ (REQUERIDO)
# ============================================
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Obtener gratis en: https://console.groq.com

# ============================================
# ALTERNATIVAS (OPCIONAL)
# ============================================

# OpenAI (si querés usar GPT)
# OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google (si querés usar Gemini)
# GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Anthropic (si querés usar Claude)
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📞 SOPORTE Y RECURSOS

### **Documentación oficial:**

- **Groq:** https://console.groq.com/docs
- **Llama 3.1:** https://llama.meta.com/docs
- **LangChain:** https://js.langchain.com/docs
- **Transformers.js:** https://huggingface.co/docs/transformers.js

### **Tutoriales recomendados:**

- RAG desde cero: https://www.youtube.com/watch?v=T-D1OfcDW1M
- Groq + RAG: https://www.youtube.com/watch?v=kYRPHsU0I4I
- Vector databases: https://www.pinecone.io/learn/vector-database/

---

**¿Preguntas?** 💬

Escribime qué querés implementar y te ayudo paso a paso! 🚀

