# 🗣️ TTS Web App - Metni Sese Çevir

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![SEO](https://img.shields.io/badge/SEO-Optimized-brightgreen.svg)](https://developers.google.com/search/docs)

Modern ve kullanıcı dostu **Text-to-Speech (TTS)** web uygulaması. Metinlerinizi doğal sesle dinleyin, gelişmiş özellikler ile okuma deneyiminizi kişiselleştirin.

## 🌟 Temel Özellikler

### 🔊 Gelişmiş Ses Kontrolleri
- **Çoklu Ses Seçimi**: Türkçe ve İngilizce destekli geniş ses seçenekleri
- **Hız Kontrolü**: 0.5x - 2.0x arası 7 farklı hız seçeneği
- **Gerçek Zamanlı Kelime Vurgulama**: Okunan kelimelerin canlı vurgulanması
- **Profesyonel İkonlar**: React Icons ile modern görsel tasarım

### 📊 Akıllı İlerleme Takibi
- **Detaylı Progress Bar**: Cümle bazında ilerleme gösterimi
- **WPM Hesaplama**: Dakikada okunan kelime sayısı
- **Süre Takibi**: Geçen süre ve tahmini kalan süre
- **Görsel İlerleme**: Yüzdelik dilimlerle görsel feedback

### 🎯 Cümle Navigasyonu
- **İleri/Geri Navigasyon**: Cümleler arası kolay geçiş
- **Akıllı Kontrol**: Duraklatma durumuna göre otomatik yönetim
- **Kelime Senkronizasyonu**: Tam zamanlı kelime-cümle eşleşmesi

### 🔄 Kaldığınız Yerden Devam Etme
- **Resume Reading Kartı**: Şık tasarımla duraklatılan okuma bildirimi
- **Otomatik Durum Kaydı**: Sayfa değişikliklerinde durum korunması
- **Metin Önizlemesi**: Hangi metni okuyorduğunuzu hatırlatma
- **Tek Tık Devam**: Kaldığınız cümleden anında devam etme

### 📚 Gelişmiş Geçmiş Yönetimi
- **Otomatik Kayıt**: Her okunan metnin anlık kaydedilmesi
- **Akıllı Arama**: Metin içeriğinde hızlı arama
- **Kategori Sistemi**: 6 farklı kategori ile organize etme
- **Favoriler**: Önemli metinleri favorilere ekleme
- **Toplu İşlemler**: Çoklu seçim ve toplu silme
- **Meta Bilgiler**: Tarih, kelime sayısı ve kategori gösterimi

### 🎨 Modern UI/UX
- **Dark/Light Tema**: Göz sağlığı için tema seçenekleri
- **Responsive Tasarım**: Tüm cihazlarda mükemmel uyum
- **Smooth Animasyonlar**: Akıcı geçiş efektleri
- **Glass Morphism**: Modern cam efekti tasarımı
- **Professional Icons**: Font Awesome ikonları

### 🌐 Çoklu Dil Desteği
- **🇹🇷 Türkçe**: Tam yerelleştirme ve Türkçe sesler
- **🇺🇸 English**: Complete localization and English voices
- **Otomatik Algılama**: Tarayıcı diline göre otomatik seçim
- **Context-Aware**: Dile göre optimize edilmiş özellikler

### ♿ Tam Erişilebilirlik
- **WCAG 2.1 AA Uyumlu**: Web erişilebilirlik standartlarına tam uyum
- **Klavye Navigasyonu**: Tam klavye desteği
- **Screen Reader Optimize**: Görme engelliler için optimize edilmiş
- **ARIA Labels**: Kapsamlı erişilebilirlik etiketleri
- **Semantic HTML**: Anlamsal HTML5 yapısı

### 🔒 Gizlilik ve Güvenlik
- **100% Offline**: Veriler sadece cihazınızda saklanır
- **Sunucu Yok**: Hiçbir veri dış sunucuya gönderilmez
- **LocalStorage**: Güvenli yerel veri saklama
- **Veri Kontrolü**: Tam veri yönetimi kontrolü

## 🚀 Canlı Demo

**[TTS Web App'i Deneyin →](https://your-domain.com)**

## 📱 Teknolojiler

### Frontend Stack
- **React 18**: Modern React hooks ve context API
- **JavaScript ES6+**: Modern JavaScript özellikleri
- **CSS3**: CSS Variables, Flexbox, Grid, Animations
- **React Icons**: Professional icon library

### Browser APIs
- **Web Speech API**: Doğal ses sentezi
- **LocalStorage API**: Veri saklama
- **Web Audio API**: Ses işleme (gelecek özellikler için)

### Development Tools
- **Create React App**: Sıfır konfigürasyon setup
- **Modern Build Pipeline**: Optimize edilmiş production build
- **PWA Ready**: Progressive Web App desteği

## 🛠️ Kurulum

### Gereksinimler
- **Node.js 16+** 
- **npm** veya **yarn**
- **Modern Browser** (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

### Kurulum Adımları

```bash
# Projeyi klonlayın
git clone https://github.com/Selman-S/tts-web-app.git

# Proje dizinine girin
cd tts-web-app

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📦 Build ve Deploy

```bash
# Production build oluşturun
npm run build

# Build'i test edin
npm install -g serve
serve -s build

# Build dosyaları 'build' klasöründe hazır
```

## 🎯 Hızlı Kullanım

### Temel Kullanım
1. **Metin Girin**: Ana alandaki metin kutusuna içeriği yazın
2. **Ses Seçin**: Dropdown'dan istediğiniz sesi seçin
3. **Hız Ayarlayın**: 0.5x - 2.0x arası hız seçin
4. **Başlatın**: "Seslendir" butonuna basın
5. **Kontrol Edin**: Duraklat, devam et veya durdurun

### Gelişmiş Özellikler
- **Cümle Navigasyonu**: Ok tuşları ile cümleler arası geçiş
- **Resume Reading**: Duraklatıp çıktığınızda kaldığınız yerden devam
- **Geçmiş Yönetimi**: Okunan metinleri organize edin
- **Tema Değiştirme**: Ayarlar sayfasından tema seçin

## 🏗️ Proje Yapısı

```
src/
├── components/              # React bileşenleri
│   ├── AudioControls/      # Ses kontrol butonları
│   ├── CurrentReading/     # Aktif okuma gösterimi
│   ├── Header/             # Başlık ve global kontroller
│   ├── History/            # Geçmiş yönetimi
│   ├── ProgressBar/        # İlerleme çubuğu
│   ├── ResumeReading/      # Kaldığınız yerden devam
│   ├── SpeedControl/       # Hız kontrol paneli
│   ├── TextInput/          # Metin giriş alanı
│   ├── UI/                 # UI bileşenleri
│   └── VoiceSelector/      # Ses seçimi paneli
├── context/                # React Context
│   ├── LanguageContext.js  # Dil yönetimi
│   ├── SpeechContext.js    # Ses yönetimi (Global State)
│   └── ThemeContext.js     # Tema yönetimi
├── hooks/                  # Custom hooks
│   ├── useHistory.js       # Geçmiş yönetimi
│   └── useSpeechSynthesis.js # Ses sentezi
├── pages/                  # Sayfa bileşenleri
│   ├── HomePage.js         # Ana sayfa
│   ├── HistoryPage.js      # Geçmiş sayfası
│   └── SettingsPage.js     # Ayarlar sayfası
├── translations/           # Çoklu dil desteği
├── utils/                  # Yardımcı fonksiyonlar
├── constants/              # Sabitler
└── styles/                 # Global stiller
```

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Primary**: Modern mavi tonları
- **Success**: Yeşil vurgular
- **Warning**: Turuncu tonları
- **Danger**: Kırmızı uyarılar
- **Neutral**: Gri skalası

### Typography
- **Font Family**: Inter, system fonts
- **Font Weights**: 400, 500, 600, 700
- **Responsive Sizes**: Mobile-first yaklaşım

### Spacing System
- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px

## 🔧 Geliştirme

### Katkıda Bulunma
1. **Fork** yapın
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** edin (`git commit -m 'Add amazing feature'`)
4. **Push** edin (`git push origin feature/amazing-feature`)
5. **Pull Request** oluşturun

### Kod Standartları
- **ESLint**: Kod kalitesi kontrolü
- **Prettier**: Kod formatlama
- **Semantic Commits**: Anlamlı commit mesajları
- **Component Documentation**: JSDoc yorumları

## 📊 SEO ve Performance

### SEO Özellikleri
- ✅ **Structured Data**: Schema.org markup
- ✅ **Meta Tags**: Kapsamlı meta bilgileri
- ✅ **Open Graph**: Sosyal medya optimizasyonu
- ✅ **Twitter Cards**: Twitter paylaşım optimizasyonu
- ✅ **Sitemap**: XML sitemap
- ✅ **Robots.txt**: Arama motoru talimatları

### Performance
- ✅ **Code Splitting**: Route bazında kod bölme
- ✅ **Lazy Loading**: Gerektiğinde yükleme
- ✅ **Optimized Images**: Görsel optimizasyonu
- ✅ **CSS Optimization**: Minimal CSS
- ✅ **Bundle Analysis**: Paket boyutu analizi

## 🌐 Tarayıcı Desteği

| Tarayıcı | Minimum Sürüm | Durum |
|----------|----------------|--------|
| Chrome   | 80+           | ✅ Tam Destek |
| Firefox  | 75+           | ✅ Tam Destek |
| Safari   | 13+           | ✅ Tam Destek |
| Edge     | 80+           | ✅ Tam Destek |

**Not**: Web Speech API desteği gereklidir.

## 📝 Dokümantasyon

- **[Kullanım Kılavuzu](USER_GUIDE.md)**: Detaylı kullanım talimatları
- **[TODO Listesi](TODO.md)**: Gelecek özellikler ve iyileştirmeler
- **[Geliştirme Roadmap](DEVELOPMENT_ROADMAP.md)**: Uzun vadeli planlama

## 📄 Lisans

Bu proje **MIT** lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Selman Sahbudak**

- 🌐 Website: [selmansahbudak.com.tr](https://www.selmansahbudak.com.tr)
- 💼 LinkedIn: [selman-sahbudak](https://linkedin.com/in/selman-sahbudak)
- 🐙 GitHub: [@Selman-S](https://github.com/Selman-S)
- 🐦 Twitter: [@selman_dev](https://twitter.com/selman_dev)
- 📧 Email: selmansahbudak1@gmail.com

## 🙏 Teşekkürler

- **Web Speech API** geliştiricilerine
- **React** topluluğuna
- **Open Source** katkıda bulunanlara
- **Accessibility** savunucularına

## 🔮 Gelecek Özellikler

### Yakın Gelecek (1-2 Ay)
- [ ] **Audio Export**: MP3/WAV dosya dışa aktarma
- [ ] **Voice Preview**: Ses önizleme özelliği
- [ ] **Reading Statistics**: Detaylı okuma istatistikleri
- [ ] **Keyboard Shortcuts**: Gelişmiş klavye kısayolları

### Orta Vadeli (3-6 Ay)
- [ ] **PWA Enhancement**: Offline mod ve push notification
- [ ] **Cloud Sync**: Bulut senkronizasyonu
- [ ] **Multi-language**: Daha fazla dil desteği
- [ ] **AI Integration**: Metin özetleme ve analiz

### Uzun Vadeli (6+ Ay)
- [ ] **Mobile App**: React Native uygulaması
- [ ] **Voice Cloning**: Kişisel ses klonlama
- [ ] **Community Features**: Sosyal özellikler
- [ ] **Enterprise Version**: Kurumsal sürüm

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

📱 **PWA olarak yükleyebilir ve offline kullanabilirsiniz!**

🚀 **Sürekli güncellenen özellikler için GitHub'ı takip edin!**
