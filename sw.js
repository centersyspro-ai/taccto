const CACHE_NAME = 'centersys-pwa-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/fotos/logo_cen.png',
  '/fotos/mobile-fitness.jpg',
  '/fotos/calendarpng.png',
  '/fotos/2cell.jpg',
  '/fotos/taxiapp1.jpg',
  '/fotos/scanning_qr.png',
  '/fotos/calendarjpg.jpg',
  '/fotos/3mobile.png'
];

// Instalar el Service Worker y tomar el control rápido
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activar y limpiar cachés de versiones anteriores
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Network-First: intenta red primero, luego cae en caché
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Ignorar peticiones de video por streaming y rangos HTTP
  if (event.request.url.includes('/videos/')) {
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then(networkResponse => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});