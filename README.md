# 🗣️ TTS Web App - Metni Sese Çevir

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![SEO](https://img.shields.io/badge/SEO-Optimized-brightgreen.svg)](https://developers.google.com/search/docs)

Modern ve kullanıcı dostu **Text-to-Speech (TTS)** web uygulaması. Metinlerinizi doğal sesle dinleyin, gelişmiş özellikler ile okuma deneyiminizi kişiselleştirin.

## 🌟 Özellikler

### 🔊 Gelişmiş Ses Özellikleri
- **Ses Seçimi**: Türkçe destekli çoklu ses seçenekleri
- **Hız Kontrolü**: 0.5x - 2.0x arası ayarlanabilir okuma hızı
- **Preset Hızlar**: Yavaş, Normal, Hızlı, Çok Hızlı seçenekleri
- **Kelime Vurgulama**: Okunan kelimelerin gerçek zamanlı vurgulanması

### 📚 İçerik Yönetimi
- **Geçmiş Yönetimi**: Okunan metinlerin otomatik kaydı
- **Kategorilendirme**: Metinleri etiketleme ve organize etme
- **Arama Fonksiyonu**: Geçmişte hızlı arama
- **Favoriler**: Önemli metinleri favorilere ekleme
- **Toplu İşlemler**: Çoklu seçim ve toplu silme

### 🎨 Modern Arayüz
- **Dark/Light Tema**: Göz yorgunluğunu azaltan tema seçenekleri
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Minimalist UI**: Temiz ve kullanıcı dostu arayüz
- **Smooth Animasyonlar**: Akıcı geçiş efektleri

### ♿ Erişilebilirlik
- **WCAG 2.1 AA Uyumlu**: Web erişilebilirlik standartlarına uygun
- **Klavye Navigasyonu**: Tam klavye desteği
- **Screen Reader Desteği**: Görme engelliler için optimize edilmiş
- **Yüksek Kontrast**: Görme zorluğu çekenler için uygun renkler

## 🚀 Canlı Demo

**[TTS Web App'i Deneyin →](https://your-domain.com)**

## 📱 Teknolojiler

- **Frontend**: React 18, Modern JavaScript (ES6+)
- **Styling**: CSS3, CSS Variables, Flexbox, Grid
- **API**: Web Speech API
- **PWA**: Service Worker, Web App Manifest
- **SEO**: Structured Data, Open Graph, Twitter Cards
- **Accessibility**: ARIA Labels, Semantic HTML

## 🛠️ Kurulum

### Gereksinimler
- Node.js 16+ 
- npm veya yarn

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
```

## 🎯 Kullanım

1. **Metin Girişi**: Ana alana seslendirilecek metni yazın
2. **Ses Seçimi**: İstediğiniz sesi seçin (🎤 butonu)
3. **Hız Ayarı**: Okuma hızını ayarlayın (⚡ butonu)
4. **Oynatma**: "Seslendir" butonuna basın
5. **Kontrol**: Duraklat, devam et veya durdur
6. **Geçmiş**: Okunan metinleri geçmişten yeniden kullanın

## 🔧 Geliştirme

### Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── Header/         # Başlık ve kontroller
│   ├── AudioControls/  # Ses kontrol butonları
│   ├── TextInput/      # Metin giriş alanı
│   ├── VoiceSelector/  # Ses seçimi paneli
│   ├── SpeedControl/   # Hız kontrol paneli
│   ├── History/        # Geçmiş yönetimi
│   └── CurrentReading/ # Aktif okuma gösterimi
├── context/            # React Context
├── hooks/              # Custom hooks
├── utils/              # Yardımcı fonksiyonlar
├── constants/          # Sabitler
└── styles/             # CSS dosyaları
```

### Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📊 SEO Özellikleri

- ✅ **Structured Data**: Schema.org markup
- ✅ **Meta Tags**: Comprehensive meta information
- ✅ **Open Graph**: Social media optimization
- ✅ **Twitter Cards**: Twitter sharing optimization
- ✅ **Sitemap**: XML sitemap for search engines
- ✅ **Robots.txt**: Search engine crawling instructions
- ✅ **Semantic HTML**: Proper HTML5 semantics
- ✅ **Performance**: Optimized loading and rendering

## 🌐 Tarayıcı Desteği

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ⚠️ **Not**: Web Speech API desteği gereklidir

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Selman Sahbudak**

- 🌐 Website: [selmansahbudak.com.tr](https://www.selmansahbudak.com.tr)
- 💼 LinkedIn: [selman-sahbudak](https://linkedin.com/in/selman-sahbudak)
- 🐙 GitHub: [@Selman-S](https://github.com/Selman-S)
- 🐦 Twitter: [@selman_dev](https://twitter.com/selman_dev)
- 📧 Email: selmansahbudak1@gmail.com

## 🙏 Teşekkürler

- Web Speech API geliştiricilerine
- React topluluğuna
- Açık kaynak katkıda bulunanlara

## 🔮 Gelecek Özellikler

- [ ] **Audio Export**: MP3/WAV dosya dışa aktarma
- [ ] **Cloud Sync**: Bulut senkronizasyonu
- [ ] **Voice Cloning**: Özel ses klonlama
- [ ] **Multi-language**: Çoklu dil desteği
- [ ] **Mobile App**: React Native mobil uygulaması
- [ ] **API Integration**: Harici TTS servisleri

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

📱 **PWA olarak yükleyebilir ve offline kullanabilirsiniz!**
