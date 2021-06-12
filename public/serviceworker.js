// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
workbox.loadModule('workbox-strategies');

const CACHE = "taOnzeV1";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  console.log(event, workbox)
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp('.*\\.(?:js)'),
  new workbox.strategies.NetworkFirst(),
);
