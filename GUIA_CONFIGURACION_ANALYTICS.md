# 📊 GUÍA DE CONFIGURACIÓN - SISTEMA DE ANALYTICS

## 🎯 OBJETIVO

Registrar **todas las interacciones** del bot en Google Sheets para análisis posterior:
- Preguntas frecuentes
- Errores y problemas
- Tiempo de respuesta
- Tópicos más consultados
- Satisfacción de usuarios
- Estadísticas diarias

---

## 📋 REQUISITOS

- ✅ Cuenta de Google
- ✅ Google Sheets (gratis)
- ✅ 15 minutos de configuración

---

## 🚀 PASO 1: CREAR GOOGLE SHEET

### 1.1. Crear nuevo Sheet
1. Ir a https://sheets.google.com
2. Crear nuevo Sheet
3. Nombrarlo: **"CDC Bot Analytics"**

### 1.2. Copiar el ID del Sheet
- URL será algo como: `https://docs.google.com/spreadsheets/d/AQUI_ESTA_EL_ID/edit`
- Copiar ese ID (entre `/d/` y `/edit`)
- Guardarlo, lo necesitarás después

---

## 🔧 PASO 2: CONFIGURAR GOOGLE APPS SCRIPT

### 2.1. Abrir Script Editor
1. En tu Google Sheet, ir a: **Extensiones → Apps Script**
2. Se abrirá el editor de código

### 2.2. Pegar el código
1. Borrar todo el código que aparece por defecto
2. Abrir el archivo: `vercel/scripts/google-sheets-webhook.gs`
3. Copiar TODO el contenido
4. Pegarlo en el editor de Apps Script

### 2.3. Configurar el SPREADSHEET_ID
Buscar esta línea al inicio del código:

```javascript
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';
```

Reemplazar `'TU_SPREADSHEET_ID_AQUI'` con el ID que copiaste en el paso 1.2

**Ejemplo:**
```javascript
const SPREADSHEET_ID = '1a2B3c4D5e6F7g8H9i0J1K2L3M4N5O6P7Q8R9S0T';
```

### 2.4. Guardar el proyecto
1. Click en el ícono de **guardar** (💾)
2. Nombrar el proyecto: **"CDC Bot Webhook"**

---

## 🌐 PASO 3: DESPLEGAR COMO WEB APP

### 3.1. Iniciar despliegue
1. En el editor de Apps Script, click en **Implementar** (arriba derecha)
2. Seleccionar **Nueva implementación**

### 3.2. Configurar la implementación

**Configuración:**
- **Tipo:** Web app
- **Descripción:** CDC Bot Analytics Webhook
- **Ejecutar como:** Yo (tu email)
- **¿Quién tiene acceso?:** Cualquier usuario *(importante!)*

### 3.3. Autorizar el script
1. Click en **Implementar**
2. Te pedirá autorización
3. Click en **Revisar permisos**
4. Seleccionar tu cuenta de Google
5. Click en **Avanzado**
6. Click en **Ir a CDC Bot Webhook (no seguro)**
7. Click en **Permitir**

### 3.4. COPIAR LA URL
- Aparecerá una URL que termina en `.../exec`
- **COPIAR ESTA URL COMPLETA**
- Ejemplo: `https://script.google.com/macros/s/AKfycby...xyz/exec`

---

## 🔐 PASO 4: CONFIGURAR VERCEL

### 4.1. Agregar variable de entorno

1. Ir a tu proyecto en Vercel: https://vercel.com/dashboard
2. Seleccionar tu proyecto CDC
3. Ir a **Settings** → **Environment Variables**
4. Agregar nueva variable:

**Name:**
```
GOOGLE_SHEETS_WEBHOOK_URL
```

**Value:**
```
[PEGAR AQUÍ LA URL QUE COPIASTE EN PASO 3.4]
```

**Environments:** Marcar todas (Production, Preview, Development)

5. Click en **Save**

### 4.2. Redeploy del proyecto
1. Ir a la pestaña **Deployments**
2. Click en los 3 puntos del último deployment
3. Click en **Redeploy**
4. Esperar que termine

---

## ✅ PASO 5: INICIALIZAR EL SPREADSHEET

### 5.1. Ejecutar función de inicialización

1. Volver al editor de Apps Script
2. En el selector de funciones (arriba), elegir: **`initializeSpreadsheet`**
3. Click en **Ejecutar** (▶️)
4. Esperar que termine
5. Refrescar tu Google Sheet

Deberías ver **3 pestañas nuevas:**
- 📊 **Conversaciones** (detalle de cada mensaje)
- 📈 **Estadísticas Diarias** (resumen por día)
- 🔄 **Sesiones** (info de sesiones completas)

---

## 🧪 PASO 6: PROBAR EL SISTEMA

### 6.1. Ejecutar test desde Apps Script

1. En el selector de funciones, elegir: **`testWebhook`**
2. Click en **Ejecutar** (▶️)
3. Ver log (abajo): debería decir `{"success":true}`

### 6.2. Verificar en Sheet

1. Ir a la pestaña **"Conversaciones"**
2. Deberías ver una fila de prueba con:
   - Timestamp actual
   - session_id: test_session_123
   - Mensaje: "Hola, que talleres hay?"

### 6.3. Probar desde el bot en vivo

1. Ir a tu sitio: https://tu-proyecto.vercel.app
2. Abrir el bot
3. Escribir una pregunta
4. Esperar respuesta
5. Ir a Google Sheet y refrescar
6. Deberías ver la interacción registrada

---

## 📊 ESTRUCTURA DE LAS HOJAS

### **Hoja 1: Conversaciones**

