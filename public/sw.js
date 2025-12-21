const CACHE_NAME = "dj-sets-v1"
const AUDIO_CACHE_NAME = "dj-sets-audio-v1"

const STATIC_ASSETS = ["/", "/manifest.json", "/icon-192.jpg", "/icon-512.jpg"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== AUDIO_CACHE_NAME)
          .map((name) => caches.delete(name)),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Handle audio files separately - cache them for offline playback
  if (url.pathname.startsWith("/api/audio") || event.request.url.includes("soundhelix")) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          return fetch(event.request).then((networkResponse) => {
            // Clone the response before caching
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone())
            }
            return networkResponse
          })
        })
      }),
    )
    return
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(event.request).then((networkResponse) => {
          // Cache successful responses for app shell
          if (networkResponse.ok && event.request.method === "GET") {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone())
            })
          }
          return networkResponse
        })
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.mode === "navigate") {
          return caches.match("/")
        }
      }),
  )
})
