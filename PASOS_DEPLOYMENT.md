# 🚀 PASOS RÁPIDOS PARA DEPLOYMENT

## ✅ **LO QUE YA ESTÁ HECHO**

1. ✅ Proyecto Next.js creado con TypeScript + Tailwind
2. ✅ Interfaz tipo WhatsApp profesional
3. ✅ Lógica del bot implementada (menú, respuestas, turnos)
4. ✅ API Routes configuradas
5. ✅ Todo subido a GitHub: https://github.com/PabloPoletti/PruebaCDC-Vercel

---

## 📋 **LO QUE TENÉS QUE HACER (5 MINUTOS)**

### **PASO 1: Crear cuenta en Vercel**

1. Ir a: **https://vercel.com/signup**
2. Click en **"Continue with GitHub"**
3. Autorizar a Vercel
4. Verificar tu email

---

### **PASO 2: Importar el proyecto**

1. En Vercel, click en **"Add New..." → "Project"**
2. Buscar **`PruebaCDC-Vercel`** en la lista
3. Click en **"Import"**

---

### **PASO 3: Configurar (dejar todo por defecto)**

Verificar que aparezca:
- ✅ Framework: **Next.js** (detectado automáticamente)
- ✅ Root Directory: `./`
- ✅ Build Command: `npm run build`

> **NO cambies nada**. Vercel lo detecta todo automáticamente.

---

### **PASO 4: Deploy**

1. Scroll hasta abajo
2. Click en **"Deploy"**
3. Esperar 2-3 minutos ⏳

---

### **PASO 5: ¡Listo!**

Cuando termine, verás:
```
✓ Deployment Complete!
https://tu-proyecto.vercel.app
```

Click en **"Visit"** para ver tu bot funcionando 🎉

---

## 🌐 **TU BOT YA ESTÁ EN LÍNEA**

### **URL:**
```
https://[nombre-proyecto].vercel.app
```

### **Características:**
- ✅ 100% funcional
- ✅ Disponible 24/7
- ✅ HTTPS automático (seguro)
- ✅ CDN global (súper rápido)
- ✅ Dominio gratis de Vercel

---

## 🎨 **PERSONALIZACIÓN DEL DOMINIO** (Opcional)

### **Cambiar nombre del dominio de Vercel:**

1. En tu proyecto → **Settings → Domains**
2. Click en el lápiz ✏️ junto al dominio actual
3. Cambiar a:
   - `cdc-bot-25demayo.vercel.app`
   - `centro-dia-bot.vercel.app`
   - O el que prefieras
4. Save

---

## 🔄 **ACTUALIZACIONES AUTOMÁTICAS**

Cada vez que hagas cambios en GitHub:
1. ✅ Vercel detecta el `git push`
2. ✅ Re-deploya automáticamente
3. ✅ Actualiza la app en 2-3 minutos
4. ✅ Te notifica por email

**No tenés que hacer nada más** 🚀

---

## 📊 **MONITOREO**

### **Ver estadísticas:**
1. Ir a tu proyecto en Vercel
2. Dashboard → **Analytics**
3. Ver:
   - Visitas
   - Tiempo de carga
   - Errores
   - Geolocalización

**Es gratis** en el plan básico.

---

## 🆘 **SI ALGO FALLA**

### **Problema: Build failed**
- Revisar **Deployments → [último] → Building**
- Buscar la línea con `ERROR`
- Contactame con el error

### **Problema: 404 Not Found**
- Hacer **Redeploy** desde el dashboard
- Esperar 2 minutos

### **Problema: El bot no responde**
- Abrir DevTools (F12) → Console
- Ver si hay errores en rojo
- Verificar que `/api/chat` responda

---

## 🎯 **PRÓXIMOS PASOS** (Opcionales)

Ahora que el bot está funcionando, podés:

1. ✅ **Compartir la URL** con tu equipo
2. 🔄 **Configurar dominio personalizado** (ej: `bot.cdc25demayo.com`)
3. 🔄 **Agregar Google Analytics** (para ver métricas)
4. 🔄 **Integrar Google Sheets** (para gestión de turnos real)
5. 🔄 **Activar Groq API** (para IA conversacional avanzada)

---

## 📚 **DOCUMENTACIÓN COMPLETA**

Para más detalles, ver:
- 📖 **README.md** - Información técnica del proyecto
- 📖 **GUIA_DEPLOY_VERCEL.md** - Guía paso a paso detallada
- 🌐 **Docs de Vercel** - https://vercel.com/docs

---

## ✨ **RESUMEN**

```
1. Crear cuenta en Vercel (2 min)
2. Importar PruebaCDC-Vercel (1 min)
3. Deploy (2 min)
4. ¡Bot funcionando! 🎉
```

**Tiempo total: ~5 minutos**

---

¿Alguna duda? Seguí los pasos de **GUIA_DEPLOY_VERCEL.md** para más detalles.

Desarrollado con 💚 para el CDC 25 de Mayo

