const CACHE_NAME = 'notes-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add paths to your main CSS, JS, and image assets here
  // For a Vite project, these might be in the /assets folder after build
  // For simplicity, we'll start with basic caching
  '/src/main.jsx', // Or the built JS file path
  '/src/index.css', // Or the built CSS file path
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event: cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
