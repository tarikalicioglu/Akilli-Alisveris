// Malzeme kataloğu: key:[Türkçe, Deutsch, reyon, birim, paketMiktarı, paketFiyatı€, kiler(0/1), notlar]
// Fiyatlar: Kasım 2026, Almanya discounter normal fiyat tahmini (Aldi/Lidl/Penny/Netto seviyesi). Uygulama içinde düzenlenebilir.
const ING_BASE = {
// ET & TAVUK
kiyma:["Dana kıyma","Rinderhackfleisch","et","g",500,4.99,0],
kkiyma:["Kuzu kıyma","Lammhackfleisch","et","g",400,5.99,0],
hackmix:["Karışık kıyma (dana-domuz)","Hackfleisch gemischt","et","g",500,3.99,0,"d"],
dana:["Dana kuşbaşı","Rindergulasch","et","g",500,6.99,0],
kuzu:["Kuzu eti (kuşbaşı/kol)","Lammfleisch (Keule/Gulasch)","et","g",400,8.49,0],
kuzuincik:["Kuzu incik","Lammhaxe","et","g",800,12.99,0],
kuzupirzola:["Kuzu pirzola","Lammkoteletts","et","g",400,8.99,0],
biftek:["Dana biftek/bonfile","Rindersteak / Hüftsteak","et","g",400,9.99,0],
rouladen:["Dana rulo dilim","Rinderrouladen","et","g",600,9.99,0],
rinderbraten:["Dana rosto eti","Rinderbraten","et","g",1000,13.99,0],
kalb:["Dana şnitzel (genç dana)","Kalbsschnitzel","et","g",400,9.99,0],
tgogus:["Tavuk göğsü","Hähnchenbrustfilet","et","g",600,5.99,0],
tbut:["Tavuk but/baget","Hähnchenschenkel / Unterkeulen","et","g",1000,4.49,0],
tbutfile:["Tavuk but eti (kemiksiz)","Hähnchen-Oberkeulenfilet","et","g",600,6.49,0],
tbutun:["Bütün tavuk","Hähnchen ganz","et","g",1200,5.49,0],
tkanat:["Tavuk kanat","Hähnchenflügel","et","g",1000,4.99,0],
ciger:["Dana ciğer","Rinderleber","et","g",500,3.49,0],
iskembe:["İşkembe","Kutteln (Pansen)","et","g",1000,6.99,0],
sucuk:["Sucuk","Sucuk (Knoblauchwurst)","et","g",250,3.49,0],
pastirma:["Pastırma","Pastirma","et","g",100,3.99,0],
hindifume:["Hindi füme / hindi jambon","Putenbrust (Aufschnitt)","et","g",150,1.99,0],
sosis:["Sosis (Wiener)","Wiener Würstchen","et","ad",8,2.49,0,"d"],
bratwurst:["Bratwurst","Bratwurst","et","ad",4,2.99,0,"d"],
mettwurst:["Mettwurst / Kohlwurst (Pinkel)","Mettwurst / Pinkel","et","ad",4,2.79,0,"d"],
blutwurst:["Kan sosisi","Blutwurst","et","g",300,1.99,0,"d"],
speck:["Domuz pastırması (speck)","Speckwürfel / Bacon","et","g",150,1.49,0,"d"],
jambon:["Domuz jambonu","Kochschinken","et","g",200,1.99,0,"d"],
schwschnitzel:["Domuz şnitzel","Schweineschnitzel","et","g",600,5.99,0,"d"],
schwnacken:["Domuz boyun eti","Schweinenacken / Schweinebraten","et","g",1000,7.49,0,"d"],
kassler:["Kassler (tütsülü domuz)","Kasseler","et","g",500,4.99,0,"d"],
leberkase:["Leberkäse","Leberkäse","et","g",500,3.29,0,"d"],
maultaschen:["Maultaschen (hazır)","Maultaschen","et","g",360,2.29,0,"d"],
// BALIK
somon:["Somon fileto","Lachsfilet","balik","g",250,4.49,0],
levrek:["Levrek/çupra","Wolfsbarsch / Dorade","balik","g",400,7.99,0],
hamsi:["Hamsi","Sardellen (frisch)","balik","g",500,6.99,0],
uskumru:["Uskumru","Makrele","balik","g",500,5.99,0],
beyazbalik:["Beyaz balık fileto","Seelachs-/Kabeljaufilet","balik","g",400,4.49,0],
karides:["Karides","Garnelen","balik","g",250,4.99,0],
midye:["Midye","Miesmuscheln","balik","g",1000,4.99,0],
ton:["Ton balığı (konserve)","Thunfisch (Dose)","konserve","ad",1,1.49,0],
fischstab:["Balık kroket (fish sticks)","Fischstäbchen","donuk","g",450,2.29,0],
// SEBZE & MEYVE
sogan:["Kuru soğan","Zwiebeln","sebze","ad",8,1.29,0,"~125g/ad"],
ksogan:["Kırmızı soğan","Rote Zwiebeln","sebze","ad",5,1.29,0],
ysogan:["Yeşil soğan","Lauchzwiebeln","sebze","demet",1,0.69,0],
sarimsak:["Sarımsak","Knoblauch","sebze","diş",30,1.29,0,"3 baş ≈ 30 diş"],
domates:["Domates","Tomaten","sebze","g",1000,2.49,0],
cdomates:["Çeri domates","Cherrytomaten","sebze","g",250,1.29,0],
salatalik:["Salatalık","Salatgurke","sebze","ad",1,0.69,0],
patlican:["Patlıcan","Aubergine","sebze","ad",1,0.99,0,"~300g/ad"],
kabak:["Kabak","Zucchini","sebze","ad",1,0.79,0,"~250g/ad"],
sbiber:["Sivri/çarliston biber","Spitzpaprika / grüne Peperoni","sebze","ad",3,1.99,0],
dbiber:["Dolmalık biber","Paprika (grün)","sebze","ad",3,1.99,0],
kbiber:["Kırmızı biber (kapya)","Paprika rot / Spitzpaprika rot","sebze","ad",3,1.99,0],
acibiber:["Acı biber","Chili / Peperoni scharf","sebze","ad",8,1.29,0],
patates:["Patates","Kartoffeln","sebze","g",2000,2.49,0],
havuc:["Havuç","Karotten","sebze","ad",10,0.99,0,"1kg ≈ 10 ad"],
ispanak:["Ispanak","Spinat (frisch/TK)","sebze","g",500,1.99,0],
pirasa:["Pırasa","Lauch / Porree","sebze","ad",1,0.79,0],
lahana:["Beyaz lahana","Weißkohl","sebze","ad",1,1.29,0],
karalahana:["Kara lahana","Grünkohl","sebze","g",500,2.49,0],
klahana:["Kırmızı lahana","Rotkohl","sebze","ad",1,1.29,0],
karnabahar:["Karnabahar","Blumenkohl","sebze","ad",1,1.99,0],
brokoli:["Brokoli","Brokkoli","sebze","ad",1,1.49,0],
tfasulye:["Taze fasulye","Grüne Bohnen (frisch/TK)","sebze","g",500,2.29,0],
bamya:["Bamya","Okra","sebze","g",400,2.49,0],
bezelye:["Bezelye (dondurulmuş)","Erbsen TK","donuk","g",750,1.79,0],
enginar:["Enginar","Artischocken(böden)","sebze","ad",4,3.99,0],
bakla:["Taze bakla","Dicke Bohnen (TK)","donuk","g",500,2.49,0],
semizotu:["Semizotu","Portulak","sebze","demet",1,1.99,0],
kereviz:["Kereviz (kök)","Knollensellerie","sebze","ad",1,1.49,0],
mantar:["Mantar","Champignons","sebze","g",400,1.69,0],
maydanoz:["Maydanoz","Petersilie","sebze","demet",1,0.79,0],
dereotu:["Dereotu","Dill","sebze","demet",1,0.99,0],
nane:["Taze nane","Minze","sebze","demet",1,0.99,0],
feslegen:["Fesleğen","Basilikum (Topf)","sebze","demet",1,1.49,0],
roka:["Roka","Rucola","sebze","g",125,0.99,0],
marul:["Marul","Römersalat / Eisberg","sebze","ad",1,0.99,0],
limon:["Limon","Zitronen","sebze","ad",5,1.49,0],
elma:["Elma","Äpfel","sebze","ad",6,2.29,0],
pancar:["Pancar (haşlanmış)","Rote Bete (gekocht)","sebze","g",500,1.29,0],
ayva:["Ayva","Quitten","sebze","ad",1,1.29,0],
balkabagi:["Bal kabağı","Hokkaido-Kürbis","sebze","ad",1,1.99,0],
spargel:["Kuşkonmaz","Spargel","sebze","g",500,4.99,0],
asma:["Asma yaprağı (salamura)","Weinblätter (eingelegt)","konserve","g",400,2.49,0],
kurudolma:["Kuru patlıcan/biber (dolmalık)","Getrocknete Auberginen/Paprika","kiler","ad",20,3.99,0],
kuruaci:["Kuru acı biber","Getrocknete Chilischoten","baharat","ad",20,1.99,0],
// SÜT & YUMURTA
sut:["Süt","Milch 3,5%","sut","ml",1000,0.99,0],
yogurt:["Yoğurt","Joghurt 3,5% / Türk. Joghurt","sut","g",1000,1.99,0],
suzme:["Süzme yoğurt","Griechischer Joghurt 10%","sut","g",500,1.49,0],
tereyagi:["Tereyağı","Butter","sut","g",250,1.15,0],
yumurta:["Yumurta","Eier","sut","ad",10,2.99,0],
bpeynir:["Beyaz peynir","Hirtenkäse / Weißkäse","sut","g",200,1.29,0],
kasar:["Kaşar peyniri","Gouda / Kaşar","sut","g",400,2.99,0],
mozzarella:["Mozzarella","Mozzarella","sut","g",125,0.79,0],
parmesan:["Parmesan","Hartkäse (Parmesan/Grana)","sut","g",100,1.99,0],
emmentaler:["Rende peynir (Emmental)","Emmentaler gerieben","sut","g",200,1.79,0],
krema:["Krema","Schlagsahne","sut","ml",200,0.85,0],
kpeynir:["Krem peynir","Frischkäse","sut","g",200,0.89,0],
schmand:["Ekşi krema","Schmand / Saure Sahne","sut","g",200,0.75,0],
quark:["Lor/quark","Speisequark","sut","g",500,1.19,0],
mascarpone:["Mascarpone","Mascarpone","sut","g",250,1.99,0],
camembert:["Camembert","Camembert","sut","g",250,1.79,0],
hollandaise:["Hollandaise sos","Sauce Hollandaise","sut","ml",250,0.99,0],
// KİLER
pirinc:["Pirinç","Reis (Rundkorn/Baldo)","kiler","g",1000,2.29,0],
risotto:["Risotto pirinci","Risottoreis","kiler","g",500,1.49,0],
bulgur:["Pilavlık bulgur","Bulgur grob","kiler","g",1000,1.99,0],
ibulgur:["Köftelik (ince) bulgur","Bulgur fein","kiler","g",1000,1.99,0],
kmercimek:["Kırmızı mercimek","Rote Linsen","kiler","g",500,1.49,0],
ymercimek:["Yeşil mercimek","Tellerlinsen","kiler","g",500,1.29,0],
nohut:["Nohut (kuru)","Kichererbsen getrocknet","kiler","g",1000,2.49,0],
nohutk:["Nohut (konserve)","Kichererbsen (Dose)","konserve","ad",1,0.79,0],
kfasulye:["Kuru fasulye","Weiße Bohnen getrocknet","kiler","g",500,1.49,0],
barbunya:["Barbunya (konserve)","Kidney-/Borlotti-Bohnen (Dose)","konserve","ad",1,0.89,0],
fava:["Kuru bakla (fava)","Getrocknete Ackerbohnen","kiler","g",500,2.49,0],
schaelerbsen:["Kuru bezelye","Schälerbsen","kiler","g",500,1.29,0],
bugday:["Aşurelik/dövme buğday","Weizenkörner (geschält)","kiler","g",1000,2.49,0],
tarhana:["Tarhana","Tarhana","kiler","g",500,2.99,0],
un:["Un","Weizenmehl","kiler","g",1000,0.59,0],
misirunu:["Mısır unu","Maismehl","kiler","g",500,1.29,0],
irmik:["İrmik","Weichweizengrieß","kiler","g",500,0.89,0],
nisasta:["Nişasta","Speisestärke","kiler","g",400,1.29,0],
seker:["Toz şeker","Zucker","kiler","g",1000,0.99,0],
kabartma:["Kabartma tozu","Backpulver","kiler","paket",5,0.49,0],
vanilin:["Vanilin şeker","Vanillinzucker","kiler","paket",5,0.49,0],
maya:["Kuru maya","Trockenhefe","kiler","paket",3,0.39,0],
puding:["Vanilyalı puding tozu","Puddingpulver Vanille","kiler","paket",3,0.69,0],
galeta:["Galeta unu","Paniermehl","kiler","g",400,0.69,0],
makarna:["Makarna (penne/burgu)","Nudeln (Penne/Fusilli)","kiler","g",500,0.79,0],
spagetti:["Spagetti","Spaghetti","kiler","g",500,0.79,0],
lazanya:["Lazanya yaprağı","Lasagneplatten","kiler","g",500,1.29,0],
eriste:["Erişte","Eriste (türk. Bandnudeln)","kiler","g",500,1.99,0],
sehriye:["Arpa/tel şehriye","Suppennudeln / Arpa Şehriye","kiler","g",500,0.99,0],
spatzle:["Spätzle","Spätzle","kiler","g",500,1.29,0],
gnocchi:["Gnocchi","Gnocchi","kiler","g",500,1.29,0],
schupf:["Schupfnudeln","Schupfnudeln","kiler","g",500,1.49,0],
knodel:["Patates köftesi (Knödel)","Kartoffelknödel","kiler","ad",6,1.49,0],
mantihaz:["Hazır mantı (dondurulmuş)","Manti TK","donuk","g",1000,4.99,0],
pommes:["Patates kızartması (dondurulmuş)","Pommes frites TK","donuk","g",750,1.49,0],
yufka:["Yufka","Yufka-Teigblätter","firin","paket",1,2.49,0],
baklavayufka:["Baklava yufkası","Baklava-Teig","firin","paket",1,2.99,0],
milfoy:["Milföy hamuru","Blätterteig","firin","paket",1,1.29,0],
flammteig:["Flammkuchen hamuru","Flammkuchenteig","firin","paket",1,1.49,0],
kadayif:["Tel kadayıf","Kadayif-Teig","firin","g",500,2.99,0],
gullac:["Güllaç yaprağı","Güllaç-Blätter","firin","paket",1,2.99,0],
jelatin:["Jelatin (yaprak)","Blattgelatine","kiler","ad",6,1.29,0],
kedidili:["Kedi dili bisküvi","Löffelbiskuits","kiler","g",200,1.29,0],
lavas:["Lavaş/dürüm","Wraps / Lavash","firin","ad",6,1.49,0],
pide:["Pide ekmeği","Fladenbrot","firin","ad",1,1.29,0],
ekmek:["Ekmek","Brot / Baguette","firin","ad",1,1.49,0],
tost:["Tost ekmeği","Toastbrot","firin","ad",20,0.99,0],
ceviz:["Ceviz içi","Walnusskerne","kiler","g",200,2.49,0],
fistik:["Antep fıstığı (iç)","Pistazienkerne","kiler","g",100,3.49,0],
camfistik:["Çam fıstığı","Pinienkerne","kiler","g",50,2.29,0],
kusuzumu:["Kuş üzümü/kuru üzüm","Korinthen / Rosinen","kiler","g",200,1.29,0],
kayisi:["Kuru kayısı","Getrocknete Aprikosen","kiler","g",200,2.29,0],
cikolata:["Bitter çikolata","Zartbitterschokolade","kiler","g",100,0.89,0],
kakao:["Kakao","Backkakao","kiler","g",125,1.49,0],
kahve:["Kahve (espresso)","Kaffee / Espresso","kiler","g",250,3.99,1],
tahin:["Tahin","Tahini (Sesammus)","kiler","g",300,2.99,0],
pekmez:["Üzüm pekmezi","Traubensirup","kiler","g",400,2.49,0],
// KONSERVE & SOS
salca:["Domates salçası","Tomatenmark","konserve","yk",13,0.59,0,"200g ≈ 13 yk"],
bsalca:["Biber salçası","Paprikamark (Biber Salçası)","konserve","yk",45,2.99,0,"680g ≈ 45 yk"],
dkonserve:["Doğranmış domates (konserve)","Gehackte Tomaten (Dose)","konserve","ad",1,0.69,0],
passata:["Süzme domates (passata)","Passierte Tomaten","konserve","ml",500,0.79,0],
misir:["Mısır (konserve)","Mais (Dose)","konserve","ad",1,0.89,0],
zeytin:["Zeytin","Oliven","konserve","g",200,1.29,0],
tursu:["Kornişon turşu","Gewürzgurken","konserve","g",670,1.29,0],
sauerkraut:["Lahana turşusu (Sauerkraut)","Sauerkraut","konserve","ad",1,0.79,0],
kapari:["Kapari","Kapern","konserve","g",100,1.29,0],
apfelmus:["Elma püresi","Apfelmus","konserve","ml",720,1.29,0],
narek:["Nar ekşisi","Granatapfelsirup","konserve","ml",250,1.99,0],
sirke:["Sirke","Essig","konserve","ml",750,0.69,1],
hardal:["Hardal","Senf","konserve","yk",13,0.49,1],
mayonez:["Mayonez","Mayonnaise","konserve","ml",250,0.99,0],
ketcap:["Ketçap","Ketchup","konserve","ml",500,1.29,0],
bulyon:["Bulyon (et/tavuk/sebze)","Brühwürfel","konserve","ad",8,0.59,1],
ksarap:["Kırmızı şarap (yemeklik)","Rotwein trocken","icecek","ml",750,2.99,0],
bsarap:["Beyaz şarap (yemeklik)","Weißwein trocken","icecek","ml",750,2.99,0],
bira:["Bira (koyu)","Dunkelbier","icecek","ml",500,1.09,0],
zyagi:["Zeytinyağı","Olivenöl","kiler","ml",1000,7.49,0],
aycicek:["Ayçiçek yağı","Sonnenblumenöl","kiler","ml",1000,1.69,0],
// BAHARAT (genelde evde var)
tuz:["Tuz","Salz","baharat","çk",200,0.39,1],
karabiber:["Karabiber","Pfeffer schwarz","baharat","çk",25,1.29,1],
kimyon:["Kimyon","Kreuzkümmel","baharat","çk",25,1.29,1],
kummel:["Karaman kimyonu","Kümmel","baharat","çk",25,1.29,1],
kekik:["Kekik","Thymian/Oregano","baharat","çk",25,1.29,1],
nanek:["Kuru nane","Minze getrocknet","baharat","çk",25,1.29,1],
pul:["Pul biber","Pul Biber","baharat","çk",50,1.99,1],
tozbiber:["Toz kırmızı biber (tatlı)","Paprikapulver edelsüß","baharat","çk",25,1.29,1],
isot:["İsot","Isot Biber","baharat","çk",50,2.49,1],
sumak:["Sumak","Sumach","baharat","çk",40,1.99,1],
tarcin:["Tarçın","Zimt","baharat","çk",20,1.29,1],
yenibahar:["Yenibahar","Piment","baharat","çk",20,1.49,1],
defne:["Defne yaprağı","Lorbeerblätter","baharat","ad",20,0.99,1],
kori:["Köri","Currypulver","baharat","çk",20,1.29,1],
muskat:["Muskat","Muskatnuss","baharat","çk",20,1.49,1]
};
const AISLES = {et:"🥩 Et & Tavuk",balik:"🐟 Balık",sebze:"🥬 Sebze & Meyve",sut:"🧀 Süt, Peynir & Yumurta",kiler:"🌾 Kiler (Bakliyat, Un, Makarna)",konserve:"🥫 Konserve & Soslar",firin:"🥖 Ekmek & Hamur",donuk:"🧊 Dondurulmuş",baharat:"🧂 Baharat",icecek:"🍷 İçecek",diger:"🛒 Diğer"};
const UNITS = {g:"g",ml:"ml",ad:"adet",demet:"demet","diş":"diş",yk:"yemek kaşığı","çk":"çay kaşığı",paket:"paket"};
// Tarifler: R(id, ad, mutfak, kategori, etiketler, yöre, malzemeler | [[varyant, malzemeler, not, ekEtiket]...])
// Malzemeler 4 kişilik. Etiketler: e=etli, v=etsiz, z=zeytinyağlı, s=sulu, d=domuz eti
const RECIPES = [];
function R(id,name,cu,cat,tags,region,ings,note){RECIPES.push({id,name,cu,cat,tags,region,ings,note});}

