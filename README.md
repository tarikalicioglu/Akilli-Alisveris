# 🛒 Akıllı Alışveriş

Haftalık yemek menünden alışveriş listesi çıkaran ve market tekliflerini karşılaştıran telefon uygulaması.

**Uygulama adresi:** https://tarikalicioglu.github.io/Akilli-Alisveris/
(Telefonda açıp tarayıcı menüsünden **"Ana ekrana ekle"** de, uygulama gibi açılır.)

## Neler yapar
- 289 hazır tarif (207 Türk, 40 Alman, 42 Avrupa), yöreye göre tarif seçimi (Antep / Hatay / Urfa usulü vb.)
- Haftalık menü → miktarlı veya sadece liste, işaretlenebilir alışveriş listesi
- Market teklifleri: her **sabah** posta koduna göre otomatik çekilir
- Market market toplam fiyat raporu ve "karma plan" (her ürünü en ucuz yerden al)
- Menüyü yazıyla ekleme ("pazartesi karnıyarık, salı Antep usulü lahmacun…"), kendi tariflerini ekleme

## Kurulum (bir kerelik)
1. **Siteyi aç:** Repo → **Settings → Pages** → Branch: **main**, klasör **/ (root)** → **Save**.
2. Telefonda uygulama adresini aç → tarayıcı menüsünden **"Ana ekrana ekle"**.

Posta kodu `config.json` dosyasında (`45307`). Teklifler her sabah otomatik güncellenir.

### Teklifleri elle yenilemek
Uygulamada **Marketler → 🔄 Şimdi yeniden çek** → açılan GitHub sayfasında **Run workflow**.
(İstersen Ayarlar → Gelişmiş'e bir GitHub anahtarı girerek bu butonun doğrudan çalışmasını sağlayabilirsin; zorunlu değil.)

## Dosyalar
| Dosya | Ne işe yarar |
|---|---|
| `index.html`, `js/app.js` | Uygulama |
| `js/data.js` | Malzeme kataloğu, ortalama fiyatlar ve tarifler |
| `scripts/fetch-offers.mjs` | Teklifleri çeken ve eşleştiren betik |
| `config.json` | Posta kodu, marketler, arama terimleri |
| `data/offers.json` | Otomatik oluşturulan güncel teklifler |

> Teklif verisi marktguru.de üzerinden alınır. Bu resmi bir arayüz değildir; site değişirse betiğin güncellenmesi gerekebilir.
