const CACHE_NAME = 'v1_cache_android_para_todos';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './assets/images/front.jpg',
  './fotos/logo_cen.png'
];

// Instalar el Service Worker y guardar en caché los archivos básicos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting());
      })
      .catch(err => console.log('Fallo el registro de caché', err))
  );
});

// Activar y actualizar caché vieja
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de carga: Buscar en caché primero, si no, ir a la red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      if (res) {
        return res;
      }
      return fetch(e.request);
    })
  );
});