// ===== ÇORBALAR =====
R("mercimek","Mercimek çorbası","tr","corba","v s","Tüm Türkiye",[
 ["Klasik (havuçlu-patatesli)","kmercimek 270, sogan 1, havuc 1, patates 150, tereyagi 30, salca 1, un 10, kimyon 1, pul 1, limon 1, tuz 1"],
 ["Lokanta usulü (sade, unlu)","kmercimek 270, sogan 1, un 20, tereyagi 40, bulyon 1, kimyon 1, pul 1, limon 1, tuz 1"],
 ["Süzme (patatessiz, kremalı)","kmercimek 270, sogan 1, havuc 1, krema 100, tereyagi 30, kimyon 1, limon 1, tuz 1"]]);
R("ezogelin","Ezogelin çorbası","tr","corba","v s","Gaziantep","kmercimek 200, pirinc 40, ibulgur 50, sogan 1, salca 2, bsalca 1, tereyagi 40, nanek 2, pul 1, kimyon 1, limon 1");
R("yayla","Yayla çorbası","tr","corba","v s","Tüm Türkiye","yogurt 500, pirinc 80, yumurta 1, un 20, tereyagi 30, nanek 2, tuz 1");
R("tarhanacorba","Tarhana çorbası","tr","corba","v s","Uşak / Orta Anadolu",[
 ["Klasik (salçalı)","tarhana 120, salca 1, tereyagi 30, sarimsak 2, nanek 1, tuz 1"],
 ["Kırşehir/Yozgat usulü (nohutlu, etli suyla)","tarhana 120, nohutk 1, salca 1, tereyagi 30, kuzu 150, nanek 1, pul 1"],
 ["Maraş tarhanası (kuru, yoğurtlu)","tarhana 150, yogurt 200, tereyagi 40, sarimsak 2, nanek 1"]]);
R("domatescorba","Domates çorbası","tr","corba","v s","Tüm Türkiye","domates 800, un 30, tereyagi 30, sut 250, salca 1, kasar 80, tuz 1");
R("tavukcorba","Tavuk suyu çorbası","tr","corba","e s","Tüm Türkiye",[
 ["Şehriyeli","tbut 600, sehriye 80, havuc 1, limon 1, tereyagi 20, tuz 1, karabiber 1"],
 ["Terbiyeli (yumurta-limonlu)","tbut 600, pirinc 50, un 20, yumurta 1, limon 1, tereyagi 20, tuz 1"],
 ["Kremalı","tgogus 300, un 40, sut 500, tereyagi 30, havuc 1, tuz 1"]]);
