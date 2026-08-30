// ===== ToolBox Pro Service Worker =====
const CACHE_NAME = 'toolboxpro-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/components.js',
  '/manifest.json',
  '/favicon.svg',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/json-formatter.html',
  '/word-counter.html',
  '/password-generator.html',
  '/color-picker.html',
  '/base64-encoder-decoder.html',
  '/url-encoder-decoder.html',
  '/lorem-ipsum-generator.html',
  '/qr-code-generator.html',
  '/hash-generator.html',
  '/text-case-converter.html',
  '/uuid-generator.html',
  '/json-to-csv.html',
  '/regex-tester.html',
  '/markdown-preview.html',
  '/css-minifier.html',
  '/timestamp-converter.html',
  '/ip-lookup.html',
  '/random-number-generator.html',
  '/html-to-text.html',
  '/text-diff-checker.html'
];

// Install: pre-cache all static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for same-origin, network-first for external
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) {
        // Return cached, but also update cache in background
        fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, response);
            });
          }
        }).catch(function() {});
        return cached;
      }

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200) {
          // Return offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return response;
        }

        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(function() {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
