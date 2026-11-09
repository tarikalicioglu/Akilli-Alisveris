// Basit çevrimdışı önbellek: önce ağ, olmazsa önbellek.
const C="akilli-alisveris-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","js/data.js","js/app.js","manifest.webmanifest","icons/icon-192.png"])));self.skipWaiting();});
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok&&!u.pathname.includes("/data/")){ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); } return r; }).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