R("dugun","Düğün çorbası","tr","corba","e s","Orta Anadolu","kuzu 300, un 30, yumurta 1, yogurt 200, limon 1, tereyagi 30, pul 1, tuz 1");
R("iskembe","İşkembe çorbası","tr","corba","e s","İstanbul / Tüm Türkiye","iskembe 1000, sarimsak 6, sirke 100, un 30, yumurta 1, limon 1, tereyagi 30, pul 1, tuz 1");
R("mantarcorba","Kremalı mantar çorbası","tr","corba","v s","","mantar 400, sogan 1, krema 200, un 20, tereyagi 30, sut 250, tuz 1");
R("sebzecorba","Sebze çorbası","tr","corba","v s","","havuc 2, patates 300, kabak 1, sogan 1, bezelye 100, salca 1, tereyagi 20, tuz 1");
R("brokolicorba","Brokoli çorbası","tr","corba","v s","","brokoli 1, patates 200, sogan 1, krema 200, tereyagi 20, tuz 1");
R("balkabagicorba","Balkabağı çorbası","tr","corba","v s","","balkabagi 1, sogan 1, havuc 1, krema 200, tereyagi 20, tuz 1");
R("arabasi","Arabaşı çorbası","tr","corba","e s","Yozgat / Kayseri","tgogus 400, un 150, salca 2, bsalca 1, limon 1, tereyagi 30, pul 1, tuz 1");
R("beyran","Beyran","tr","corba","e s","Gaziantep","kuzu 400, pirinc 100, sarimsak 6, bsalca 1, tereyagi 30, pul 2, tuz 1");
R("ymercimekcorba","Yeşil mercimek çorbası","tr","corba","v s","","ymercimek 250, sogan 1, havuc 1, patates 150, salca 1, tereyagi 20, nanek 1, tuz 1");
R("sehriyecorba","Domatesli şehriye çorbası","tr","corba","v s","","sehriye 100, domates 200, salca 1, tereyagi 20, bulyon 1, tuz 1");
R("toyga","Toyga çorbası","tr","corba","v s","Orta Anadolu","yogurt 500, bugday 100, nohutk 1, un 20, yumurta 1, tereyagi 30, nanek 2");
R("lebeniye","Lebeniye (köfteli yoğurt çorbası)","tr","corba","e s","Gaziantep / Hatay","kiyma 200, yogurt 750, nohutk 1, pirinc 50, yumurta 1, un 20, tereyagi 30, nanek 2");
R("kellepaca","Paça çorbası (dana incik ile)","tr","corba","e s","Tüm Türkiye","dana 500, sarimsak 5, sirke 50, un 30, yumurta 1, limon 1, tereyagi 30, pul 1");
R("keledos","Keledoş","tr","corba","e s","Van","kuzu 400, ymercimek 150, nohutk 1, kfasulye 100, bulgur 100, yogurt 500, karalahana 300, tereyagi 40, nanek 1");
R("kesme","Kesme çorbası (ev eriştesiyle)","tr","corba","v s","Doğu Anadolu","un 200, yumurta 1, ymercimek 100, salca 1, tereyagi 30, nanek 1, pul 1");

// ===== ETLİ YEMEKLER =====
R("tas","Tas kebabı","tr","etli","e s","Tüm Türkiye","dana 600, sogan 2, salca 2, domates 300, tereyagi 30, patates 300, tuz 1, karabiber 1");
R("orman","Orman kebabı","tr","etli","e s","Tüm Türkiye","kuzu 600, patates 400, havuc 2, bezelye 150, sogan 2, domates 200, tereyagi 30, tuz 1");
R("hunkar","Hünkar beğendi","tr","etli","e","İstanbul (Saray mutfağı)","kuzu 600, sogan 1, domates 300, sbiber 2, salca 1, patlican 5, sut 400, un 40, tereyagi 50, kasar 80, tuz 1");
R("alinazik","Ali Nazik","tr","etli","e","Gaziantep",[
 ["Kıymalı","kkiyma 500, patlican 5, yogurt 500, sarimsak 3, tereyagi 40, sbiber 2, pul 1, tuz 1"],
 ["Kuşbaşılı","kuzu 500, patlican 5, yogurt 500, sarimsak 3, tereyagi 40, domates 200, pul 1, tuz 1"]]);
R("incik","Fırında kuzu incik","tr","etli","e","Tüm Türkiye","kuzuincik 1600, sogan 2, havuc 2, sarimsak 6, domates 300, salca 1, patates 500, defne 2, kekik 1, tuz 1");
R("etlipatates","Etli patates yemeği","tr","etli","e s","","dana 400, patates 800, sogan 1, salca 2, domates 200, tuz 1");
R("etlibezelye","Etli bezelye","tr","etli","e s","","dana 300, bezelye 500, havuc 1, patates 200, sogan 1, salca 1, tuz 1");
R("etlitfasulye","Etli taze fasulye","tr","etli","e s","","dana 300, tfasulye 750, sogan 1, domates 400, salca 1, tuz 1");
R("etlibamya","Etli bamya","tr","etli","e s","Güneydoğu / Ege","kuzu 300, bamya 500, sogan 1, domates 300, salca 1, limon 1, tuz 1");
R("kapuska","Kapuska (kıymalı lahana)","tr","etli","e s","Karadeniz / Orta Anadolu","kiyma 250, lahana 1, sogan 1, salca 2, pirinc 50, pul 1, tuz 1");
R("etlipirasa","Etli pırasa","tr","etli","e s","","kiyma 250, pirasa 4, havuc 1, pirinc 50, salca 1, limon 1, tuz 1");
R("etliispanak","Kıymalı ıspanak","tr","etli","e s","","kiyma 250, ispanak 1000, sogan 1, pirinc 50, salca 1, yogurt 250, tuz 1");
R("turlu","Türlü","tr","etli","e s","Tüm Türkiye",[
 ["Etli","dana 400, patlican 2, kabak 2, patates 300, tfasulye 250, dbiber 2, domates 400, sogan 2, salca 1, tuz 1"],
 ["Etsiz (zeytinyağlı)","patlican 2, kabak 2, patates 300, tfasulye 250, dbiber 2, domates 400, sogan 2, salca 1, zyagi 80, tuz 1","","v z"]]);
R("kapama","Kuzu kapama","tr","etli","e","İstanbul","kuzu 1000, marul 2, ysogan 2, dereotu 1, tereyagi 50, tuz 1");
R("elbasan","Elbasan tava","tr","etli","e","Rumeli (Balkan)","kuzu 600, yogurt 600, yumurta 2, un 50, tereyagi 60, tuz 1");
R("testi","Testi kebabı","tr","etli","e","Nevşehir (Kapadokya)","dana 700, sogan 2, domates 400, sbiber 4, sarimsak 4, tereyagi 50, salca 1, tuz 1");
R("sackavurma","Saç kavurma","tr","etli","e","Tüm Türkiye","kuzu 700, sogan 2, sbiber 4, domates 300, tereyagi 30, tuz 1");
R("kavurma","Et kavurma","tr","etli","e","Tüm Türkiye","kuzu 1000, tereyagi 50, tuz 1");
R("guvec","Etli sebze güveç","tr","etli","e","Tüm Türkiye","dana 500, patlican 2, sbiber 3, domates 400, sogan 2, sarimsak 4, patates 300, tuz 1");
R("cobankavurma","Çoban kavurma","tr","etli","e","","dana 500, sogan 2, dbiber 2, sbiber 3, domates 300, tereyagi 30, tuz 1");
R("etsote","Et sote","tr","etli","e","","dana 600, sogan 1, dbiber 2, domates 300, sarimsak 3, tereyagi 30, tuz 1");
R("tandir","Fırında kuzu tandır","tr","etli","e","Konya (Fırın kebabı)","kuzu 1500, sogan 2, sarimsak 6, tereyagi 50, kekik 1, tuz 1");
R("karniyarik","Karnıyarık","tr","etli","e","Tüm Türkiye","kiyma 300, patlican 6, sogan 2, sarimsak 3, sbiber 4, domates 400, salca 1, maydanoz 1, aycicek 300, tuz 1");
R("musakka","Patlıcan musakka","tr","etli","e","Tüm Türkiye","kiyma 400, patlican 5, sogan 1, sbiber 3, domates 400, salca 1, aycicek 300, tuz 1");
R("kiymalipatates","Fırında kıymalı patates","tr","etli","e","","kiyma 400, patates 800, sogan 1, salca 2, domates 300, sbiber 2, tuz 1");
R("kabakmusakka","Kıymalı kabak (kabak musakka)","tr","etli","e","","kiyma 300, kabak 5, sogan 1, domates 300, salca 1, tuz 1");
R("tavalokmasi","Patlıcan oturtma","tr","etli","e","İstanbul","kiyma 350, patlican 4, sogan 1, sbiber 3, domates 300, salca 1, aycicek 300, tuz 1");
R("kagitkebabi","Kağıt kebabı","tr","etli","e","Tüm Türkiye","kuzu 600, patates 300, havuc 1, bezelye 100, sbiber 2, domates 200, tereyagi 30, kekik 1");
R("ciger","Ciğer tava","tr","etli","e","",[
 ["Edirne usulü (ince kızartma)","ciger 600, un 50, aycicek 300, ksogan 1, sumak 1, acibiber 2, tuz 1"],
 ["Arnavut ciğeri (küp, baharatlı)","ciger 600, un 40, aycicek 200, ksogan 2, maydanoz 1, pul 1, kimyon 1, tuz 1"]]);

// ===== TAVUK =====
R("tavuksote","Tavuk sote","tr","tavuk","e","","tgogus 700, sogan 1, dbiber 2, kbiber 1, mantar 200, domates 300, salca 1, tuz 1");
R("firintavuk","Fırında tavuk-patates","tr","tavuk","e","","tbut 1200, patates 1000, salca 2, sarimsak 4, zyagi 60, tozbiber 1, kekik 1, tuz 1");
R("tavuksis","Tavuk şiş","tr","tavuk","e","","tgogus 800, yogurt 200, salca 1, sarimsak 3, sbiber 4, domates 300, lavas 4, tuz 1");
R("cerkez","Çerkez tavuğu","tr","tavuk","e","Çerkes mutfağı","tgogus 700, ceviz 250, ekmek 1, sarimsak 3, tozbiber 1, tuz 1");
R("tavukhaslama","Tavuk haşlama","tr","tavuk","e s","","tbutun 1200, patates 400, havuc 2, sogan 1, limon 1, tuz 1");
R("tavukguvec","Tavuk güveç","tr","tavuk","e","","tbutfile 800, patates 300, sbiber 3, domates 400, sogan 1, mantar 200, kasar 100, tuz 1");
R("kanat","Fırında soslu tavuk kanat","tr","tavuk","e","","tkanat 1200, salca 1, bsalca 1, zyagi 50, sarimsak 3, pul 1, tuz 1");
R("tavukdoner","Ev usulü tavuk döner","tr","tavuk","e","","tbutfile 1000, yogurt 200, salca 1, sarimsak 3, lavas 6, domates 300, marul 1, tursu 150, tuz 1");
R("kremalitavuk","Kremalı mantarlı tavuk","tr","tavuk","e","","tgogus 700, mantar 300, krema 200, sogan 1, tereyagi 20, kasar 80, tuz 1");
R("tavukkofte","Tavuk köfte","tr","tavuk","e","","tgogus 600, sogan 1, galeta 40, yumurta 1, maydanoz 1, kimyon 1, tuz 1");
R("tavukpilav","Pilav üstü tavuk (nohutlu)","tr","tavuk","e","İstanbul seyyar usulü","tbut 800, pirinc 400, nohutk 1, tereyagi 50, bulyon 1, tuz 1");
R("tavukdurum","Tavuk dürüm","tr","tavuk","e","","tgogus 600, lavas 4, domates 200, marul 1, ksogan 1, yogurt 150, sumak 1, tuz 1");
R("tavuktantuni","Tavuk tantuni","tr","tavuk","e","Mersin","tgogus 600, lavas 6, domates 300, ksogan 2, maydanoz 1, sumak 1, pul 1, limon 1");

// ===== KEBAPLAR & IZGARA =====
R("kiymakebabi","Kıyma kebabı (Adana / Urfa)","tr","kebap","e","Adana / Şanlıurfa",[
 ["Adana usulü (acılı)","kkiyma 800, kbiber 2, pul 3, lavas 4, sogan 2, sumak 1, domates 300, sbiber 4, maydanoz 1, tuz 1"],
 ["Urfa usulü (acısız, isotlu)","kkiyma 800, kbiber 2, isot 1, lavas 4, sogan 2, sumak 1, domates 300, sbiber 4, maydanoz 1, tuz 1"]]);
