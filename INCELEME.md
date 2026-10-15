# Portföy incelemesi — yayımlanmamış değişiklikler

## Tespitler

- Önceki kod her sayfa açılışında kullanıcı depoları için 1, her depo ağacı için 1 API isteği yapıyordu. 11 proje için en az 12 istek. Anonim GitHub REST sınırı genellikle IP başına saatte 60 istektir; yaklaşık 5 açılış bu bütçeyi tüketebilir. Bu oturumda gerçek bir 403/429 yanıtı veya kalan kota ölçülmedi; kota bağımlılığı kaynak kodundan doğrulandı.
- Depo listesi otomatik olarak bütün arşivlenmemiş, fork olmayan depoları alıyordu. Bu, portföy dışı depoları da ekleyebilir. Ağaç isteği başarısız olduğunda hata yutulup boş medya gösteriliyordu.
- GitHub Actions son Pages çalışması 38731543767, 19aa1c1 commit'i için 15 Ekim 2026 tarihinde başarılı tamamlandı. Bu nedenle gözlenen arayüz hatalarını başarısız Pages derlemesine bağlamak doğru değil. Pages yönetim ayarlarındaki yayın klasörü bu oturumda doğrudan okunmadı.
- Gerçek açılış görseli `docs/hero-ingiliz-anahtari.png.png`; eski kod `.png` istiyordu. Üstelik hero betiği body oluşmadan çalışıp çıkıyordu; sonradan API'den bulunan ilk görsel de hero alanını değiştiriyordu.
- `docs` yayın kökü olduğunda kökteki CNC videosu yayın dizininin dışında kalır. Hazırlanan sürüm bu dosyayı silmeden, medya için SHA sabitli raw adresini kullanıyor. Site varlıkları `./` ile Cnc alt dizinine uyumlu.
- Kartlar 16:10 oranına ve `object-fit:cover` kuralına zorlanıyordu. Video kontrolleri bağlantılı kartın içine konuyordu.
- Eski eşleme gerçek `Kozmetik-Moda`, `Spor-Beslenme`, `Endustriyel-Perspektif` depo adlarını tam tanımadığı için bazı onaylı başlık/kategoriler uygulanmıyordu.

## Hazırlanan değişiklikler

- `docs/projects.js`: mevcut 11 depodan açık katalog; tüm 25 medya dosyası korunur. Medya URL'leri mevcut commit SHA'larına sabittir; tarayıcı GitHub API'sini kullanmaz. Yeni projeler otomatik eklenmez; katalog bilinçli güncellenir.
- `docs/index.html`: İngiliz anahtarı doğrudan ve doğru dosya adıyla yüklenir. Mevcut koyu/limon yeşili kimlik, hizmetler, hakkımda, SSS ve iletişim içerikleri korunur. Mobil boyutlar, odak görünürlüğü, içerik atlama bağlantısı ve azaltılmış hareket desteği iyileştirilir.
- `docs/app.js`: Türkçe kategori filtreleri, proje sayacı, 11 detay rotası, bilinmeyen proje mesajı ve video hata yönlendirmesi. Proje başlıkları açık eşlemeyle korunur. İç içe oynatıcı/bağlantı yerine kartlar yerel film kapakları gösterir.
- `docs/posters/`: mevcut filmlerden üretilen 11 JPEG kapak, toplam yaklaşık 1,1 MB. Filmler yeniden kodlanmadı veya kırpılmadı. Kartlar ve oynatıcılar `contain` ile kadrajı korur; farklı oranlarda kenar boşlukları beklenen davranıştır. Detay filmleri kullanıcı oynatana kadar indirilmez.
- `scripts/verify.cjs`: katalog, detay rotaları, filtre, bilinmeyen rota ve yerel kapak doğrulaması.

Türkçe kategori sözlüğü korunur; yalnızca proje içeren kategoriler filtre olarak gösterilir. Endüstri 360, Hassasiyetin Gücü, Hareketin Mühendisliği, Sahanın Gücü, Formun Ötesinde, Lojistik, Gayrimenkul, Maybelline, Continental, OCN Protein, Turizm ve Seyahat: toplam 11 proje.

## Doğrulama ve inceleme

`node scripts/verify.cjs`, iki JavaScript dosyası için `node --check` ve `git diff --check` geçti. Medya boyutları ffprobe ile yerel özgünlerden okundu. İlk hazırlıkta tarayıcı testi yapılmamıştı; sonraki tarayıcı testleri ve iki düzeltme `TARAYICI-TESTLERI.md` içinde belgelendi; uzak medya GitHub raw erişimine bağımlı kalır. Film yüklenemezse proje deposuna bağlantı sunulur.

Yerelde incelemek için Cnc içinde `python -m http.server 8000 --directory docs` çalıştırıp `http://localhost:8000` adresini açabilirsiniz. `?proje=Cnc` detay sayfası örneğidir.

Hiçbir dosya silinmedi. Yeni depo oluşturulmadı; Pages ayarları değiştirilmedi. Kullanıcının isteğiyle değişiklikler mevcut Cnc deposunda ayrı bir dal ve inceleme PR’ı olarak hazırlanmıştır. PR birleştirilmeyecek ve canlıya yayın yapılmayacaktır. Yayın öncesinde bu sürümü görsel olarak inceleyip Pages kaynağının `main /docs` olduğunu doğrulamak gerekir; bu işlem henüz yapılmadı.

## PR öncesi ek kontrol

11 JPEG kapak ve özgün İngiliz anahtarı görseli temas sayfasında görsel olarak incelendi. Dikey/yatay kapak oranları korundu; video boyutları özgün dosyalarla karşılaştırıldı. Türkçe eşlemeler ve 25 medya kaydı doğrulandı. Sonraki Chromium oynatma, mobil ve dokunmatik kontrolleri `TARAYICI-TESTLERI.md` içinde belgelendi.
