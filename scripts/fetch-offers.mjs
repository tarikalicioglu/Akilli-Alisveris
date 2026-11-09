// Akıllı Alışveriş – haftalık teklif çekici
// Marktguru'dan posta koduna göre market tekliflerini çeker, yapay zeka ile
// uygulamanın malzeme kataloğuyla eşleştirir ve data/offers.json dosyasına yazar.
// Çalıştırma: ZIP=70173 ANTHROPIC_API_KEY=... node scripts/fetch-offers.mjs
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(fs.readFileSync(path.join(ROOT, "config.json"), "utf8"));
const ZIP = String(process.env.ZIP || config.zip || "").trim();
const API_KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = config.model || "claude-haiku-5-5";
const UA = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!/^\d{5}$/.test(ZIP)) { console.error("Geçerli bir posta kodu yok (config.json 'zip' veya ZIP)."); process.exit(1); }

// ---- Katalog (uygulamanın js/data.js dosyasından) ----
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8") + ";this.ING_BASE=ING_BASE;", ctx);
const ING = ctx.ING_BASE;
const keys = Object.keys(ING).filter((k) => !ING[k][6] && !(config.skip || []).includes(k));

// ---- Market adlarını eşle ----
const MARKET_MAP = config.markets; // {"Aldi": ["aldi"], ...}
function marketOf(name) {
  const n = String(name || "").toLowerCase();
  for (const [m, pats] of Object.entries(MARKET_MAP)) if (pats.some((p) => n.includes(p))) {
    if ((config.excludeAdvertisers || []).some((x) => n.includes(x))) return null;
    return m;
  }
  return null;
}

// ---- Marktguru ----
async function getKeys() {
  const r = await fetch("https://www.marktguru.de/", { headers: { "User-Agent": UA, "Accept-Language": "de-DE" } });
  if (!r.ok) throw new Error("marktguru.de açılamadı: HTTP " + r.status);
  const html = await r.text();
  const apiKey = (html.match(/"apiKey"\s*:\s*"([^"]+)"/) || [])[1];
  const clientKey = (html.match(/"clientKey"\s*:\s*"([^"]+)"/) || [])[1];
  if (!apiKey || !clientKey) throw new Error("Marktguru anahtarları sayfada bulunamadı (site yapısı değişmiş olabilir).");
  return { apiKey, clientKey };
}
let debugShown = false;
async function search(q, k) {
  const url = `https://api.marktguru.de/api/v1/offers/search?as=web&limit=48&offset=0&q=${encodeURIComponent(q)}&zipCode=${ZIP}`;
  for (let t = 0; t < 3; t++) {
    const r = await fetch(url, { headers: { "User-Agent": UA, "x-apikey": k.apiKey, "x-clientkey": k.clientKey, Accept: "application/json" } });
    if (r.status === 429) { await sleep(5000 * (t + 1)); continue; }
    if (!r.ok) throw new Error(`Arama hatası (${q}): HTTP ${r.status}`);
    const j = await r.json();
    if (!debugShown && j.results && j.results[0]) { debugShown = true; console.log("Örnek ham sonuç:", JSON.stringify(j.results[0]).slice(0, 1500)); }
    return j.results || [];
  }
  return [];
}
function toOffer(r) {
  const adv = (r.advertisers && r.advertisers[0]) || r.advertiser || {};
  const market = marketOf(adv.name || adv.uniqueName);
  const price = Number(r.price);
  if (!market || !(price > 0)) return null;
  const brand = (r.brand && r.brand.name) || "";
  const prod = (r.product && r.product.name) || r.title || "";
  const unit = (r.unit && (r.unit.shortName || r.unit.name)) || "";
  const qty = Number(r.quantity) || null;
  const v = (r.validityDates && r.validityDates[0]) || {};
  return {
    market, id: r.id, n: [brand, prod].filter(Boolean).join(" ").slice(0, 90) || String(r.description || "").slice(0, 90),
    desc: String(r.description || "").replace(/\s+/g, " ").slice(0, 160), size: qty && unit ? `${qty} ${unit}` : "",
    rawQty: qty, rawUnit: unit.toLowerCase(), p: price, old: Number(r.oldPrice) || null,
    from: v.from ? String(v.from).slice(0, 10) : "", to: v.to ? String(v.to).slice(0, 10) : "",
  };
}
function searchTerm(k) {
  const o = (config.searchTerms || {})[k]; if (o) return o;
  return String(ING[k][1]).split(/[/(]/)[0].replace(/\b(TK|Dose|frisch|getrocknet|gerieben|eingelegt)\b/gi, "").trim();
}

// ---- Birim dönüştürme (yapay zeka yoksa yedek) ----
function guessQty(k, o) {
  const unit = ING[k][3]; const u = o.rawUnit; let q = o.rawQty; if (!q) return null;
  if (unit === "g") { if (u === "g") return q; if (u === "kg") return q * 1000; }
  if (unit === "ml") { if (u === "ml") return q; if (u === "l") return q * 1000; }
  if (unit === "ad" && /st(ü|u)ck|stk/.test(u)) return q;
  return null;
}

// ---- Yapay zeka ile eşleştirme ----
async function aiMatch(batch) {
  const prompt = `Bir alışveriş uygulaması için Alman süpermarket tekliflerini malzemelerle eşleştiriyorsun.
Her malzeme için aday teklifler listelendi. Sadece o malzemenin kendisi olarak yemekte kullanılabilecek teklifleri seç
(ör. "Butter" için tereyağı paketleri evet; Butterkekse, Kräuterbutter, Butterbrezel hayır. "Zwiebeln" için soğan evet; Zwiebelringe/Röstzwiebeln hayır).
Hazır yemekleri, atıştırmalıkları, karışık ürünleri ve alakasız ürünleri ATLA.
Her seçilen teklif için qty: paketin malzemenin KATALOG BİRİMİNDEKİ miktarı (sayı). Örn. birim "ad" ve soğan ~125 g/adet ise 2 kg → 16; birim g ise 1 kg → 1000; yumurta 10 Stück → 10.
Paket boyutu belli değilse ama tipik paket açıksa (ör. tereyağı 250 g) makul tahmin yap; hiç tahmin edilemiyorsa o teklifi atla.

${batch.map(({ k, cands }) => `### ${k} | ${ING[k][0]} | ${ING[k][1]} | birim: ${ING[k][3]}${ING[k][7] ? " (" + ING[k][7] + ")" : ""}
${cands.map((o, i) => `${i}: [${o.market}] ${o.n} | ${o.size || "?"} | ${o.p} € | ${o.desc}`).join("\n")}`).join("\n\n")}

Sadece JSON döndür: {"<malzeme anahtarı>":[{"i":0,"qty":500}], ...}  (uygun teklif yoksa boş liste)`;
  for (let t = 0; t < 3; t++) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 8000, messages: [{ role: "user", content: prompt }] }),
    });
    if (r.status === 429 || r.status >= 500) { await sleep(10000 * (t + 1)); continue; }
    if (!r.ok) throw new Error("Anthropic API hatası: HTTP " + r.status + " " + (await r.text()).slice(0, 300));
    const j = await r.json();
    const txt = (j.content || []).map((c) => c.text || "").join("").replace(/```json|```/g, "");
    return JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
  }
  throw new Error("Anthropic API yanıt vermedi");
}

