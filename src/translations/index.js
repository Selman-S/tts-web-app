// Translation system for Turkish and English
export const translations = {
  tr: {
    // App title
    appTitle: 'Text to Speech',
    
    // Navigation
    nav: {
      home: 'Ana Sayfa',
      history: 'Geçmiş',
      settings: 'Ayarlar'
    },
    
    // Text Input
    textInput: {
      placeholder: 'Seslendirilecek metni buraya yazın...',
      characterCount: 'karakter',
      voice: 'Ses',
      speed: 'Hız',
      clearText: 'Metni temizle',
      enterText: 'Lütfen bir metin girin.',
      browserNotSupported: 'Tarayıcınız bu özelliği desteklemiyor.',
      validTextRequired: 'Lütfen geçerli bir metin girin.'
    },
    
    // Audio Controls
    audioControls: {
      speak: 'Seslendir',
      pause: 'Duraklat',
      resume: 'Devam Et',
      stop: 'Durdur',
      speakAriaLabel: 'Metni seslendir',
      pauseAriaLabel: 'Seslendirmeyi duraklat',
      resumeAriaLabel: 'Seslendirmeye devam et',
      stopAriaLabel: 'Seslendirmeyi durdur'
    },
    
    // Resume Reading
    resumeReading: {
      title: 'Kaldığınız Yerden Devam Edin',
      description: 'Önceki okuma seansınızı kaldığınız yerden devam ettirin',
      resumeButton: 'Kaldığım Yerden Devam Et',
      dismissButton: 'Kapat',
      sentenceInfo: 'Cümle {current} / {total}',
      textPreview: 'Metin önizlemesi'
    },
    
    // Progress Bar
    progressBar: {
      sentences: 'cümle',
      wordsPerMinute: 'KDK',
      estimatedTime: 'dk',
      elapsedTime: 'Geçen Süre',
      of: '/'
    },
    
    // Current Reading
    currentReading: {
      reading: 'Okunan',
      sentenceNavigation: 'Cümle Geçişi',
      previousSentence: 'Önceki Cümle',
      nextSentence: 'Sonraki Cümle'
    },
    
    // Voice Selector
    voiceSelector: {
      title: 'Ses Seçimi',
      defaultVoice: 'Varsayılan Ses',
      systemDefault: 'Sistem varsayılan sesi'
    },
    
    // Speed Control
    speedControl: {
      title: 'Okuma Hızı',
      slow: 'Yavaş',
      normal: 'Normal',
      fast: 'Hızlı',
      veryFast: 'Çok Hızlı'
    },
    
    // History
    history: {
      title: 'Geçmiş',
      clear: 'Temizle',
      search: 'Ara...',
      all: 'Tümü',
      favorites: 'Favoriler',
      categories: 'Kategoriler',
      selectAll: 'Tümünü Seç',
      selectItem: 'Öğeyi seç',
      changeCategory: 'Kategoriyi değiştir',
      delete: 'Sil',
      cancel: 'İptal',
      load: 'Yükle',
      words: 'kelime',
      noHistory: 'Henüz geçmiş yok',
      noResults: 'Sonuç bulunamadı'
    },
    
    // Settings
    settings: {
      title: 'Ayarlar',
      language: 'Dil',
      languageSelection: 'Dil Seçimi',
      turkish: 'Türkçe',
      english: 'English',
      theme: 'Tema',
      themeSelection: 'Tema Seçimi',
      light: 'Açık Tema',
      dark: 'Koyu Tema',
      voiceSettings: 'Ses Ayarları',
      selectedVoice: 'Seçili Ses',
      readingSpeed: 'Okuma Hızı',
      dataManagement: 'Veri Yönetimi',
      clearAllData: 'Tüm Verileri Temizle',
      exportData: 'Verileri Dışa Aktar',
      importData: 'Verileri İçe Aktar',
      about: 'Hakkında',
      version: 'Sürüm',
      developer: 'Geliştirici',
      confirmClearData: 'Tüm veriler silinecek. Emin misiniz?',
      clearDataWarning: 'Bu işlem tüm geçmiş kayıtlarınızı, ayarlarınızı ve duraklatılmış okuma oturumunuzu kalıcı olarak siler.',
      dataCleared: 'Tüm veriler temizlendi.',
      dataExported: 'Veriler dışa aktarıldı.',
      dataImported: 'Veriler içe aktarıldı.'
    },
    
    // Categories
    categories: {
      news: 'Haberler',
      education: 'Eğitim',
      entertainment: 'Eğlence',
      work: 'İş',
      personal: 'Kişisel',
      other: 'Diğer'
    },
    
    // Common
    common: {
      close: 'Kapat',
      save: 'Kaydet',
      cancel: 'İptal',
      confirm: 'Onayla',
      yes: 'Evet',
      no: 'Hayır',
      ok: 'Tamam',
      error: 'Hata',
      success: 'Başarılı',
      loading: 'Yükleniyor...',
      default: 'Varsayılan',
      preparing: 'Hazırlanıyor...',
      enterTextFirst: 'Metin girin',
      closeError: 'Hatayı kapat',
      minutes: 'dk',
      words: 'kelime'
    },

    // Home page
    home: {
      inputLabel: 'Metninizi buraya yazın veya yapıştırın',
      inputPlaceholder: 'İpucu: Metniniz yazarken otomatik kaydedilir...',
      autoSaved: 'Metin otomatik kaydedildi',
      textStats: 'Metin istatistikleri',
      clearText: 'Metni temizle',
      wordCount: 'Kelime',
      charCount: 'Karakter',
      estimatedTime: 'Tahmini süre',
      atSpeed: 'Hız ile',
      voiceLabel: 'Ses Seçimi',
      speedLabel: 'Hız',
      statusPreparing: 'Hazırlanıyor...',
      statusPaused: 'Duraklatıldı',
      statusSpeaking: 'Okunuyor...',
      timeRemaining: 'kaldı',
      readingStats: 'Okuma İstatistikleri',
      completed: 'Tamamlanan',
      totalTime: 'Toplam Süre',
      resumeTitle: 'Kaldığınız Yerden Devam Edin',
      resumeButton: 'Devam Et',
      dismissButton: 'Kapat',
      speedOptions: {
        '0.5': '0.5x - Çok Yavaş',
        '0.75': '0.75x - Yavaş',
        '1': '1.0x - Normal',
        '1.25': '1.25x - Hızlı',
        '1.5': '1.5x - Çok Hızlı',
        '1.75': '1.75x - Ultra Hızlı',
        '2': '2.0x - Maksimum'
      },
      tip: 'İpucu: Metin okurken diğer sekmelere geçebilirsiniz',
      speakTitle: 'Metni sesli okumaya başla',
      writeFirst: 'Önce bir metin yazın'
    }
  },
  
  en: {
    // App title
    appTitle: 'Text to Speech',
    
    // Navigation
    nav: {
      home: 'Home',
      history: 'History',
      settings: 'Settings'
    },
    
    // Text Input
    textInput: {
      placeholder: 'Enter text to be spoken here...',
      characterCount: 'characters',
      voice: 'Voice',
      speed: 'Speed',
      clearText: 'Clear text',
      enterText: 'Please enter some text.',
      browserNotSupported: 'Your browser does not support this feature.',
      validTextRequired: 'Please enter valid text.'
    },
    
    // Audio Controls
    audioControls: {
      speak: 'Speak',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      speakAriaLabel: 'Speak text',
      pauseAriaLabel: 'Pause speech',
      resumeAriaLabel: 'Resume speech',
      stopAriaLabel: 'Stop speech'
    },
    
    // Resume Reading
    resumeReading: {
      title: 'Resume Where You Left Off',
      description: 'Continue your previous reading session from where you left off',
      resumeButton: 'Resume Reading',
      dismissButton: 'Dismiss',
      sentenceInfo: 'Sentence {current} / {total}',
      textPreview: 'Text preview'
    },
    
    // Progress Bar
    progressBar: {
      sentences: 'sentences',
      wordsPerMinute: 'WPM',
      estimatedTime: 'min',
      elapsedTime: 'Elapsed Time',
      of: '/'
    },
    
    // Current Reading
    currentReading: {
      reading: 'Reading',
      sentenceNavigation: 'Sentence Navigation',
      previousSentence: 'Previous Sentence',
      nextSentence: 'Next Sentence'
    },
    
    // Voice Selector
    voiceSelector: {
      title: 'Voice Selection',
      defaultVoice: 'Default Voice',
      systemDefault: 'System default voice'
    },
    
    // Speed Control
    speedControl: {
      title: 'Reading Speed',
      slow: 'Slow',
      normal: 'Normal',
      fast: 'Fast',
      veryFast: 'Very Fast'
    },
    
    // History
    history: {
      title: 'History',
      clear: 'Clear',
      search: 'Search...',
      all: 'All',
      favorites: 'Favorites',
      categories: 'Categories',
      selectAll: 'Select All',
      selectItem: 'Select item',
      changeCategory: 'Change category',
      delete: 'Delete',
      cancel: 'Cancel',
      load: 'Load',
      words: 'words',
      noHistory: 'No history yet',
      noResults: 'No results found'
    },
    
    // Settings
    settings: {
      title: 'Settings',
      language: 'Language',
      languageSelection: 'Language Selection',
      turkish: 'Türkçe',
      english: 'English',
      theme: 'Theme',
      themeSelection: 'Theme Selection',
      light: 'Light Theme',
      dark: 'Dark Theme',
      voiceSettings: 'Voice Settings',
      selectedVoice: 'Selected Voice',
      readingSpeed: 'Reading Speed',
      dataManagement: 'Data Management',
      clearAllData: 'Clear All Data',
      exportData: 'Export Data',
      importData: 'Import Data',
      about: 'About',
      version: 'Version',
      developer: 'Developer',
      confirmClearData: 'All data will be deleted. Are you sure?',
      clearDataWarning: 'This permanently deletes all history, settings, and paused reading sessions.',
      dataCleared: 'All data cleared.',
      dataExported: 'Data exported.',
      dataImported: 'Data imported.'
    },
    
    // Categories
    categories: {
      news: 'News',
      education: 'Education',
      entertainment: 'Entertainment',
      work: 'Work',
      personal: 'Personal',
      other: 'Other'
    },
    
    // Common
    common: {
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      error: 'Error',
      success: 'Success',
      loading: 'Loading...',
      default: 'Default',
      preparing: 'Preparing...',
      enterTextFirst: 'Enter text',
      closeError: 'Close error',
      minutes: 'min',
      words: 'words'
    },

    // Home page
    home: {
      inputLabel: 'Write or paste your text here',
      inputPlaceholder: 'Tip: Your text is auto-saved as you type...',
      autoSaved: 'Text auto-saved',
      textStats: 'Text statistics',
      clearText: 'Clear text',
      wordCount: 'Words',
      charCount: 'Characters',
      estimatedTime: 'Estimated time',
      atSpeed: 'At speed',
      voiceLabel: 'Voice Selection',
      speedLabel: 'Speed',
      statusPreparing: 'Preparing...',
      statusPaused: 'Paused',
      statusSpeaking: 'Reading...',
      timeRemaining: 'remaining',
      readingStats: 'Reading Statistics',
      completed: 'Completed',
      totalTime: 'Total Time',
      resumeTitle: 'Resume Where You Left Off',
      resumeButton: 'Resume',
      dismissButton: 'Dismiss',
      speedOptions: {
        '0.5': '0.5x - Very Slow',
        '0.75': '0.75x - Slow',
        '1': '1.0x - Normal',
        '1.25': '1.25x - Fast',
        '1.5': '1.5x - Very Fast',
        '1.75': '1.75x - Ultra Fast',
        '2': '2.0x - Maximum'
      },
      tip: 'Tip: You can switch tabs while text is being read',
      speakTitle: 'Start reading text aloud',
      writeFirst: 'Write some text first'
    }
  }
};

// Translation hook
export const useTranslation = (currentLanguage) => {
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  };

  return { t };
}; 