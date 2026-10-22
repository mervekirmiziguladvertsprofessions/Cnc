# Onaylı portföy kapakları — inceleme ve test raporu

## Kapsam

Kullanıcının yüklediği ROSS_STUDIO_12_KAPAK_25MB_ALTI (1).zip içindeki SITE_1920x1080 JPG dosyalarından 11'i hiçbir yeniden kodlama veya sıkıştırma yapılmadan eklendi. Onaylı görseller yeniden üretilmedi ve alternatif görsel kullanılmadı.

Protein Ocean / Spor-Beslenme için ZIP'teki 11 numaralı JPG siteye alınmadı. Mevcut proje nesnesi, poster bağlantısı, poster dosyası, içerik ve videolar aynen korundu. Mevcut OCN posterinin SHA-256 değeri: f761ad7e31a8dad09e1d970b861f64a4bcab41fa9682574e8fcab6392e2884fd.

Yalnızca docs/projects.js içindeki diğer 11 poster alanı değiştirildi. Proje adları, sırası, kategoriler, video URL'leri, çözünürlükleri, açıklamalar ve detay sayfası kodu değişmedi. docs/index.html, docs/app.js, mevcut medya ve eski kapak dosyalarına dokunulmadı.

## Eşleştirmeler

| Proje | Proje kimliği | Yeni dosya |
| --- | --- | --- |
| Endüstri 360 | Endustriyel-Perspektif | docs/posters/approved-2026-10-23/01_Endustri_360.jpg |
| Hassasiyetin Gücü | Cnc | docs/posters/approved-2026-10-23/02_Hassasiyetin_Gucu_CNC.jpg |
| Hareketin Mühendisliği | Robotik-Otomasyon | docs/posters/approved-2026-10-23/03_Hareketin_Muhendisligi_Robotik.jpg |
| Sahanın Gücü | Is-Makineleri | docs/posters/approved-2026-10-23/04_Sahanin_Gucu_Is_Makineleri.jpg |
| Formun Ötesinde | Plastik-Teknolojileri-Formun-Otesinde | docs/posters/approved-2026-10-23/05_Formun_Otesinde_Plastik.jpg |
| Yeraltından Cevhere | Madencilik | docs/posters/approved-2026-10-23/06_Yeraltindan_Cevhere_Maden.jpg |
| Lojistik | Lojistik | docs/posters/approved-2026-10-23/07_Lojistik.jpg |
| Gayrimenkul | Gayrimenkul | docs/posters/approved-2026-10-23/08_Gayrimenkul.jpg |
| Maybelline | Kozmetik-Moda | docs/posters/approved-2026-10-23/09_Maybelline.jpg |
| Continental | Otomotiv | docs/posters/approved-2026-10-23/10_Continental.jpg |
| Turizm ve Seyahat | Turizm-Seyahat | docs/posters/approved-2026-10-23/12_Turizm_Seyahat_OTEL_ONU.jpg |

OCN Protein: mevcut ./posters/Spor-Beslenme.jpg korunur.

## Kaynaklar ve ölçüler

- Uygulanan 11 JPG'nin tamamı 1920 × 1080, 16:9 ve ZIP ile bayt bazında aynı.
- Plastik için gönderilen JPG'nin yan boşlukları ve tüm panelleri korunmuştur; kırpma yapılmadı.
- Turizmde gönderilen otel önü/yolcular/valizler görseli kullanıldı.
- Madencilikte mevcut Yeraltından Cevhere kartına yeraltı tüneli kapağı bağlandı; yeni proje oluşturulmadı.
- Paket kaynakları assets/approved-covers/2026-10-23/sources/ altında 12 dosya olarak arşivlendi; manifest.json aynen korundu. Kaynaklar docs yayın kökünün dışındadır ve sayfa tarafından yüklenmez.
- Yeni küçük paket 10 WebP kaynak ile 2 PNG kaynak içeriyor. WebP'ler orijinal PNG gibi sunulmuyor; paketteki halleri aynen saklandı. İki PNG de değiştirilmedi. 12 kaynak dosyasının paket_sha256 kontrolleri geçti.
- Manifestte kaynakların çoğu 1672 × 941 olarak belirtiliyor. JPG teslim boyutu 1920 × 1080; orijinal kaynakların doğal olarak 1080p olduğu iddia edilmiyor.
- Sayfa mevcut lazy-loading ve contain davranışını kullanır. Kod/CSS ve ön yükleme davranışı değiştirilmedi. 11 yeni JPG toplam 9.82 MB; dosyaların kullanıcıdan gelen kalite ve boyutu korundu.

## Doğrulama

- scripts/verify.cjs: 12 proje, 12 detay rotası, 9 sektör filtresi, bilinmeyen rota, yerel kapak yolları ve sabit medya bağlantıları geçti.
- Chromium 390, 768 ve 1440 px: 36 kart kontrolü, 36 detay görünümü ve 30 filtre kontrolü geçti.
- Tüm yeni kapaklar tarayıcıda decode edildi, doğal boyutları 1920 × 1080 ve ön plan object-fit değeri contain olarak doğrulandı.
- Her detay sayfasında video posterleri doğru proje kapağına eşlendi; video URL ve boyut alanları mevcut katalogla karşılaştırıldı.
- Geri dönüş bağlantısı çalıştı. Yerel 404/kırık görsel: 0. JavaScript hatası: 0. Yatay taşma: 0.
- Plastik, Turizm ve Yeraltından Cevhere kartlarının ekran görüntüleri görsel olarak incelendi.
- Testte harici font ve medya istekleri kapatıldı. Uzak video oynatma veya fiziksel cihaz testi yeniden yapılmadı; medya URL'leri değişmediği doğrulandı.
- ZIP'teki JPG'ler, kaynak dosyalar ve GitHub'a aktarılan blob'lar dosya kimlikleriyle karşılaştırıldı.

## Değişen dosyalar

- docs/projects.js: yalnızca 11 poster alanı.
- docs/posters/approved-2026-10-23/: 11 yeni JPG.
- assets/approved-covers/2026-10-23/manifest.json: paketin manifesti.
- assets/approved-covers/2026-10-23/sources/: 12 değiştirilmemiş kaynak (10 WebP, 2 PNG); OCN kaynağı yalnızca arşivdir, siteye bağlanmaz.
- KAPAK-GUNCELLEME.md: bu rapor.

## Yayın durumu

Değişiklikler yalnızca inceleme dalına ve PR'a hazırlanmıştır. main dalı, GitHub Pages ayarları ve canlı site değiştirilmedi. Kullanıcı onayı olmadan birleştirme/yayın yapılmayacak.
