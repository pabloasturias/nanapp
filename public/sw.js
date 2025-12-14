const CACHE_NAME = 'nanapp-v6';
const OFFLINE_URL = '/';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-144.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/screenshots/screenshot-wide.png',
  '/screenshots/screenshot-portrait.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[SW] Instalando v6...');
      
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
          console.log('[SW] Cached:', asset);
        } catch (err) {
          console.log('[SW] Error caching:', asset, err.message);
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
              console.log('[SW] Cached JS:', src);
            } catch (e) {}
          }
        }
        
        for (const match of cssMatches) {
          const href = match.match(/href="([^"]*)"/)?.[1];
          if (href && href.startsWith('/assets/')) {
            try {
              await cache.add(href);
              console.log('[SW] Cached CSS:', href);
            } catch (e) {}
          }
        }
      } catch (err) {
        console.log('[SW] Error parsing index:', err);
      }
      
      const externals = [
        'https://cdn.tailwindcss.com',
        'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;600;700&display=swap'
      ];
      
      for (const url of externals) {
        try {
          const res = await fetch(url, { mode: 'cors' });
          if (res.ok) {
            await cache.put(url, res);
            console.log('[SW] Cached external:', url);
          }
        } catch (e) {}
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
      await self.clients.claim();
      console.log('[SW] Activated and claimed clients');
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  if (!url.protocol.startsWith('http')) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.log('[SW] Navigation failed, serving cached:', event.request.url);
          const cachedResponse = await caches.match(OFFLINE_URL);
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('/index.html');
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(event.request);
        
        if (networkResponse.ok && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        console.log('[SW] Fetch failed:', event.request.url);
        
        if (event.request.destination === 'image') {
          return new Response('', { status: 404 });
        }
        
        return new Response('Offline', { status: 503 });
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
