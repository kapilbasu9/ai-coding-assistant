const CACHE_NAME = "ai-coding-assistant-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json"];

// Install event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Activate event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName =>
          cacheName !== CACHE_NAME ? caches.delete(cacheName) : null
        )
      )
    )
  );
});
