const CACHE_NAME = '4cake-cache-v2';

const CORE_ASSETS = [
  './index.html',
  './manifest.json',
  './LOGO_MARQUE.png',
  './slcm_logo.jpg',
  './feuilletine_box.png',
  './topping_caramel.png',
  './topping_chocolat.png',
  './topping_fraise.png',
  './pate_sucre.png',
  './icon-192.png',
  './icon-512.png'
];

// Installation : met en cache les fichiers essentiels du site (pour le mode hors-ligne)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch((err) => console.warn('Mise en cache initiale partielle :', err))
  );
  self.skipWaiting();
});

// Activation : nettoie TOUTES les anciennes versions de cache (y compris 4cake-cache-v1)
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

// Stratégie : RÉSEAU D'ABORD. Le site va toujours chercher la dernière version en ligne.
// Le cache ne sert que de secours si la connexion est coupée (mode hors-ligne).
// C'est l'inverse de l'ancienne stratégie "cache d'abord", qui figeait les mises à jour.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
