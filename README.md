# 🛒 Akıllı Alışveriş

Haftalık yemek menünden alışveriş listesi çıkaran ve market tekliflerini karşılaştıran telefon uygulaması.

**Uygulama adresi:** https://tarikalicioglu.github.io/Akilli-Alisveris/
(Telefonda açıp tarayıcı menüsünden **"Ana ekrana ekle"** de, uygulama gibi açılır.)

## Neler yapar
- 289 hazır tarif (207 Türk, 40 Alman, 42 Avrupa), yöreye göre tarif seçimi (Antep / Hatay / Urfa usulü vb.)
- Haftalık menü → miktarlı veya sadece liste, işaretlenebilir alışveriş listesi
- Market teklifleri: her **pazartesi ve perşembe sabahı** posta koduna göre otomatik çekilir
- Market market toplam fiyat raporu ve "karma plan" (her ürünü en ucuz yerden al)
- Elle PDF / ekran görüntüsü prospekt yükleme, yapay zeka ile tarif oluşturma

## Kurulum (bir kerelik)
1. **API anahtarını GitHub'a ekle:** Repo → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `ANTHROPIC_API_KEY`
   - Secret: console.anthropic.com'dan aldığın anahtar
2. **Posta kodunu yaz:** `config.json` içindeki `"zip": ""` alanına posta kodunu yaz.
3. **İlk güncelleme:** Repo → **Actions → "Market tekliflerini güncelle" → Run workflow**.
4. Uygulamada **Ayarlar → Bağlantılar**'a aynı API anahtarını gir (uygulama içi yapay zeka için; sadece telefonda saklanır).

### İsteğe bağlı: uygulamadan "Şimdi yeniden çek" butonu
GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate new token
- Repository access: sadece `Akilli-Alisveris`
- Permissions: **Actions: Read and write**
Oluşan anahtarı uygulamada **Ayarlar → GitHub anahtarı** alanına yapıştır.

## Dosyalar
| Dosya | Ne işe yarar |
|---|---|
| `index.html`, `js/app.js` | Uygulama |
| `js/data.js` | Malzeme kataloğu, ortalama fiyatlar ve tarifler |
| `scripts/fetch-offers.mjs` | Teklifleri çeken ve eşleştiren betik |
| `config.json` | Posta kodu, marketler, arama terimleri |
| `data/offers.json` | Otomatik oluşturulan güncel teklifler |

> Teklif verisi marktguru.de üzerinden alınır. Bu resmi bir arayüz değildir; site değişirse betiğin güncellenmesi gerekebilir.
