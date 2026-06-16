import { useState, useEffect, useCallback, useRef } from 'react';
import { MAX_HISTORY, STORAGE_KEYS } from '../constants';
import { splitIntoSentences, analyzeText } from '../utils/textUtils';

/**
 * Speech synthesis hook with sentence navigation and word highlighting
 */
export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);

  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState(null);

  const [readingStats, setReadingStats] = useState({
    wordsPerMinute: 0,
    totalReadTime: 0,
    sessionsCompleted: 0
  });

  // Sentence & word tracking for navigation/highlight
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);
  const [currentSentence, setCurrentSentence] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [wordStart, setWordStart] = useState(0);
  const [wordEnd, setWordEnd] = useState(0);

  const utteranceRef = useRef(null);
  const isPlayingRef = useRef(false);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const progressIntervalRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  const sentencesRef = useRef([]);
  const sentenceIndexRef = useRef(0);
  const speakSentenceAtRef = useRef(null);

  const processedText = analyzeText(currentText, speechRate);

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const filteredVoices = availableVoices
        .filter((voice) => !voice.name.includes('Google') || voice.lang.includes('tr'))
        .sort((a, b) => {
          if (a.lang.includes('tr') && !b.lang.includes('tr')) return -1;
          if (!a.lang.includes('tr') && b.lang.includes('tr')) return 1;
          return a.name.localeCompare(b.name);
        });

      setVoices(filteredVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Apply saved voice/rate when voices are ready
  const applySavedSettings = useCallback(() => {
    try {
      const savedRate = localStorage.getItem(STORAGE_KEYS.SPEECH_RATE);
      if (savedRate) setSpeechRate(parseFloat(savedRate));

      const savedVoice = localStorage.getItem(STORAGE_KEYS.SELECTED_VOICE);
      if (savedVoice && voices.length > 0) {
        const voiceData = JSON.parse(savedVoice);
        const voice = voices.find((v) => v.name === voiceData.name);
        if (voice) setSelectedVoice(voice);
      }

      const savedStats = localStorage.getItem(STORAGE_KEYS.READING_STATS);
      if (savedStats) setReadingStats(JSON.parse(savedStats));
    } catch (error) {
      console.error('Settings load error:', error);
    }
  }, [voices]);

  useEffect(() => {
    if (voices.length > 0) applySavedSettings();
  }, [voices, applySavedSettings]);

  // Sync settings when changed from Settings page (same tab)
  useEffect(() => {
    const handleSettingsChange = () => applySavedSettings();
    window.addEventListener('tts-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('tts-settings-changed', handleSettingsChange);
  }, [applySavedSettings]);

  // Save session state for resume card
  const saveSession = useCallback((text, sentenceIndex, elapsedMs) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TEXT, text);
    localStorage.setItem(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now().toString());
    localStorage.setItem(STORAGE_KEYS.PAUSED_ELAPSED, elapsedMs.toString());
    localStorage.setItem(STORAGE_KEYS.SENTENCE_INDEX, sentenceIndex.toString());
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_TEXT);
    localStorage.removeItem(STORAGE_KEYS.SESSION_TIMESTAMP);
    localStorage.removeItem(STORAGE_KEYS.PAUSED_ELAPSED);
    localStorage.removeItem(STORAGE_KEYS.SENTENCE_INDEX);
  }, []);

  // Visibility handling for mobile tab switches
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isSpeaking && !isPaused) {
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
        pausedTimeRef.current = elapsed;
        saveSession(currentText, sentenceIndexRef.current, elapsed);
      } else if (!document.hidden && isSpeaking && window.speechSynthesis && !window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        setIsPaused(true);
        isPlayingRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSpeaking, isPaused, currentText, saveSession]);

  const autoSave = useCallback((text) => {
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (text && text.trim().length > 10) {
        localStorage.setItem(STORAGE_KEYS.AUTO_SAVED_TEXT, text);
        localStorage.setItem(STORAGE_KEYS.AUTO_SAVE_TIMESTAMP, Date.now().toString());
      }
    }, 2000);
  }, []);

  const updateProgress = useCallback(() => {
    if (!isPlayingRef.current || !startTimeRef.current) return;

    const elapsed = (Date.now() - startTimeRef.current + pausedTimeRef.current) / 1000;
    const total = sentencesRef.current.length;
    const sentenceProgress = total > 0 ? (sentenceIndexRef.current + 1) / total : 0;
    const progressPercent = Math.min(sentenceProgress * 100, 100);

    setProgress(progressPercent);
    setElapsedTime(elapsed);

    const analysis = analyzeText(currentText, speechRate);
    if (analysis) {
      setEstimatedTime(Math.max(0, analysis.estimatedSeconds - elapsed));
      if (elapsed > 0) {
        const wordsRead = sentenceProgress * analysis.wordCount;
        setReadingStats((prev) => ({
          ...prev,
          wordsPerMinute: Math.round((wordsRead / elapsed) * 60)
        }));
      }
    }
  }, [currentText, speechRate]);

  useEffect(() => {
    if (isSpeaking && !isPaused) {
      progressIntervalRef.current = setInterval(updateProgress, 500);
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isSpeaking, isPaused, updateProgress]);

  const handleError = useCallback((error, context) => {
    const errorMessage = (error.message || '').toLowerCase();
    const normalErrors = ['interrupted', 'canceled', 'not-allowed', 'synthesis-failed', 'synthesis-unavailable'];
    const isNormal = normalErrors.some((e) => errorMessage.includes(e));

    if (!isNormal) {
      setLastError({ message: error.message || 'Unexpected error', context, timestamp: Date.now() });
    }

    setIsLoading(false);
    isPlayingRef.current = false;

    if (errorMessage.includes('interrupted') && currentText) {
      const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      pausedTimeRef.current = elapsed;
      saveSession(currentText, sentenceIndexRef.current, elapsed);
      setIsPaused(true);
      setIsSpeaking(true);
    } else {
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [currentText, saveSession]);

  const validateText = useCallback((text) => {
    if (!text || typeof text !== 'string') throw new Error('Lütfen geçerli bir metin girin.');
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Metin boş olamaz.');
    if (trimmed.length > 50000) throw new Error('Metin çok uzun (max 50.000 karakter).');
    if (trimmed.length < 3) throw new Error('Metin çok kısa (min 3 karakter).');
    return trimmed;
  }, []);

  const addToHistory = useCallback((text, actualReadTime = 0) => {
    try {
      const historyItem = {
        id: Date.now(),
        text,
        timestamp: new Date().toLocaleString('tr-TR'),
        preview: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
        category: 'other',
        isFavorite: false,
        wordCount: text.trim().split(/\s+/).length,
        charCount: text.length,
        actualReadTime,
        readingRate: speechRate,
        voiceUsed: selectedVoice?.name || 'Default'
      };

      const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      const newHistory = [historyItem, ...history.filter((item) => item.text !== text)];
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory.slice(0, MAX_HISTORY)));
      window.dispatchEvent(new Event('tts-history-changed'));
    } catch (error) {
      console.error('History save error:', error);
    }
  }, [speechRate, selectedVoice]);

  const finishReading = useCallback(() => {
    setIsSpeaking(false);
    setIsPaused(false);
    isPlayingRef.current = false;
    setProgress(100);
    setCurrentWord('');
    setCurrentSentence('');

    const totalTime = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
    setReadingStats((prev) => {
      const newStats = {
        ...prev,
        totalReadTime: prev.totalReadTime + totalTime,
        sessionsCompleted: prev.sessionsCompleted + 1
      };
      localStorage.setItem(STORAGE_KEYS.READING_STATS, JSON.stringify(newStats));
      return newStats;
    });

    if (currentText) addToHistory(currentText, totalTime);
    setCurrentText('');
    clearSession();
  }, [currentText, addToHistory, clearSession]);

  const createUtterance = useCallback((sentence) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = speechRate;
    utterance.lang = selectedVoice?.lang || 'tr-TR';
    utterance.volume = 1;
    utterance.pitch = 1;
    if (selectedVoice) utterance.voice = selectedVoice;
    return utterance;
  }, [speechRate, selectedVoice]);

  const speakSentenceAt = useCallback((index) => {
    const sentences = sentencesRef.current;
    if (index < 0 || index >= sentences.length) return;

    window.speechSynthesis.cancel();
    sentenceIndexRef.current = index;
    setCurrentSentenceIndex(index);
    setCurrentSentence(sentences[index]);
    setCurrentWord('');
    setWordStart(0);
    setWordEnd(0);

    const utterance = createUtterance(sentences[index]);

    utterance.onstart = () => {
      setIsLoading(false);
      setIsSpeaking(true);
      setIsPaused(false);
      isPlayingRef.current = true;
      if (!startTimeRef.current) startTimeRef.current = Date.now();
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const sentence = sentences[index];
        setCurrentWord(sentence.substring(event.charIndex, event.charIndex + event.charLength));
        setWordStart(event.charIndex);
        setWordEnd(event.charIndex + event.charLength);
      }
    };

    utterance.onend = () => {
      if (!isPlayingRef.current) return;
      const nextIndex = sentenceIndexRef.current + 1;
      if (nextIndex < sentences.length) {
        speakSentenceAtRef.current?.(nextIndex);
      } else {
        finishReading();
      }
    };

    utterance.onerror = (event) => {
      const errorType = event.error || 'unknown';
      if (errorType === 'interrupted' || errorType === 'canceled') {
        handleError(new Error(errorType), 'speech');
      } else if (errorType === 'not-allowed') {
        handleError(new Error('Ses iznine ihtiyaç var.'), 'speech');
      } else {
        handleError(new Error(`Speech error: ${errorType}`), 'speech');
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [createUtterance, finishReading, handleError]);

  speakSentenceAtRef.current = speakSentenceAt;

  const speak = useCallback((text, startIndex = 0) => {
    try {
      setIsLoading(true);
      setLastError(null);

      if (!('speechSynthesis' in window)) {
        throw new Error('Tarayıcınız sesli okuma desteklemiyor.');
      }

      const processedInput = validateText(text);
      const sentences = splitIntoSentences(processedInput);
      if (!sentences.length) throw new Error('Okunacak cümle bulunamadı.');

      window.speechSynthesis.cancel();
      sentencesRef.current = sentences;
      sentenceIndexRef.current = startIndex;
      setCurrentText(processedInput);
      setTotalSentences(sentences.length);
      setProgress(0);
      setElapsedTime(0);
      pausedTimeRef.current = 0;
      startTimeRef.current = Date.now();
      isPlayingRef.current = true;

      saveSession(processedInput, startIndex, 0);
      speakSentenceAt(startIndex);
    } catch (error) {
      setIsLoading(false);
      handleError(error, 'speak');
      throw error;
    }
  }, [validateText, saveSession, speakSentenceAt, handleError]);

  const pause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      try {
        window.speechSynthesis.pause();
        setIsPaused(true);
        isPlayingRef.current = false;
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
        pausedTimeRef.current = elapsed;
        saveSession(currentText, sentenceIndexRef.current, elapsed);
      } catch (error) {
        handleError(error, 'pause');
      }
    }
  }, [isSpeaking, isPaused, currentText, saveSession, handleError]);

  const resume = useCallback(() => {
    if (!currentText) return;

    try {
      setLastError(null);
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        isPlayingRef.current = true;
        startTimeRef.current = Date.now() - pausedTimeRef.current;
      } else {
        // Restart from saved sentence index after interruption
        setIsPaused(false);
        isPlayingRef.current = true;
        startTimeRef.current = Date.now() - pausedTimeRef.current;
        speakSentenceAt(sentenceIndexRef.current);
      }
    } catch (error) {
      setIsPaused(false);
      isPlayingRef.current = true;
      window.speechSynthesis.cancel();
      setTimeout(() => speakSentenceAt(sentenceIndexRef.current), 100);
    }
  }, [currentText, speakSentenceAt]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    isPlayingRef.current = false;
    setProgress(0);
    setElapsedTime(0);
    setEstimatedTime(0);
    setCurrentText('');
    setCurrentSentence('');
    setCurrentWord('');
    setLastError(null);
    sentencesRef.current = [];
    clearSession();
  }, [clearSession]);

  const goToPreviousSentence = useCallback(() => {
    if (sentenceIndexRef.current <= 0) return;
    const wasPlaying = isSpeaking && !isPaused;
    window.speechSynthesis.cancel();
    const newIndex = sentenceIndexRef.current - 1;
    if (wasPlaying) {
      isPlayingRef.current = true;
      speakSentenceAt(newIndex);
    } else {
      sentenceIndexRef.current = newIndex;
      setCurrentSentenceIndex(newIndex);
      setCurrentSentence(sentencesRef.current[newIndex] || '');
      saveSession(currentText, newIndex, pausedTimeRef.current);
    }
  }, [isSpeaking, isPaused, currentText, speakSentenceAt, saveSession]);

  const goToNextSentence = useCallback(() => {
    if (sentenceIndexRef.current >= sentencesRef.current.length - 1) return;
    const wasPlaying = isSpeaking && !isPaused;
    window.speechSynthesis.cancel();
    const newIndex = sentenceIndexRef.current + 1;
    if (wasPlaying) {
      isPlayingRef.current = true;
      speakSentenceAt(newIndex);
    } else {
      sentenceIndexRef.current = newIndex;
      setCurrentSentenceIndex(newIndex);
      setCurrentSentence(sentencesRef.current[newIndex] || '');
      saveSession(currentText, newIndex, pausedTimeRef.current);
    }
  }, [isSpeaking, isPaused, currentText, speakSentenceAt, saveSession]);

  const loadPausedSession = useCallback(() => {
    try {
      const savedText = localStorage.getItem(STORAGE_KEYS.CURRENT_TEXT);
      const sessionTs = localStorage.getItem(STORAGE_KEYS.SESSION_TIMESTAMP);
      const savedIndex = localStorage.getItem(STORAGE_KEYS.SENTENCE_INDEX);
      const savedElapsed = localStorage.getItem(STORAGE_KEYS.PAUSED_ELAPSED);

      if (savedText && sessionTs) {
        const timestamp = parseInt(sessionTs, 10);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          const sentences = splitIntoSentences(savedText);
          const index = savedIndex ? parseInt(savedIndex, 10) : 0;

          sentencesRef.current = sentences;
          sentenceIndexRef.current = index;
          pausedTimeRef.current = savedElapsed ? parseInt(savedElapsed, 10) : 0;

          setCurrentText(savedText);
          setTotalSentences(sentences.length);
          setCurrentSentenceIndex(index);
          setCurrentSentence(sentences[index] || '');
          setIsPaused(true);

          return { text: savedText, hasSession: true, sentenceIndex: index };
        }
        clearSession();
      }
    } catch (error) {
      console.error('Session load error:', error);
    }
    return { hasSession: false };
  }, [clearSession]);

  const loadAutoSavedText = useCallback(() => {
    try {
      const autoSavedText = localStorage.getItem(STORAGE_KEYS.AUTO_SAVED_TEXT);
      const timestamp = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE_TIMESTAMP);
      if (autoSavedText && timestamp) {
        const saveTime = parseInt(timestamp, 10);
        if (Date.now() - saveTime < 7 * 24 * 60 * 60 * 1000) {
          return { text: autoSavedText, timestamp: saveTime };
        }
      }
    } catch (error) {
      console.error('Auto-save load error:', error);
    }
    return null;
  }, []);

  const selectVoice = useCallback((voice) => {
    setSelectedVoice(voice);
    if (voice) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_VOICE, JSON.stringify({ name: voice.name, lang: voice.lang }));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_VOICE);
    }
    window.dispatchEvent(new Event('tts-settings-changed'));
  }, []);

  const changeRate = useCallback((rate) => {
    if (rate >= 0.5 && rate <= 2.0) {
      setSpeechRate(rate);
      localStorage.setItem(STORAGE_KEYS.SPEECH_RATE, rate.toString());
      window.dispatchEvent(new Event('tts-settings-changed'));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) window.speechSynthesis.cancel();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, []);

  return {
    isSpeaking,
    isPaused,
    currentText,
    speechRate,
    selectedVoice,
    voices,
    progress,
    elapsedTime,
    estimatedTime,
    isLoading,
    lastError,
    readingStats,
    processedText,
    currentSentenceIndex,
    totalSentences,
    currentSentence,
    currentWord,
    wordStart,
    wordEnd,
    speak,
    pause,
    resume,
    stop,
    selectVoice,
    changeRate,
    autoSave,
    goToPreviousSentence,
    goToNextSentence,
    loadPausedSession,
    loadAutoSavedText,
    hasActiveSession: isSpeaking || isPaused,
    canResume: isPaused && !!currentText,
    isReady: !isLoading && voices.length > 0,
    clearError: () => setLastError(null)
  };
};
