// Service Worker de Calistenia Pro: cachea el "shell" de la app para que
// funcione sin conexión una vez instalada/visitada al menos una vez.
// Estrategia "stale-while-revalidate": responde con lo que haya en caché
// al instante (funciona offline), y en paralelo pide la versión de red para
// dejarla lista la próxima vez. Si algún día cambia mucho el contenido y
// hace falta forzar que todos bajen la versión nueva, alcanza con subir el
// número de CACHE_NAME de más abajo.
const CACHE_NAME = 'calistenia-pro-v1';
const APP_SHELL = [
  '/', '/index.html', '/app.js', '/config.js', '/manifest.json',
  '/icon.svg', '/icon-192.png', '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Solo GET del mismo origen; todo lo demás (APIs externas, POST, etc.)
  // pasa directo a la red sin intervención.
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match('/index.html'));
      return cached || network;
    })
  );
});
