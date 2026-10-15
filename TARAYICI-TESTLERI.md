# PR #1 — Tarayıcı test sonuçları

15 Ekim 2026, Chromium 154.0.8037.57 ile yerel HTTP önizlemesinde test edildi. Başlangıç dosya ağacı PR başı `c14dfa9` ile aynıydı; aşağıdaki iki düzeltmeden sonra testler tekrar geçti. Canlı site kullanılmadı ve yayın yapılmadı.

## Bulunan ve düzeltilen sorunlar

1. `.section` kuralı tablet genişliğinde kapsayıcının yatay boşluklarını sıfırlıyordu. Yalnızca dikey padding tanımlanarak 768 px'de 24 px, telefonda 20 px yan boşluk korundu.
2. `preload="none"` detay videoları oynatılmadan önce proje kapağı göstermiyordu. Mevcut yerel kapak `poster` olarak eklendi; video ön yükleme davranışı ve kadrajı korundu.

## Sonuçlar

- 11 kart kapağı ve özgün İngiliz anahtarı görseli tarayıcıda çözümlendi ve görüntülendi; hepsinde `object-fit: contain` doğrulandı.
- 11 projenin Türkçe başlıkları ve kategorileri detay sayfalarında kontrol edildi. Tüm 9 görünür filtre doğru sayıda proje gösterdi (Sanayi & İmalat: 4; diğer dolu kategoriler: 1; toplam: 11).
- 12 özgün video (İş Makineleri'nde iki video) uzak GitHub raw adreslerinden 1440 px ve 390 px genişliklerde oynatıldı. Başlatma, duraklatma, süre ortasına ileri sarma ve yeniden oynatma: 24 kontrol geçti. Çözümlenen video boyutları katalogdaki özgün boyutlarla eşleşti.
- 320, 375, 390, 768 ve 1440 px genişliklerde toplam 55 proje detay düzeni kontrol edildi; yatay taşma yok. Detay görselleri de yüklendi. Mobil ana sayfa ve CNC detayı ekran görüntüleri görsel olarak incelendi.
- Ek olarak 390 × 844 dokunmatik mobil Chromium emülasyonunda CNC videosu yerel oynatıcı düğmesine dokunarak başlatıldı; `playsinline`, zaman ilerlemesi ve taşmayan düzen doğrulandı.
- Karttan detay açma ve Tüm Projeler'e dönüş 5 genişlikte geçti. Bilinmeyen proje mesajı ve bilerek bozuk video adresiyle hata yönlendirmesi geçti.
- JavaScript sayfa hatası: 0. GitHub API isteği: 0.

| Proje | Video sayısı | Masaüstü ve mobil oynatma/durdurma/sarma |
| --- | ---: | --- |
| Endüstri 360 | 1 | Geçti |
| Hassasiyetin Gücü | 1 | Geçti |
| Hareketin Mühendisliği | 1 | Geçti |
| Sahanın Gücü | 2 | Geçti |
| Formun Ötesinde | 1 | Geçti |
| Lojistik | 1 | Geçti |
| Gayrimenkul | 1 | Geçti |
| Maybelline | 1 | Geçti |
| Continental | 1 | Geçti |
| OCN Protein | 1 | Geçti |
| Turizm ve Seyahat | 1 | Geçti |

## Sınırlar ve yeniden çalıştırma

Testler masaüstü Chromium ve mobil Chromium emülasyonudur; fiziksel telefon/Safari testi ve duyulan ses kalitesi kontrolü yapılmadı. Otomatik oynatma kontrolleri sessizde yapıldı. Google Fonts bu ortamın ağ politikasında engellendi; yedek yazı tipleriyle görünüm doğrulandı. Ortam proxy CA'sı tarayıcı güven deposuna eklenerek TLS doğrulaması açık tutuldu. Sayfa değişimi ve ileri sarma sırasında iptal edilen medya istekleri oynatma başarısızlığı sayılmadı; video zaman ilerlemesi ayrıca doğrulandı.

Playwright ve Chromium bulunan bir ortamda, proxy kullanılıyorsa proxy CA'sı güvenilir olarak tanımlanmışken:

```sh
python -m http.server 8000 --directory docs
# Ayrı terminalde:
python scripts/browser-qa.py --output /tmp/cnc-qa
node scripts/verify.cjs
```

Çalışma çıktıları: `results.json` ve ekran görüntüleri seçilen output dizinine yazılır. Test için kullanılan bozuk URL dışında medya dosyası eklenmez/değiştirilmez.

Özgün `CNC.PROJE 01.mp4`, İngiliz anahtarı PNG'si, 11 kapak ve proje kataloğu korunmuştur. Hiçbir reklam dosyası silinmedi. PR birleştirilmedi; main, Pages ayarları ve canlı site değiştirilmedi.
