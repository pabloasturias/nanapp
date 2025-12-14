const CACHE_NAME = 'nanapp-v4';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-144.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Instalando...');
      
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.log('[SW] Error precache:', asset);
        }
      }
      
      try {
        const indexResponse = await fetch('/index.html');
        const indexText = await indexResponse.text();
        
        const scriptMatches = indexText.match(/src="([^"]*\.js)"/g) || [];
        const cssMatches = indexText.match(/href="([^"]*\.css)"/g) || [];
        
        for (const match of scriptMatches) {
          const src = match.match(/src="([^"]*)"/)?.[1];
          if (src && src.startsWith('/assets/')) {
            try {
              await cache.add(src);
              console.log('[SW] Cached:', src);
            } catch (e) {}
          }
        }
        
        for (const match of cssMatches) {
          const href = match.match(/href="([^"]*)"/)?.[1];
          if (href && href.startsWith('/assets/')) {
            try {
              await cache.add(href);
              console.log('[SW] Cached:', href);
            } catch (e) {}
          }
        }
      } catch (err) {
        console.log('[SW] Error parseando index:', err);
      }
      
      const externals = [
        'https://cdn.tailwindcss.com',
        'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;600;700&display=swap'
      ];
      
      for (const url of externals) {
        try {
          const res = await fetch(url, { mode: 'cors' });
          if (res.ok) await cache.put(url, res);
        } catch (e) {}
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => 
      Promise.all(names.map((name) => name !== CACHE_NAME ? caches.delete(name) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;

        if (response.type === 'basic' || response.type === 'cors') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
