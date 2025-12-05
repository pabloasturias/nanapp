const CACHE_NAME = 'nanapp-store-v1';

// LISTA MAESTRA DE RECURSOS PARA MODO OFFLINE
// Incluye el núcleo de React, Iconos, Estilos y TODO el código fuente local.
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  
  // Dependencias Externas Críticas
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;600;700&display=swap',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0',
  'https://aistudiocdn.com/lucide-react@^0.555.0',
  
  // Iconos para Notificaciones y UI
  'https://cdn.jsdelivr.net/npm/lucide-static@0.344.0/icons/baby.svg',
  'https://img.icons8.com/fluency/96/sleeping-baby.png',
  'https://img.icons8.com/fluency/512/sleeping-baby.png',

  // Código Fuente Local (Para que la app cargue sin servidor)
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './services/audioEngine.ts',
  './services/translations.ts',
  './services/LanguageContext.tsx',
  './components/Controls.tsx',
  './components/SoundButton.tsx',
  './components/Visualizer.tsx',
  './components/TipsView.tsx',
  './components/SleepView.tsx',
  './components/StoryView.tsx',
  './components/SettingsModal.tsx',
  './components/WhyItWorksModal.tsx',
  './components/SupportModal.tsx',
  './components/LegalModal.tsx',
  './components/Toast.tsx'
];

// 1. INSTALACIÓN: Descargar y guardar todo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando app completa...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. ACTIVACIÓN: Limpiar versiones antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. INTERCEPTOR DE RED (Estrategia: Cache First, falling back to Network)
// Esta es la mejor estrategia para apps de "Ruido Blanco" que no cambian a menudo.
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en caché, úsalo (Velocidad instantánea y Offline)
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no, búscalo en internet y guárdalo para la próxima
      return fetch(event.request).then((networkResponse) => {
        // Verificar si la respuesta es válida
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Si falla internet y no está en caché... (Aquí podrías retornar una página offline genérica)
        console.log('[SW] Fallo de red y recurso no cacheado:', event.request.url);
      });
    })
  );
});