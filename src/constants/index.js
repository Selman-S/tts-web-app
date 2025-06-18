// Application constants
export const MAX_CHARS = 50000;
export const MAX_HISTORY = 10;

// Category definitions for text organization
export const CATEGORIES = [
  { id: 'personal', name: 'Kişisel', icon: '👤', color: '#007bff' },
  { id: 'work', name: 'İş', icon: '💼', color: '#28a745' },
  { id: 'education', name: 'Eğitim', icon: '📚', color: '#6f42c1' },
  { id: 'news', name: 'Haberler', icon: '📰', color: '#dc3545' },
  { id: 'entertainment', name: 'Eğlence', icon: '🎬', color: '#fd7e14' },
  { id: 'other', name: 'Diğer', icon: '📄', color: '#6c757d' }
];

// Speech synthesis settings
export const SPEECH_RATE_MIN = 0.5;
export const SPEECH_RATE_MAX = 2.0;
export const SPEECH_RATE_STEP = 0.1;
export const SPEECH_RATE_DEFAULT = 1.0;

// Speed presets for quick selection
export const SPEED_PRESETS = [
  { rate: 0.75, label: 'Yavaş' },
  { rate: 1.0, label: 'Normal' },
  { rate: 1.25, label: 'Hızlı' },
  { rate: 1.5, label: 'Çok Hızlı' }
];

// LocalStorage keys
export const STORAGE_KEYS = {
  HISTORY: 'tts-history',
  SPEECH_RATE: 'tts-speech-rate',
  THEME: 'tts-theme',
  CURRENT_PROGRESS: 'tts-current-progress'
}; 