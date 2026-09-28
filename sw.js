const V = "glaqlink-v33";
const ASSETS = ["./", "index.html", "favicon.svg", "amanhecer.jpg", "capa-produtor.jpg", "fazenda-aerea.jpg",
  "fundo-desfocado.jpg", "lavoura.jpg", "modulo-rx.webp", "modulo-tx.webp", "painel-solar.jpg",
  "produtor-modulos.jpg", "seca.jpg", "torre-metalica.jpg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== V).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  if (r.mode === "navigate" || u.pathname.endsWith("/") || u.pathname.endsWith(".html")) {
    e.respondWith(fetch(r).then(res => {
      const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res;
    }).catch(() => caches.match(r).then(m => m || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
    return res;
  })));
});
