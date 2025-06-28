import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Enhanced Speech Synthesis Hook 🚀
 * Features: Smart text processing, auto-save, statistics, performance optimization
 */
export const useSpeechSynthesis = () => {
  // Core state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  
  // Enhanced progress & stats
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState(null);
  
  // Reading statistics
  const [readingStats, setReadingStats] = useState({
    wordsPerMinute: 0,
    totalReadTime: 0,
    sessionsCompleted: 0
  });
  
  // Refs for performance
  const utteranceRef = useRef(null);
  const isPlayingRef = useRef(false);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const progressIntervalRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  
  // Smart text processing with memoization
  const processedText = useMemo(() => {
    if (!currentText) return null;
    
    // Clean text for better TTS experience
    const cleaned = currentText
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
      .replace(/(\d+)/g, ' $1 ')
      .trim();
    
    const wordCount = cleaned.split(/\s+/).filter(w => w.length > 0).length;
    const estimatedMinutes = wordCount / (200 * speechRate);
    
    return {
      text: cleaned,
      wordCount,
      charCount: cleaned.length,
      estimatedSeconds: Math.round(estimatedMinutes * 60)
    };
  }, [currentText, speechRate]);

  // Enhanced voice loading and filtering
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      // Smart voice filtering and sorting
      const filteredVoices = availableVoices
        .filter(voice => !voice.name.includes('Google') || voice.lang.includes('tr'))
        .sort((a, b) => {
          if (a.lang.includes('tr') && !b.lang.includes('tr')) return -1;
          if (!a.lang.includes('tr') && b.lang.includes('tr')) return 1;
          return a.name.localeCompare(b.name);
        });
      
      setVoices(filteredVoices);
      
      // Auto-select best Turkish voice
      if (!selectedVoice && filteredVoices.length > 0) {
        const bestVoice = filteredVoices.find(v => 
          v.lang.includes('tr') && !v.name.includes('Google')
        ) || filteredVoices.find(v => v.lang.includes('tr')) || filteredVoices[0];
        
        setSelectedVoice(bestVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  // Load settings and stats
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load speech rate
        const savedRate = localStorage.getItem('tts-speech-rate');
        if (savedRate) setSpeechRate(parseFloat(savedRate));

        // Load selected voice
        const savedVoice = localStorage.getItem('tts-selected-voice');
        if (savedVoice && voices.length > 0) {
          const voiceData = JSON.parse(savedVoice);
          const voice = voices.find(v => v.name === voiceData.name);
          if (voice) setSelectedVoice(voice);
        }

        // Load reading statistics
        const savedStats = localStorage.getItem('tts-reading-stats');
        if (savedStats) setReadingStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Settings load error:', error);
      }
    };

    if (voices.length > 0) loadSettings();
  }, [voices]);

  // Enhanced visibility handling for mobile browsers
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden - speech may be interrupted on mobile
        if (isSpeaking && !isPaused) {
          console.log('Page hidden while speaking - preparing for potential interruption');
          // Save current state in case speech gets interrupted
          const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
          pausedTimeRef.current = elapsed;
          localStorage.setItem('tts-paused-time', elapsed.toString());
        }
      } else {
        // Page visible again
        console.log('Page visible again');
        
        // Check if speech synthesis was interrupted while hidden
        if (isSpeaking && window.speechSynthesis && !window.speechSynthesis.speaking) {
          console.log('Speech was interrupted while page was hidden');
          // Mark as paused so user can resume
          setIsSpeaking(false);
          setIsPaused(true);
          isPlayingRef.current = false;
        }
      }
    };

    // Handle browser focus/blur events for better mobile compatibility
    const handleFocus = () => {
      console.log('Window focused');
    };

    const handleBlur = () => {
      console.log('Window blurred');
      // On mobile, speech often stops when window loses focus
      if (isSpeaking && currentText) {
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
        pausedTimeRef.current = elapsed;
        localStorage.setItem('tts-paused-time', elapsed.toString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isSpeaking, isPaused, currentText]);

  // Auto-save functionality with debouncing
  const autoSave = useCallback((text) => {
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (text && text.trim().length > 10) {
        localStorage.setItem('tts-auto-saved-text', text);
        localStorage.setItem('tts-auto-save-timestamp', Date.now().toString());
      }
    }, 2000);
  }, []);

  // Real-time progress tracking with statistics
  const updateProgress = useCallback(() => {
    if (!isPlayingRef.current || !startTimeRef.current || !processedText) return;
    
    const elapsed = (Date.now() - startTimeRef.current + pausedTimeRef.current) / 1000;
    const progressPercent = Math.min((elapsed / processedText.estimatedSeconds) * 100, 100);
    
    setProgress(progressPercent);
    setElapsedTime(elapsed);
    setEstimatedTime(Math.max(0, processedText.estimatedSeconds - elapsed));
    
    // Calculate real-time WPM
    if (elapsed > 0) {
      const wordsRead = (progressPercent / 100) * processedText.wordCount;
      const currentWPM = Math.round((wordsRead / elapsed) * 60);
      setReadingStats(prev => ({ ...prev, wordsPerMinute: currentWPM }));
    }
  }, [processedText]);

  // Progress interval management
  useEffect(() => {
    if (isSpeaking && !isPaused) {
      progressIntervalRef.current = setInterval(updateProgress, 500);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isSpeaking, isPaused, updateProgress]);

  // Enhanced error handling with smart filtering
  const handleError = useCallback((error, context) => {
    console.error(`TTS Error [${context}]:`, error);
    
    // Filter out normal/expected errors that shouldn't be shown to user
    const normalErrors = [
      'interrupted', // Normal when switching tabs or stopping speech
      'canceled',    // Normal when canceling speech
      'not-allowed', // Sometimes occurs on first interaction
      'synthesis-failed', // Temporary browser issues
      'synthesis-unavailable' // Temporary browser issues
    ];
    
    const errorMessage = error.message?.toLowerCase() || '';
    const isNormalError = normalErrors.some(normalError => 
      errorMessage.includes(normalError)
    );
    
    // Only show unexpected errors to user
    if (!isNormalError) {
      setLastError({ 
        message: error.message || 'Beklenmeyen bir hata oluştu', 
        context, 
        timestamp: Date.now() 
      });
    }
    
    // Always cleanup state regardless of error type
    setIsLoading(false);
    setIsSpeaking(false);
    setIsPaused(false);
    isPlayingRef.current = false;
    
    // For interrupted error, try to save current position for resume
    if (errorMessage.includes('interrupted') && currentText) {
      const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      pausedTimeRef.current = elapsed;
      localStorage.setItem('tts-paused-time', elapsed.toString());
      setIsPaused(true); // Mark as paused so user can resume
    }
  }, [currentText]);

  // Smart text validation
  const validateText = useCallback((text) => {
    if (!text || typeof text !== 'string') {
      throw new Error('Lütfen geçerli bir metin girin.');
    }
    
    const trimmed = text.trim();
    if (trimmed.length === 0) throw new Error('Metin boş olamaz.');
    if (trimmed.length > 50000) throw new Error('Metin çok uzun (max 50.000 karakter).');
    if (trimmed.length < 3) throw new Error('Metin çok kısa (min 3 karakter).');
    
    return trimmed;
  }, []);

  // Enhanced speak function with stability improvements
  const speak = useCallback((text) => {
    try {
      setIsLoading(true);
      setLastError(null);
      
      // Check browser support
      if (!('speechSynthesis' in window)) {
        throw new Error('Tarayıcınız sesli okuma desteklemiyor.');
      }
      
      // Check if speech synthesis is available and not speaking
      if (window.speechSynthesis.speaking) {
        console.log('Speech synthesis busy, canceling current speech');
        window.speechSynthesis.cancel();
        // Small delay to ensure cleanup
        setTimeout(() => speak(text), 100);
        return;
      }
      
      const processedInput = validateText(text);
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(processedInput);
      utterance.rate = speechRate;
      utterance.lang = selectedVoice?.lang || 'tr-TR';
      utterance.volume = 1;
      utterance.pitch = 1;
      
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onstart = () => {
        setIsLoading(false);
        setIsSpeaking(true);
        setIsPaused(false);
        isPlayingRef.current = true;
        startTimeRef.current = Date.now();
        pausedTimeRef.current = 0;
        setProgress(0);
        setElapsedTime(0);
        
        setCurrentText(processedInput);
        localStorage.setItem('tts-current-text', processedInput);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        isPlayingRef.current = false;
        setProgress(100);
        
        // Update statistics
        const totalTime = (Date.now() - startTimeRef.current) / 1000;
        setReadingStats(prev => {
          const newStats = {
            ...prev,
            totalReadTime: prev.totalReadTime + totalTime,
            sessionsCompleted: prev.sessionsCompleted + 1
          };
          localStorage.setItem('tts-reading-stats', JSON.stringify(newStats));
          return newStats;
        });
        
        setCurrentText('');
        localStorage.removeItem('tts-current-text');
        addToHistory(processedInput, totalTime);
      };

      utterance.onerror = (event) => {
        // Get detailed error information
        const errorType = event.error || 'unknown';
        const errorMessage = `Speech synthesis error: ${errorType}`;
        
        // Handle different error types appropriately
        switch (errorType) {
          case 'interrupted':
            // Normal interruption - save state for potential resume
            console.log('Speech interrupted - saving state for resume');
            handleError(new Error('interrupted'), 'speech');
            break;
          case 'canceled':
            // Normal cancellation - just cleanup
            console.log('Speech canceled by user or system');
            handleError(new Error('canceled'), 'speech');
            break;
          case 'not-allowed':
            // Permission issue - show helpful message
            handleError(new Error('Ses iznine ihtiyaç var. Lütfen tarayıcı ayarlarını kontrol edin.'), 'speech');
            break;
          case 'synthesis-failed':
          case 'synthesis-unavailable':
            // Temporary browser issues
            console.log('Synthesis temporarily unavailable, saving for retry');
            handleError(new Error('Sesli okuma geçici olarak kullanılamıyor. Lütfen tekrar deneyin.'), 'speech');
            break;
          default:
            // Unexpected errors
            handleError(new Error(errorMessage), 'speech');
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      handleError(error, 'speak');
      throw error;
    }
  }, [speechRate, selectedVoice, validateText, handleError]);

  // Enhanced pause/resume/stop functions
  const pause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      try {
        window.speechSynthesis.pause();
        setIsPaused(true);
        isPlayingRef.current = false;
        pausedTimeRef.current = Date.now() - (startTimeRef.current || Date.now());
        localStorage.setItem('tts-paused-time', pausedTimeRef.current.toString());
      } catch (error) {
        handleError(error, 'pause');
      }
    }
  }, [isSpeaking, isPaused, handleError]);

  const resume = useCallback(() => {
    if (isPaused && currentText) {
      try {
        setLastError(null); // Clear any previous errors
        
        // Check if browser's speech synthesis is in paused state
        if (window.speechSynthesis.paused) {
          console.log('Resuming paused speech');
          window.speechSynthesis.resume();
          setIsPaused(false);
          isPlayingRef.current = true;
          startTimeRef.current = Date.now() - pausedTimeRef.current;
        } else {
          // Speech was interrupted/canceled, restart from beginning
          // In the future, we could implement resume from position
          console.log('Speech was interrupted, restarting from beginning');
          setIsPaused(false);
          speak(currentText);
        }
      } catch (error) {
        console.log('Resume failed, attempting restart:', error);
        handleError(error, 'resume');
        
        // Fallback: always try to restart speech
        try {
          setIsPaused(false);
          // Clear any speech synthesis state and restart
          window.speechSynthesis.cancel();
          setTimeout(() => {
            speak(currentText);
          }, 100);
        } catch (fallbackError) {
          handleError(fallbackError, 'resume-fallback');
        }
      }
    } else if (!currentText) {
      // No text to resume - this shouldn't happen but let's handle it
      console.warn('Resume called but no current text available');
      setIsPaused(false);
      setLastError({ 
        message: 'Devam edilecek metin bulunamadı', 
        context: 'resume', 
        timestamp: Date.now() 
      });
    }
  }, [isPaused, currentText, speak, handleError]);

  const stop = useCallback(() => {
    try {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      isPlayingRef.current = false;
      setProgress(0);
      setElapsedTime(0);
      setEstimatedTime(0);
      setCurrentText('');
      setLastError(null);
      
      localStorage.removeItem('tts-current-text');
      localStorage.removeItem('tts-paused-time');
    } catch (error) {
      handleError(error, 'stop');
    }
  }, [handleError]);

  // Session management
  const loadPausedSession = useCallback(() => {
    try {
      const savedText = localStorage.getItem('tts-current-text');
      const savedTime = localStorage.getItem('tts-paused-time');
      
      if (savedText && savedTime) {
        const timestamp = parseInt(savedTime, 10);
        // Restore if less than 24 hours old
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setCurrentText(savedText);
          setIsPaused(true);
          pausedTimeRef.current = timestamp;
          return { text: savedText, hasSession: true };
        } else {
          localStorage.removeItem('tts-current-text');
          localStorage.removeItem('tts-paused-time');
        }
      }
    } catch (error) {
      console.error('Session load error:', error);
    }
    
    return { hasSession: false };
  }, []);

  const loadAutoSavedText = useCallback(() => {
    try {
      const autoSavedText = localStorage.getItem('tts-auto-saved-text');
      const timestamp = localStorage.getItem('tts-auto-save-timestamp');
      
      if (autoSavedText && timestamp) {
        const saveTime = parseInt(timestamp, 10);
        // Return if less than 7 days old
        if (Date.now() - saveTime < 7 * 24 * 60 * 60 * 1000) {
          return { text: autoSavedText, timestamp: saveTime };
        }
      }
    } catch (error) {
      console.error('Auto-save load error:', error);
    }
    
    return null;
  }, []);

  // Enhanced history management
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
      
      const savedHistory = localStorage.getItem('tts-history');
      let history = savedHistory ? JSON.parse(savedHistory) : [];
      
      const newHistory = [historyItem, ...history.filter(item => item.text !== text)];
      localStorage.setItem('tts-history', JSON.stringify(newHistory.slice(0, 200)));
    } catch (error) {
      console.error('History save error:', error);
    }
  }, [speechRate, selectedVoice]);

  // Settings handlers
  const selectVoice = useCallback((voice) => {
    setSelectedVoice(voice);
    if (voice) {
      localStorage.setItem('tts-selected-voice', JSON.stringify({
        name: voice.name,
        lang: voice.lang
      }));
    }
  }, []);

  const changeRate = useCallback((rate) => {
    if (rate >= 0.5 && rate <= 2.0) {
      setSpeechRate(rate);
      localStorage.setItem('tts-speech-rate', rate.toString());
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (utteranceRef.current) window.speechSynthesis.cancel();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, []);

  return {
    // Core state
    isSpeaking,
    isPaused,
    currentText,
    speechRate,
    selectedVoice,
    voices,
    
    // Enhanced tracking
    progress,
    elapsedTime,
    estimatedTime,
    isLoading,
    lastError,
    readingStats,
    processedText,
    
    // Actions
    speak,
    pause,
    resume,
    stop,
    selectVoice,
    changeRate,
    autoSave,
    
    // Session management
    loadPausedSession,
    loadAutoSavedText,
    
    // Computed
    hasActiveSession: isSpeaking || isPaused,
    canResume: isPaused && currentText,
    isReady: !isLoading && voices.length > 0,
    
    // Utilities
    clearError: () => setLastError(null)
  };
}; 