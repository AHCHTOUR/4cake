const CACHE_NAME = '4cake-cache-v1';

const CORE_ASSETS = [
  './index.html',
  './manifest.json',
  './LOGO_MARQUE.jpg',
  './slcm_logo.jpg',
  './feuilletine_box.jpg',
  './topping_caramel.jpg',
  './topping_chocolat.jpg',
  './topping_fraise.jpg',
  './pate_sucre.jpg',
  './icon-192.png',
  './icon-512.png'
];

// Installation : met en cache les fichiers essentiels du site
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activation : nettoie les anciennes versions de cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Stratégie : cache d'abord pour les fichiers du site, réseau sinon (avec repli sur le cache si hors-ligne)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Ne met en cache que les réponses valides de même origine
          if (response && response.status === 200 && event.request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
