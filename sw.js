// simple service worker: cache app shell & external libs
const CACHE_NAME = 'rental-app-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/index.html?utm=homescreen',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS.map(u => new Request(u, {mode: 'no-cors'}))).catch(()=>{}))
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      return caches.open(CACHE_NAME).then(cache => { try{ cache.put(req, resp.clone()); }catch(e){} return resp; });
    }).catch(()=>cached))
  );
});
