"use strict";
// ================== SABİTLER ==================
const CATS = {
  corba:["Çorbalar","🥣"], etli:["Etli Yemekler","🍖"], tavuk:["Tavuk","🍗"], kebap:["Kebap & Izgara","🍢"],
  kofte:["Köfteler","🧆"], zeytinyagli:["Zeytinyağlılar","🫒"], dolma:["Dolma & Sarma","🫑"], sebze:["Sebze (Etsiz)","🥕"],
  bakliyat:["Bakliyat (Sulu)","🫘"], pilav:["Pilavlar","🍚"], makarna:["Makarna & Mantı","🍝"], hamur:["Hamur İşi & Börek","🥟"],
  balik:["Balık & Deniz","🐟"], meze:["Mezeler","🥗"], salata:["Salatalar","🥬"], kahvalti:["Kahvaltılık","🍳"], tatli:["Tatlılar","🍮"]
};
const CUIS = {tr:"Türk", de:"Alman", eu:"Avrupa", my:"Benim"};
const FILTERS = [["e","Etli"],["v","Etsiz"],["z","Zeytinyağlı"],["s","Sulu"]];
const TAGN = {e:"Etli",v:"Etsiz",z:"Zeytinyağlı",s:"Sulu",d:"Domuz"};
const DAYS = ["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"];
const DSHORT = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
const DEFAULT_MARKETS = ["Aldi","Lidl","Kaufland","Netto","Penny"];
const MCOL = {Aldi:"#00005F",Lidl:"#0050AA",Kaufland:"#E10915",Netto:"#FFD400",Penny:"#CD1414",Rewe:"#CC071E",Edeka:"#1C4E9C",Norma:"#E30613"};
const PRICE_DATE = "Kasım 2026";
const LS_KEY = "haftalik_mutfak_v1";
const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFWK = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ================== DURUM ==================
function freshState(){
  return {v:1, savedAt:0, persons:4, hidePork:false, plan:[], checked:{}, haveOv:{}, extras:[], customR:[], customIng:{}, priceOv:{},
    markets:{}, marketList:DEFAULT_MARKETS.slice(), listMode:"qty", lastTab:"yemek", zip:"", feedAt:""};
}
let S = freshState();
let lsOK = true;
function loadLocal(){
  try{ const raw = localStorage.getItem(LS_KEY); if(raw){ S = Object.assign(freshState(), JSON.parse(raw)); return true; } }
  catch(e){ lsOK = false; }
  return false;
}
let saveTimer=null;
function save(){
  S.savedAt = Date.now();
  try{ localStorage.setItem(LS_KEY, JSON.stringify(S)); }catch(e){ lsOK=false; }
  updateBadges();
}

// ---- GitHub deposu (otomatik teklifler) ----
const REPO = (()=>{ const h=location.hostname, seg=location.pathname.split("/").filter(Boolean);
  if(h.endsWith(".github.io")) return {owner:h.split(".")[0], repo:seg[0]||"Akilli-Alisveris"};
  return {owner:"tarikalicioglu", repo:"Akilli-Alisveris"}; })();
const GH_LS="hm_github_token";
function lsGet(k){ try{ return localStorage.getItem(k)||""; }catch(e){ return ""; } }
function lsSet(k,v){ try{ v?localStorage.setItem(k,v):localStorage.removeItem(k); }catch(e){} }
let feed=null, feedErr="";
async function loadFeed(){
  try{ const r=await fetch("data/offers.json?t="+Date.now(),{cache:"no-store"}); if(!r.ok) throw new Error(r.status); feed=await r.json(); feedErr=""; }
  catch(e){ feed=null; feedErr="Otomatik teklif dosyası okunamadı"; }
  return feed;
}
function applyFeed(f, silent){
  if(!f||!f.markets) return 0; let n=0;
  for(const [m,d] of Object.entries(f.markets)){
    if(!d.offers||!d.offers.length) continue;
    const prev=S.markets[m];
    if(prev && prev.own) continue; // kendi marketin: dokunma
    if(prev && !prev.auto && prev.added > new Date(f.updatedAt).getTime()) continue; // elle yüklenen daha yeni
    S.markets[m]={offers:d.offers, validText:d.validText||"", validTo:d.validTo||"", added:new Date(f.updatedAt).getTime(), auto:true};
    if(!S.marketList.includes(m)) S.marketList.push(m); n+=d.offers.length;
  }
  S.feedAt=f.updatedAt; save(); if(!silent) toast(n?`${n} güncel teklif yüklendi ✓`:"Dosyada teklif yok");
  return n;
}
let dispatchState=null;
async function dispatchUpdate(){
  const tok=lsGet(GH_LS); if(!tok){ toast("Önce Ayarlar'a GitHub anahtarı gir"); setTab("ayar"); return; }
  if(!S.zip){ toast("Önce Ayarlar'dan posta kodunu gir"); setTab("ayar"); return; }
  dispatchState={msg:"GitHub'a istek gönderiliyor…"}; render();
  try{
    const r=await fetch(`https://api.github.com/repos/${REPO.owner}/${REPO.repo}/actions/workflows/update-offers.yml/dispatches`,{method:"POST",headers:{"Authorization":"Bearer "+tok,"Accept":"application/vnd.github+json","Content-Type":"application/json"},body:JSON.stringify({ref:"main",inputs:{zip:String(S.zip)}})});
    if(r.status!==204){ throw new Error(r.status===401||r.status===403?"GitHub anahtarı geçersiz veya yetkisi yok":"GitHub hatası "+r.status); }
    const before=feed&&feed.updatedAt; const t0=Date.now();
    while(Date.now()-t0<12*60*1000){
      dispatchState={msg:`Teklifler çekiliyor… (${Math.round((Date.now()-t0)/1000)} sn, genelde 3-6 dk sürer)`}; if(curTab==="market") render();
      await new Promise(r=>setTimeout(r,20000));
      const f=await loadFeed(); if(f && f.updatedAt && f.updatedAt!==before){ dispatchState=null; applyFeed(f); render(); return; }
    }
    throw new Error("Zaman aşımı. GitHub'da Actions sekmesine bak.");
  }catch(e){ dispatchState=null; render(); toast(e.message||"Hata",4000); }
}

