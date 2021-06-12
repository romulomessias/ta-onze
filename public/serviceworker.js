importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js"
);

const CACHE = "taOnzeV1";
const offlineFallbackPage = "'/offline'";

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("install", async (event) => {
    s;
    event.waitUntil(
        self.caches.open(CACHE).then((cache) => {
            console.log(offlineFallbackPage);
            return cache.addAll([]);
        })
    );
});

if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
    new RegExp(".*\\.(?:js)"),
    new workbox.strategies.NetworkFirst()
);
