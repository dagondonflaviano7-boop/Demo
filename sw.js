const CACHE_NAME = 'tindapos-v1';

// Add all the local files your app needs to run offline
const urlsToCache = [
  '/',
  '/sari-sari-pos (1).html',
  '/firebase-config.js',
  '/cloudinary-config.js'
];

// Install the service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercept network requests and serve from cache first
self.addEventListener('fetch', event => {
  // Only cache local files, ignore external API calls (like Firebase or Cloudinary)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {}); // Catch block prevents errors if fully offline
        return response || fetchPromise;
      });
    })
  );
});

// Listen for the skip waiting message from the UI
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});