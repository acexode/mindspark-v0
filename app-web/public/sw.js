const CACHE_NAME = "mindspark-v2";
const OFFLINE_URLS = ["/onboarding", "/home"];

const isLocalDev =
  self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1";

if (isLocalDev) {
  self.addEventListener("install", () => {
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .then(() => self.registration.unregister()),
    );
  });
} else {
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) => cache.addAll(OFFLINE_URLS))
        .then(() => self.skipWaiting()),
    );
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
        )
        .then(() => self.clients.claim()),
    );
  });

  self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (
              response.ok &&
              response.redirected === false &&
              event.request.url.startsWith(self.location.origin)
            ) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => cached);

        return cached ?? fetchPromise;
      }),
    );
  });

  self.addEventListener("sync", (event) => {
    if (event.tag === "sync-attempts") {
      event.waitUntil(
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => client.postMessage({ type: "SYNC_ATTEMPTS" }));
        }),
      );
    }
  });
}
