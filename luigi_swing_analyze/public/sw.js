const CACHE_NAME = 'golf-swing-v1';
const urlsToCache = [
  '/golf-swing-analyzer/',
  '/golf-swing-analyzer/index.html',
  '/golf-swing-analyzer/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