// ---- Ana akış ----
const keysMG = await getKeys();
console.log(`PLZ ${ZIP} · ${keys.length} malzeme aranıyor…`);
const perKey = [];
for (const k of keys) {
  let res = [];
  try { res = await search(searchTerm(k), keysMG); } catch (e) { console.warn(e.message); }
  const seen = new Set();
  const cands = res.map(toOffer).filter(Boolean).filter((o) => !seen.has(o.id) && seen.add(o.id)).slice(0, 25);
  if (cands.length) perKey.push({ k, cands });
  await sleep(350);
}
console.log(`${perKey.length} malzeme için aday teklif bulundu.`);

const out = {};
const add = (o, k, qty) => {
  (out[o.market] ||= []).push({ n: o.n, size: o.size, p: o.p, old: o.old, key: k, qty, from: o.from, to: o.to });
};
if (API_KEY) {
  for (let i = 0; i < perKey.length; i += 8) {
    const batch = perKey.slice(i, i + 8);
    try {
      const m = await aiMatch(batch);
      for (const { k, cands } of batch) for (const x of m[k] || []) { const o = cands[x.i]; const q = Number(x.qty); if (o && q > 0) add(o, k, q); }
    } catch (e) { console.warn("Eşleştirme hatası:", e.message); }
    console.log(`Eşleştirildi: ${Math.min(i + 8, perKey.length)}/${perKey.length}`);
  }
} else {
  console.warn("ANTHROPIC_API_KEY yok: basit eşleştirme kullanılıyor (daha az isabetli).");
  for (const { k, cands } of perKey) {
    const term = searchTerm(k).toLowerCase().split(" ")[0];
    for (const o of cands) { const q = guessQty(k, o); if (q && o.n.toLowerCase().includes(term)) add(o, k, q); }
  }
}

const markets = {};
for (const [m, offers] of Object.entries(out)) {
  const tos = offers.map((o) => o.to).filter(Boolean).sort();
  const froms = offers.map((o) => o.from).filter(Boolean).sort();
  const fmt = (d) => d ? d.slice(8, 10) + "." + d.slice(5, 7) + "." : "";
  const validTo = tos[Math.floor(tos.length / 2)] || "";
  markets[m] = { validText: froms.length && validTo ? `${fmt(froms[0])}–${fmt(validTo)}` : "", validTo, offers };
}
const result = { updatedAt: new Date().toISOString(), zip: ZIP, source: "marktguru.de", markets };
fs.writeFileSync(path.join(ROOT, "data/offers.json"), JSON.stringify(result));
console.log("Bitti:", Object.entries(markets).map(([m, d]) => `${m} ${d.offers.length}`).join(", "));
