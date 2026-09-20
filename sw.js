// ===== AI Directories Service Worker =====
const CACHE_NAME = 'ai-directories-v20';

// Observability: log unexpected failures without changing behavior.
// Expected paths (offline fallbacks, skipped background refreshes while
// offline) stay quiet — see the fetch handler below.
self.addEventListener('error', function(event) {
  console.error('[SW] Error:', event.message || event);
});
self.addEventListener('unhandledrejection', function(event) {
  console.error('[SW] Unhandled rejection:', event.reason);
});
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/components.js',
  '/tool-registry.js',
  '/command-palette.js',
  '/guides-data.js',
  '/tool-page-shared.css',
  '/manifest.json',
  '/favicon.svg',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/terms.html',
  '/ai-registry.js',
  '/ai-tools/',
  '/ai-tools/ai-code/',
  '/ai-tools/chatgpt/',
  '/developer-tools/',
  '/guides.html',
  '/guide.css',
  '/json-vs-yaml.html',
  '/how-base64-encoding-works.html',
  '/regex-testing-guide.html',
  '/best-free-ai-image-generators.html',
  '/404.html',
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
  '/text-diff-checker.html',
  '/json-to-yaml.html',
  '/jwt-decoder.html',
  '/xml-formatter.html',
  '/url-parser.html',
  '/html-entity-converter.html',
  '/image-to-base64.html'
];

// Install: pre-cache all static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    }).catch(function(err) {
      // Install still fails (unchanged behavior) — but the log now names the
      // failing entry instead of an anonymous unhandled rejection.
      console.error('[SW] Precache failed — service worker not installed:', err);
      throw err;
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
    }).catch(function(err) {
      // Old-cache cleanup is best-effort; never block activation on it.
      console.warn('[SW] Old cache cleanup failed:', err);
    })
  );
  self.clients.claim();
});

// Fetch: network-first for page navigations (fresh content when online, cache as
// offline fallback), cache-first with background revalidate for static assets.
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // API routes (e.g. /api/feedback) must always hit the network — never cached, never served from cache
  if (url.pathname.indexOf('/api/') === 0) {
    return;
  }

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Navigations: always try the network first so users never see stale pages
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); }).catch(function(err) {
            console.warn('[SW] Navigation cache update failed:', err);
          });
        }
        return response;
      }).catch(function() {
        // Expected offline fallback — deliberately silent.
        return caches.match(event.request).then(function(cached) {
          return cached || caches.match('/index.html');
        });
      })
    );
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
            }).catch(function(err) {
              console.warn('[SW] Cache update failed:', err);
            });
          }
        }).catch(function(err) {
          // Expected while offline (the cached response is already in use).
          // Debug-level so normal consoles stay clean; visible when debugging.
          console.debug('[SW] Background refresh skipped:', err && err.message);
        });
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
        }).catch(function(err) {
          console.warn('[SW] Cache update failed:', err);
        });
        return response;
      }).catch(function() {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        // Non-navigation cache miss while offline: fail the request cleanly.
        // Returning a real Response avoids a SW-internal TypeError from an
        // undefined respondWith value.
        return Response.error();
      });
    })
  );
});
