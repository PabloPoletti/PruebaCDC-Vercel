# 🚀 Guía Completa de Deployment en Vercel

Guía paso a paso para deployar el bot CDC en Vercel de forma profesional.

---

## 📋 **Índice**

1. [Requisitos Previos](#requisitos-previos)
2. [Crear Cuenta en Vercel](#crear-cuenta-en-vercel)
3. [Deploy desde GitHub](#deploy-desde-github)
4. [Configuración Inicial](#configuración-inicial)
5. [Variables de Entorno](#variables-de-entorno-opcional)
6. [Verificar Deployment](#verificar-deployment)
7. [Dominio Personalizado](#dominio-personalizado-opcional)
8. [Redeploy y Actualizaciones](#redeploy-y-actualizaciones)
9. [Troubleshooting](#troubleshooting)

---

## 1️⃣ **Requisitos Previos**

Antes de empezar, asegurate de tener:

- ✅ Cuenta de GitHub (donde está el repo `PruebaCDC-Vercel`)
- ✅ Navegador web actualizado (Chrome, Firefox, Edge, Safari)
- ✅ Acceso a tu email (para verificación)

> **Nota:** NO necesitás instalar Node.js ni nada localmente. Vercel hace todo en la nube.

---

## 2️⃣ **Crear Cuenta en Vercel**

### **Paso 1: Registrarse**

1. Ir a **https://vercel.com/signup**
2. Elegir **"Continue with GitHub"**
3. Autorizar a Vercel para acceder a tu cuenta de GitHub
4. Completar tu perfil (nombre, email)

### **Paso 2: Verificar Email**

1. Revisar tu bandeja de entrada
2. Hacer click en el link de verificación
3. Volver a Vercel

> **¡Listo!** Ya tenés tu cuenta de Vercel creada. Es **GRATIS** para uso personal/proyectos pequeños.

---

## 3️⃣ **Deploy desde GitHub**

### **Paso 1: Importar Proyecto**

1. En el dashboard de Vercel, hacer click en **"Add New..."**
2. Seleccionar **"Project"**
3. Se abrirá la página "Import Git Repository"

### **Paso 2: Seleccionar Repositorio**

1. Buscar `PruebaCDC-Vercel` en la lista
2. Si no aparece, hacer click en **"Adjust GitHub App Permissions"**:
   - Seleccionar "Only select repositories"
   - Elegir `PruebaCDC-Vercel`
   - Save
3. Volver a la lista y seleccionar el repo
4. Click en **"Import"**

---

## 4️⃣ **Configuración Inicial**

Vercel detecta automáticamente que es un proyecto Next.js. Verifica que esté así:

### **Configure Project:**

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Next.js (detectado automáticamente ✅) |
| **Root Directory** | `./` (dejar por defecto) |
| **Build Command** | `npm run build` (automático) |
| **Output Directory** | `.next` (automático) |
| **Install Command** | `npm install` (automático) |

> **¡Importante!** Si todo aparece como "detected automatically", **NO cambies nada**.

---

## 5️⃣ **Variables de Entorno** (Opcional)

### **¿Cuándo necesito esto?**

Solo si querés activar funciones avanzadas:
- ✅ **Para empezar:** NO necesitás variables de entorno
- 🔄 **Para IA avanzada:** Necesitás `GROQ_API_KEY`
- 🔄 **Para turnos con Google Sheets:** Necesitás credenciales de Google

### **Cómo agregar variables (si las necesitás):**

1. En la configuración del proyecto, expandir **"Environment Variables"**
2. Agregar cada variable:
   - **Key:** `GROQ_API_KEY`
   - **Value:** `tu_api_key_aqui`
   - Environment: **Production**, **Preview**, **Development** (todas seleccionadas)
3. Click en "Add"

> **Para empezar:** SALTEAR este paso. El bot funciona sin variables de entorno.

---

## 6️⃣ **Verificar Deployment**

### **Paso 1: Deploy**

1. Hacer click en **"Deploy"**
2. Vercel empezará a:
   - 🔄 Instalar dependencias (`npm install`)
   - 🔄 Compilar el proyecto (`npm run build`)
   - 🔄 Deployar a producción
3. **Esperar 2-4 minutos** (depende de la conexión)

### **Paso 2: Resultado**

Cuando termine, verás:

```
✓ Deployment Complete!
```

Y te mostrará:
- 🌐 **URL de producción:** `https://tu-proyecto.vercel.app`
- 📸 **Screenshot** de la app
- 📊 **Logs** del build

### **Paso 3: Probar**

1. Hacer click en **"Visit"** o en la URL
2. Debería abrirse tu bot funcionando
3. Probar escribir "hola" o un número del menú

---

## 7️⃣ **Dominio Personalizado** (Opcional)

### **Opción A: Usar dominio de Vercel (GRATIS)**

Por defecto, tu app está en:
```
https://prueba-cdc-vercel.vercel.app
```

**Para cambiarlo:**

1. En tu proyecto, ir a **Settings → Domains**
2. En "Production Domain", hacer click en el lápiz ✏️
3. Elegir un nombre mejor:
   - `cdc-bot-25demayo.vercel.app`
   - `centro-dia-bot.vercel.app`
4. Save

### **Opción B: Dominio propio ($10-15/año)**

Si tenés un dominio (ej: `centrodedia25.com`):

1. En Vercel: **Settings → Domains**
2. Click en **"Add Domain"**
3. Escribir tu dominio: `bot.centrodedia25.com`
4. Vercel te dará instrucciones de DNS
5. Ir a tu proveedor de dominio (GoDaddy, Namecheap, etc.)
6. Agregar los registros DNS que Vercel indica
7. Esperar 10-60 minutos para propagación
8. ¡Listo!

---

## 8️⃣ **Redeploy y Actualizaciones**

### **Actualizaciones Automáticas:**

Cada vez que hacés un `git push` al repo:
1. ✅ Vercel detecta el cambio
2. ✅ Hace un nuevo build automáticamente
3. ✅ Actualiza la app en producción
4. ✅ Te notifica por email

### **Redeploy Manual:**

1. En tu proyecto en Vercel
2. Ir a **Deployments**
3. En el último deployment, hacer click en los 3 puntos `⋮`
4. Seleccionar **"Redeploy"**
5. Confirmar

### **Rollback (volver a versión anterior):**

1. Ir a **Deployments**
2. Buscar el deployment anterior que funcionaba
3. Hacer click en los 3 puntos `⋮`
4. Seleccionar **"Promote to Production"**

---

## 9️⃣ **Troubleshooting**

### **❌ Error: "Build Failed"**

**Problema:** El build no se completa.

**Solución:**
1. En Vercel, ir a **Deployments → [último deployment]**
2. Click en "Building" para ver logs
3. Buscar la línea con `ERROR`
4. Revisar errores comunes:
   - Falta dependencia: Agregar en `package.json`
   - Error de TypeScript: Revisar tipos en los archivos `.ts`
   - Error de sintaxis: Revisar el código

### **❌ Error: "This page could not be found"**

**Problema:** La app se deployó pero muestra 404.

**Solución:**
1. Verificar que `src/app/page.tsx` existe
2. Verificar que `next.config.js` está configurado correctamente
3. Hacer un redeploy manual

### **❌ El bot no responde**

**Problema:** La interfaz carga pero el bot no responde.

**Solución:**
1. Abrir DevTools (F12)
2. Ir a "Console"
3. Buscar errores en rojo
4. Revisar que `src/app/api/chat/route.ts` exista
5. Verificar que la API responde:
   - Abrir: `https://tu-app.vercel.app/api/chat`
   - Debería ver: `{"status":"active"...}`

### **❌ Error: "Rate limit exceeded"**

**Problema:** Demasiadas requests al bot.

**Solución:**
1. Vercel tiene límites en el plan gratuito
2. Esperar unos minutos
3. Si persiste, considerar upgrade a plan Pro

---

## 🎉 **¡Listo!**

Tu bot está deployado en Vercel y funcionando 24/7.

### **URLs importantes:**

- 🌐 **Tu app:** `https://tu-proyecto.vercel.app`
- 📊 **Dashboard:** https://vercel.com/dashboard
- 📚 **Docs de Vercel:** https://vercel.com/docs

### **Próximos pasos sugeridos:**

1. ✅ Compartir la URL del bot
2. ✅ Configurar dominio personalizado
3. ✅ Activar analytics de Vercel (gratis)
4. ✅ Agregar Google Sheets para turnos (opcional)
5. ✅ Integrar Groq API para IA avanzada (opcional)

---

## 📞 **¿Necesitás ayuda?**

- 💬 **Soporte de Vercel:** https://vercel.com/support
- 📖 **Docs de Next.js:** https://nextjs.org/docs
- 📧 **Contacto CDC:** cdc.25demayolp.coordinacion@gmail.com

---

Desarrollado con 💚 para el CDC 25 de Mayo

