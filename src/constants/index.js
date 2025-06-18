// Application constants
export const MAX_CHARS = 50000;
export const MAX_HISTORY = 150;

// Category definitions for text organization - will be translated dynamically
export const CATEGORIES = [
  { id: 'personal', icon: '👤', color: '#007bff' },
  { id: 'work', icon: '💼', color: '#28a745' },
  { id: 'education', icon: '📚', color: '#6f42c1' },
  { id: 'news', icon: '📰', color: '#dc3545' },
  { id: 'entertainment', icon: '🎬', color: '#fd7e14' },
  { id: 'other', icon: '📄', color: '#6c757d' }
];

// Speech synthesis settings
export const SPEECH_RATE_MIN = 0.5;
export const SPEECH_RATE_MAX = 2.0;
export const SPEECH_RATE_STEP = 0.1;
export const SPEECH_RATE_DEFAULT = 1.0;

// Speed presets for quick selection - will be translated dynamically
export const SPEED_PRESETS = [
  { rate: 0.75, labelKey: 'slow' },
  { rate: 1.0, labelKey: 'normal' },
  { rate: 1.25, labelKey: 'fast' },
  { rate: 1.5, labelKey: 'veryFast' }
];

// LocalStorage keys
export const STORAGE_KEYS = {
  HISTORY: 'tts-history',
  SPEECH_RATE: 'tts-speech-rate',
  THEME: 'tts-theme',
  CURRENT_PROGRESS: 'tts-current-progress'
}; 