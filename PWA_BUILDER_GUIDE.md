# 📱 Guía para Publicar nanapp en Google Play Store

## ✅ Lo que ya está configurado

Tu PWA **nanapp** está completamente preparada para PWA Builder con:
- ✅ Manifest.json optimizado para Android
- ✅ Service Worker con estrategias de caché offline-first  
- ✅ Iconos 512x512px (requeridos)
- ✅ Digital Asset Links preparado
- ✅ Shortcuts para acciones rápidas
- ✅ Orientación portrait configurada

---

## 🚀 Pasos para Publicar en Google Play Store

### **Paso 1: Desplegar tu PWA en Replit**

Tu app debe estar en un dominio HTTPS público:

1. **Publicar en Replit Deployments:**
   - En Replit, ve a la pestaña "Deployments"
   - Click en "Deploy" para crear tu deployment
   - Espera a que se complete
   - Copia tu URL de producción (ej: `https://tu-app.replit.app`)

2. **Verificar que funcione:**
   - Abre la URL en tu navegador
   - Verifica que todos los sonidos funcionen
   - Confirma que el service worker esté registrado

---

### **Paso 2: Usar PWA Builder (Método Recomendado)**

PWA Builder es la forma más fácil de convertir tu PWA en APK/AAB:

1. **Ve a PWA Builder:**
   ```
   https://www.pwabuilder.com/
   ```

2. **Analiza tu PWA:**
   - Ingresa la URL de tu deployment de Replit
   - Click en "Start"
   - PWA Builder analizará tu manifest y service worker

3. **Genera el paquete Android:**
   - Click en "Store Package" > "Android"
   - Elige "Trusted Web Activity" (TWA)
   - Configura:
     - **Package ID:** `com.nanapp.baby`
     - **App Name:** nanapp
     - **Display Mode:** Standalone
     - **Orientation:** Portrait

4. **Descarga el proyecto:**
   - PWA Builder generará un proyecto Android completo
   - Descarga el `.zip` o `.aab` (Android App Bundle)
   - También generará tu SHA-256 fingerprint

5. **Actualiza Digital Asset Links:**
   - Copia el SHA-256 fingerprint que te dio PWA Builder
   - Edita `/public/.well-known/assetlinks.json` en tu proyecto
   - Reemplaza `PLACEHOLDER_SHA256_FINGERPRINT_FROM_PWA_BUILDER` con el fingerprint real
   - Ejemplo:
   ```json
   "sha256_cert_fingerprints": [
     "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
   ]
   ```
   - Re-despliega tu app en Replit para que el archivo se actualice

---

### **Paso 3: Crear Cuenta de Google Play Developer**

1. **Registrarse:**
   - Ve a https://play.google.com/console/signup
   - Pago único: **$25 USD**
   - Completa verificación de identidad

2. **Configurar cuenta:**
   - Información de desarrollador
   - Datos de contacto
   - Aceptar políticas de Google Play

---

### **Paso 4: Subir la App a Google Play Console**

1. **Crear nueva aplicación:**
   - Click en "Crear app"
   - Nombre: **nanapp**
   - Idioma: Español
   - Tipo: App (no juego)
   - Gratis/Pago: **Gratis**

2. **Completar información requerida:**

   **a) Ficha de la Tienda:**
   - Título corto: "nanapp"
   - Descripción corta: "Ruido blanco científico para dormir bebés"
   - Descripción completa: (Usar tu descripción actual)
   - Capturas de pantalla: Tomar screenshots de tu app
   - Icono: Usar `/icons/icon-512x512.png`
   - Gráfico destacado: Crear banner 1024x500px

   **b) Clasificación de contenido:**
   - Completar cuestionario IARC
   - Categoría: Health & Fitness
   - Sin violencia, contenido sexual, etc.
   - Apto para todas las edades

   **c) Política de privacidad:**
   - **IMPORTANTE:** Debes tener una URL pública con tu política de privacidad
   - Puedes crearla en tu misma app o usar generadores gratuitos
   - Ejemplo de generador: https://www.freeprivacypolicy.com/

   **d) Seguridad de datos:**
   - Indicar si recopilas datos del usuario
   - Para nanapp (solo almacenamiento local):
     - No recopila datos personales
     - No comparte datos con terceros
     - Los datos se guardan localmente en el dispositivo

