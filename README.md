# 💚 CDC Bot - Versión Vercel con IA + RAG

Bot web profesional con inteligencia artificial para el Centro de Día Comunitario de 25 de Mayo, La Pampa.

## 🚀 **Características**

- ✅ **IA Conversacional** (Groq + Llama 3.1 8B)
- ✅ **RAG** (Retrieval Augmented Generation)
- ✅ **Next.js 14** con App Router
- ✅ **TypeScript** para mayor seguridad
- ✅ **Tailwind CSS** para diseño moderno
- ✅ **Framer Motion** para animaciones fluidas
- ✅ **Interfaz tipo WhatsApp** profesional
- ✅ **100% Responsive** (mobile-first)
- ✅ **API Routes** serverless
- ✅ **Sistema de turnos** integrado
- ✅ **Deploy automático** en Vercel
- ✅ **Lógica igual al bot de WhatsApp** (sincronizado)

---

## ⚡ **Setup Rápido**

### **1. Deploy en Vercel (5 minutos)**
Ver: **[PASOS_DEPLOYMENT.md](PASOS_DEPLOYMENT.md)**

### **2. Configurar IA (5 minutos)**
Ver: **[CONFIGURAR_IA.md](CONFIGURAR_IA.md)** 👈 **¡IMPORTANTE!**

> ⚠️ **Sin la API key de Groq**, el bot funciona pero sin IA conversacional (solo menú básico)

---

## 📦 **Instalación Local**

### **Requisitos:**
- Node.js 20.x
- npm o yarn
- Groq API Key (gratis en https://console.groq.com)

### **Pasos:**

```bash
# 1. Clonar el repositorio
git clone https://github.com/PabloPoletti/PruebaCDC-Vercel.git
cd PruebaCDC-Vercel

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp env.example .env.local
# Editar .env.local y agregar tu GROQ_API_KEY

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:3000
```

---

## 🌐 **Deploy en Vercel** (PASO A PASO)

### **Opción 1: Deploy desde GitHub (Recomendado)**

1. **Crear cuenta en Vercel:**
   - Ir a https://vercel.com/signup
   - Registrarte con tu cuenta de GitHub

2. **Importar proyecto:**
   - Click en "Add New..." → "Project"
   - Seleccionar "Import Git Repository"
   - Buscar y seleccionar `PruebaCDC-Vercel`

3. **Configurar proyecto:**
   - Framework Preset: **Next.js** (detectado automáticamente)
   - Root Directory: `./` (dejar por defecto)
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)

4. **Variables de entorno (opcional):**
   - Si querés usar IA avanzada, agregar:
     - `GROQ_API_KEY` = tu API key de Groq

5. **Deploy:**
   - Click en "Deploy"
   - Esperar 2-3 minutos
   - ¡Listo! Tu bot estará en: `https://tu-proyecto.vercel.app`

### **Opción 2: Deploy desde CLI**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login en Vercel
vercel login

# 3. Deploy
vercel

# Seguir las instrucciones en pantalla
```

---

## 🎨 **Personalización**

### **Cambiar colores del tema:**

Editar `tailwind.config.js`:

```js
colors: {
  'cdc-green': '#25D366',      // Verde principal
  'cdc-dark-green': '#128C7E', // Verde oscuro
  'cdc-light-green': '#DCF8C6',// Verde claro (burbujas)
  'cdc-bg': '#E5DDD5',          // Fondo beige
  'cdc-dark': '#075E54',        // Verde muy oscuro
}
```

### **Modificar información del bot:**

Editar `src/lib/botLogic.ts`:
- `INFO_CENTRO` - Datos de contacto
- `HORARIOS` - Horarios de atención
- `KNOWLEDGE_BASE` - Respuestas predefinidas

---

## 📂 **Estructura del Proyecto**

```
vercel/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts        # API del bot
│   │   ├── layout.tsx              # Layout principal
│   │   ├── page.tsx                # Página principal (chat)
│   │   └── globals.css             # Estilos globales
│   ├── components/
│   │   ├── ChatHeader.tsx          # Header del chat
│   │   ├── ChatMessage.tsx         # Burbujas de mensaje
│   │   ├── ChatInput.tsx           # Input de texto
│   │   └── TypingIndicator.tsx    # Indicador "escribiendo..."
│   └── lib/
│       └── botLogic.ts             # Lógica del bot
├── public/                          # Archivos estáticos
├── package.json                     # Dependencias
├── tsconfig.json                    # Config TypeScript
├── tailwind.config.js              # Config Tailwind
├── next.config.js                  # Config Next.js
├── vercel.json                     # Config Vercel
└── README.md                       # Esta documentación
```

---

## 🔧 **Scripts Disponibles**

```bash
npm run dev      # Ejecutar en desarrollo (localhost:3000)
npm run build    # Build para producción
npm run start    # Ejecutar build de producción
npm run lint     # Linter (ESLint)
```

---

## 🌐 **Dominio Personalizado**

### **Configurar dominio propio:**

1. En Vercel, ir a tu proyecto
2. Settings → Domains
3. Add Domain → Escribir tu dominio
4. Seguir instrucciones para configurar DNS

### **Subdominios sugeridos:**
- `bot.centrodedia25.com`
- `asistente.cdc25demayo.org`
- `cdc-bot.vercel.app` (gratis)

---

## 📊 **Mejoras Futuras**

### **Versión Básica (actual):**
- ✅ Interfaz profesional
- ✅ Respuestas predefinidas (keyword-based)
- ✅ Sistema de turnos simple
- ✅ Menú interactivo

### **Versión Avanzada (opcional):**
- 🔄 Integración con Groq API (IA conversacional)
- 🔄 Google Sheets para gestión de turnos
- 🔄 Persistencia de sesiones (Redis/DB)
- 🔄 Analytics de conversaciones
- 🔄 Panel de administración

---

## 🆘 **Soporte**

### **Problemas comunes:**

**1. Error al instalar dependencias:**
```bash
# Limpiar cache e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

**2. Error en build:**
```bash
# Verificar versión de Node
node --version  # Debe ser 18.x o superior

# Actualizar dependencias
npm update
```

**3. Error en Vercel:**
- Verificar que el repositorio esté actualizado
- Revisar logs de deploy en Vercel Dashboard
- Asegurar que `package.json` tenga todas las dependencias

---

## 📞 **Información del CDC**

**Centro de Día Comunitario – 25 de Mayo**

📍 Trenel 53, Colonia 25 de Mayo, La Pampa  
📞 299 4152668  
📧 cdc.25demayolp.coordinacion@gmail.com  
🌐 https://sites.google.com/view/centro-de-da-25-de-mayo/

---

## 📝 **Licencia**

Proyecto desarrollado para el Centro de Día Comunitario de 25 de Mayo, La Pampa.

---

## 🔗 **Repositorios Relacionados**

- **Bot de WhatsApp:** https://github.com/PabloPoletti/PruebaCDC
- **App Streamlit:** https://github.com/PabloPoletti/PruebaCDC-Streamlit

---

Desarrollado con 💚 para el CDC 25 de Mayo