// ================== VERİ YARDIMCILARI ==================
function ING(k){
  const b = ING_BASE[k] || S.customIng[k];
  if(!b) return null;
  const o = S.priceOv[k];
  return {key:k, tr:b[0], de:b[1], aisle:b[2]||"diger", unit:b[3]||"ad", packQty:o?o[0]:b[4], packPrice:o?o[1]:b[5], pantry:!!b[6], hint:b[7]||"", custom:!ING_BASE[k], ov:!!o};
}
function parseIngs(str){
  return str.split(",").map(p=>p.trim()).filter(Boolean).map(p=>{const i=p.lastIndexOf(" "); return [p.slice(0,i).trim(), parseFloat(p.slice(i+1))];});
}
const RCACHE = new Map();
function isVarList(x){ return Array.isArray(x) && x.length && Array.isArray(x[0]) && typeof x[0][0]==="string" && (typeof x[0][1]==="string" || Array.isArray(x[0][1])); }
function normRecipe(r){
  const vars = isVarList(r.ings) ? r.ings.map(v=>({name:v[0], ings:typeof v[1]==="string"?parseIngs(v[1]):v[1], note:v[2]||"", tags:(v[3]||"").split(" ").filter(Boolean)}))
    : [{name:"", ings:typeof r.ings==="string"?parseIngs(r.ings):r.ings, note:r.note||"", tags:[]}];
  const base = (r.tags||"").split(" ").filter(Boolean);
  const all = new Set(base); vars.forEach(v=>v.tags.forEach(t=>all.add(t)));
  return Object.assign({}, r, {vars, baseTags:base, allTags:[...all]});
}
function allRecipes(){
  const out=[];
  for(const r of RECIPES){ if(!RCACHE.has(r.id)) RCACHE.set(r.id, normRecipe(r)); out.push(RCACHE.get(r.id)); }
  for(const r of S.customR){ out.push(normRecipe(r)); }
  return out;
}
function getR(id){
  if(RCACHE.has(id)) return RCACHE.get(id);
  const b = RECIPES.find(r=>r.id===id); if(b){ const n=normRecipe(b); RCACHE.set(id,n); return n; }
  const c = S.customR.find(r=>r.id===id); return c?normRecipe(c):null;
}
function varTags(r,vi){ const v=r.vars[vi]||r.vars[0]; const t=new Set(r.baseTags); v.tags.forEach(x=>t.add(x)); if(t.has("v")) t.delete("e"); return [...t]; }
function isPorkVar(r,vi){ return varTags(r,vi).includes("d"); }
function visibleVarIdx(r){ return r.vars.map((v,i)=>i).filter(i=>!(S.hidePork && isPorkVar(r,i))); }
function norm(s){ return (s||"").toLocaleLowerCase("tr").replace(/ı/g,"i").replace(/i̇/g,"i").replace(/ş/g,"s").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[âáà]/g,"a").replace(/ä/g,"a").replace(/[éèê]/g,"e").replace(/ß/g,"ss").replace(/[îí]/g,"i").replace(/û/g,"u"); }
function esc(s){ return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function uid(){ return Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3); }
function eur(n){ return (Math.round(n*100)/100).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"; }
function fmtNum(n){ return (Math.round(n*10)/10).toLocaleString("tr-TR"); }
function fmtQty(q,unit){
  if(unit==="g"){ return q>=1000 ? fmtNum(q/1000)+" kg" : Math.round(q/10)*10+" g"; }
  if(unit==="ml"){ return q>=1000 ? fmtNum(q/1000)+" l" : Math.round(q/10)*10+" ml"; }
  if(unit==="ad"||unit==="demet"||unit==="paket"||unit==="diş"){ const c=Math.ceil(q-0.05); return c+" "+UNITS[unit]; }
  return fmtNum(q)+" "+(UNITS[unit]||unit);
}
function catEmoji(c){ return (CATS[c]||["","🍽️"])[1]; }
function tagHtml(tags){ return tags.filter(t=>TAGN[t]).map(t=>`<span class="tag t-${t}">${TAGN[t]}</span>`).join(""); }

// ================== UI ALTYAPI ==================
const $ = s=>document.querySelector(s);
let curTab = "yemek";
let ui = {cu:"tr", cat:"all", f:new Set(), q:""};
function toast(m,ms=2200){ const t=$("#toast"); t.textContent=m; t.classList.add("on"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("on"),ms); }
function openSheet(html){ $("#sheetBody").innerHTML=html; $("#sheet").classList.add("on"); $("#scrim").classList.add("on"); $("#sheet").scrollTop=0; }
function closeSheet(){ $("#sheet").classList.remove("on"); $("#scrim").classList.remove("on"); }
$("#scrim").onclick = closeSheet;
function ask(msg, okTxt="Evet", cancelTxt="Vazgeç"){
  return new Promise(res=>{
    $("#modalBody").innerHTML = `<div style="font-weight:700;margin-bottom:14px">${msg}</div><div class="row"><button class="btn sec grow" id="mNo">${cancelTxt}</button><button class="btn grow" id="mYes">${okTxt}</button></div>`;
    $("#modal").classList.add("on");
    $("#mNo").onclick=()=>{ $("#modal").classList.remove("on"); res(false); };
    $("#mYes").onclick=()=>{ $("#modal").classList.remove("on"); res(true); };
  });
}
function copyText(txt){
  const done=()=>toast("Kopyalandı ✓");
  try{ navigator.clipboard.writeText(txt).then(done, ()=>fallback()); }catch(e){ fallback(); }
  function fallback(){ const ta=document.createElement("textarea"); ta.value=txt; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy"); done();}catch(e){ toast("Kopyalanamadı"); } ta.remove(); }
}
function setTab(t){ curTab=t; S.lastTab=t; document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on", b.dataset.tab===t)); render(); window.scrollTo(0,0); try{localStorage.setItem(LS_KEY, JSON.stringify(S));}catch(e){} }
$("#tabs").onclick = e=>{ const b=e.target.closest("button"); if(b) setTab(b.dataset.tab); };
$("#personsPill").onclick = ()=>{
  openSheet(`<h1>Varsayılan kişi sayısı</h1><p class="muted small">Yeni eklediğin yemekler bu kişi sayısıyla eklenir. Her yemeğin kişi sayısını ayrıca değiştirebilirsin.</p>
  <div class="row" style="justify-content:center;margin:16px 0"><div class="stepper"><button data-act="pp" data-d="-1">−</button><span id="ppv">${S.persons} kişi</span><button data-act="pp" data-d="1">+</button></div></div>
  <button class="btn full sec" data-act="ppall">Haftadaki tüm yemekleri ${S.persons} kişiye ayarla</button>`);
};
function updateBadges(){
  $("#personsTxt").textContent = S.persons;
  const n=S.plan.length; const b=$("#bPlan"); b.textContent=n; b.classList.toggle("hidden", !n);
  const items = buildList().filter(i=>!isHave(i.key) && !S.checked[i.key]).length; const bl=$("#bList"); bl.textContent=items; bl.classList.toggle("hidden", !items);
}
function render(){
  const v=$("#view");
  if(curTab==="yemek") v.innerHTML = viewYemek();
  else if(curTab==="hafta") v.innerHTML = viewHafta();
  else if(curTab==="liste") v.innerHTML = viewListe();
  else if(curTab==="market") v.innerHTML = viewMarket();
  else v.innerHTML = viewAyar();
  updateBadges();
}

// ================== YEMEKLER ==================
function inPlanCount(id){ return S.plan.filter(p=>p.rid===id).length; }
function searchRecipes(q){
  const nq=norm(q).trim(); if(!nq) return [];
  const words=nq.split(/\s+/);
  const res=[];
  for(const r of allRecipes()){
    if(!visibleVarIdx(r).length) continue;
    const nm=norm(r.name), meta=norm((r.region||"")+" "+r.vars.map(v=>v.name).join(" ")+" "+(CATS[r.cat]||[""])[0]+" "+CUIS[r.cu]);
    const ingn=norm(r.vars[0].ings.map(([k])=>{const i=ING(k);return i?i.tr+" "+i.de:""}).join(" "));
    let score=0, all=true;
    for(const w of words){
      if(nm.startsWith(w)) score+=5; else if(nm.includes(w)) score+=3; else if(meta.includes(w)) score+=2; else if(ingn.includes(w)) score+=1; else { all=false; break; }
    }
    if(all) res.push([score,r]);
  }
  return res.sort((a,b)=>b[0]-a[0]||a[1].name.localeCompare(b[1].name,"tr")).map(x=>x[1]);
}
function recipeCard(r){
  const n=inPlanCount(r.id);
  const vv=visibleVarIdx(r);
  const sub=[r.region, vv.length>1?`${vv.length} tarif/yöre`:""].filter(Boolean).join(" · ");
  return `<div class="rc" data-act="open" data-id="${esc(r.id)}" role="button">
    <div class="em">${catEmoji(r.cat)}</div>
    <div class="tx"><div class="nm">${esc(r.name)}</div>
      <div class="sub">${tagHtml(r.allTags.filter(t=>t!=="d"||!S.hidePork))}${vv.length>1?'<span class="tag t-var">Yöre seç</span>':''}${esc(sub)}</div></div>
    <button class="add ${n?'in':''}" data-act="open" data-id="${esc(r.id)}">${n?'✓'+(n>1?n:''):'+'}</button>
  </div>`;
}
function viewYemek(){
  return `<div class="search"><span>🔎</span><input id="q" type="search" enterkeyhint="search" placeholder="Yemek, yöre veya malzeme ara… (ör. karnıyarık, Antep)" value="${esc(ui.q)}" autocomplete="off"><button class="btn ghost sm ${ui.q?'':'hidden'}" id="clrq" data-act="clrq">✕</button></div><div id="yres">${yemekBody()}</div>`;
}
function yemekBody(){
  let h="";
  if(ui.q.trim()){
    const res=searchRecipes(ui.q);
    h += `<h3>${res.length} sonuç</h3><div class="list">${res.slice(0,80).map(recipeCard).join("")}</div>`;
    h += `<div class="card" style="margin-top:12px"><div class="row"><div class="grow"><b>Aradığın yemek yok mu?</b><div class="small muted">Kendi malzemelerinle ekle, “Benim” bölümüne kaydolsun.</div></div></div>
      <button class="btn full" style="margin-top:10px" data-act="manualRecipe">✍️ “${esc(ui.q)}” tarifini ekle</button></div>`;
    return h;
  }
  h += `<div class="seg">${Object.entries(CUIS).map(([k,v])=>`<button class="${ui.cu===k?'on':''}" data-act="cu" data-v="${k}">${k==="tr"?"🇹🇷 ":k==="de"?"🇩🇪 ":k==="eu"?"🇪🇺 ":"⭐ "}${v}</button>`).join("")}</div>`;
  let rs = allRecipes().filter(r=>r.cu===ui.cu || (ui.cu==="my" && r.custom));
  if(ui.cu==="my") rs = allRecipes().filter(r=>r.custom);
  rs = rs.filter(r=>visibleVarIdx(r).length);
  const counts={}; rs.forEach(r=>counts[r.cat]=(counts[r.cat]||0)+1);
  if(ui.cu==="my"){
    h += `<div class="row" style="margin:4px 0 10px"><button class="btn grow" data-act="manualRecipe">✍️ Yeni tarif ekle</button></div>`;
    if(!rs.length) return h+`<div class="empty"><div class="big">📒</div>Henüz kendi tarifin yok.<br><span class="small">Annenin tarifini veya listede olmayan bir yemeği buraya ekleyebilirsin.</span></div>`;
  }
  if(ui.cu==="tr" && ui.cat==="all" && !ui.f.size){
    h += `<h2>Türk mutfağı · ${rs.length} yemek</h2><div class="catgrid">${Object.entries(CATS).filter(([k])=>counts[k]).map(([k,[n,e]])=>`<button class="cat" data-act="cat" data-v="${k}"><span class="e">${e}</span>${n}<small>${counts[k]} yemek</small></button>`).join("")}</div>`;
    h += `<div class="chips">${FILTERS.map(([k,n])=>`<button class="chip f" data-act="f" data-v="${k}">${n}</button>`).join("")}</div>`;
    const reg = rs.filter(r=>visibleVarIdx(r).length>1);
    h += `<h2>Yöreye göre değişenler</h2><div class="list">${reg.slice(0,12).map(recipeCard).join("")}</div>`;
    h += `<div class="row" style="margin-top:10px"><button class="btn sec full" data-act="cat" data-v="reg">Tümünü gör (${reg.length})</button></div>`;
    return h;
  }
  h += `<div class="chips"><button class="chip ${ui.cat==='all'?'on':''}" data-act="cat" data-v="all">Tümü <small>${rs.length}</small></button>${ui.cu==="tr"?`<button class="chip ${ui.cat==='reg'?'on':''}" data-act="cat" data-v="reg">📍 Yöresel</button>`:''}${Object.entries(CATS).filter(([k])=>counts[k]).map(([k,[n,e]])=>`<button class="chip ${ui.cat===k?'on':''}" data-act="cat" data-v="${k}">${e} ${n} <small>${counts[k]}</small></button>`).join("")}</div>`;
  h += `<div class="chips">${FILTERS.map(([k,n])=>`<button class="chip f ${ui.f.has(k)?'on':''}" data-act="f" data-v="${k}">${n}</button>`).join("")}</div>`;
  if(ui.cat==="reg") rs = rs.filter(r=>visibleVarIdx(r).length>1);
  else if(ui.cat!=="all") rs = rs.filter(r=>r.cat===ui.cat);
  if(ui.f.size) rs = rs.filter(r=>[...ui.f].every(f=>r.allTags.includes(f)));
  rs.sort((a,b)=>a.name.localeCompare(b.name,"tr"));
  if(!rs.length) return h+`<div class="empty"><div class="big">🤷</div>Bu filtrede yemek yok.</div>`;
  if(ui.cat==="all"){
    for(const [k,[n,e]] of Object.entries(CATS)){ const g=rs.filter(r=>r.cat===k); if(g.length) h+=`<h3>${e} ${n}</h3><div class="list">${g.map(recipeCard).join("")}</div>`; }
  } else h += `<div class="list" style="margin-top:4px">${rs.map(recipeCard).join("")}</div>`;
  return h;
}
// ---- Tarif detay sayfası ----
let sheetCtx=null;
function openRecipe(id, planUid){
  const r=getR(id); if(!r) return;
  const pe = planUid ? S.plan.find(p=>p.uid===planUid) : null;
  const vv = visibleVarIdx(r);
  sheetCtx = {id, planUid, vi: pe ? pe.vi : (vv.length===1? vv[0] : -1), servings: pe?pe.servings:S.persons, day: pe?pe.day:-1};
  renderRecipeSheet();
}
function renderRecipeSheet(){
  const c=sheetCtx, r=getR(c.id); const vv=visibleVarIdx(r);
  const v = c.vi>=0 ? r.vars[c.vi] : null;
  let h = `<div class="row"><div class="grow"><h1>${catEmoji(r.cat)} ${esc(r.name)}</h1><div class="muted small">${esc([CUIS[r.cu],(CATS[r.cat]||[""])[0],r.region].filter(Boolean).join(" · "))}</div></div>
    ${r.custom?`<button class="iconbtn" data-act="delCustom" data-id="${esc(r.id)}" title="Tarifi sil">🗑️</button>`:''}</div>
    <div style="margin:6px 0">${tagHtml(v?varTags(r,c.vi):r.baseTags)}</div>`;
  if(vv.length>1){
    h += `<label class="lb">📍 Yöre / tarif seç ${c.vi<0?'<span class="warnb">seçilmedi</span>':''}</label>`;
    h += vv.map(i=>{const x=r.vars[i]; return `<button class="vopt ${c.vi===i?'on':''}" data-act="vsel" data-i="${i}"><span class="rd"></span><span><b>${esc(x.name)}</b>${x.note?`<div class="small muted">${esc(x.note)}</div>`:''}<div class="small muted">${x.ings.length} malzeme ${tagHtml(varTags(r,i))}</div></span></button>`}).join("");
  }
  if(v && v.note && vv.length<=1) h+=`<div class="note">${esc(v.note)}</div>`;
  h += `<div class="row" style="margin:14px 0 6px"><b class="grow">Kaç kişilik?</b><div class="stepper"><button data-act="sv" data-d="-1">−</button><span>${c.servings} kişi</span><button data-act="sv" data-d="1">+</button></div></div>`;
  if(v){
    const f=c.servings/4;
    h += `<label class="lb">🧺 Malzemeler (${c.servings} kişilik)</label><div class="ings">${v.ings.map(([k,q])=>{const i=ING(k); return i?`<div class="ing"><span>${esc(i.tr)}${i.pantry?' <span class="small muted">(kiler)</span>':''}</span><b>${fmtQty(q*f,i.unit)}</b></div>`:''}).join("")}</div>`;
  } else h += `<div class="note">Bu yemeğin malzemeleri yöreye göre değişiyor. Doğru alışveriş listesi için yukarıdan bir tarif seç.</div>`;
  h += `<label class="lb">📅 Hangi gün? (isteğe bağlı)</label><div class="days"><button class="chip ${c.day===-1?'on':''}" data-act="dsel" data-d="-1">Fark etmez</button>${DSHORT.map((d,i)=>`<button class="chip ${c.day===i?'on':''}" data-act="dsel" data-d="${i}">${d}</button>`).join("")}</div>`;
  h += `<div class="row" style="margin-top:16px">${c.planUid?`<button class="btn sec" data-act="rmPlan" data-uid="${c.planUid}">Çıkar</button>`:''}<button class="btn grow" data-act="savePlan" ${c.vi<0?'disabled':''}>${c.planUid?'Güncelle':'Haftama ekle'}</button></div>`;
  if(c.vi<0) h+=`<div class="small muted" style="text-align:center;margin-top:6px">Eklemek için önce yöre/tarif seç</div>`;
  openSheet(h);
}

// ================== HAFTAM ==================
function viewHafta(){
  let h = `<div class="row" style="margin:4px 0 8px"><h2 class="grow" style="margin:6px 2px">Bu haftanın menüsü</h2>${S.plan.length?`<button class="btn ghost sm" data-act="clearPlan">Temizle</button>`:''}</div>`;
  h += `<div class="card"><b>📝 Listeni yazarak ekle</b><div class="small muted" style="margin:2px 0 8px">Ör: “Pazartesi mercimek çorbası ve karnıyarık, salı etli kuru fasulye pilav, çarşamba Antep usulü lahmacun, cuma 6 kişilik mantı”</div>
    <textarea id="planText" rows="3" placeholder="Bu hafta yapacağın yemekleri yaz…"></textarea>
    <button class="btn full" style="margin-top:8px" data-act="localPlan">📅 Menüye ekle</button></div>`;
  if(!S.plan.length) return h+`<div class="empty"><div class="big">📅</div>Menün boş.<br><span class="small">“Yemekler” sekmesinden seç veya yukarıya yaz.</span><br><br><button class="btn" data-tab-go="yemek">Yemeklere göz at</button></div>`;
  const need = S.plan.filter(p=>p.needsVariant).length;
  if(need) h += `<div class="note">⚠️ ${need} yemekte yöre/tarif seçilmedi. Alışveriş listesi şu an varsayılan tarife göre çıkıyor. Yemeğe dokunup seçebilirsin.</div>`;
  const groups=[...DAYS.map((d,i)=>[i,d]),[-1,"Gün belirtilmemiş"]];
  for(const [di,dn] of groups){
    const es=S.plan.filter(p=>p.day===di); if(!es.length) continue;
    h += `<h3>${dn}</h3><div class="day">`;
    for(const p of es){
      const r=getR(p.rid); if(!r){ h+=`<div class="pe"><div class="tx">Silinmiş tarif</div><button class="iconbtn" data-act="rmPlan" data-uid="${p.uid}">✕</button></div>`; continue; }
      const v=r.vars[p.vi]||r.vars[0];
      h += `<div class="pe"><div class="tx" data-act="openPlan" data-uid="${p.uid}" role="button"><div class="nm">${catEmoji(r.cat)} ${esc(r.name)}</div>
        <div class="sub">${v.name?esc(v.name):esc(r.region||"")} ${p.needsVariant?'<span class="warnb">yöre seç</span>':''}</div></div>
        <div class="stepper"><button data-act="ps" data-uid="${p.uid}" data-d="-1">−</button><span>${p.servings} 👤</span><button data-act="ps" data-uid="${p.uid}" data-d="1">+</button></div>
        <button class="iconbtn" data-act="rmPlan" data-uid="${p.uid}">✕</button></div>`;
    }
    h += `</div>`;
  }
  h += `<button class="btn full" style="margin-top:10px" data-tab-go="liste">🛒 Alışveriş listesini gör</button>`;
  return h;
}

// ================== LİSTE ==================
function isHave(k){ if(k in S.haveOv) return S.haveOv[k]; const i=ING(k); return i?i.pantry:false; }
function buildList(){
  const m=new Map();
  for(const p of S.plan){
    const r=getR(p.rid); if(!r) continue; const v=r.vars[p.vi]||r.vars[0]; const f=p.servings/4;
    for(const [k,q] of v.ings){ if(!ING(k)) continue; if(!m.has(k)) m.set(k,{key:k,qty:0,dishes:new Set()}); const it=m.get(k); it.qty+=q*f; it.dishes.add(r.name); }
  }
  for(const x of S.extras){ const k=x.key; if(!ING(k)) continue; if(!m.has(k)) m.set(k,{key:k,qty:0,dishes:new Set()}); const it=m.get(k); it.qty+=x.qty||0; it.dishes.add("Ekstra"); it.extra=true; }
  return [...m.values()];
}
function viewListe(){
  const items=buildList();
  let h=`<div class="seg"><button class="${S.listMode==='qty'?'on':''}" data-act="lm" data-v="qty">⚖️ Miktarlı</button><button class="${S.listMode==='plain'?'on':''}" data-act="lm" data-v="plain">📋 Sadece liste</button></div>`;
  const need = S.plan.filter(p=>p.needsVariant).length;
  if(need) h+=`<div class="note">⚠️ ${need} yemekte yöre/tarif seçilmedi. <a href="#" data-tab-go="hafta">Haftam</a> sekmesinden seç.</div>`;
  h += `<div class="row" style="margin:6px 0 10px"><input type="text" id="extraIn" placeholder="Ekstra ürün ekle (ör. ekmek, süt)…" list="ingdl"><button class="btn sm" data-act="addExtra">Ekle</button></div>
   <datalist id="ingdl">${Object.keys(ING_BASE).concat(Object.keys(S.customIng)).map(k=>`<option value="${esc(ING(k).tr)}">`).join("")}</datalist>`;
  if(!items.length) return h+`<div class="empty"><div class="big">🛒</div>Liste boş. Önce menüne yemek ekle.<br><br><button class="btn" data-tab-go="yemek">Yemek seç</button></div>`;
  const buy=items.filter(i=>!isHave(i.key)), have=items.filter(i=>isHave(i.key));
  const left=buy.filter(i=>!S.checked[i.key]).length;
  const avgT=buy.reduce((t,i)=>t+avgCost(i.key,i.qty),0);
  const bestT=buy.reduce((t,i)=>t+cheapest(i).cost,0);
  const hasOffers=S.marketList.some(m=>S.markets[m]&&S.markets[m].offers.length);
  h += `<div class="card" style="display:flex;align-items:center;gap:10px"><div class="grow"><div class="small muted">Tahmini toplam (${PRICE_DATE} ort. fiyat)</div><div style="font-size:22px;font-weight:900">${eur(avgT)}</div>${hasOffers&&bestT<avgT-0.01?`<div class="small offer">Prospekt indirimleriyle: ${eur(bestT)}</div>`:''}</div><button class="btn sm" data-tab-go="market">${hasOffers?'📊 Market raporu':'🏪 Prospekt yükle'}</button></div>`;
  h += `<div class="row" style="margin-bottom:6px"><div class="grow small muted"><b style="color:var(--ink)">${left}</b> / ${buy.length} ürün alınacak · ${S.plan.length} yemek</div><button class="btn sec sm" data-act="copyList">📋 Kopyala</button>${Object.keys(S.checked).length?'<button class="btn ghost sm" data-act="uncheck">Sıfırla</button>':''}</div>`;
  const byA={}; buy.forEach(i=>{const a=ING(i.key).aisle; (byA[a]=byA[a]||[]).push(i);});
  for(const a of Object.keys(AISLES)){
    const g=byA[a]; if(!g) continue;
    g.sort((x,y)=>(!!S.checked[x.key])-(!!S.checked[y.key]) || ING(x.key).tr.localeCompare(ING(y.key).tr,"tr"));
    h+=`<div class="aisle"><h3>${AISLES[a]}</h3><div class="box">${g.map(i=>listItem(i,false)).join("")}</div></div>`;
  }
  if(have.length){
    h+=`<div class="aisle"><h3>🏠 Evde var (listeden çıkarıldı)</h3><div class="small muted" style="margin:-2px 2px 6px">Baharat, tuz, yağ gibi ürünler varsayılan olarak burada. Bitti ise “Al” de.</div><div class="box">${have.map(i=>listItem(i,true)).join("")}</div></div>`;
  }
  return h;
}
function listItem(i,haveSec){
  const g=ING(i.key); const done=!!S.checked[i.key];
  let pr="";
  if(!haveSec && i.qty>0){ const c=cheapest(i); pr = c.m ? `<small class="offer">🏷️ ${esc(c.m)} ${eur(c.cost)}</small>` : `<small>≈ ${eur(c.cost)}</small>`; }
  const q = S.listMode==="qty" ? `<div class="lq">${fmtQty(i.qty,g.unit)}${pr}</div>` : (pr?`<div class="lq">${pr}</div>`:"");
  const dishes=[...i.dishes].join(", ");
  return `<div class="li ${done&&!haveSec?'done':''}">${haveSec?'':`<div class="ck" data-act="ck" data-k="${esc(i.key)}">${done?'✓':''}</div>`}
    <div class="lt" ${haveSec?'':`data-act="ck" data-k="${esc(i.key)}"`}><div class="lnm">${esc(g.tr)}</div><div class="lde">${esc(g.de)}${S.listMode==="qty"?' · '+esc(dishes):''}</div></div>
    ${q}<button class="havebtn" data-act="have" data-k="${esc(i.key)}">${haveSec?'Al':'Evde var'}</button>${i.extra?`<button class="havebtn" data-act="rmExtra" data-k="${esc(i.key)}">✕</button>`:''}</div>`;
}
function listAsText(){
  const items=buildList().filter(i=>!isHave(i.key));
  const byA={}; items.forEach(i=>{const a=ING(i.key).aisle; (byA[a]=byA[a]||[]).push(i);});
  let t="🛒 Alışveriş listesi\n";
  for(const a of Object.keys(AISLES)){ const g=byA[a]; if(!g) continue; t+="\n"+AISLES[a].replace(/^\S+\s/,"")+"\n";
    for(const i of g){ const x=ING(i.key); t+=`${S.checked[i.key]?"☑":"☐"} ${x.tr}${S.listMode==="qty"?" – "+fmtQty(i.qty,x.unit):""} (≈ ${eur(cheapest(i).cost)})\n`; } }
  t+=`\nTahmini toplam: ${eur(items.reduce((a,i)=>a+cheapest(i).cost,0))}\n`;
  return t;
}

// ================== MARKETLER & RAPOR ==================
let busy = null; // {market, pct, msg}
function viewMarket(){
  let h=`<h2>🔄 Otomatik teklifler</h2><div class="card">
    <div class="small muted">Her sabah ${feed&&feed.zip?esc(feed.zip)+" posta kodu için":"posta koduna göre"} marketlerin güncel teklifleri otomatik çekilir.</div>
    <div style="margin:8px 0"><b>${feed&&feed.updatedAt?"Son güncelleme: "+new Date(feed.updatedAt).toLocaleString("tr-TR",{weekday:"short",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):(feedErr||"Henüz otomatik veri yok")}</b>${feed&&feed.zip?` · PLZ ${esc(feed.zip)}`:''}${feed&&feed.markets?`<div class="small muted">${Object.entries(feed.markets).map(([m,d])=>esc(m)+": "+(d.offers||[]).length).join(" · ")}</div>`:''}</div>
    ${dispatchState?`<div class="small"><span class="spin dark"></span> ${esc(dispatchState.msg)}</div>`:`<div class="row wrap"><button class="btn sm" data-act="feedLoad">📥 Güncel teklifleri al</button>${lsGet(GH_LS)?`<button class="btn sec sm" data-act="feedDispatch">🔄 Şimdi yeniden çek</button>`:`<a class="btn sec sm" style="text-decoration:none" href="https://github.com/${REPO.owner}/${REPO.repo}/actions/workflows/update-offers.yml" target="_blank" rel="noopener">🔄 Şimdi yeniden çek</a>`}</div>${lsGet(GH_LS)?'':`<div class="small muted" style="margin-top:6px">Açılan GitHub sayfasında <b>Run workflow</b> → yeşil <b>Run workflow</b>'a bas. 3-6 dk sonra burada “Güncel teklifleri al” de.`}</div>`}
  </div>`;
  const withOffers=S.marketList.filter(m=>S.markets[m]&&S.markets[m].offers.length&&!S.markets[m].own);
  const own=S.marketList.filter(m=>S.markets[m]&&S.markets[m].own);
  h+=`<h2>🏪 Kendi marketlerim</h2><div class="small muted" style="margin:-4px 2px 8px">Türk marketi, kasap, pazar… Oradan aldığın ürünlerin fiyatını bir kez gir; raporda o market de karşılaştırılır.</div>`;
  if(own.length){
    h+=`<div class="card" style="padding:4px 12px">`;
    for(const m of own){ const d=S.markets[m];
      h+=`<div class="mk" style="padding:8px 0;border-bottom:1px dashed var(--line)" data-act="ownOpen" data-m="${esc(m)}" role="button"><div class="mlogo" style="background:var(--olive);width:38px;height:38px">${esc(m.slice(0,4).toUpperCase())}</div>
        <div class="grow"><b>${esc(m)}</b><div class="small muted">${d.offers.length} ürün fiyatı girildi</div></div><span class="btn sec sm">Fiyatlar</span></div>`; }
    h+=`</div>`;
  }
  h+=`<button class="btn sec full" data-act="ownAdd" style="margin-bottom:6px">+ Market ekle</button>`;
  if(withOffers.length){
    h+=`<h2>Marketler</h2><div class="card" style="padding:4px 12px">`;
    for(const m of withOffers){ const d=S.markets[m]; const exp=d.validTo && new Date(d.validTo+"T23:59:59")<new Date(); const col=MCOL[m]||"#7A6B5D";
      h+=`<div class="mk" style="padding:8px 0;border-bottom:1px dashed var(--line)"><div class="mlogo" style="background:${col};${m==='Netto'?'color:#222':''};width:38px;height:38px">${esc(m.slice(0,4).toUpperCase())}</div>
        <div class="grow"><b>${esc(m)}</b><div class="small muted">${d.offers.length} indirimli ürün${d.validText?' · '+esc(d.validText):''} ${exp?'<span class="warnb">süresi geçmiş</span>':''}</div></div>
        <button class="iconbtn" data-act="viewOffers" data-m="${esc(m)}" title="Ürünleri gör">👁️</button></div>`; }
    h+=`</div><div class="small muted" style="margin:0 2px">Aldi'nin teklifleri bu kaynakta yok; Aldi ürünleri ortalama fiyattan hesaplanır.</div>`;
  }
  h+=`<h2 style="margin-top:22px">📊 Market karşılaştırma raporu</h2>`;
  h+=reportHtml();
  return h;
}
function avgCost(key,qty){ const g=ING(key); if(!g||!g.packQty) return 0; return Math.ceil(qty/g.packQty - 1e-9)*g.packPrice; }
function bestOffer(market,key,qty){
  const d=S.markets[market]; if(!d) return null; let best=null;
  const g=ING(key);
  for(const o of d.offers){
    let match = o.key===key;
    if(!match && g && g.custom){ const a=norm(g.tr), b=norm(o.n+" "+(o.tr||"")); match = a.length>3 && b.includes(a.split(" ")[0]); }
    if(!match || !(o.p>0) || !(o.qty>0)) continue;
    const packs=Math.ceil(qty/o.qty - 1e-9); const cost=packs*o.p;
    if(!best || cost<best.cost) best={o,packs,cost};
  }
  return best;
}
function cheapest(i){ let best={cost:avgCost(i.key,i.qty),m:null}; for(const m of S.marketList){ const b=bestOffer(m,i.key,i.qty); if(b&&b.cost<best.cost) best={cost:b.cost,m}; } return best; }
function computeReport(){
  const items=buildList().filter(i=>!isHave(i.key) && i.qty>0);
  const mks=S.marketList.filter(m=>S.markets[m] && S.markets[m].offers.length);
  const base=items.reduce((s,i)=>s+avgCost(i.key,i.qty),0);
  const rows=mks.map(m=>{
    let total=0, hits=0; const lines=items.map(i=>{ const b=bestOffer(m,i.key,i.qty); const a=avgCost(i.key,i.qty);
      if(b && (b.cost<=a || S.markets[m].own)){ hits++; total+=b.cost; return {i, offer:b, cost:b.cost, avg:a}; } total+=a; return {i, cost:a, avg:a}; });
    return {m,total,hits,lines};
  }).sort((a,b)=>a.total-b.total);
  // karma: her ürünü en ucuz yerden al
  let mixTotal=0; const mix=items.map(i=>{ let best={cost:avgCost(i.key,i.qty),m:null}; for(const m of mks){ const b=bestOffer(m,i.key,i.qty); if(b && b.cost<best.cost) best={cost:b.cost,m,offer:b}; } mixTotal+=best.cost; return {i,...best}; });
  return {items,mks,base,rows,mix,mixTotal};
}
function reportHtml(){
  const R=computeReport();
  if(!R.items.length) return `<div class="empty"><div class="big">📊</div>Rapor için önce menüne yemek ekle.</div>`;
  let h=`<div class="card"><div class="kv"><span>Alınacak ürün</span><b>${R.items.length}</b></div><div class="kv" style="border:0"><span>Ortalama fiyatlarla tahmini toplam<br><span class="small muted">(${PRICE_DATE} Almanya ortalaması)</span></span><b>${eur(R.base)}</b></div></div>`;
  if(!R.mks.length) return h+`<div class="note info">Market karşılaştırması için yukarıdan en az bir marketin prospektini yükle. Prospekti olmayan ürünler ortalama fiyattan hesaplanır.</div>`;
  const best=R.rows[0];
  h+=`<div class="note ok">🏆 En ucuz tek market: <b>${esc(best.m)}</b>, ${eur(best.total)} (${best.hits} ürün indirimde)${R.rows.length>1?`. Bu, en pahalı seçenekten ${eur(R.rows[R.rows.length-1].total-best.total)} daha ucuz.`:''}</div>`;
  for(const [ix,r] of R.rows.entries()){
    h+=`<details class="rep ${ix===0?'best':''}"><summary><div class="mlogo" style="background:${MCOL[r.m]||'#7A6B5D'};${r.m==='Netto'?'color:#222':''};width:38px;height:38px">${esc(r.m.slice(0,4).toUpperCase())}</div>
      <div class="grow"><b>${esc(r.m)}</b><div class="small muted">${r.hits}/${R.items.length} ürün prospektte · kalanı ortalama fiyat</div></div><div class="tot">${eur(r.total)}</div></summary>
      ${r.lines.map(l=>{const g=ING(l.i.key); return `<div class="rl"><div class="a"><b>${esc(g.tr)}</b> <span class="muted">${fmtQty(l.i.qty,g.unit)}</span><div class="small ${l.offer?'offer':'avg'}">${l.offer?`🏷️ ${esc(l.offer.o.n)}${l.offer.o.size?' ('+esc(l.offer.o.size)+')':''} × ${l.offer.packs} · ${eur(l.offer.o.p)}${l.offer.o.app?' · App fiyatı':''}`:`ort. fiyat: ${eur(g.packPrice)} / ${fmtQty(g.packQty,g.unit)}`}</div></div><div class="p">${eur(l.cost)}</div></div>`}).join("")}
    </details>`;
  }
  if(R.mks.length>1){
    const split=R.mix.filter(x=>x.m); const byM={}; split.forEach(x=>(byM[x.m]=byM[x.m]||[]).push(x));
    h+=`<details class="rep"><summary><div class="mlogo ai" style="width:38px;height:38px">MİX</div><div class="grow"><b>Karma plan</b><div class="small muted">Her indirimli ürünü en ucuz olduğu yerden al</div></div><div class="tot">${eur(R.mixTotal)}</div></summary>
      ${Object.entries(byM).map(([m,xs])=>`<div class="rl" style="background:#FBF6EF"><b>${esc(m)}'den al</b></div>`+xs.map(x=>{const g=ING(x.i.key);return `<div class="rl"><div class="a">${esc(g.tr)} <span class="muted">${fmtQty(x.i.qty,g.unit)}</span><div class="small offer">${esc(x.offer.o.n)} × ${x.offer.packs}</div></div><div class="p">${eur(x.cost)}</div></div>`}).join("")).join("")}
      <div class="rl" style="background:#FBF6EF"><b>Kalanlar (herhangi bir marketten)</b></div>${R.mix.filter(x=>!x.m).map(x=>{const g=ING(x.i.key);return `<div class="rl"><div class="a">${esc(g.tr)} <span class="muted">${fmtQty(x.i.qty,g.unit)}</span></div><div class="p avg">${eur(x.cost)}</div></div>`}).join("")}
    </details>`;
  }
  h+=`<div class="small muted" style="margin:6px 2px">Hesap, gereken miktara göre paket sayısını yukarı yuvarlar (ör. 1,2 kg soğan için 1 paket 2 kg). “Evde var” işaretli ürünler hesaba katılmaz. Ortalama fiyatları Ayarlar’dan düzenleyebilirsin.</div>`;
  h+=`<button class="btn sec full" data-act="copyReport">📋 Raporu kopyala</button>`;
  return h;
}
function reportText(){
  const R=computeReport(); let t=`📊 Market raporu (${new Date().toLocaleDateString("tr-TR")})\n`;
  for(const r of R.rows){ t+=`\n${r.m}: ${eur(r.total)} (${r.hits} ürün indirimde)\n`; }
  if(R.mks.length>1) t+=`\nKarma plan: ${eur(R.mixTotal)}\n`;
  t+=`Ortalama fiyatlarla: ${eur(R.base)}\n`;
  return t;
}

// ================== AYARLAR ==================
let priceQ="";
function viewAyar(){
  let h=`<h2>Ayarlar</h2><div class="card">
    <div class="row"><b class="grow">Varsayılan kişi sayısı</b><div class="stepper"><button data-act="pp" data-d="-1">−</button><span>${S.persons} kişi</span><button data-act="pp" data-d="1">+</button></div></div>
    <div class="row" style="margin-top:12px"><div class="grow"><b>Domuz eti içerenleri gizle</b><div class="small muted">Alman ve Avrupa tariflerinde domuzlu versiyonlar gizlenir, domuzsuz alternatifler kalır.</div></div>
    <button class="chip ${S.hidePork?'on':''}" data-act="pork">${S.hidePork?'Açık':'Kapalı'}</button></div></div>`;
  const hasGh=!!lsGet(GH_LS);
  h+=`<details class="card"><summary style="font-weight:800;cursor:pointer">⚙️ Gelişmiş (isteğe bağlı)</summary>
    <div class="small muted" style="margin:8px 0">Bunlar olmadan da her şey çalışır. Sadece “Şimdi yeniden çek” butonunun GitHub'a gitmeden doğrudan çalışması içindir.</div>
    <label class="lb">Posta kodu</label><div class="row"><input type="text" inputmode="numeric" id="zipIn" value="${esc(S.zip||(feed&&feed.zip)||"")}" maxlength="5"><button class="btn sm" data-act="saveZip">Kaydet</button></div>
    <label class="lb">GitHub anahtarı ${hasGh?'<span class="tag t-v">kayıtlı</span>':''}</label>
    <div class="row"><input type="password" id="ghIn" placeholder="${hasGh?'•••••••• (değiştirmek için yaz)':'github_pat_…'}" autocomplete="off"><button class="btn sm" data-act="saveGh">Kaydet</button></div>
    ${hasGh?'<button class="btn ghost sm" data-act="clearKeys">Anahtarı bu cihazdan sil</button>':''}
  </details>`;
  h+=`<h2>💶 Ortalama fiyatlar <span class="small muted">(${PRICE_DATE})</span></h2>
   <div class="small muted" style="margin:-4px 2px 8px">Prospekte olmayan ürünler için kullanılır. Alman discounter normal fiyatları baz alındı. Kendi gördüğün fiyatı yazabilirsin.</div>
   <div class="card"><input type="text" id="priceQ" placeholder="Ürün ara…" value="${esc(priceQ)}">
   <div class="pr small muted" style="font-weight:800"><span>Ürün</span><span>Paket</span><span>Fiyat €</span></div>
   <div id="priceRows">${priceRows()}</div></div>`;
  h+=`<h2>💾 Veriler</h2><div class="card">
    <div class="small">${lsOK?'✅ Veriler telefonunun hafızasına kaydediliyor. Tarayıcı verilerini silersen kaybolur; ara sıra yedeği kopyalayıp bir yere kaydet.':'⚠️ Tarayıcı hafızası kullanılamıyor (gizli sekme olabilir).'}</div>
    <div class="row wrap" style="margin-top:10px"><button class="btn sec sm" data-act="exportData">📤 Yedeği kopyala</button><button class="btn sec sm" data-act="importData">📥 Yedekten yükle</button><button class="btn ghost sm" data-act="resetAll">Her şeyi sıfırla</button></div></div>
    <div class="small muted" style="text-align:center;margin:16px 0">${RECIPES.length} hazır tarif · ${Object.keys(ING_BASE).length} malzeme</div>`;
  return h;
}
function priceRows(){
  const nq=norm(priceQ);
  const keys=Object.keys(ING_BASE).concat(Object.keys(S.customIng)).filter(k=>{const g=ING(k); return !nq || norm(g.tr+" "+g.de).includes(nq);});
  return keys.slice(0,nq?60:40).map(k=>{const g=ING(k); return `<div class="pr"><span>${esc(g.tr)}${g.ov?' <span class="warnb">düzenlendi</span>':''}<div class="lde">${esc(g.de)}</div></span><span class="muted">${fmtQty(g.packQty,g.unit)}</span><input type="number" step="0.01" inputmode="decimal" value="${g.packPrice}" data-price="${esc(k)}"></div>`}).join("") + (!nq?`<div class="small muted" style="padding-top:8px">İlk 40 ürün gösteriliyor, diğerleri için ara.</div>`:'');
}

// ================== OLAYLAR ==================
document.addEventListener("input", e=>{
  if(e.target.id==="q"){ ui.q=e.target.value; $("#yres").innerHTML=yemekBody(); $("#clrq").classList.toggle("hidden",!ui.q); }
  if(e.target.id==="priceQ"){ priceQ=e.target.value; $("#priceRows").innerHTML=priceRows(); }
});
document.addEventListener("change", e=>{
  const t=e.target;
  if(t.dataset.price){ const k=t.dataset.price, g=ING(k), v=parseFloat(String(t.value).replace(",",".")); if(v>0){ S.priceOv[k]=[g.packQty, v]; save(); toast("Fiyat kaydedildi"); } }
});
document.addEventListener("keydown", e=>{ if(e.key==="Enter" && e.target.id==="extraIn"){ e.preventDefault(); addExtra(); } });
document.addEventListener("click", async e=>{
  const go=e.target.closest("[data-tab-go]"); if(go){ e.preventDefault(); closeSheet(); setTab(go.dataset.tabGo); return; }
  const el=e.target.closest("[data-act]"); if(!el) return;
  const a=el.dataset.act, d=el.dataset;
  switch(a){
    case "clrq": ui.q=""; render(); setTimeout(()=>$("#q")&&$("#q").focus(),0); break;
    case "cu": ui.cu=d.v; ui.cat="all"; ui.f.clear(); render(); break;
    case "cat": ui.cat=d.v; render(); window.scrollTo(0,0); break;
    case "f": ui.f.has(d.v)?ui.f.delete(d.v):ui.f.add(d.v); render(); break;
    case "open": e.stopPropagation(); openRecipe(d.id); break;
    case "openPlan": { const p=S.plan.find(x=>x.uid===d.uid); if(p) openRecipe(p.rid,p.uid); break; }
    case "vsel": sheetCtx.vi=+d.i; renderRecipeSheet(); break;
    case "sv": sheetCtx.servings=Math.max(1,Math.min(30,sheetCtx.servings+(+d.d))); renderRecipeSheet(); break;
    case "dsel": sheetCtx.day=+d.d; renderRecipeSheet(); break;
    case "savePlan": {
      const c=sheetCtx; if(c.vi<0) return;
      if(c.planUid){ const p=S.plan.find(x=>x.uid===c.planUid); Object.assign(p,{vi:c.vi,servings:c.servings,day:c.day,needsVariant:false}); toast("Güncellendi"); }
      else { S.plan.push({uid:uid(),rid:c.id,vi:c.vi,servings:c.servings,day:c.day}); toast("Haftana eklendi ✓"); }
      save(); closeSheet(); render(); break; }
    case "rmPlan": S.plan=S.plan.filter(p=>p.uid!==d.uid); save(); closeSheet(); render(); break;
    case "ps": { const p=S.plan.find(x=>x.uid===d.uid); p.servings=Math.max(1,Math.min(30,p.servings+(+d.d))); save(); render(); break; }
    case "clearPlan": if(await ask("Haftanın menüsü ve işaretler temizlensin mi?","Temizle")){ S.plan=[]; S.checked={}; save(); render(); } break;
    case "pp": S.persons=Math.max(1,Math.min(20,S.persons+(+d.d))); save(); if($("#ppv")) $("#ppv").textContent=S.persons+" kişi"; if($("#sheet").classList.contains("on")) $("#personsPill").click(); render(); break;
    case "ppall": S.plan.forEach(p=>p.servings=S.persons); save(); closeSheet(); render(); toast("Tüm yemekler "+S.persons+" kişilik"); break;
    case "lm": S.listMode=d.v; save(); render(); break;
    case "ck": S.checked[d.k]?delete S.checked[d.k]:S.checked[d.k]=true; save(); render(); break;
    case "uncheck": S.checked={}; save(); render(); break;
    case "have": S.haveOv[d.k]=!isHave(d.k); save(); render(); break;
    case "addExtra": addExtra(); break;
    case "rmExtra": S.extras=S.extras.filter(x=>x.key!==d.k); save(); render(); break;
    case "copyList": copyText(listAsText()); break;
    case "copyReport": copyText(reportText()); break;
    case "clearOffers": if(await ask(d.m+" prospekt ürünleri silinsin mi?","Sil")){ delete S.markets[d.m]; if(!DEFAULT_MARKETS.includes(d.m) && await ask(d.m+" listeden de kaldırılsın mı?","Kaldır","Kalsın")) S.marketList=S.marketList.filter(x=>x!==d.m); save(); render(); } break;
    case "viewOffers": viewOffers(d.m); break;
    case "ownAdd": ownAddSheet(); break;
    case "ownCreate": { const n=(d.m||($("#ownName")&&$("#ownName").value)||"").trim(); if(!n){ toast("Market adı yaz"); break; }
      if(S.markets[n] && !S.markets[n].own){ toast("Bu isimde bir market zaten var"); break; }
      if(!S.marketList.includes(n)) S.marketList.push(n); if(!S.markets[n]) S.markets[n]={offers:[],own:true,added:Date.now()}; save(); render(); ownSheet(n); break; }
    case "ownOpen": ownSheet(d.m); break;
    case "ownSave": ownSavePrice(d.m); break;
    case "ownDel": { S.markets[d.m].offers.splice(+d.i,1); save(); render(); ownSheet(d.m); break; }
    case "ownRemove": if(await ask(d.m+" ve girdiğin fiyatlar silinsin mi?","Sil")){ delete S.markets[d.m]; S.marketList=S.marketList.filter(x=>x!==d.m); save(); closeSheet(); render(); } break;
    case "delOffer": { const m=S.markets[d.m]; m.offers.splice(+d.i,1); save(); viewOffers(d.m); render(); break; }
    case "pork": S.hidePork=!S.hidePork; save(); render(); break;
    case "feedLoad": { const f=await loadFeed(); if(f) applyFeed(f); else toast(feedErr); render(); break; }
    case "feedDispatch": dispatchUpdate(); break;
    case "saveZip": { const z=($("#zipIn").value||"").trim(); if(!/^\d{5}$/.test(z)){ toast("5 haneli posta kodu gir"); break; } S.zip=z; save(); toast("Posta kodu kaydedildi"); render(); break; }
    case "saveGh": { const v=($("#ghIn").value||"").trim(); if(v.length<20){ toast("Geçersiz anahtar"); break; } lsSet(GH_LS,v); toast("GitHub anahtarı kaydedildi"); render(); break; }
    case "clearKeys": if(await ask("Anahtar bu cihazdan silinsin mi?","Sil")){ lsSet(GH_LS,""); render(); } break;
    case "manualRecipe": manualRecipeSheet(ui.q); break;
    case "localPlan": localPlan(); break;
    case "srch": closeSheet(); ui.q=d.q; setTab("yemek"); break;
    case "mrAddLine": mrAddLine(); break;
    case "mrSave": mrSave(); break;
    case "delCustom": if(await ask("Bu tarif silinsin mi?","Sil")){ S.customR=S.customR.filter(r=>r.id!==d.id); S.plan=S.plan.filter(p=>p.rid!==d.id); save(); closeSheet(); render(); } break;
    case "exportData": copyText(JSON.stringify(S)); break;
    case "importData": openSheet(`<h1>Yedekten yükle</h1><p class="small muted">Daha önce kopyaladığın yedek metnini yapıştır.</p><textarea id="impTxt" rows="6"></textarea><button class="btn full" style="margin-top:10px" data-act="doImport">Yükle</button>`); break;
    case "doImport": try{ const o=JSON.parse($("#impTxt").value); if(!o||!Array.isArray(o.plan)) throw 0; S=Object.assign(freshState(),o); save(); closeSheet(); render(); toast("Yedek yüklendi"); }catch(err){ toast("Geçersiz yedek metni"); } break;
    case "resetAll": if(await ask("Tüm menü, liste, prospektler, kendi tariflerin ve fiyat düzenlemelerin silinsin mi?","Hepsini sil")){ S=freshState(); save(); render(); } break;
  }
});
function addExtra(){
  const inp=$("#extraIn"); const v=(inp.value||"").trim(); if(!v) return;
  const nv=norm(v); let key=Object.keys(ING_BASE).concat(Object.keys(S.customIng)).find(k=>norm(ING(k).tr)===nv) || Object.keys(ING_BASE).find(k=>norm(ING(k).tr).startsWith(nv)||norm(ING(k).de).startsWith(nv));
  if(!key){ key="c_"+nv.replace(/[^a-z0-9]+/g,"_").slice(0,30); if(!S.customIng[key]) S.customIng[key]=[v, v, "diger","ad",1,1.99,0]; }
  const g=ING(key);
  if(!S.extras.find(x=>x.key===key)) S.extras.push({key, qty:g.unit==="g"?500:g.unit==="ml"?1000:1});
  S.haveOv[key]=false; inp.value=""; save(); render(); toast(g.tr+" eklendi");
}
function addMarket(){
  openSheet(`<h1>Market ekle</h1><div class="days" style="margin:8px 0">${["Rewe","Edeka","Norma","Real","Globus","Türk marketi"].filter(m=>!S.marketList.includes(m)).map(m=>`<button class="chip" data-act="mkAdd" data-m="${m}">${m}</button>`).join("")}</div><label class="lb">veya adını yaz</label><input type="text" id="mkName" placeholder="Market adı"><button class="btn full" style="margin-top:10px" data-act="mkAdd">Ekle</button>`);
}
document.addEventListener("click", e=>{ const el=e.target.closest('[data-act="mkAdd"]'); if(!el) return; const m=(el.dataset.m||($("#mkName")&&$("#mkName").value)||"").trim(); if(m && !S.marketList.includes(m)){ S.marketList.push(m); save(); } closeSheet(); render(); });
function ownAddSheet(){
  openSheet(`<h1>Market ekle</h1><p class="small muted">Örnek isimler (dokununca eklenir) veya kendin yaz:</p>
   <div class="days" style="margin:8px 0">${["Türk marketi","Kasap","Pazar","Aldi (kendi fiyatlarım)"].filter(m=>!S.marketList.includes(m)).map(m=>`<button class="chip" data-act="ownCreate" data-m="${esc(m)}">${esc(m)}</button>`).join("")}</div>
   <label class="lb">Market adı</label><input type="text" id="ownName" placeholder="ör. Bolu Market, Kasap Ali"><button class="btn full" style="margin-top:10px" data-act="ownCreate">Ekle</button>`);
}
function ownSheet(m){
  const d=S.markets[m]; if(!d){ closeSheet(); return; }
  openSheet(`<div class="row"><h1 class="grow">${esc(m)}</h1><button class="iconbtn" data-act="ownRemove" data-m="${esc(m)}" title="Marketi sil">🗑️</button></div>
   <div class="small muted">Bu markette aldığın ürünlerin <b>paket</b> fiyatını gir. Fiyatlar sen değiştirene kadar kalır.</div>
   <div class="card" style="margin-top:10px">
     <label class="lb" style="margin-top:0">Ürün</label><input type="text" id="opIng" list="ingdl3" placeholder="ör. Sucuk, Dana kıyma, Yufka">
     <datalist id="ingdl3">${Object.keys(ING_BASE).concat(Object.keys(S.customIng)).map(k=>`<option value="${esc(ING(k).tr)}">`).join("")}</datalist>
     <div class="row" style="margin-top:8px"><div class="grow"><label class="lb" style="margin-top:0">Paket miktarı <span id="opUnit" class="muted"></span></label><input type="text" inputmode="decimal" id="opQty" placeholder="ör. 500"></div>
       <div class="grow"><label class="lb" style="margin-top:0">Fiyat (€)</label><input type="text" inputmode="decimal" id="opPrice" placeholder="ör. 4,99"></div></div>
     <button class="btn full" style="margin-top:10px" data-act="ownSave" data-m="${esc(m)}">Fiyatı kaydet</button>
   </div>
   ${d.offers.length?`<div class="ings">${d.offers.map((o,i)=>`<div class="ing"><span><b>${esc(o.n)}</b> <span class="muted">${esc(o.size)}</span></span><span style="text-align:right"><b>${eur(o.p)}</b> <button class="havebtn" data-act="ownDel" data-m="${esc(m)}" data-i="${i}">sil</button></span></div>`).join("")}</div>`:'<div class="empty small">Henüz fiyat yok.</div>'}`);
}
function findIngKey(name){ const nv=norm(name.trim()); const ks=Object.keys(ING_BASE).concat(Object.keys(S.customIng)); return ks.find(k=>norm(ING(k).tr)===nv) || ks.find(k=>norm(ING(k).tr).startsWith(nv)) || ks.find(k=>norm(ING(k).de).startsWith(nv)); }
document.addEventListener("input",e=>{ if(e.target.id==="opIng"){ const k=findIngKey(e.target.value); const u=$("#opUnit"); if(u) u.textContent=k?"("+(UNITS[ING(k).unit]||ING(k).unit)+")":""; } });
function ownSavePrice(m){
  const name=($("#opIng").value||"").trim(); const k=findIngKey(name);
  if(!k){ toast("Ürünü listeden seç"); return; }
  const g=ING(k); let q=parseFloat(String($("#opQty").value).replace(",",".")); const p=parseFloat(String($("#opPrice").value).replace(",","."));
  if(!(p>0)){ toast("Fiyatı yaz"); return; }
  if(!(q>0)) q=g.packQty;
  const d=S.markets[m]; const i=d.offers.findIndex(o=>o.key===k);
  const o={n:g.tr, size:fmtQty(q,g.unit), p, key:k, qty:q, manual:true};
  if(i>=0) d.offers[i]=o; else d.offers.push(o);
  d.added=Date.now(); save(); render(); ownSheet(m); toast(g.tr+" kaydedildi");
}
function viewOffers(m){
  const d=S.markets[m]; if(!d){ closeSheet(); return; }
  openSheet(`<h1>${esc(m)} · ${d.offers.length} ürün</h1><div class="small muted">${esc(d.validText||"")}</div>
   <div class="ings" style="margin-top:10px">${d.offers.map((o,i)=>{const g=o.key?ING(o.key):null; return `<div class="ing"><span><b>${esc(o.n)}</b> ${o.size?`<span class="muted">${esc(o.size)}</span>`:''}<div class="small ${g?'offer':'muted'}">${g?'↔ '+esc(g.tr):'listedeki bir malzemeyle eşleşmedi'}${o.app?' · App fiyatı':''}</div></span><span style="text-align:right"><b>${eur(o.p)}</b><br><button class="havebtn" data-act="delOffer" data-m="${esc(m)}" data-i="${i}">sil</button></span></div>`}).join("")}</div>`);
}
function pasteOffers(m){
  openSheet(`<h1>${esc(m)} prospekt metni</h1><p class="small muted">Prospekt sitesinden veya uygulamadan kopyaladığın metni yapıştır.</p><textarea id="pasteTxt" rows="8" placeholder="Hackfleisch gemischt 500 g 3,99 €…"></textarea><button class="btn ai full" style="margin-top:10px" data-act="doPaste" data-m="${esc(m)}">✨ Ürünleri çıkar</button>`);
}

// ---- Elle tarif ----
let mrLines=[];
function manualRecipeSheet(prefill){
  mrLines=[{name:"",qty:""},{name:"",qty:""},{name:"",qty:""}];
  openSheet(`<h1>✍️ Kendi tarifin</h1><label class="lb">Yemek adı</label><input type="text" id="mrName" placeholder="ör. Annemin bamya çorbası" value="${esc(prefill||"")}">
   <div class="row"><div class="grow"><label class="lb">Kategori</label><select id="mrCat">${Object.entries(CATS).map(([k,[n]])=>`<option value="${k}">${n}</option>`).join("")}</select></div><div class="grow"><label class="lb">Yöre (isteğe bağlı)</label><input type="text" id="mrReg"></div></div>
   <label class="lb">Malzemeler (4 kişilik)</label><div id="mrLines"></div>
   <datalist id="ingdl2">${Object.keys(ING_BASE).concat(Object.keys(S.customIng)).map(k=>`<option value="${esc(ING(k).tr)}">`).join("")}</datalist>
   <button class="btn ghost sm" data-act="mrAddLine">+ Malzeme satırı</button>
   <button class="btn full" style="margin-top:10px" data-act="mrSave">Kaydet</button>`);
  mrRender();
}
function mrRender(){ $("#mrLines").innerHTML=mrLines.map((l,i)=>`<div class="row" style="margin-bottom:6px"><input type="text" list="ingdl2" placeholder="Malzeme" value="${esc(l.name)}" data-mr="${i}" data-f="name" class="grow"><input type="text" placeholder="Miktar" value="${esc(l.qty)}" data-mr="${i}" data-f="qty" style="width:110px"></div>`).join("")+`<div class="small muted">Miktar örnekleri: 500 g, 2 adet, 1 demet, 2 yk. Birim yazmazsan malzemenin kendi birimi kullanılır.</div>`; }
document.addEventListener("input", e=>{ const t=e.target; if(t.dataset.mr!==undefined){ mrLines[+t.dataset.mr][t.dataset.f]=t.value; } });
function mrAddLine(){ mrLines.push({name:"",qty:""}); mrRender(); }
function mrSave(){
  const name=$("#mrName").value.trim(); if(!name){ toast("Yemek adı yaz"); return; }
  const ings=[];
  for(const l of mrLines){ if(!l.name.trim()) continue; const nv=norm(l.name.trim());
    let key=Object.keys(ING_BASE).concat(Object.keys(S.customIng)).find(k=>norm(ING(k).tr)===nv);
    const m=String(l.qty).replace(",",".").match(/([\d.]+)\s*(kg|g|gr|l|lt|ml|adet|ad|demet|yk|çk|diş|paket)?/i);
    let q=m?parseFloat(m[1]):1, u=m&&m[2]?m[2].toLowerCase():null;
    if(u==="kg"){q*=1000;u="g";} if(u==="l"||u==="lt"){q*=1000;u="ml";} if(u==="gr")u="g"; if(u==="adet")u="ad";
    if(!key){ key="c_"+nv.replace(/[^a-z0-9]+/g,"_").slice(0,30); S.customIng[key]=[l.name.trim(),l.name.trim(),"diger",u||"ad",u==="g"?500:u==="ml"?1000:1,1.99,0]; }
    ings.push([key,q||1]);
  }
  if(!ings.length){ toast("En az bir malzeme ekle"); return; }
  S.customR.push({id:"my_"+uid(), name, cu:"my", cat:$("#mrCat").value, tags:"", region:$("#mrReg").value.trim(), ings, custom:true});
  save(); closeSheet(); ui.cu="my"; render(); toast("Tarif kaydedildi");
}

// ================== MENÜ METNİNİ OKU (yapay zekasız) ==================
const DAY_ALIASES=[["pazartesi",0],["cumartesi",5],["carsamba",2],["persembe",3],["sali",1],["cuma",4],["pazar",6],["pzt",0],["cmt",5]];
const EXTRA_ALIAS={"pilav":"pirincpilav","pirinc pilavi":"pirincpilav","bulgur":"bulgurpilav","kuru fasulye":"kurufasulye","fasulye":"kurufasulye","mercimek":"mercimek","corba":"mercimek","kofte":"izgarakofte","salata":"coban","doner":"tavukdoner","kebap":"kiymakebabi","adana":"kiymakebabi","urfa kebab":"kiymakebabi","borek":"ispanakborek","makarna":"kiymalimakarna","tavuk":"tavuksote","balik":"baliktava","dolma":"biberdolma","sarma":"yaprak","tost":"croque","bolonez":"bolognese","spagetti":"bolognese","lazanya":"lasagne","krep":"crepes","snitzel":"schnitzel","sinitzel":"schnitzel","gulas":"gulasch","pirzola":"pirzola","iskender":"iskender","manti":"manti","kumpir":"firinsebze"};
const VAR_STOP=new Set(["usulu","klasik","kolay","ile","yapimi","yapim","sade","tepsi","ev","icin","tarif","usul","li","lu"]);
let ALIAS=null;
function buildAliases(){
  const a=[];
  for(const r of allRecipes()){
    const n=norm(r.name); a.push([n,r.id]);
    const base=n.replace(/\(.*?\)/g," ").replace(/\s+/g," ").trim(); if(base!==n) a.push([base,r.id]);
    const par=(n.match(/\((.*?)\)/)||[])[1]; if(par && r.cu!=="tr") par.split("/").map(x=>x.trim()).filter(x=>x.includes(" ")).forEach(x=>a.push([x,r.id]));
    n.split("/").map(x=>x.replace(/\(.*?\)/g,"").trim()).filter(x=>x.length>3&&x!==n).forEach(x=>a.push([x,r.id]));
  }
  const seen=new Set(); const strong=a.filter(([k])=>k.length>2 && !seen.has(k) && seen.add(k));
  const weak=Object.entries(EXTRA_ALIAS).filter(([k,v])=>getR(v)&&!seen.has(k)).map(([k,v])=>[k,v,1]);
  ALIAS=strong.sort((x,y)=>y[0].length-x[0].length).concat(weak.sort((x,y)=>y[0].length-x[0].length));
}
function reEsc(x){ return x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }
function parseMenuText(text){
  if(!ALIAS) buildAliases();
  let t=" "+norm(text).replace(/[\n;]+/g,",")+" ";
  // günlere böl
  const marks=[]; for(const [w,d] of DAY_ALIASES){ const re=new RegExp("(^|[^a-z])"+w+"(si|ya|ye|gunu|günü)?(?=[^a-z])","g"); let m; while((m=re.exec(t))){ if(!marks.some(x=>m.index>=x.i&&m.index<x.e)) marks.push({i:m.index,e:m.index+m[0].length,d}); } }
  marks.sort((a,b)=>a.i-b.i);
  const segs=[]; let last=0, day=-1;
  for(const m of marks){ segs.push({day, txt:t.slice(last,m.i)}); last=m.e; day=m.d; }
  segs.push({day, txt:t.slice(last)});
  const found=[], unknown=[];
  for(const sg of segs){
    const items=sg.txt.split(/,|\+|\bve\b|\bile\b|\byaninda\b|&/).map(x=>x.trim()).filter(Boolean);
    for(let it of items){
      const sm=it.match(/(\d+)\s*(kisilik|kisi)/); const serv=sm?parseInt(sm[1]):null; if(sm) it=it.replace(sm[0]," ");
      let rest=" "+it+" "; let any=false;
      const ids=new Set();
      for(const [al,id,isWeak] of ALIAS){
        if(isWeak && any && !["pilav","bulgur","salata","pirinc pilavi"].includes(al)) continue;
        if(ids.has(id)) continue;
        const re=new RegExp("(^|[^a-z])"+reEsc(al)+"[a-z]{0,4}(?=[^a-z])");
        const m=rest.match(re); if(!m) continue;
        const r=getR(id); if(!r) continue;
        // varyant: kalem içindeki kelimelere göre
        const vv=visibleVarIdx(r); let vi=null;
        if(vv.length>1){ let best=0; for(const i of vv){ const rn=norm(r.name).replace(/\(.*?\)/g,""); const words=norm(r.vars[i].name).replace(/[()/,:-]/g," ").split(/\s+/).filter(w=>w.length>=4&&!VAR_STOP.has(w)&&!rn.includes(w.slice(0,4))); const sc=words.filter(w=>new RegExp("(^|[^a-z])"+reEsc(w.slice(0,Math.max(4,w.length-2)))).test(rest)).length; if(sc>best){best=sc;vi=i;} } }
        found.push({id, day:sg.day, vi, serv}); ids.add(id);
        rest=rest.replace(m[0]," "); any=true;
      }
      const left=rest.replace(/\b(usulu|usul|etli|etsiz|zeytinyagli|ev|yapimi|bir|de|da|ayran|ekmek|icecek|tatli|corbasi|yemegi|sos|sosu|kisilik|ve|ile)\b/g," ").replace(/[^a-z ]/g," ").trim();
      if(!any && left.length>2) unknown.push(it.trim());
    }
  }
  return {found, unknown};
}
function localPlan(){
  const txt=($("#planText").value||"").trim(); if(!txt){ toast("Önce yemekleri yaz"); return; }
  const {found,unknown}=parseMenuText(txt); let need=0;
  for(const f of found){
    const r=getR(f.id); const vv=visibleVarIdx(r); let vi=f.vi, needs=false;
    if(vi===null){ vi=vv[0]||0; needs=vv.length>1; if(needs) need++; }
    S.plan.push({uid:uid(), rid:f.id, vi, servings:f.serv||S.persons, day:f.day, needsVariant:needs});
  }
  save(); render();
  if(unknown.length || need){
    openSheet(`<h1>${found.length} yemek eklendi</h1>
     ${found.length?`<div class="ings">${found.map(f=>{const r=getR(f.id);return `<div class="ing"><span>${catEmoji(r.cat)} ${esc(r.name)}</span><b class="small">${f.day>=0?DSHORT[f.day]:"–"}</b></div>`}).join("")}</div>`:''}
     ${need?`<div class="note">⚠️ ${need} yemekte yöre/tarif seçmen gerekiyor. Haftam'da “yöre seç” yazan yemeğe dokun.</div>`:''}
     ${unknown.length?`<label class="lb">Tanınmayanlar</label><div class="list">${unknown.map(u=>`<div class="rc"><div class="tx"><div class="nm">${esc(u)}</div></div><button class="btn sec sm" data-act="srch" data-q="${esc(u)}">🔎 Ara</button></div>`).join("")}</div><div class="small muted" style="margin-top:6px">Ara'ya basınca listede benzerini bulabilir veya kendi tarifin olarak ekleyebilirsin.</div>`:''}
     <button class="btn full" style="margin-top:12px" data-act="closeSheet">Tamam</button>`);
    $("#planText").value="";
  } else { toast(found.length+" yemek menüye eklendi ✓"); }
}
document.addEventListener("click",e=>{ if(e.target.closest('[data-act="closeSheet"]')) closeSheet(); });
// tarif ekleme/silmede takma ad listesini yenile
const _save=save; save=function(){ ALIAS=null; _save(); };

// ================== BAŞLAT ==================
const hadLocal = loadLocal();
curTab = S.lastTab || "yemek";
document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on", b.dataset.tab===curTab));
render();
loadFeed().then(f=>{ if(f && f.updatedAt && f.updatedAt!==S.feedAt){ const n=applyFeed(f,true); if(n) toast(`🔄 ${n} güncel market teklifi yüklendi`,3000); } if(curTab==="market") render(); });
if("serviceWorker" in navigator){ navigator.serviceWorker.register("sw.js").catch(()=>{}); }