3. **Testing cerrado (Obligatorio en 2025):**
   - Crear lista de testers (mínimo 12 personas)
   - Distribuir durante 14 días mínimo
   - Opciones:
     - Lista de emails
     - Google Groups
     - Link de prueba

4. **Subir el APK/AAB:**
   - Ve a "Producción" > "Crear nueva versión"
   - Sube el `.aab` generado por PWA Builder
   - Completa notas de la versión
   - Código de versión: 1

5. **Enviar para revisión:**
   - Click en "Enviar para revisión"
   - Tiempo de revisión: 1-7 días típicamente

---

## 🛠️ Método Alternativo: Bubblewrap (CLI)

Si prefieres usar línea de comandos:

```bash
# Instalar Bubblewrap
npm install -g @bubblewrap/cli

# Inicializar proyecto
bubblewrap init --manifest https://tu-deployment.replit.app/manifest.json

# Configurar
# - Package: com.nanapp.baby
# - Host: tu-deployment.replit.app

# Generar keystore
bubblewrap build

# Obtener SHA-256 fingerprint
keytool -list -v -keystore android.keystore -alias android
```

---

## 📋 Checklist Pre-Publicación

Antes de enviar a revisión, verifica:

- [ ] PWA desplegada en HTTPS (Replit Deployments)
- [ ] Manifest.json accesible en `/manifest.json`
- [ ] Service Worker funcionando correctamente
- [ ] Digital Asset Links actualizado con SHA-256 real
- [ ] Política de privacidad publicada
- [ ] 12+ testers durante 14+ días (testing cerrado)
- [ ] Screenshots de calidad (mínimo 2)
- [ ] Descripción completa en español
- [ ] Clasificación de contenido completada
- [ ] APK/AAB firmado y subido

---

## 🎯 Requisitos de Google Play 2025

- **API Level Target:** Android 14 (API 34) mínimo
- **Testing cerrado:** 12 testers, 14 días
- **Política de privacidad:** Obligatoria (URL pública)
- **Formulario de seguridad de datos:** Completo
- **Cuenta verificada:** ID personal/empresarial

---

## 💡 Tips Importantes

1. **URLs en el manifest:**
   - Asegúrate de que todos los paths en `manifest.json` funcionen en producción
   - Los iconos deben ser accesibles: `https://tu-app.replit.app/icons/icon-512x512.png`

2. **Digital Asset Links:**
   - CRÍTICO: El archivo `.well-known/assetlinks.json` debe ser públicamente accesible
   - Probar: `https://tu-app.replit.app/.well-known/assetlinks.json`
   - Verificar en: https://developers.google.com/digital-asset-links/tools/generator

3. **Cache del Service Worker:**
   - Tu service worker ya está optimizado
   - Versión actual: `nanapp-v3`
   - Auto-limpia cachés antiguos

4. **Actualizaciones:**
   - Cambios en tu PWA se reflejan AUTOMÁTICAMENTE (sin re-publicar en Play Store)
   - Solo necesitas nueva versión si cambias código nativo o manifest

---

## 📞 Soporte y Recursos

- **PWA Builder:** https://www.pwabuilder.com/
- **Google Play Console:** https://play.google.com/console
- **Digital Asset Links Generator:** https://developers.google.com/digital-asset-links/tools/generator
- **TWA Documentation:** https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities

---

## ⚠️ Notas sobre nanapp

Tu app está lista técnicamente, pero considera:

1. **Política de Privacidad:** Debes crear una antes de publicar
2. **Screenshots reales:** Los actuales son placeholders (iconos)
3. **Testing:** Consigue 12 amigos/familia para testing cerrado
4. **Dominio propio (opcional):** Puedes usar dominio personalizado en Replit

---

**¡Éxito con la publicación de nanapp en Google Play Store! 🚀**