Registra CADA mensaje:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| Timestamp | Fecha y hora exacta | 2025-11-18T20:45:32.123Z |
| Session ID | ID único de sesión | session_1731957932_abc123 |
| Mensaje Usuario | Texto exacto del usuario | "q talleres ay x la mñn?" |
| Mensaje Normalizado | Texto corregido | "que talleres hay por la mañana" |
| Respuesta Bot | Respuesta completa | "El taller de Amor de Huerta..." |
| RAG Usado | Si usó sistema RAG | Sí / No |
| Modelo | Qué modelo de IA usó | llama-70b, llama-8b-fallback |
| Tiempo Respuesta (ms) | Milisegundos de respuesta | 1234 |
| Error | Si ocurrió error | Sí / No |
| Mensaje Error | Detalle del error | "rate_limit exceeded" |
| Opción Menú | Si usó menú (1-7) | 4 |
| Relevancia Contexto | Score de relevancia RAG | 0.85 |
| User Agent | Navegador del usuario | Mozilla/5.0... |
| Fue Útil | Feedback opcional | Sí / No / (vacío) |

### **Hoja 2: Estadísticas Diarias**

Resumen automático por día:

| Columna | Descripción |
|---------|-------------|
| Fecha | Día |
| Total Sesiones | Cuántas conversaciones |
| Total Mensajes | Cuántos mensajes |
| Usuarios Únicos | Estimación |
| Promedio Mensajes/Sesión | Avg |
| Tiempo Respuesta Promedio | En ms |
| Tasa de Error (%) | % de errores |
| Preguntas Top 5 | Más frecuentes |
| Tópicos Top 5 | Temas más consultados |
| Hora Pico | Cuándo más se usa |

### **Hoja 3: Sesiones**

Info completa de cada sesión:

| Columna | Descripción |
|---------|-------------|
| Session ID | ID único |
| Inicio | Cuándo empezó |
| Fin | Cuándo terminó |
| Duración (min) | Tiempo total |
| Total Mensajes | Cuántos mensajes |
| Mensajes Usuario | Solo del usuario |
| Mensajes Bot | Solo del bot |
| Errores | Cuántos errores |
| Tiempo Respuesta Promedio | Avg |
| Opciones Menú | Qué usó del menú |
| Consultas RAG | Cuántas veces usó IA |
| Tópicos | Temas consultados |

---

## 📈 ANÁLISIS Y REPORTES

### **Preguntas que puedes responder:**

1. ✅ ¿Cuáles son las 10 preguntas más frecuentes?
2. ✅ ¿Qué temas consultan más? (talleres, horarios, etc.)
3. ✅ ¿Cuántos errores hay por día?
4. ✅ ¿Cuánto tarda en responder el bot?
5. ✅ ¿A qué hora del día hay más consultas?
6. ✅ ¿Qué modelo de IA funciona mejor? (70B vs 8B)
7. ✅ ¿Cuántos usuarios usan el bot por día?
8. ✅ ¿Cuántos mensajes hay por conversación en promedio?
9. ✅ ¿Qué errores son más comunes?
10. ✅ ¿El RAG encuentra contexto relevante?

### **Crear gráficos en Google Sheets:**

1. **Gráfico de preguntas frecuentes:**
   - Seleccionar columna "Mensaje Usuario"
   - Insertar → Gráfico → Gráfico de barras
   - Mostrar top 10

2. **Gráfico de tasa de error:**
   - Hoja "Estadísticas Diarias"
   - Columnas: Fecha + Tasa de Error
   - Insertar → Gráfico → Líneas

3. **Gráfico de uso por hora:**
   - Crear columna con hora del día
   - Contar mensajes por hora
   - Gráfico de barras

---

## 🔍 QUERIES ÚTILES

### **Top 10 preguntas:**
```
=QUERY(Conversaciones!A:C, "SELECT C, COUNT(C) GROUP BY C ORDER BY COUNT(C) DESC LIMIT 10")
```

### **Tasa de error hoy:**
```
=COUNTIF(Conversaciones!I:I,"Sí") / COUNTA(Conversaciones!I:I) * 100
```

### **Tiempo de respuesta promedio:**
```
=AVERAGE(Conversaciones!H:H)
```

---

## 🛠️ TROUBLESHOOTING

### **Problema: No aparecen datos en el Sheet**

**Soluciones:**
1. Verificar que la URL del webhook esté correcta en Vercel
2. Ver logs en Vercel: Deployments → Ver logs
3. Ejecutar `testWebhook()` en Apps Script para verificar que funciona
4. Verificar que el script tenga permisos

### **Problema: Error 403 Forbidden**

**Solución:**
- Verificar que al desplegar pusiste **"Cualquier usuario"** en acceso
- Volver a implementar el script

### **Problema: Los datos no se actualizan**

**Solución:**
- Refrescar manualmente el Sheet (F5)
- Google Sheets puede tardar unos segundos

---

## 🎯 PRÓXIMOS PASOS

Una vez que tengas datos:

1. **Semana 1:** Monitorear errores y corregir
2. **Semana 2:** Identificar preguntas frecuentes y agregar respuestas pre-definidas
3. **Semana 3:** Analizar tópicos y mejorar base de conocimiento
4. **Mes 1:** Crear dashboard con gráficos
5. **Mes 2:** Implementar sistema de feedback (botones "¿Te ayudó?")

---

## 📞 SOPORTE

Si tienes problemas:
1. Ver logs en Vercel Dashboard
2. Ver ejecuciones en Apps Script (icono de reloj)
3. Verificar que todas las variables estén configuradas

---

*Guía actualizada: 18 de Noviembre 2025*  
*Versión: 1.0*

