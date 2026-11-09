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
const KEY_LS="hm_anthropic_key", GH_LS="hm_github_token";
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
    h += `<div class="card" style="margin-top:12px"><div class="row"><div class="grow"><b>Aradığın yemek yok mu?</b><div class="small muted">Yapay zeka “${esc(ui.q)}” için malzemeleri (yöre farklarıyla) çıkarıp listene eklesin.</div></div></div>
      <button class="btn ai full" style="margin-top:10px" data-act="aiRecipe">✨ “${esc(ui.q)}” tarifini oluştur</button></div>`;
    return h;
  }
  h += `<div class="seg">${Object.entries(CUIS).map(([k,v])=>`<button class="${ui.cu===k?'on':''}" data-act="cu" data-v="${k}">${k==="tr"?"🇹🇷 ":k==="de"?"🇩🇪 ":k==="eu"?"🇪🇺 ":"⭐ "}${v}</button>`).join("")}</div>`;
  let rs = allRecipes().filter(r=>r.cu===ui.cu || (ui.cu==="my" && r.custom));
  if(ui.cu==="my") rs = allRecipes().filter(r=>r.custom);
  rs = rs.filter(r=>visibleVarIdx(r).length);
  const counts={}; rs.forEach(r=>counts[r.cat]=(counts[r.cat]||0)+1);
  if(ui.cu==="my"){
    h += `<div class="row" style="margin:4px 0 10px"><button class="btn ai grow" data-act="aiRecipePrompt">✨ AI ile tarif ekle</button><button class="btn sec grow" data-act="manualRecipe">✍️ Elle ekle</button></div>`;
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
  h += `<div class="card"><b>📝 Listeni yazarak ekle</b><div class="small muted" style="margin:2px 0 8px">Ör: “Pazartesi mercimek çorbası ve karnıyarık, salı kuru fasulye pilav, çarşamba Antep usulü lahmacun…”</div>
    <textarea id="planText" rows="3" placeholder="Bu hafta yapacağın yemekleri yaz…"></textarea>
    <button class="btn ai full" style="margin-top:8px" data-act="aiPlan">✨ Yapay zeka ile menüye ekle</button></div>`;
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
    <div class="small muted">Her pazartesi ve perşembe sabahı ${S.zip?esc(S.zip)+" posta kodu için":"posta koduna göre"} marketlerin güncel teklifleri otomatik çekilir.</div>
    <div style="margin:8px 0"><b>${feed&&feed.updatedAt?"Son güncelleme: "+new Date(feed.updatedAt).toLocaleString("tr-TR",{weekday:"short",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):(feedErr||"Henüz otomatik veri yok")}</b>${feed&&feed.zip?` · PLZ ${esc(feed.zip)}`:''}${feed&&feed.markets?`<div class="small muted">${Object.entries(feed.markets).map(([m,d])=>esc(m)+": "+(d.offers||[]).length).join(" · ")}</div>`:''}</div>
    ${dispatchState?`<div class="small"><span class="spin dark"></span> ${esc(dispatchState.msg)}</div>`:`<div class="row wrap"><button class="btn sm" data-act="feedLoad">📥 Güncel teklifleri al</button><button class="btn sec sm" data-act="feedDispatch">🔄 Şimdi yeniden çek</button></div>`}
  </div>`;
  h+=`<h2>Elle prospekt yükle</h2><div class="small muted" style="margin:-4px 2px 10px">Otomatik çekilemeyen bir market veya Türk marketi için PDF, ekran görüntüsü ya da metin yükleyebilirsin.</div>`;
  for(const m of S.marketList){
    const d=S.markets[m]; const n=d?d.offers.length:0;
    const exp = d && d.validTo && new Date(d.validTo+"T23:59:59") < new Date();
    const col=MCOL[m]||"#7A6B5D";
    h+=`<div class="card"><div class="mk"><div class="mlogo" style="background:${col};${m==='Netto'?'color:#222':''}">${esc(m.slice(0,4).toUpperCase())}</div>
      <div class="grow"><b>${esc(m)}</b><div class="small muted">${n?`${d.auto?'🔄 ':''}${n} ürün · ${d.validText?esc(d.validText):'yüklendi '+new Date(d.added).toLocaleDateString("tr-TR")}`:'Prospekt yok'} ${exp?'<span class="warnb">süresi geçmiş</span>':''}</div></div>
      ${n?`<button class="iconbtn" data-act="viewOffers" data-m="${esc(m)}" title="Ürünleri gör">👁️</button>`:''}</div>
      ${busy&&busy.market===m?`<div class="small" style="margin-top:8px"><span class="spin dark"></span> ${esc(busy.msg)}</div><div class="progress"><i style="width:${busy.pct}%"></i></div>`:
      `<div class="row wrap" style="margin-top:10px"><label class="btn sm" style="position:relative;overflow:hidden;${busy?'pointer-events:none;opacity:.5':''}">📄 PDF / Görsel<input type="file" accept="application/pdf,image/*" multiple style="position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer" data-up="${esc(m)}"></label>
       <button class="btn sec sm" data-act="pasteOffers" data-m="${esc(m)}" ${busy?'disabled':''}>📝 Metin</button>
       ${n?`<button class="btn ghost sm" data-act="clearOffers" data-m="${esc(m)}">Temizle</button>`:''}</div>`}
    </div>`;
  }
  h+=`<button class="btn sec full" data-act="addMarket">+ Market ekle (Rewe, Edeka, Norma, Türk marketi…)</button>`;
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
      if(b){ hits++; total+=b.cost; return {i, offer:b, cost:b.cost, avg:a}; } total+=a; return {i, cost:a, avg:a}; });
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
  const hasKey=!!lsGet(KEY_LS), hasGh=!!lsGet(GH_LS);
  h+=`<h2>🔑 Bağlantılar</h2><div class="card">
    <label class="lb" style="margin-top:0">Posta kodun (PLZ)</label><div class="row"><input type="text" inputmode="numeric" id="zipIn" value="${esc(S.zip||"")}" placeholder="ör. 70173" maxlength="5"><button class="btn sm" data-act="saveZip">Kaydet</button></div>
    <div class="small muted" style="margin-top:4px">Teklifler bölgeye göre değişir.</div>
    <label class="lb">Anthropic API anahtarı ${hasKey?'<span class="tag t-v">kayıtlı</span>':'<span class="warnb">yok</span>'}</label>
    <div class="row"><input type="password" id="keyIn" placeholder="${hasKey?'•••••••• (değiştirmek için yaz)':'sk-ant-…'}" autocomplete="off"><button class="btn sm" data-act="saveKey">Kaydet</button></div>
    <div class="small muted" style="margin-top:4px">Uygulama içindeki yapay zeka için (tarif oluşturma, menü okuma, elle prospekt). Sadece bu telefonda saklanır.</div>
    <label class="lb">GitHub anahtarı ${hasGh?'<span class="tag t-v">kayıtlı</span>':'<span class="tag t-s">isteğe bağlı</span>'}</label>
    <div class="row"><input type="password" id="ghIn" placeholder="${hasGh?'•••••••• (değiştirmek için yaz)':'github_pat_…'}" autocomplete="off"><button class="btn sm" data-act="saveGh">Kaydet</button></div>
    <div class="small muted" style="margin-top:4px">“Şimdi yeniden çek” butonu için. Sadece bu telefonda saklanır.</div>
    ${hasKey||hasGh?'<button class="btn ghost sm" data-act="clearKeys">Anahtarları bu cihazdan sil</button>':''}
  </div>`;
  h+=`<h2>💶 Ortalama fiyatlar <span class="small muted">(${PRICE_DATE})</span></h2>
   <div class="small muted" style="margin:-4px 2px 8px">Prospekte olmayan ürünler için kullanılır. Alman discounter normal fiyatları baz alındı. Kendi gördüğün fiyatı yazabilirsin.</div>
   <div class="card"><button class="btn ai full" data-act="aiPrices">✨ Listemdeki ürünlerin fiyatlarını AI ile gözden geçir</button>
   <div class="small muted" style="margin-top:6px">Yapay zeka kendi bilgisinden tahmin eder, öneriler onayına sunulur. Gerçek fiyatlar için otomatik teklifleri kullan.</div>
   <input type="text" id="priceQ" placeholder="Ürün ara…" value="${esc(priceQ)}" style="margin-top:10px">
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
  if(t.dataset.up){ const files=[...t.files]; t.value=""; if(files.length) importProspekt(t.dataset.up, files); }
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
    case "addMarket": addMarket(); break;
    case "clearOffers": if(await ask(d.m+" prospekt ürünleri silinsin mi?","Sil")){ delete S.markets[d.m]; if(!DEFAULT_MARKETS.includes(d.m) && await ask(d.m+" listeden de kaldırılsın mı?","Kaldır","Kalsın")) S.marketList=S.marketList.filter(x=>x!==d.m); save(); render(); } break;
    case "viewOffers": viewOffers(d.m); break;
    case "delOffer": { const m=S.markets[d.m]; m.offers.splice(+d.i,1); save(); viewOffers(d.m); render(); break; }
    case "pasteOffers": pasteOffers(d.m); break;
    case "doPaste": { const txt=$("#pasteTxt").value.trim(); if(txt){ closeSheet(); importProspekt(d.m, [], txt); } break; }
    case "pork": S.hidePork=!S.hidePork; save(); render(); break;
    case "feedLoad": { const f=await loadFeed(); if(f) applyFeed(f); else toast(feedErr); render(); break; }
    case "feedDispatch": dispatchUpdate(); break;
    case "saveZip": { const z=($("#zipIn").value||"").trim(); if(!/^\d{5}$/.test(z)){ toast("5 haneli posta kodu gir"); break; } S.zip=z; save(); toast("Posta kodu kaydedildi"); render(); break; }
    case "saveKey": { const v=($("#keyIn").value||"").trim(); if(!v.startsWith("sk-")){ toast("Anahtar sk-ant- ile başlamalı"); break; } lsSet(KEY_LS,v); toast("API anahtarı kaydedildi"); render(); break; }
    case "saveGh": { const v=($("#ghIn").value||"").trim(); if(v.length<20){ toast("Geçersiz anahtar"); break; } lsSet(GH_LS,v); toast("GitHub anahtarı kaydedildi"); render(); break; }
    case "clearKeys": if(await ask("Anahtarlar bu cihazdan silinsin mi?","Sil")){ lsSet(KEY_LS,""); lsSet(GH_LS,""); render(); } break;
    case "aiRecipe": aiRecipe(ui.q); break;
    case "aiRecipePrompt": openSheet(`<h1>✨ AI ile tarif ekle</h1><p class="small muted">Yemeğin adını yaz. İstersen yöresini veya özel bir detayı da ekle (ör. “Hatay usulü oruk”, “annemin bamya çorbası, kuzu etli”).</p><input type="text" id="aiRName" placeholder="Yemek adı"><button class="btn ai full" style="margin-top:10px" data-act="aiRGo">Oluştur</button>`); setTimeout(()=>$("#aiRName")&&$("#aiRName").focus(),250); break;
    case "aiRGo": { const n=$("#aiRName").value.trim(); if(n){ closeSheet(); aiRecipe(n); } break; }
    case "manualRecipe": manualRecipeSheet(); break;
    case "mrAddLine": mrAddLine(); break;
    case "mrSave": mrSave(); break;
    case "delCustom": if(await ask("Bu tarif silinsin mi?","Sil")){ S.customR=S.customR.filter(r=>r.id!==d.id); S.plan=S.plan.filter(p=>p.rid!==d.id); save(); closeSheet(); render(); } break;
    case "aiPlan": aiPlan(); break;
    case "aiPrices": aiPrices(); break;
    case "applyPrices": applyPrices(); break;
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
function manualRecipeSheet(){
  mrLines=[{name:"",qty:""}];
  openSheet(`<h1>✍️ Kendi tarifin</h1><label class="lb">Yemek adı</label><input type="text" id="mrName" placeholder="ör. Annemin bamya çorbası">
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

// ================== YAPAY ZEKA ==================
function extractJSON(t){
  t=String(t||"").replace(/```json|```/g,"");
  const s=Math.min(...["{","["].map(c=>{const i=t.indexOf(c);return i<0?1e9:i;}));
  const e=Math.max(t.lastIndexOf("}"),t.lastIndexOf("]"));
  if(s>=1e9||e<0) throw new Error("Yapay zeka yanıtı okunamadı");
  return JSON.parse(t.slice(s,e+1));
}
function blobB64(b){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(String(r.result).split(",")[1]); r.onerror=rej; r.readAsDataURL(b); }); }
async function ai(prompt, opts={}){
  const key=lsGet(KEY_LS);
  if(!key) throw {code:"no_key", message:"Yapay zeka için Ayarlar'a Anthropic API anahtarı gir"};
  const content=[];
  for(const b of (opts.images||[])) content.push({type:"image",source:{type:"base64",media_type:b.type||"image/jpeg",data:await blobB64(b)}});
  content.push({type:"text",text:prompt});
  let r;
  try{
    r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"x-api-key":key,"anthropic-version":"2023-06-01","content-type":"application/json","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:opts.tier==="quick"?"claude-haiku-5-5":"claude-sonnet-5-5", max_tokens:16000, messages:[{role:"user",content}]})});
  }catch(e){ throw {code:"net", message:"İnternet bağlantısı yok"}; }
  if(!r.ok){ let m=""; try{ m=(await r.json()).error.message; }catch(e){}
    throw {code: r.status===401?"bad_key": r.status===429||r.status===529?"rate_limited":"http", message:m||("HTTP "+r.status)}; }
  const j=await r.json();
  return extractJSON((j.content||[]).map(c=>c.text||"").join(""));
}
function aiErr(e){
  const c=e&&e.code;
  if(c==="no_key"||c==="bad_key"){ toast(c==="no_key"?"Yapay zeka için Ayarlar'dan API anahtarı gir":"API anahtarı geçersiz",3500); closeSheet(); setTab("ayar"); }
  else if(c==="rate_limited") toast("Çok sık istek gönderildi, biraz sonra dene",3500);
  else toast("Yapay zeka hatası: "+((e&&e.message)||"bilinmiyor"),3500);
}
function catalogText(withHints){
  return Object.keys(ING_BASE).concat(Object.keys(S.customIng)).map(k=>{const g=ING(k); return `${k} | ${g.tr} | ${g.de} | birim: ${g.unit}${withHints&&g.hint?" ("+g.hint+")":""}`;}).join("\n");
}
function loadingSheet(msg){ openSheet(`<div class="empty"><span class="spin dark" style="width:30px;height:30px;border-width:3.5px"></span><div style="margin-top:12px;font-weight:700">${esc(msg)}</div></div>`); }

async function aiRecipe(q){
  loadingSheet(`“${q}” için tarif hazırlanıyor…`);
  const prompt=`Sen Türk, Alman ve Avrupa mutfaklarını çok iyi bilen bir şefsin. Kullanıcı Almanya'da yaşıyor ve haftalık alışveriş listesi çıkarıyor.
Yemek: "${q}"
Görev: Bu yemeğin 4 kişilik malzeme listesini çıkar. Yemek yöreden yöreye veya tarife göre belirgin şekilde değişiyorsa (ör. Antep/Hatay/Urfa usulü, etli/zeytinyağlı) 2-4 varyant ver; değişmiyorsa tek varyant ver. Varyant adları kısa olsun ve yöreyi belirtsin.
Malzemeleri mümkünse aşağıdaki katalog anahtarlarıyla eşleştir ve katalogdaki birimi kullan (g, ml, ad, demet, diş, yk, çk, paket). Katalogda yoksa key=null yap ve name (Türkçe), de (Almanca market adı), aisle (et|balik|sebze|sut|kiler|konserve|firin|donuk|baharat|icecek|diger), unit, packQty, packPrice (Almanya ortalama € fiyatı) ver. Su dahil etme.
KATALOG (anahtar | Türkçe | Almanca | birim):
${catalogText(true)}

Sadece şu JSON'u döndür:
{"name":"Yemeğin Türkçe adı","cuisine":"tr|de|eu","cat":"${Object.keys(CATS).join("|")}","region":"yöre veya ülke","tags":"e/v/z/s/d harflerinden boşlukla (e=etli, v=etsiz, z=zeytinyağlı, s=sulu, d=domuz eti)","variants":[{"name":"varyant adı","note":"kısa not veya boş","tags":"","ings":[{"key":"kiyma","qty":500},{"key":null,"name":"Sumak","de":"Sumach","aisle":"baharat","unit":"çk","qty":1,"packQty":40,"packPrice":1.99}]}]}`;
  try{
    const j=await ai(prompt,{tier:"default"});
    if(!j||!Array.isArray(j.variants)||!j.variants.length) throw new Error("Tarif okunamadı");
    const vars=j.variants.map(v=>{
      const ings=[];
      for(const x of (v.ings||[])){
        let k=x.key; const q=parseFloat(x.qty)||1;
        if(!k || !ING(k)){ const nm=String(x.name||k||"Malzeme"); const nv=norm(nm);
          k=Object.keys(ING_BASE).concat(Object.keys(S.customIng)).find(kk=>norm(ING(kk).tr)===nv) || ("c_"+nv.replace(/[^a-z0-9]+/g,"_").slice(0,30));
          if(!ING(k)) S.customIng[k]=[nm, String(x.de||nm), AISLES[x.aisle]?x.aisle:"diger", UNITS[x.unit]?x.unit:"ad", parseFloat(x.packQty)||1, parseFloat(x.packPrice)||1.99, x.aisle==="baharat"?1:0]; }
        const ex=ings.find(i=>i[0]===k); if(ex) ex[1]+=q; else ings.push([k,q]);
      }
      return [String(v.name||""), ings, String(v.note||""), String(v.tags||"")];
    }).filter(v=>v[1].length);
    const r={id:"my_"+uid(), name:String(j.name||q), cu:"my", srcCu:j.cuisine, cat:CATS[j.cat]?j.cat:"etli", tags:String(j.tags||""), region:String(j.region||""), ings: vars.length>1?vars:vars[0][1], note: vars.length===1?vars[0][2]:"", custom:true, ai:true};
    S.customR.push(r); save();
    ui.q=""; render(); openRecipe(r.id); toast("Tarif “Benim” bölümüne kaydedildi");
  }catch(e){ closeSheet(); aiErr(e); }
}

async function aiPlan(){
  const txt=($("#planText").value||"").trim(); if(!txt){ toast("Önce yemekleri yaz"); return; }
  const btn=document.querySelector('[data-act="aiPlan"]'); btn.disabled=true; btn.innerHTML='<span class="spin"></span> Menü okunuyor…';
  const rs=allRecipes();
  const prompt=`Kullanıcı bu hafta yapacağı yemekleri serbest metinle yazdı. Her yemeği aşağıdaki tarif listesindeki bir id ile eşleştir.
Kurallar:
- day: 0=Pazartesi … 6=Pazar, gün belirtilmemişse -1.
- Kullanıcı yöre/tarif belirttiyse (ör. "Antep usulü", "etli", "zeytinyağlı", "pastırmalı") uygun varyantın index'ini "v" olarak ver; belirtmediyse ve tarifin birden fazla varyantı varsa "v": null ver.
- Kişi sayısı belirtildiyse "servings" ver, yoksa null.
- "pilav", "salata", "cacık" gibi eşlikçiler de ayrı yemektir.
- Listede olmayan yemek için id=null ve "name" ver.
METİN: """${txt}"""
TARİFLER (id | ad | varyantlar):
${rs.map(r=>`${r.id} | ${r.name}${r.vars.length>1?" | "+r.vars.map((v,i)=>i+":"+v.name).join("; "):""}`).join("\n")}

Sadece JSON döndür: {"items":[{"id":"karniyarik","name":"Karnıyarık","day":0,"v":null,"servings":null}]}`;
  try{
    const j=await ai(prompt,{tier:"default"});
    const items=(j&&j.items)||[]; let added=0; const missing=[];
    for(const it of items){
      const r=it.id?getR(it.id):null;
      if(!r){ if(it.name) missing.push(it.name); continue; }
      const vv=visibleVarIdx(r); let vi=Number.isInteger(it.v)&&r.vars[it.v]?it.v:null; let needs=false;
      if(vi===null){ vi=vv[0]||0; needs=vv.length>1; }
      const day=Number.isInteger(it.day)&&it.day>=-1&&it.day<=6?it.day:-1;
      S.plan.push({uid:uid(), rid:r.id, vi, servings:parseInt(it.servings)||S.persons, day, needsVariant:needs}); added++;
    }
    save(); render();
    if(missing.length){
      openSheet(`<h1>${added} yemek eklendi</h1><p>Şunlar hazır listede yok:</p><div class="list">${missing.map(m=>`<div class="rc"><div class="tx"><div class="nm">${esc(m)}</div></div><button class="btn ai sm" data-act="aiMiss" data-n="${esc(m)}">✨ Oluştur</button></div>`).join("")}</div>`);
    } else toast(added+" yemek menüye eklendi ✓");
  }catch(e){ aiErr(e); render(); }
}
document.addEventListener("click", e=>{ const el=e.target.closest('[data-act="aiMiss"]'); if(el){ closeSheet(); aiRecipe(el.dataset.n); }});

let priceSugg=[];
async function aiPrices(){
  const items=buildList().filter(i=>!isHave(i.key));
  const keys=items.length?items.map(i=>i.key):Object.keys(ING_BASE).filter(k=>!ING_BASE[k][6]).slice(0,60);
  loadingSheet("Fiyatlar gözden geçiriliyor…");
  const prompt=`Almanya'da (Aldi, Lidl, Penny, Netto, Kaufland gibi discounterlarda) ${new Date().toLocaleDateString("de-DE",{month:"long",year:"numeric"})} itibarıyla tipik NORMAL (indirimsiz) raf fiyatlarını tahmin et. Aşağıdaki her ürün için verilen paket büyüklüğüne göre € fiyat ver. Bilmediğin veya mevcut değer makulse aynı değeri döndür. Türk ürünleri (sucuk, pul biber, yufka vb.) için Almanya'daki Türk marketlerinin tipik fiyatını kullan.
Ürünler (anahtar | Almanca ad | paket | mevcut fiyat €):
${keys.map(k=>{const g=ING(k); return `${k} | ${g.de} | ${fmtQty(g.packQty,g.unit)} | ${g.packPrice}`;}).join("\n")}
Sadece JSON: {"prices":[{"key":"kiyma","price":4.99}]}`;
  try{
    const j=await ai(prompt,{tier:"default"});
    priceSugg=((j&&j.prices)||[]).map(p=>({key:p.key, price:parseFloat(p.price)})).filter(p=>ING(p.key)&&p.price>0&&Math.abs(p.price-ING(p.key).packPrice)>=0.05);
    if(!priceSugg.length){ openSheet(`<h1>Fiyatlar güncel görünüyor</h1><p class="muted">Yapay zeka mevcut ortalama fiyatlarda belirgin bir fark önermedi.</p>`); return; }
    openSheet(`<h1>Önerilen fiyatlar</h1><div class="note">Bunlar yapay zeka tahminidir, gerçek prospekt fiyatı değildir.</div><div class="ings">${priceSugg.map(p=>{const g=ING(p.key);return `<div class="ing"><span>${esc(g.tr)} <span class="muted small">${fmtQty(g.packQty,g.unit)}</span></span><b>${eur(g.packPrice)} → ${eur(p.price)}</b></div>`}).join("")}</div><button class="btn full" style="margin-top:10px" data-act="applyPrices">Uygula</button>`);
  }catch(e){ closeSheet(); aiErr(e); }
}
function applyPrices(){ for(const p of priceSugg){ const g=ING(p.key); S.priceOv[p.key]=[g.packQty,p.price]; } save(); closeSheet(); render(); toast(priceSugg.length+" fiyat güncellendi"); }

// ---- Prospekt işleme ----
function loadScript(src){ return new Promise((res,rej)=>{ const s=document.createElement("script"); s.src=src; s.onload=res; s.onerror=()=>rej(new Error("Betik yüklenemedi")); document.head.appendChild(s); }); }
async function ensurePdf(){ if(window.pdfjsLib) return; await loadScript(PDFJS); await loadScript(PDFWK); window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFWK; }
function canvasBlob(cv){ return new Promise(r=>cv.toBlob(b=>r(b),"image/jpeg",0.82)); }
async function shrinkImage(file){
  const url=URL.createObjectURL(file);
  try{ const img=await new Promise((res,rej)=>{const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=url;});
    const max=1800, sc=Math.min(1,max/Math.max(img.width,img.height)); const cv=document.createElement("canvas"); cv.width=Math.round(img.width*sc); cv.height=Math.round(img.height*sc);
    cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height); return await canvasBlob(cv);
  } finally { URL.revokeObjectURL(url); }
}
function setBusy(m,pct,msg){ busy={market:m,pct,msg}; if(curTab==="market") render(); }
async function importProspekt(m, files, pastedText){
  if(busy){ toast("Başka bir prospekt işleniyor"); return; }
  const parts=[]; // {type:'text',text} | {type:'img',blob}
  try{
    setBusy(m,3,"Dosyalar hazırlanıyor…");
    if(pastedText) parts.push({type:"text",text:pastedText});
    for(const f of files){
      if(f.type==="application/pdf" || /\.pdf$/i.test(f.name)){
        setBusy(m,5,"PDF açılıyor…"); await ensurePdf();
        const pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;
        const N=Math.min(pdf.numPages,40);
        for(let p=1;p<=N;p++){
          setBusy(m,5+Math.round(25*p/N),`PDF sayfası ${p}/${N} okunuyor…`);
          const page=await pdf.getPage(p); const tc=await page.getTextContent(); const txt=tc.items.map(i=>i.str).join(" ").replace(/\s+/g," ").trim();
          if(txt.length>250 && /\d[,.]\d\d/.test(txt)) parts.push({type:"text",text:`[Sayfa ${p}] ${txt}`});
          else { const vp=page.getViewport({scale:1.6}); const cv=document.createElement("canvas"); cv.width=vp.width; cv.height=vp.height; await page.render({canvasContext:cv.getContext("2d"),viewport:vp}).promise; parts.push({type:"img",blob:await canvasBlob(cv)}); }
        }
        if(pdf.numPages>40) toast("Sadece ilk 40 sayfa işlendi",3000);
      } else if(f.type.startsWith("image/")){ parts.push({type:"img",blob:await shrinkImage(f)}); }
    }
    if(!parts.length){ busy=null; render(); toast("Desteklenen dosya bulunamadı"); return; }
    if(!lsGet(KEY_LS)) throw {code:"no_key"};
    const imgOK=true;
    // gruplar
    const batches=[]; let cur={text:"",imgs:[]};
    for(const pt of parts){
      if(pt.type==="text"){ if(cur.text.length+pt.text.length>14000 || cur.imgs.length){ batches.push(cur); cur={text:"",imgs:[]}; } cur.text+=pt.text+"\n"; }
      else { if(!imgOK) continue; if(cur.imgs.length>=3 || cur.text){ batches.push(cur); cur={text:"",imgs:[]}; } cur.imgs.push(pt.blob); }
    }
    if(cur.text||cur.imgs.length) batches.push(cur);
    if(!batches.length) throw {message:"Görseller bu görünümde yapay zekaya gönderilemiyor. PDF veya metin dene."};
    const offers=[]; let validText="", validTo="";
    for(let b=0;b<batches.length;b++){
      setBusy(m,30+Math.round(68*b/batches.length),`Yapay zeka ürünleri okuyor (${b+1}/${batches.length})…`);
      const bt=batches[b];
      const prompt=`Aşağıda Almanya'daki "${m}" marketinin güncel prospektinden ${bt.imgs.length?"görseller":"metin"} var. Sadece gıda ve mutfak ürünlerini (et, sebze, süt ürünleri, kuru gıda, yağ, baharat, içecek vb.) çıkar; elektronik, giyim, ev eşyası gibi ürünleri ATLA.
Her ürün için:
- n: prospektteki ürün adı (Almanca, marka dahil kısa)
- size: paket bilgisi (ör. "500 g", "1 kg", "10 Stück", "6 x 1,5 l")
- p: ödenecek indirimli fiyat (€, sayı). "Lidl Plus"/"App"/"Kaufland Card" gibi sadece uygulamayla geçerli fiyatsa onu yaz ve app:true yap.
- key: aşağıdaki katalogdan bu ürüne en uygun malzeme anahtarı; uygun yoksa null. Örn. "Hähnchenbrustfilet" → tgogus, "Rinderhackfleisch" → kiyma, "Hackfleisch gemischt" → hackmix, "Speisezwiebeln 2 kg" → sogan, "Tomaten" → domates, "Deutsche Markenbutter" → tereyagi. Hazır yemek, tatlı/atıştırmalık gibi ürünler için null.
- qty: bu paketin, eşleştirdiğin anahtarın KATALOG BİRİMİNDEKİ miktarı (sayı). Örn. sogan birimi "ad" (~125 g/adet) ise 2 kg soğan → 16; domates birimi g ise 1 kg → 1000; yumurta 10 Stück → 10; tereyagi 250 g → 250; salca birimi yk (200g≈13 yk) ise 200 g → 13. key null ise qty null.
Ayrıca prospektin geçerlilik tarihini bulursan validText ("11.11.–16.11.") ve validTo (YYYY-MM-DD, yıl ${new Date().getFullYear()}) ver.
KATALOG (anahtar | Türkçe | Almanca | birim):
${catalogText(true)}
${bt.text?`\nPROSPEKT METNİ:\n"""${bt.text}"""`:""}
Sadece JSON döndür: {"validText":"","validTo":"","items":[{"n":"","size":"","p":0,"app":false,"key":null,"qty":null}]}`;
      let j=null;
      for(let tries=0;tries<2 && !j;tries++){ try{ j=await ai(prompt,{images:bt.imgs, tier:"default"}); }catch(e){ if(e&&(e.code==="no_key"||e.code==="bad_key"||e.code==="net")) throw e; if(e&&e.code==="rate_limited") await new Promise(r=>setTimeout(r,8000)); if(tries) console.warn(e); } }
      if(!j) continue;
      if(j.validText && !validText) validText=String(j.validText); if(j.validTo && !validTo) validTo=String(j.validTo).slice(0,10);
      for(const it of (j.items||[])){
        const p=parseFloat(String(it.p).replace(",",".")); if(!(p>0) || !it.n) continue;
        const key=it.key && ING(it.key) ? it.key : null;
        offers.push({n:String(it.n).slice(0,80), size:String(it.size||"").slice(0,40), p, app:!!it.app, key, qty:key?parseFloat(it.qty)||null:null});
      }
    }
    if(!offers.length) throw {message:"Prospektte gıda ürünü bulunamadı"};
    const seen=new Set(); const uniq=offers.filter(o=>{const k=norm(o.n)+"|"+o.p; if(seen.has(k)) return false; seen.add(k); return true;});
    const prev=S.markets[m];
    const merge = prev && (Date.now()-prev.added < 6*3600*1000) && prev.offers.length;
    if(prev&&prev.auto) { /* elle yükleme otomatik veriyi değiştirir */ }
    S.markets[m]={offers: merge && !prev.auto ? prev.offers.concat(uniq.filter(o=>!prev.offers.some(x=>norm(x.n)===norm(o.n)&&x.p===o.p))) : uniq, validText: validText||(prev&&merge?prev.validText:""), validTo: validTo||(prev&&merge?prev.validTo:""), added: merge?prev.added:Date.now()};
    busy=null; save(); render();
    const matched=uniq.filter(o=>o.key).length;
    toast(`${m}: ${uniq.length} ürün okundu, ${matched} tanesi malzemelerle eşleşti`,3500);
  }catch(e){ busy=null; render(); aiErr(e); }
}

// ================== BAŞLAT ==================
const hadLocal = loadLocal();
curTab = S.lastTab || "yemek";
document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on", b.dataset.tab===curTab));
render();
loadFeed().then(f=>{ if(f && f.updatedAt && f.updatedAt!==S.feedAt){ const n=applyFeed(f,true); if(n) toast(`🔄 ${n} güncel market teklifi yüklendi`,3000); } if(curTab==="market") render(); });
if("serviceWorker" in navigator){ navigator.serviceWorker.register("sw.js").catch(()=>{}); }