R("iskender","İskender kebap (ev usulü)","tr","kebap","e","Bursa","biftek 600, pide 2, yogurt 500, tereyagi 100, salca 1, domates 300, sbiber 4, tuz 1");
R("beyti","Beyti sarma","tr","kebap","e","İstanbul","kiyma 600, lavas 4, yogurt 400, salca 2, tereyagi 50, sarimsak 2, pul 1, tuz 1");
R("patlicankebabi","Patlıcan kebabı","tr","kebap","e","Gaziantep / Şanlıurfa","kiyma 600, patlican 4, domates 300, sbiber 4, sogan 1, lavas 4, tuz 1");
R("kuzusis","Kuzu şiş","tr","kebap","e","","kuzu 800, sogan 1, sbiber 4, domates 300, yogurt 100, lavas 4, kekik 1, tuz 1");
R("cag","Cağ kebabı","tr","kebap","e","Erzurum","kuzu 800, sogan 2, karabiber 1, lavas 4, ksogan 1, maydanoz 1, tuz 1");
R("tantuni","Tantuni","tr","kebap","e","Mersin","dana 600, lavas 6, domates 300, ksogan 2, maydanoz 1, sumak 1, pul 1, limon 1, aycicek 50, tuz 1");
R("pirzola","Kuzu pirzola ızgara","tr","kebap","e","","kuzupirzola 1000, sogan 1, kekik 1, zyagi 30, sbiber 4, domates 300, tuz 1");
R("islim","İslim kebabı","tr","kebap","e","Tüm Türkiye","kiyma 500, patlican 4, domates 300, sbiber 4, sogan 1, galeta 30, yumurta 1, salca 1, aycicek 200, tuz 1");
R("izgarakofte","Izgara köfte","tr","kofte","e","Tüm Türkiye",[
 ["Ev usulü","kiyma 600, sogan 1, galeta 50, yumurta 1, maydanoz 1, kimyon 1, tuz 1"],
 ["İnegöl usulü (sadece et-soğan)","kiyma 700, sogan 1, tuz 1, karabiber 1"],
 ["Tekirdağ usulü (bayat ekmek, kimyon)","kiyma 600, ekmek 1, sogan 1, kimyon 2, tuz 1, karabiber 1"],
 ["Akçaabat usulü (sarımsaklı)","kiyma 600, ekmek 1, sarimsak 4, sogan 1, tuz 1, karabiber 1"],
 ["Sultanahmet köftesi","kiyma 600, galeta 60, sogan 1, sarimsak 2, kimyon 1, tuz 1"]]);
R("izmirkofte","İzmir köfte","tr","kofte","e","İzmir","kiyma 500, patates 600, sbiber 4, domates 400, salca 1, sogan 1, galeta 50, yumurta 1, kimyon 1, tuz 1");
R("kadinbudu","Kadınbudu köfte","tr","kofte","e","İstanbul","kiyma 500, pirinc 80, sogan 1, yumurta 2, un 50, aycicek 300, tuz 1");
R("ekslikofte","Sulu köfte (ekşili köfte)","tr","kofte","e s","Ege / İstanbul",[
 ["Terbiyeli (yumurta-limonlu)","kiyma 300, pirinc 50, sogan 1, havuc 1, patates 200, limon 1, yumurta 1, un 20, maydanoz 1, tuz 1"],
 ["Salçalı","kiyma 300, pirinc 50, sogan 1, havuc 1, patates 200, salca 2, maydanoz 1, tuz 1"]]);
R("iclikofte","İçli köfte","tr","kofte","e","Güneydoğu Anadolu",[
 ["Antep usulü (bulgur-irmik, cevizli)","ibulgur 300, irmik 100, kiyma 300, sogan 2, ceviz 80, bsalca 2, pul 1, kimyon 1, aycicek 700, tuz 1"],
 ["Hatay usulü (kibbe, fıstıklı)","ibulgur 300, kiyma 400, sogan 2, ceviz 50, fistik 30, bsalca 1, pul 1, yenibahar 1, aycicek 700, tuz 1"],
 ["Diyarbakır usulü (haşlama)","ibulgur 300, kiyma 400, sogan 2, ceviz 50, bsalca 2, pul 1, tuz 1"],
 ["Fırında içli köfte (tepsi)","ibulgur 300, kiyma 400, sogan 2, ceviz 80, salca 2, tereyagi 80, pul 1, tuz 1"]]);
R("kasapkofte","Kasap köfte (fırında)","tr","kofte","e","","kiyma 600, sogan 1, ekmek 1, patates 500, sbiber 3, domates 300, tuz 1");
R("misketkofte","Misket köfte (sebzeli)","tr","kofte","e","","kiyma 500, sogan 1, galeta 40, yumurta 1, havuc 1, patates 300, bezelye 100, salca 1, tuz 1");

// ===== ZEYTİNYAĞLILAR =====
R("zyfasulye","Zeytinyağlı taze fasulye","tr","zeytinyagli","v z","Ege","tfasulye 750, sogan 2, domates 400, zyagi 100, seker 10, tuz 1");
R("enginar","Zeytinyağlı enginar","tr","zeytinyagli","v z","İstanbul / Ege","enginar 8, bezelye 150, havuc 2, patates 200, dereotu 1, limon 2, zyagi 100, un 10, tuz 1");
R("zypirasa","Zeytinyağlı pırasa","tr","zeytinyagli","v z","","pirasa 5, havuc 2, pirinc 50, limon 1, zyagi 80, seker 5, tuz 1");
R("zybarbunya","Zeytinyağlı barbunya","tr","zeytinyagli","v z","","barbunya 2, sogan 1, havuc 1, domates 300, sarimsak 3, zyagi 80, maydanoz 1, tuz 1");
R("imambayildi","İmam bayıldı","tr","zeytinyagli","v z","Osmanlı / İstanbul","patlican 6, sogan 3, sarimsak 6, domates 400, sbiber 4, maydanoz 1, zyagi 150, seker 5, tuz 1");
R("zykereviz","Zeytinyağlı kereviz","tr","zeytinyagli","v z","İstanbul","kereviz 2, havuc 1, sogan 1, bezelye 100, limon 1, zyagi 80, seker 10, tuz 1");
R("zybakla","Zeytinyağlı bakla","tr","zeytinyagli","v z","Ege","bakla 500, sogan 1, dereotu 1, limon 1, zyagi 80, yogurt 250, tuz 1");
R("zybamya","Zeytinyağlı bamya","tr","zeytinyagli","v z","","bamya 500, sogan 1, domates 300, limon 1, zyagi 80, tuz 1");
R("zykarnabahar","Zeytinyağlı karnabahar","tr","zeytinyagli","v z","","karnabahar 1, havuc 1, patates 200, sogan 1, limon 1, zyagi 80, tuz 1");
R("zylahana","Zeytinyağlı lahana kavurma","tr","zeytinyagli","v z","Karadeniz","lahana 1, sogan 1, salca 1, pirinc 50, zyagi 80, pul 1, tuz 1");
R("zykabak","Zeytinyağlı kabak","tr","zeytinyagli","v z","","kabak 5, sogan 1, domates 300, pirinc 40, dereotu 1, zyagi 80, tuz 1");
R("pilaki","Fasulye pilakisi","tr","zeytinyagli","v z","İstanbul / Karadeniz","kfasulye 300, sogan 2, havuc 2, patates 200, sarimsak 4, zyagi 100, limon 1, maydanoz 1, tuz 1");
R("zyispanak","Zeytinyağlı ıspanak","tr","zeytinyagli","v z","","ispanak 1000, sogan 1, pirinc 50, zyagi 60, yogurt 250, tuz 1");

// ===== DOLMA & SARMA =====
R("biberdolma","Biber dolması","tr","dolma","","Tüm Türkiye",[
 ["Zeytinyağlı (etsiz, iç pilavlı)","dbiber 10, pirinc 300, sogan 3, domates 200, kusuzumu 30, camfistik 20, nanek 1, yenibahar 1, zyagi 120, limon 1, tuz 1","","v z"],
 ["Etli","dbiber 10, kiyma 400, pirinc 150, sogan 1, domates 300, salca 2, nanek 1, maydanoz 1, yogurt 300, tuz 1","","e"]]);
R("yaprak","Yaprak sarma","tr","dolma","","Tüm Türkiye",[
 ["Zeytinyağlı (İstanbul/Ege)","asma 400, pirinc 300, sogan 3, kusuzumu 30, camfistik 30, nanek 1, yenibahar 1, tarcin 1, limon 2, zyagi 150, tuz 1","","v z"],
 ["Etli (yoğurtlu)","asma 400, kiyma 400, pirinc 150, sogan 1, salca 2, nanek 1, yogurt 400, tereyagi 30, tuz 1","","e"],
 ["Tokat usulü (tereyağlı, salçalı)","asma 400, kiyma 300, pirinc 100, bulgur 100, sogan 1, salca 2, bsalca 1, tereyagi 50, yogurt 300","","e"],
 ["Güneydoğu usulü (ekşili, bulgurlu)","asma 400, kiyma 300, bulgur 200, sogan 1, bsalca 2, narek 50, limon 1, sarimsak 4","","e"]]);
R("kabakdolma","Kabak dolması","tr","dolma","","Tüm Türkiye",[
 ["Etli","kabak 8, kiyma 400, pirinc 150, sogan 1, domates 300, salca 1, nane 1, yogurt 300, tuz 1","","e"],
 ["Zeytinyağlı","kabak 8, pirinc 250, sogan 2, domates 300, dereotu 1, nane 1, zyagi 100, tuz 1","","v z"]]);
R("lahanasarma","Lahana sarması","tr","dolma","","Tüm Türkiye",[
 ["Etli (İstanbul usulü)","lahana 1, kiyma 400, pirinc 150, sogan 1, salca 2, tereyagi 30, limon 1, yogurt 300, tuz 1","","e"],
 ["Zeytinyağlı","lahana 1, pirinc 300, sogan 3, kusuzumu 30, camfistik 20, yenibahar 1, zyagi 120, limon 1, tuz 1","","v z"],
 ["Karadeniz kara lahana sarması","karalahana 1000, kiyma 300, pirinc 150, misirunu 50, sogan 1, salca 1, tereyagi 30, pul 1, tuz 1","","e"]]);
R("patlicandolma","Patlıcan dolması","tr","dolma","e","Güneydoğu","patlican 8, kiyma 400, pirinc 150, sogan 1, domates 300, salca 2, tuz 1");
R("kurudolma","Kuru dolma","tr","dolma","e","Gaziantep",[
 ["Antep usulü (etli, ekşili)","kurudolma 20, kiyma 400, pirinc 200, sogan 1, domates 200, bsalca 2, salca 1, narek 50, sarimsak 4, nanek 1, tuz 1"],
 ["Zeytinyağlı (etsiz)","kurudolma 20, pirinc 300, sogan 2, bsalca 2, narek 50, zyagi 100, nanek 1, tuz 1","","v z"]]);
R("mumbar","Domates dolması (etli)","tr","dolma","e","","domates 1200, kiyma 400, pirinc 150, sogan 1, maydanoz 1, nanek 1, tuz 1");

// ===== ETSİZ SEBZE =====
R("patatesyemegi","Patates yemeği (etsiz)","tr","sebze","v s","","patates 1000, sogan 1, salca 2, sbiber 2, aycicek 50, tuz 1");
R("ispanakyemek","Ispanak yemeği (yumurtalı)","tr","sebze","v s","","ispanak 1000, sogan 1, pirinc 50, salca 1, yumurta 4, yogurt 250, tuz 1");
R("mucver","Mücver","tr","sebze","v","Tüm Türkiye","kabak 3, yumurta 3, un 80, bpeynir 100, dereotu 1, ysogan 1, aycicek 300, tuz 1");
R("bezelyeyemek","Bezelye yemeği (etsiz)","tr","sebze","v s","","bezelye 750, havuc 1, patates 200, sogan 1, salca 1, aycicek 40, tuz 1");
R("firinsebze","Fırında sebze","tr","sebze","v","","patates 600, kabak 2, patlican 1, kbiber 2, havuc 2, sogan 2, zyagi 60, kekik 1, tuz 1");
R("mantarsote","Mantar sote","tr","sebze","v","","mantar 800, sogan 1, sbiber 2, tereyagi 30, kekik 1, tuz 1");
R("karnabaharkizartma","Karnabahar kızartması","tr","sebze","v","","karnabahar 1, yumurta 2, un 80, aycicek 400, yogurt 300, sarimsak 2, tuz 1");
R("kabakbastisi","Kabak yemeği (etsiz)","tr","sebze","v s","","kabak 5, sogan 1, domates 300, salca 1, pirinc 40, aycicek 40, tuz 1");
R("pirasayumurta","Pırasalı yumurta","tr","sebze","v","Ege","pirasa 3, yumurta 4, tereyagi 20, pul 1, tuz 1");

