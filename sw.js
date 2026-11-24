const V = "glaqlink-v60";
const ASSETS = ["./", "index.html", "suporte.html", "favicon.ico", "favicon-32.png", "apple-touch-icon.png", "icon-192.png", "logo.png", "caixa-tx.jpg", "casa-bomba.jpg",
  "fazenda-aerea.jpg", "seca.jpg", "produtor-modulos.jpg", "modulo-rx.webp", "modulo-tx.webp", "placa-tx.png", "placa-rx.png", "quadro-rx.jpg", "bebedouro-tx.jpg", "kit-aqlink.jpg", "campo-real.jpg", "por-dentro-tx-rx.jpg", "kit-tx-rx-boia.jpg", "politica-de-privacidade.html", "fonts/poppins-latin-400-normal.woff2", "fonts/poppins-latin-700-normal.woff2"];
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
  if (u.pathname.endsWith(".pdf")) return;
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
