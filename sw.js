const CACHE_NAME = '4cake-cache-v5';
const MAX_CACHE_ENTRIES = 80; // évite une croissance illimitée du cache

const CORE_ASSETS = [
  './',
  './manifest.json',
  './LOGO_MARQUE.png',
  './slcm_logo.jpg',
  './feuilletine_box.png',
  './topping_caramel.png',
  './topping_chocolat.png',
  './topping_fraise.png',
  './pate_sucre.png',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

// Pages stratégiques : les seules pages HTML mises en cache pour un accès hors-ligne.
// Le reste du site (679 pages recette, fiches produit, etc.) n'est volontairement PAS
// mis en cache automatiquement au clic — ça évite une croissance illimitée du cache
// au fil de la navigation, qui était le problème de la version précédente de ce fichier.
const STRATEGIC_PAGES = [
  '/fr/', '/ar/',
  '/fr/devis', '/ar/devis',
  '/fr/conseils', '/ar/conseils'
];

// Extensions d'assets statiques : sûres à mettre en cache automatiquement (CSS/JS/polices/images).
const CACHEABLE_EXT = /\.(css|js|png|jpe?g|webp|svg|ico|woff2?|ttf)$/i;

function isCacheable(url){
  const path = new URL(url).pathname;
  if (STRATEGIC_PAGES.includes(path)) return true;
  if (CACHEABLE_EXT.test(path)) return true;
  return false;
}

// Limite la taille du cache : supprime les entrées les plus anciennes au-delà du seuil.
// L'ordre d'itération de cache.keys() correspond à l'ordre d'ajout (FIFO), donc les
// premières entrées de la liste sont les plus anciennes.
async function trimCache(){
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  if (keys.length <= MAX_CACHE_ENTRIES) return;
  const excess = keys.length - MAX_CACHE_ENTRIES;
  for (let i = 0; i < excess; i++){
    await cache.delete(keys[i]);
  }
}

// Installation : met en cache les fichiers essentiels du site (pour le mode hors-ligne)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch((err) => console.warn('Mise en cache initiale partielle :', err))
  );
  self.skipWaiting();
});

// Activation : nettoie TOUTES les anciennes versions de cache
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
// Le cache ne sert que de secours si la connexion est coupée (mode hors-ligne), et seulement
// pour les assets statiques et les pages stratégiques (voir isCacheable ci-dessus) — pas pour
// chaque page visitée, contrairement à la version précédente de ce fichier.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200
            && event.request.url.startsWith(self.location.origin)
            && isCacheable(event.request.url)) {
          const clone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone))
            .then(() => trimCache())
            .catch(() => { /* le cache ne doit jamais casser la navigation */ });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
