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
      default: 'Varsayılan'
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
      default: 'Default'
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