// ===== BAKLİYAT (SULU) =====
R("kurufasulye","Kuru fasulye","tr","bakliyat","s","Tüm Türkiye",[
 ["Etli (İstanbul usulü)","kfasulye 500, dana 300, sogan 2, salca 2, bsalca 1, tereyagi 30, pul 1, tuz 1","","e"],
 ["Pastırmalı (Kayseri)","kfasulye 500, pastirma 100, sogan 2, salca 2, tereyagi 30, tuz 1","","e"],
 ["Sucuklu","kfasulye 500, sucuk 200, sogan 1, salca 2, tereyagi 20, tuz 1","","e"],
 ["Erzurum usulü (kavurmalı, tereyağlı)","kfasulye 500, kuzu 300, sogan 2, salca 1, tereyagi 50, tuz 1","","e"],
 ["Zeytinyağlı (etsiz)","kfasulye 500, sogan 2, havuc 1, salca 2, zyagi 80, pul 1, tuz 1","","v z"]]);
R("nohut","Nohut yemeği","tr","bakliyat","s","Tüm Türkiye",[
 ["Etli","nohut 400, dana 300, sogan 1, salca 2, tereyagi 30, tuz 1","","e"],
 ["Etsiz","nohut 400, sogan 1, havuc 1, patates 200, salca 2, aycicek 40, tuz 1","","v"],
 ["Kavurmalı (Erzurum/Sivas)","nohut 400, kuzu 250, sogan 1, salca 1, tereyagi 40, tuz 1","","e"]]);
R("ymercimekyemek","Yeşil mercimek yemeği","tr","bakliyat","v s","","ymercimek 400, sogan 1, havuc 1, bulgur 50, salca 2, pul 1, aycicek 40, tuz 1");
R("barbunyayemek","Etli barbunya","tr","bakliyat","e s","","barbunya 3, dana 250, sogan 1, salca 2, havuc 1, tuz 1");
R("mercimekmuceddere","Mercimekli bulgur pilavı (Müceddere)","tr","bakliyat","v","Hatay / Güneydoğu","ymercimek 200, bulgur 250, sogan 3, zyagi 80, kimyon 1, tuz 1");

// ===== PİLAVLAR =====
R("pirincpilav","Pirinç pilavı","tr","pilav","v","Tüm Türkiye",[
 ["Şehriyeli","pirinc 400, sehriye 50, tereyagi 50, bulyon 1, tuz 1"],
 ["Sade (tereyağlı)","pirinc 400, tereyagi 60, tuz 1"]]);
R("bulgurpilav","Bulgur pilavı","tr","pilav","v","Tüm Türkiye",[
 ["Domatesli-biberli","bulgur 400, sogan 1, sbiber 2, domates 200, salca 1, tereyagi 30, tuz 1"],
 ["Sade (tereyağlı)","bulgur 400, sogan 1, tereyagi 50, tuz 1"],
 ["Şehriyeli","bulgur 400, sehriye 50, tereyagi 40, salca 1, tuz 1"]]);
R("icpilav","İç pilav","tr","pilav","v","İstanbul (Saray)","pirinc 400, sogan 1, camfistik 30, kusuzumu 30, tereyagi 50, tarcin 1, yenibahar 1, dereotu 1, seker 5, tuz 1");
R("nohutpilav","Nohutlu pilav","tr","pilav","v","","pirinc 400, nohutk 1, tereyagi 50, bulyon 1, tuz 1");
R("etlipilav","Kuzu etli pilav","tr","pilav","e","","pirinc 400, kuzu 400, sogan 1, havuc 1, tereyagi 40, tuz 1");
R("perde","Perde pilavı","tr","pilav","e","Siirt","pirinc 400, tbut 600, un 300, yumurta 2, yogurt 100, tereyagi 150, camfistik 30, kusuzumu 30, tuz 1");
R("keskek","Keşkek","tr","pilav","e","Ege / Orta Anadolu",[
 ["Kuzu etli (Orta Anadolu)","bugday 500, kuzu 600, sogan 1, tereyagi 80, pul 1, tuz 1"],
 ["Tavuklu (Ege/Manisa)","bugday 500, tbut 800, tereyagi 80, pul 1, tuz 1"]]);
R("mantarlipilav","Mantarlı bulgur pilavı","tr","pilav","v","","bulgur 400, mantar 250, sogan 1, sbiber 2, tereyagi 30, tuz 1");
R("hamsipilav","Hamsili pilav","tr","balik","e","Karadeniz","hamsi 1000, pirinc 400, sogan 1, camfistik 20, kusuzumu 20, tereyagi 50, dereotu 1, tuz 1");

// ===== MAKARNA & MANTI =====
R("manti","Mantı","tr","makarna","e","Kayseri",[
 ["Kayseri mantısı (ev yapımı)","un 500, yumurta 1, kiyma 300, sogan 1, yogurt 500, sarimsak 3, tereyagi 60, salca 1, pul 1, nanek 1, tuz 1"],
 ["Sinop mantısı (cevizli)","un 500, yumurta 1, kiyma 300, sogan 1, yogurt 400, ceviz 60, tereyagi 60, pul 1, tuz 1"],
 ["Kolay: hazır mantı ile","mantihaz 1000, yogurt 500, sarimsak 2, tereyagi 50, salca 1, pul 1, nanek 1"],
 ["Tatar böreği / Bükme (Eskişehir)","un 500, yumurta 1, kiyma 300, sogan 1, yogurt 500, sarimsak 2, tereyagi 60, tuz 1"]]);
R("firinmakarna","Fırın makarna (beşamelli)","tr","makarna","v","","makarna 500, sut 750, un 60, tereyagi 60, yumurta 2, kasar 150, tuz 1");
R("kiymalimakarna","Kıymalı makarna","tr","makarna","e","","makarna 500, kiyma 300, sogan 1, salca 2, domates 200, tereyagi 20, tuz 1");
R("eriste","Erişte (tereyağlı, cevizli)","tr","makarna","v","Orta Anadolu","eriste 500, tereyagi 60, ceviz 60, bpeynir 100, tuz 1");
R("yogurtlumakarna","Yoğurtlu makarna","tr","makarna","v","","makarna 500, yogurt 500, sarimsak 2, tereyagi 40, pul 1, nanek 1, tuz 1");
R("hingel","Hingel (Hangel)","tr","makarna","v","Kars / Ardahan / Erzurum","un 500, yumurta 1, patates 400, bpeynir 150, sogan 2, yogurt 500, tereyagi 80, tuz 1");

// ===== HAMUR İŞLERİ & BÖREK =====
R("lahmacun","Lahmacun","tr","hamur","e","Güneydoğu",[
 ["Antep usulü (sarımsaklı, acılı)","un 500, maya 1, kiyma 400, sogan 2, sarimsak 4, domates 300, kbiber 2, bsalca 2, maydanoz 1, pul 1, limon 2, marul 1, tuz 1"],
 ["Urfa usulü (isotlu, sarımsaksız)","un 500, maya 1, kiyma 400, sogan 2, domates 300, isot 2, bsalca 2, maydanoz 1, limon 2, tuz 1"],
 ["Kolay: lavaşla ev usulü","lavas 6, kiyma 400, sogan 1, domates 300, salca 2, bsalca 1, maydanoz 1, limon 1, tuz 1"]]);
R("pide","Pide","tr","hamur","","Karadeniz / Tüm Türkiye",[
 ["Kıymalı (Karadeniz)","un 500, maya 1, kiyma 400, sogan 1, domates 200, sbiber 2, tereyagi 50, yumurta 1, tuz 1","","e"],
 ["Kaşarlı-yumurtalı","un 500, maya 1, kasar 300, yumurta 4, tereyagi 50, tuz 1","","v"],
 ["Kuşbaşılı","un 500, maya 1, dana 400, sogan 1, domates 200, sbiber 2, tereyagi 50, tuz 1","","e"],
 ["Sucuklu-kaşarlı","un 500, maya 1, sucuk 200, kasar 250, yumurta 2, tereyagi 30, tuz 1","","e"]]);
R("etliekmek","Etli ekmek","tr","hamur","e","Konya","un 500, maya 1, kiyma 500, sogan 2, domates 300, sbiber 3, tereyagi 50, tuz 1");
R("suboregi","Su böreği","tr","hamur","v","İstanbul","un 500, yumurta 5, bpeynir 300, maydanoz 1, tereyagi 200, sut 100, tuz 1");
R("sigara","Sigara böreği","tr","hamur","v","","yufka 1, bpeynir 300, maydanoz 1, yumurta 1, aycicek 500");
R("ispanakborek","Ispanaklı börek","tr","hamur","v","",[
 ["Kol böreği (yufka)","yufka 1, ispanak 500, sogan 1, bpeynir 200, yumurta 2, sut 200, aycicek 100, tuz 1"],
 ["Tepsi böreği (yufka)","yufka 2, ispanak 500, sogan 1, bpeynir 200, yumurta 3, sut 300, aycicek 100, tuz 1"]]);
R("kiymaliborek","Kıymalı börek","tr","hamur","e","","yufka 2, kiyma 400, sogan 2, yumurta 2, sut 200, aycicek 100, tuz 1");
R("patatesliborek","Patatesli börek","tr","hamur","v","","yufka 2, patates 600, sogan 1, yumurta 2, sut 200, aycicek 100, pul 1, tuz 1");
R("gozleme","Gözleme","tr","hamur","","Tüm Türkiye",[
 ["Peynirli-ıspanaklı","un 500, yogurt 100, ispanak 300, bpeynir 250, tereyagi 50, tuz 1","","v"],
 ["Patatesli","un 500, yogurt 100, patates 600, sogan 1, pul 1, tereyagi 50, tuz 1","","v"],
 ["Kıymalı","un 500, yogurt 100, kiyma 300, sogan 1, tereyagi 50, tuz 1","","e"]]);
R("pogaca","Poğaça","tr","hamur","v","","un 500, yogurt 150, sut 100, aycicek 100, maya 1, yumurta 2, bpeynir 200, tuz 1");
R("pisi","Pişi","tr","hamur","v","","un 500, maya 1, sut 200, seker 10, aycicek 500, tuz 1");
R("bazlama","Bazlama","tr","hamur","v","Tüm Anadolu","un 500, yogurt 200, maya 1, sut 100, tuz 1");
R("cigborek","Çiğ börek","tr","hamur","e","Eskişehir (Tatar)","un 500, kiyma 300, sogan 2, aycicek 800, tuz 1, karabiber 1");
R("pacanga","Paçanga böreği","tr","hamur","e","İstanbul","yufka 1, pastirma 150, kasar 200, domates 200, sbiber 2, aycicek 400");
R("kete","Kete","tr","hamur","v","Kars / Erzurum","un 500, maya 1, sut 200, tereyagi 150, yumurta 1, tuz 1");

// ===== BALIK =====
R("hamsitava","Hamsi tava","tr","balik","e","Karadeniz","hamsi 1000, misirunu 150, aycicek 400, limon 1, ksogan 1, roka 125, tuz 1");
R("levrekbugulama","Levrek buğulama","tr","balik","e","Ege","levrek 1000, sogan 1, domates 300, sbiber 2, mantar 200, limon 1, tereyagi 30, tuz 1");
R("somonfirin","Fırında somon","tr","balik","e","","somon 750, patates 500, limon 1, tereyagi 30, dereotu 1, tuz 1");
R("uskumru","Uskumru (ızgara/fırın)","tr","balik","e","İstanbul","uskumru 1000, limon 1, ksogan 1, roka 125, zyagi 30, tuz 1");
R("karidesguvec","Karides güveç","tr","balik","e","Ege / İstanbul","karides 500, mantar 200, sbiber 2, domates 300, kasar 150, tereyagi 30, sarimsak 3, tuz 1");
R("balikbugulama","Balık buğulama (fileto)","tr","balik","e","","beyazbalik 800, sogan 1, domates 300, sbiber 2, limon 1, zyagi 40, tuz 1");
R("baliktava","Balık tava (fileto)","tr","balik","e","","beyazbalik 800, un 80, aycicek 300, limon 1, ksogan 1, roka 125, tuz 1");

