/* Diamond Soap Naturals — Service Worker */
const CACHE_NAME = 'ds-v1';
const ASSETS = [
  './',
  './index.html',
  './css/styles.min.css',
  './js/script.min.js',
  './assets/hero-poster-logo.webp',
  './assets/hero-poster-logo.jpg',
  './assets/image-1.webp',
  './assets/image-1.jpg',
  './assets/image-2.webp',
  './assets/image-2.jpg',
  './assets/image-3.webp',
  './assets/image-3.jpg',
  './assets/image-4.webp',
  './assets/image-4.jpg',
  './assets/hero-poster.jpg',
  './assets/hero-poster.webp',
  './assets/fonts/inter-400.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Network-first for HTML
  if (e.request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/') {
    e.respondWith(
      fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
