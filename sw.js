const CACHE_NAME = 'centersys-pwa-v1';
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
  '/fotos/ban1.png',
  '/fotos/scanning_qr.png',
  '/fotos/calendarjpg.jpg',
  '/fotos/3mobile.png'
];

// Instalar el Service Worker y almacenar archivos esenciales en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Abriendo caché y guardando recursos...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antigua...', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de red: Cache First, luego cae en Red
self.addEventListener('fetch', event => {
  // Ignorar peticiones de video (ya que el manejo de streaming por caché requiere rangos HTTP complejos)
  if (event.request.url.includes('/videos/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});