// ===== MEZELER =====
R("haydari","Haydari","tr","meze","v","İstanbul / Ege","suzme 500, sarimsak 2, dereotu 1, nanek 1, zyagi 20, tuz 1");
R("cacik","Cacık","tr","meze","v","Tüm Türkiye","yogurt 500, salatalik 2, sarimsak 2, nanek 1, zyagi 10, tuz 1");
R("humus","Humus","tr","meze","v","Hatay / Güneydoğu","nohutk 2, tahin 80, limon 1, sarimsak 2, kimyon 1, zyagi 30, tuz 1");
R("babagannus","Babagannuş / Mutabbel","tr","meze","v","Hatay",[
 ["Hatay babagannuşu (közlenmiş, domates-biberli)","patlican 3, domates 200, kbiber 1, maydanoz 1, sarimsak 2, narek 30, zyagi 40, tuz 1"],
 ["Mutabbel (tahinli-yoğurtlu)","patlican 3, tahin 50, yogurt 150, sarimsak 2, limon 1, zyagi 20, tuz 1"]]);
R("patlicansalata","Közlenmiş patlıcan salatası","tr","meze","v","",[
 ["Yoğurtlu","patlican 4, yogurt 300, sarimsak 2, zyagi 20, tuz 1"],
 ["Zeytinyağlı (köz biberli)","patlican 4, kbiber 2, sarimsak 2, maydanoz 1, limon 1, zyagi 50, tuz 1"]]);
R("saksuka","Şakşuka","tr","meze","v z","","patlican 3, kabak 2, sbiber 3, domates 400, sarimsak 3, aycicek 300, zyagi 30, tuz 1");
R("muhammara","Muhammara / Acuka","tr","meze","v","Gaziantep / Hatay",[
 ["Muhammara (közlenmiş biberli)","kbiber 3, ceviz 150, galeta 40, bsalca 2, narek 30, kimyon 1, sarimsak 2, zyagi 50, tuz 1"],
 ["Acuka (salçalı, pratik)","bsalca 4, salca 2, ceviz 150, galeta 40, sarimsak 2, zyagi 60, kimyon 1, pul 1"]]);
R("ezme","Acılı ezme","tr","meze","v","Adana / Antep","domates 400, ksogan 1, sbiber 3, acibiber 2, maydanoz 1, bsalca 1, narek 30, sumak 1, zyagi 30, tuz 1");
R("atom","Atom","tr","meze","v","İstanbul (ocakbaşı)","suzme 500, kuruaci 6, tereyagi 30");
R("kisir","Kısır","tr","meze","v","Güneydoğu",[
 ["Antep usulü (salçalı)","ibulgur 250, salca 1, bsalca 2, ysogan 1, maydanoz 1, nane 1, domates 200, salatalik 1, limon 1, narek 40, zyagi 60, marul 1, tuz 1"],
 ["Hatay usulü (bol ekşili, cevizli)","ibulgur 250, bsalca 1, ysogan 1, maydanoz 1, nane 1, ceviz 50, narek 60, limon 1, zyagi 60, tuz 1"]]);
R("fava","Fava","tr","meze","v z","Ege","fava 400, sogan 1, dereotu 1, zyagi 80, limon 1, seker 5, tuz 1");
R("semizotu","Yoğurtlu semizotu","tr","meze","v","","semizotu 1, yogurt 400, sarimsak 2, zyagi 10, tuz 1");
R("giritezme","Girit ezmesi","tr","meze","v","Ege (Girit göçmenleri)","bpeynir 200, ceviz 50, fistik 30, nane 1, zyagi 50, pul 1");
R("kozbiber","Köz biber (sirkeli)","tr","meze","v z","","kbiber 4, sarimsak 2, sirke 30, zyagi 40, maydanoz 1, tuz 1");
R("patlicankizartma","Patlıcan kızartması (yoğurtlu)","tr","meze","v","","patlican 4, aycicek 400, yogurt 400, sarimsak 2, domates 200, tuz 1");
R("havuctarator","Havuç tarator","tr","meze","v","","havuc 4, yogurt 400, sarimsak 2, ceviz 40, zyagi 20, tuz 1");
R("piyaz","Fasulye piyazı","tr","meze","v","",[
 ["Klasik (sirkeli, yumurtalı)","kfasulye 250, ksogan 2, maydanoz 1, yumurta 2, sirke 40, zyagi 50, sumak 1, pul 1, tuz 1"],
 ["Antalya usulü (tahinli)","kfasulye 250, tahin 80, limon 1, sarimsak 2, yumurta 2, ksogan 1, maydanoz 1, sirke 20, pul 1, tuz 1"]]);
R("mercimekkofte","Mercimek köftesi","tr","meze","v","Tüm Türkiye","kmercimek 200, ibulgur 200, sogan 2, salca 2, bsalca 1, ysogan 1, maydanoz 1, marul 1, limon 1, zyagi 60, kimyon 1, pul 1, tuz 1");
R("cigkofte","Çiğ köfte","tr","meze","","Şanlıurfa",[
 ["Etsiz (günümüz usulü)","ibulgur 500, sogan 1, isot 3, bsalca 3, salca 2, narek 50, maydanoz 1, ysogan 1, marul 1, limon 2, lavas 6, tuz 1","","v"],
 ["Urfa usulü (etli, geleneksel)","ibulgur 400, kiyma 250, sogan 1, isot 4, bsalca 2, maydanoz 1, ysogan 1, marul 1, limon 2, tuz 1","Çiğ et içerir; çok taze, yağsız et kullanın.","e"]]);
R("pancarsalata","Pancar salatası","tr","meze","v","","pancar 500, yogurt 300, sarimsak 2, zyagi 20, tuz 1");
R("topik","Topik","tr","meze","v","İstanbul (Ermeni mutfağı)","nohut 300, patates 200, sogan 4, tahin 60, kusuzumu 20, camfistik 20, tarcin 1, tuz 1");

// ===== SALATALAR =====
R("coban","Çoban salatası","tr","salata","v","Tüm Türkiye","domates 400, salatalik 2, sbiber 2, ksogan 1, maydanoz 1, limon 1, zyagi 40, tuz 1");
R("gavurdagi","Gavurdağı salatası","tr","salata","v","Gaziantep","domates 400, ceviz 60, ksogan 1, sbiber 2, maydanoz 1, narek 40, sumak 1, zyagi 40, tuz 1");
R("mevsim","Mevsim salatası","tr","salata","v","","marul 1, roka 125, havuc 1, cdomates 250, limon 1, zyagi 40, tuz 1");
R("patatessalata","Patates salatası (Türk usulü)","tr","salata","v","","patates 800, ysogan 1, maydanoz 1, dereotu 1, limon 1, zyagi 50, pul 1, tuz 1");
R("makarnasalata","Makarna salatası","tr","salata","v","","makarna 300, misir 1, tursu 150, kbiber 1, yogurt 200, mayonez 100, dereotu 1, tuz 1");
R("russalata","Rus salatası","tr","salata","v","İstanbul","patates 500, havuc 2, bezelye 150, tursu 150, mayonez 200, yogurt 150, tuz 1");
R("tonsalata","Ton balıklı salata","tr","salata","e","","ton 2, marul 1, misir 1, domates 200, ksogan 1, limon 1, zyagi 30, tuz 1");
R("kasiksalata","Kaşık salata","tr","salata","v","Adana","domates 400, sbiber 3, ksogan 1, maydanoz 1, nane 1, pul 1, narek 30, zyagi 40, tuz 1");
R("rokasalata","Roka salatası","tr","salata","v","","roka 250, cdomates 250, bpeynir 100, limon 1, zyagi 30, tuz 1");

// ===== KAHVALTILIK =====
R("menemen","Menemen","tr","kahvalti","v","Tüm Türkiye",[
 ["Soğansız","domates 500, sbiber 4, yumurta 4, tereyagi 30, pul 1, tuz 1"],
 ["Soğanlı","domates 500, sbiber 4, sogan 1, yumurta 4, tereyagi 30, pul 1, tuz 1"],
 ["Kaşarlı","domates 500, sbiber 4, yumurta 4, kasar 100, tereyagi 30, tuz 1"],
 ["Sucuklu","domates 500, sbiber 4, yumurta 4, sucuk 100, tereyagi 10, tuz 1","","e"]]);
R("sucukyumurta","Sucuklu yumurta","tr","kahvalti","e","","sucuk 200, yumurta 6, tereyagi 10");
R("cilbir","Çılbır","tr","kahvalti","v","Osmanlı mutfağı","yumurta 8, yogurt 500, sarimsak 2, tereyagi 40, pul 1, sirke 30, tuz 1");
R("kahvaltitabagi","Serpme kahvaltı tabağı","tr","kahvalti","v","","bpeynir 300, kasar 200, zeytin 200, domates 300, salatalik 2, yumurta 4, ekmek 1, tereyagi 50");
R("muhlama","Kuymak / Mıhlama","tr","kahvalti","v","Karadeniz",[
 ["Trabzon/Rize mıhlama","misirunu 100, tereyagi 100, kasar 250, tuz 1"],
 ["Kuymak (çeçil/kaşarlı)","misirunu 100, tereyagi 100, kasar 250, sut 200, tuz 1"]]);
R("omlet","Omlet (peynirli/mantarlı)","tr","kahvalti","v","","yumurta 6, bpeynir 100, mantar 150, tereyagi 20, tuz 1");
R("pastirmaliyumurta","Pastırmalı yumurta","tr","kahvalti","e","Kayseri","pastirma 100, yumurta 6, tereyagi 20");

// ===== TATLILAR =====
R("sutlac","Sütlaç","tr","tatli","v","Tüm Türkiye",[
 ["Fırın sütlaç","sut 1000, pirinc 100, seker 200, nisasta 30, vanilin 1"],
 ["Tencere sütlacı","sut 1000, pirinc 120, seker 200, nisasta 20, tarcin 1"]]);
R("muhallebi","Muhallebi","tr","tatli","v","","sut 1000, nisasta 60, un 30, seker 200, vanilin 1");
R("supangle","Supangle","tr","tatli","v","","sut 1000, kakao 40, un 50, nisasta 30, seker 200, cikolata 100, tereyagi 30");
R("revani","Revani","tr","tatli","v","Osmanlı","irmik 250, un 100, yumurta 4, seker 500, yogurt 150, kabartma 1, limon 1, aycicek 80");
R("sekerpare","Şekerpare","tr","tatli","v","","un 400, irmik 50, tereyagi 200, seker 600, yumurta 2, kabartma 1, limon 1");
R("baklava","Baklava (ev usulü)","tr","tatli","v","Gaziantep / İstanbul",[
 ["Cevizli","baklavayufka 1, ceviz 300, tereyagi 250, seker 600, limon 1"],
 ["Fıstıklı","baklavayufka 1, fistik 300, tereyagi 250, seker 600, limon 1"]]);
R("kunefe","Künefe","tr","tatli","v","Hatay","kadayif 250, mozzarella 250, tereyagi 100, seker 300, fistik 30, limon 1");
R("kadayif","Cevizli tel kadayıf","tr","tatli","v","","kadayif 500, ceviz 200, tereyagi 200, seker 600, limon 1");
R("irmikhelva","İrmik helvası","tr","tatli","v","","irmik 300, tereyagi 125, sut 500, seker 250, camfistik 30");
R("unhelva","Un helvası","tr","tatli","v","","un 300, tereyagi 200, sut 500, seker 250, ceviz 50");
R("asure","Aşure","tr","tatli","v","Tüm Türkiye","bugday 250, nohutk 1, kfasulye 100, seker 400, kayisi 100, kusuzumu 100, ceviz 100, tarcin 1");
R("kabaktatli","Kabak tatlısı","tr","tatli","v","","balkabagi 1, seker 300, ceviz 80, tahin 50");
R("ayvatatli","Ayva tatlısı","tr","tatli","v","","ayva 2, seker 250, krema 200, ceviz 40");
R("gullac","Güllaç","tr","tatli","v","İstanbul (Ramazan)","gullac 1, sut 1500, seker 300, ceviz 150, fistik 20");
R("lokma","Lokma","tr","tatli","v","İzmir","un 300, maya 1, seker 400, aycicek 1000, limon 1");
R("kek","Kek","tr","tatli","v","",[
 ["Sade (vanilyalı)","un 300, yumurta 3, seker 200, sut 200, aycicek 100, kabartma 1, vanilin 1"],
 ["Islak kek (kakaolu)","un 250, yumurta 3, seker 250, sut 300, aycicek 120, kakao 50, kabartma 1, cikolata 100"]]);
R("trilece","Trileçe","tr","tatli","v","Balkan / Rumeli","un 150, yumurta 5, seker 300, sut 1000, krema 200, kabartma 1, vanilin 1");
R("katmer","Katmer","tr","tatli","v","Gaziantep","un 300, fistik 150, krema 200, tereyagi 100, seker 100, tuz 1");
R("kazandibi","Kazandibi","tr","tatli","v","İstanbul","sut 1000, nisasta 50, un 50, seker 200, tereyagi 20, vanilin 1");
R("profiterol","Profiterol","tr","tatli","v","","un 150, tereyagi 100, yumurta 4, sut 750, nisasta 40, seker 150, cikolata 150, krema 100, kakao 20");
// ===== ALMAN MUTFAĞI =====
R("kartoffelsalat","Kartoffelsalat (patates salatası)","de","salata","v","Almanya",[
 ["Süddeutsch / Schwäbisch (sirkeli, et sulu)","patates 1000, sogan 1, bulyon 1, sirke 60, aycicek 60, hardal 1, tuz 1"],
 ["Norddeutsch (mayonezli)","patates 1000, mayonez 250, tursu 200, yumurta 3, sogan 1, tuz 1"]]);
R("schnitzel","Schnitzel","de","etli","e","Avusturya / Almanya",[
 ["Wiener Schnitzel (dana)","kalb 600, un 60, yumurta 2, galeta 120, aycicek 300, limon 1, patates 800, tuz 1"],
 ["Schnitzel Wiener Art (domuz)","schwschnitzel 600, un 60, yumurta 2, galeta 120, aycicek 300, limon 1, pommes 750, tuz 1","","d"],
 ["Hähnchenschnitzel (tavuk)","tgogus 600, un 60, yumurta 2, galeta 120, aycicek 300, limon 1, pommes 750, tuz 1"],
 ["Jägerschnitzel (mantar soslu, tavuk)","tgogus 600, un 60, yumurta 2, galeta 120, aycicek 300, mantar 300, krema 200, sogan 1, spatzle 500, tuz 1"]]);
R("gulasch","Rindergulasch","de","etli","e s","Almanya / Macaristan","dana 1000, sogan 4, tozbiber 2, salca 2, kbiber 2, ksarap 200, bulyon 1, kummel 1, spatzle 500, tuz 1");
R("rouladen","Rinderrouladen","de","etli","e","Almanya",[
 ["Klasik (speck'li)","rouladen 800, speck 100, tursu 150, hardal 3, sogan 2, havuc 1, ksarap 200, knodel 6, klahana 1, tuz 1","","d"],
 ["Domuzsuz (pastırma/hindi ile)","rouladen 800, pastirma 80, tursu 150, hardal 3, sogan 2, havuc 1, ksarap 200, knodel 6, klahana 1, tuz 1"]]);
R("sauerbraten","Sauerbraten (Rheinischer)","de","etli","e","Rheinland","rinderbraten 1200, sirke 250, ksarap 500, sogan 2, havuc 2, defne 2, kusuzumu 50, knodel 6, klahana 1, tuz 1");
R("kasespatzle","Käsespätzle","de","makarna","v","Allgäu / Schwaben","spatzle 500, emmentaler 300, sogan 3, tereyagi 50, tuz 1");
R("maultaschen","Maultaschen","de","makarna","e d","Schwaben",[
 ["Geschmälzt (soğanlı, tavada)","maultaschen 720, sogan 2, tereyagi 30, yumurta 4"],
 ["In der Brühe (çorbada)","maultaschen 720, bulyon 2, ysogan 1, havuc 1"]]);
R("currywurst","Currywurst mit Pommes","de","etli","e d","Berlin / Ruhrgebiet","bratwurst 8, ketcap 300, kori 2, sogan 1, pommes 750, mayonez 100");
R("bratkartoffeln","Bratkartoffeln","de","sebze","","Almanya",[
 ["Speck'li (klasik)","patates 1000, sogan 2, speck 100, tereyagi 30, tuz 1","","d e"],
 ["Vejetaryen","patates 1000, sogan 2, tereyagi 40, yumurta 4, tuz 1","","v"]]);
R("kartoffelsuppe","Kartoffelsuppe","de","corba","s","Almanya",[
 ["Würstchen'li (klasik)","patates 800, havuc 2, kereviz 1, pirasa 1, sogan 1, bulyon 2, sosis 4, krema 100, muskat 1, tuz 1","","e d"],
 ["Vejetaryen","patates 800, havuc 2, kereviz 1, pirasa 1, sogan 1, bulyon 2, krema 150, muskat 1, tuz 1","","v"]]);
R("erbseneintopf","Erbseneintopf","de","corba","e s d","Almanya","schaelerbsen 500, havuc 2, patates 400, pirasa 1, kereviz 1, mettwurst 4, sogan 1, bulyon 2, tuz 1");
R("linsen","Linsen mit Spätzle","de","bakliyat","s","Schwaben",[
 ["Saitenwürstle ile (klasik)","ymercimek 400, havuc 2, kereviz 1, sogan 1, sosis 8, sirke 40, spatzle 500, un 20, bulyon 1, tuz 1","","e d"],
 ["Vejetaryen","ymercimek 400, havuc 2, kereviz 1, sogan 1, sirke 40, spatzle 500, un 20, bulyon 1, tuz 1","","v"]]);
R("frikadellen","Frikadellen (Buletten)","de","kofte","e","Almanya",[
 ["Karışık kıymalı (klasik)","hackmix 600, ekmek 1, sogan 1, yumurta 1, hardal 1, aycicek 50, tuz 1","","d"],
 ["Dana kıymalı","kiyma 600, ekmek 1, sogan 1, yumurta 1, hardal 1, aycicek 50, tuz 1"]]);
R("klopse","Königsberger Klopse","de","kofte","e","Doğu Prusya / Berlin",[
 ["Karışık kıymalı (klasik)","hackmix 600, ekmek 1, yumurta 1, sogan 1, kapari 50, krema 100, limon 1, un 30, tereyagi 30, bulyon 2, pirinc 300, tuz 1","","d"],
 ["Dana kıymalı","kiyma 600, ekmek 1, yumurta 1, sogan 1, kapari 50, krema 100, limon 1, un 30, tereyagi 30, bulyon 2, pirinc 300, tuz 1"]]);
R("leberkase","Leberkäse mit Spiegelei","de","etli","e d","Bavyera","leberkase 600, yumurta 4, patates 800, hardal 2");
R("flammkuchen","Flammkuchen","de","hamur","","Elsass / Pfalz",[
 ["Klasik (speck'li)","flammteig 2, schmand 400, speck 150, sogan 2, tuz 1","","e d"],
 ["Vejetaryen (pırasa-peynirli)","flammteig 2, schmand 400, pirasa 1, emmentaler 100, sogan 1, tuz 1","","v"]]);
R("senfeier","Senfeier (hardallı yumurta)","de","sebze","v","Kuzey Almanya","yumurta 8, patates 800, hardal 3, un 30, tereyagi 30, sut 400, krema 100, tuz 1");
R("kohlrouladen","Kohlrouladen","de","dolma","e","Almanya / Doğu Avrupa",[
 ["Klasik (karışık kıyma, speck)","lahana 1, hackmix 600, sogan 1, ekmek 1, yumurta 1, speck 100, salca 1, bulyon 1, patates 800, tuz 1","","d"],
 ["Dana kıymalı","lahana 1, kiyma 600, sogan 1, ekmek 1, yumurta 1, salca 1, bulyon 1, patates 800, tuz 1"]]);
R("schweinebraten","Schweinebraten mit Knödeln","de","etli","e d","Bavyera","schwnacken 1500, sogan 2, havuc 2, bira 500, kummel 1, knodel 6, klahana 1, tuz 1");
R("frikassee","Hühnerfrikassee","de","tavuk","e","Almanya","tgogus 800, havuc 2, mantar 250, bezelye 150, krema 200, un 40, tereyagi 40, limon 1, bulyon 1, pirinc 300, tuz 1");
R("gruenkohl","Grünkohl mit Pinkel","de","etli","e d","Kuzey Almanya (Bremen)","karalahana 1000, mettwurst 4, kassler 500, sogan 2, patates 800, hardal 2, tuz 1");
R("himmelunderde","Himmel und Erde","de","sebze","","Rheinland",[
 ["Kan sosisli (klasik)","patates 1000, elma 4, sogan 2, blutwurst 400, tereyagi 40, tuz 1","","e d"],
 ["Vejetaryen","patates 1000, elma 4, sogan 2, tereyagi 50, tuz 1","","v"]]);
R("reibekuchen","Kartoffelpuffer / Reibekuchen","de","sebze","v","Rheinland / Almanya","patates 1000, sogan 1, yumurta 2, un 40, aycicek 200, apfelmus 720, tuz 1");
R("zwiebelkuchen","Zwiebelkuchen","de","hamur","e d","Pfalz / Baden","un 300, maya 1, sogan 8, speck 150, schmand 200, yumurta 3, kummel 1, tereyagi 30, tuz 1");
R("spargel","Spargel mit Sauce Hollandaise","de","sebze","","Almanya (bahar)",[
 ["Jambonlu (klasik)","spargel 1500, patates 800, jambon 200, hollandaise 250, tereyagi 30, tuz 1","","e d"],
 ["Vejetaryen","spargel 1500, patates 800, hollandaise 250, tereyagi 30, tuz 1","","v"]]);
R("bratwurstkraut","Bratwurst mit Sauerkraut & Püree","de","etli","e d","Almanya","bratwurst 8, sauerkraut 2, patates 1000, sut 200, tereyagi 40, muskat 1, tuz 1");
R("gemueseeintopf","Gemüseeintopf","de","corba","v s","Almanya","patates 500, havuc 3, pirasa 1, kereviz 1, tfasulye 250, bezelye 150, sogan 1, bulyon 2, tuz 1");
R("pfannkuchen","Pfannkuchen (Alman krebi)","de","tatli","v","Almanya","un 250, yumurta 3, sut 500, seker 20, aycicek 40, apfelmus 360");
R("kaiserschmarrn","Kaiserschmarrn","de","tatli","v","Bavyera / Avusturya","un 200, yumurta 4, sut 400, seker 50, kusuzumu 50, tereyagi 40, apfelmus 360");
R("apfelstrudel","Apfelstrudel (milföyle kolay)","de","tatli","v","Avusturya / Bavyera","milfoy 1, elma 5, kusuzumu 50, seker 80, tarcin 1, tereyagi 40, galeta 40");
R("kasekuchen","Käsekuchen","de","tatli","v","Almanya","quark 1000, yumurta 4, seker 250, puding 1, un 250, tereyagi 175, kabartma 1, limon 1");
R("apfelkuchen","Apfelkuchen (versunkener)","de","tatli","v","Almanya","un 250, tereyagi 150, seker 150, yumurta 3, elma 4, kabartma 1, vanilin 1");
R("obatzda","Obatzda","de","meze","v","Bavyera","camembert 250, tereyagi 50, kpeynir 100, sogan 1, tozbiber 1, kummel 1, ekmek 1");
R("brathaehnchen","Brathähnchen / Grillhendl","de","tavuk","e","Bavyera (Oktoberfest)","tbutun 1200, tereyagi 40, tozbiber 2, patates 800, tuz 1");
R("flaedle","Flädlesuppe","de","corba","v s","Schwaben","un 100, yumurta 2, sut 200, bulyon 2, ysogan 1, havuc 1, tuz 1");
R("gaisburger","Gaisburger Marsch","de","corba","e s","Stuttgart","dana 600, patates 600, spatzle 250, havuc 2, kereviz 1, pirasa 1, sogan 2, bulyon 2, tuz 1");
R("schupfnudeln","Schupfnudeln mit Sauerkraut","de","makarna","","Baden / Schwaben",[
 ["Speck'li","schupf 500, sauerkraut 1, speck 100, sogan 1, tereyagi 20, tuz 1","","e d"],
 ["Vejetaryen","schupf 500, sauerkraut 1, sogan 1, tereyagi 30, tuz 1","","v"]]);
R("fischstaebchen","Fischstäbchen mit Kartoffelpüree","de","balik","e","Almanya","fischstab 450, patates 1000, sut 200, tereyagi 40, ispanak 450, muskat 1, tuz 1");
R("ruehrei","Rührei mit Krabben (Nordsee)","de","kahvalti","e","Kuzey Almanya","yumurta 8, karides 200, tereyagi 20, ysogan 1, ekmek 1, tuz 1");
R("rotkohl","Rotkohl (garnitür)","de","sebze","v","Almanya","klahana 1, elma 2, sogan 1, sirke 50, seker 30, defne 2, tereyagi 30, tuz 1");

// ===== AVRUPA MUTFAKLARI =====
R("bolognese","Spaghetti Bolognese","eu","makarna","e","İtalya","spagetti 500, kiyma 500, sogan 1, havuc 1, kereviz 1, dkonserve 2, salca 1, ksarap 100, parmesan 50, sarimsak 2, zyagi 30, tuz 1");
R("carbonara","Spaghetti Carbonara","eu","makarna","e","İtalya (Roma)",[
 ["Klasik (guanciale/pancetta)","spagetti 500, speck 150, yumurta 4, parmesan 100, karabiber 2","","d"],
 ["Domuzsuz (hindi füme)","spagetti 500, hindifume 150, yumurta 4, parmesan 100, karabiber 2"]]);
R("lasagne","Lasagne","eu","makarna","e","İtalya","lazanya 250, kiyma 500, sogan 1, havuc 1, dkonserve 2, salca 1, sut 750, un 60, tereyagi 60, mozzarella 250, parmesan 50, tuz 1");
R("arrabbiata","Penne all'Arrabbiata","eu","makarna","v","İtalya","makarna 500, dkonserve 2, sarimsak 3, acibiber 2, maydanoz 1, zyagi 40, parmesan 50, tuz 1");
R("aglio","Spaghetti Aglio e Olio","eu","makarna","v","İtalya","spagetti 500, sarimsak 6, acibiber 2, maydanoz 1, zyagi 80, parmesan 50, tuz 1");
R("pesto","Pasta al Pesto Genovese","eu","makarna","v","İtalya (Liguria)","makarna 500, feslegen 2, camfistik 40, parmesan 60, sarimsak 2, zyagi 100, tuz 1");
R("risotto","Risotto ai Funghi","eu","pilav","v","İtalya","risotto 350, mantar 400, sogan 1, bsarap 150, bulyon 2, parmesan 60, tereyagi 40, tuz 1");
R("minestrone","Minestrone","eu","corba","v s","İtalya","havuc 2, kabak 1, patates 300, kereviz 1, tfasulye 200, dkonserve 1, barbunya 1, makarna 100, sogan 1, zyagi 40, parmesan 40, tuz 1");
R("pizza","Pizza Margherita","eu","hamur","v","İtalya (Napoli)","un 500, maya 1, passata 250, mozzarella 375, feslegen 1, zyagi 30, tuz 1");
R("caprese","Insalata Caprese","eu","salata","v","İtalya","domates 500, mozzarella 250, feslegen 1, zyagi 40, tuz 1");
R("tiramisu","Tiramisu","eu","tatli","v","İtalya","mascarpone 500, yumurta 4, seker 100, kedidili 200, kahve 20, kakao 20");
R("parmigiana","Melanzane alla Parmigiana","eu","sebze","v","İtalya","patlican 3, passata 500, mozzarella 250, parmesan 80, feslegen 1, sarimsak 2, zyagi 80, tuz 1");
R("gnocchi","Gnocchi al Pomodoro","eu","makarna","v","İtalya","gnocchi 800, passata 500, sarimsak 2, feslegen 1, mozzarella 125, zyagi 30, tuz 1");
R("ratatouille","Ratatouille","eu","sebze","v z","Fransa (Provence)","patlican 2, kabak 2, kbiber 2, domates 500, sogan 2, sarimsak 3, kekik 1, zyagi 60, tuz 1");
R("quiche","Quiche","eu","hamur","","Fransa",[
 ["Quiche Lorraine (speck'li)","milfoy 1, speck 150, yumurta 3, krema 200, emmentaler 100, muskat 1, tuz 1","","e d"],
 ["Ispanaklı-peynirli","milfoy 1, ispanak 300, bpeynir 150, yumurta 3, krema 200, emmentaler 80, tuz 1","","v"]]);
R("coqauvin","Coq au Vin","eu","tavuk","e","Fransa (Burgonya)",[
 ["Klasik (speck'li)","tbut 1200, ksarap 500, mantar 250, sogan 2, speck 100, havuc 2, sarimsak 3, un 20, tereyagi 30, tuz 1","","d"],
 ["Domuzsuz","tbut 1200, ksarap 500, mantar 250, sogan 2, havuc 2, sarimsak 3, un 20, tereyagi 30, tuz 1"]]);
R("bourguignon","Bœuf Bourguignon","eu","etli","e s","Fransa (Burgonya)","dana 1000, ksarap 750, mantar 300, havuc 3, sogan 2, salca 1, sarimsak 3, un 20, defne 2, tuz 1");
R("onionsoup","Soupe à l'oignon (soğan çorbası)","eu","corba","v s","Fransa (Paris)","sogan 8, tereyagi 50, bsarap 100, bulyon 2, ekmek 1, emmentaler 150, tuz 1");
R("croque","Croque Monsieur","eu","kahvalti","e","Fransa",[
 ["Klasik (jambonlu)","tost 8, jambon 200, emmentaler 200, sut 250, un 20, tereyagi 30","","d"],
 ["Hindi fümeli","tost 8, hindifume 200, emmentaler 200, sut 250, un 20, tereyagi 30"]]);
R("crepes","Crêpes","eu","tatli","v","Fransa (Bretanya)","un 250, yumurta 3, sut 500, tereyagi 30, seker 20");
R("gratin","Gratin Dauphinois","eu","sebze","v","Fransa (Alpler)","patates 1200, krema 400, sut 200, sarimsak 2, emmentaler 100, muskat 1, tuz 1");
R("nicoise","Salade Niçoise","eu","salata","e","Fransa (Nice)","ton 2, yumurta 4, tfasulye 200, patates 400, domates 300, zeytin 100, marul 1, zyagi 40, sirke 20, tuz 1");
R("paella","Paella Mixta","eu","pilav","e","İspanya (Valencia)","risotto 400, tbutfile 500, karides 300, midye 500, kbiber 1, bezelye 150, domates 200, sarimsak 3, tozbiber 1, bulyon 2, limon 1, zyagi 50, tuz 1");
R("tortilla","Tortilla Española","eu","kahvalti","v","İspanya","patates 800, yumurta 6, sogan 1, zyagi 200, tuz 1");
R("gazpacho","Gazpacho","eu","corba","v","İspanya (Endülüs)","domates 1000, salatalik 1, kbiber 1, sarimsak 1, ekmek 1, sirke 30, zyagi 60, tuz 1");
R("bravas","Patatas Bravas","eu","meze","v","İspanya","patates 1000, passata 250, tozbiber 2, acibiber 1, sarimsak 2, mayonez 100, zyagi 60, tuz 1");
R("moussaka","Moussaka (Yunan)","eu","etli","e","Yunanistan","patlican 3, patates 500, kiyma 500, sogan 1, dkonserve 1, sut 500, un 50, tereyagi 50, yumurta 1, parmesan 50, tarcin 1, tuz 1");
R("souvlaki","Souvlaki / Gyros","eu","kebap","e","Yunanistan",[
 ["Tavuk souvlaki","tgogus 800, limon 1, kekik 1, sarimsak 3, lavas 4, domates 200, ksogan 1, yogurt 300, salatalik 1, tuz 1"],
 ["Domuz gyros (klasik)","schwnacken 800, sogan 1, kekik 1, tozbiber 1, lavas 4, domates 200, yogurt 300, salatalik 1, tuz 1","","d"]]);
R("horiatiki","Horiatiki (Yunan salatası)","eu","salata","v","Yunanistan","domates 500, salatalik 1, dbiber 1, ksogan 1, bpeynir 200, zeytin 100, kekik 1, zyagi 50, tuz 1");
R("spanakopita","Spanakopita","eu","hamur","v","Yunanistan","yufka 1, ispanak 750, bpeynir 300, ysogan 1, dereotu 1, yumurta 2, zyagi 80, tuz 1");
R("gulyas","Gulyásleves (Macar gulaş çorbası)","eu","corba","e s","Macaristan","dana 600, patates 500, sogan 2, kbiber 2, tozbiber 2, salca 1, kummel 1, sarimsak 2, tuz 1");
R("shepherds","Shepherd's Pie / Cottage Pie","eu","etli","e","İngiltere",[
 ["Cottage Pie (dana)","kiyma 600, patates 1000, havuc 2, bezelye 150, sogan 1, salca 1, bulyon 1, sut 150, tereyagi 50, tuz 1"],
 ["Shepherd's Pie (kuzu)","kkiyma 600, patates 1000, havuc 2, bezelye 150, sogan 1, salca 1, bulyon 1, sut 150, tereyagi 50, tuz 1"]]);
R("fishchips","Fish & Chips","eu","balik","e","İngiltere","beyazbalik 800, un 200, bira 300, pommes 750, limon 1, aycicek 700, bezelye 300, tuz 1");
R("pierogi","Pierogi Ruskie","eu","makarna","v","Polonya","un 500, patates 500, quark 250, sogan 2, tereyagi 50, yumurta 1, schmand 200, tuz 1");
R("kottbullar","Köttbullar (İsveç köftesi)","eu","kofte","e","İsveç","kiyma 500, galeta 40, sut 100, sogan 1, yumurta 1, krema 200, bulyon 1, patates 800, tereyagi 30, tuz 1");
R("borscht","Borş çorbası","eu","corba","e s","Ukrayna / Rusya","pancar 500, lahana 1, patates 300, havuc 1, sogan 1, dana 400, salca 1, schmand 200, dereotu 1, sirke 20, tuz 1");
R("stroganoff","Beef Stroganoff","eu","etli","e","Rusya","biftek 600, mantar 250, sogan 1, schmand 200, hardal 1, pirinc 300, tereyagi 30, tuz 1");
R("moules","Moules Frites (midye-patates)","eu","balik","e","Belçika","midye 2000, bsarap 200, sogan 1, sarimsak 3, tereyagi 40, maydanoz 1, pommes 750");
R("rosti","Rösti","eu","sebze","v","İsviçre","patates 1000, tereyagi 50, tuz 1");
R("geschnetzeltes","Zürcher Geschnetzeltes","eu","etli","e","İsviçre (Zürih)","kalb 600, mantar 250, krema 200, bsarap 100, sogan 1, tereyagi 30, patates 1000, tuz 1");
R("caesar","Caesar salatası (tavuklu)","eu","salata","e","","marul 2, tgogus 400, parmesan 50, ekmek 1, mayonez 80, hardal 1, limon 1, sarimsak 1, zyagi 40");
R("pannacotta","Panna Cotta","eu","tatli","v","İtalya (Piemonte)","krema 600, sut 200, seker 100, vanilin 1, jelatin 6");
