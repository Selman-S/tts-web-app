import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Simple and reliable Speech Synthesis hook for mobile browsers
 * Focuses on core functionality that works consistently across devices
 */
export const useSpeechSynthesis = () => {
  // Basic state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  
  // Progress tracking - simplified
  const [progress, setProgress] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  
  // Refs for cleanup and state management
  const utteranceRef = useRef(null);
  const isPlayingRef = useRef(false);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  
  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default Turkish voice if available
      const turkishVoice = availableVoices.find(voice => 
        voice.lang.includes('tr') || voice.lang.includes('TR')
      );
      if (turkishVoice && !selectedVoice) {
        setSelectedVoice(turkishVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  // Load saved settings
  useEffect(() => {
    const savedRate = localStorage.getItem('tts-speech-rate');
    if (savedRate) {
      const rate = parseFloat(savedRate);
      if (rate >= 0.5 && rate <= 2.0) {
        setSpeechRate(rate);
      }
    }

    const savedVoice = localStorage.getItem('tts-selected-voice');
    if (savedVoice) {
      try {
        const voiceData = JSON.parse(savedVoice);
        setTimeout(() => {
          const voice = voices.find(v => v.name === voiceData.name);
          if (voice) setSelectedVoice(voice);
        }, 100);
      } catch (e) {
        console.error('Error loading voice:', e);
      }
    }
  }, [voices]);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('tts-speech-rate', speechRate.toString());
  }, [speechRate]);

  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('tts-selected-voice', JSON.stringify({
        name: selectedVoice.name,
        lang: selectedVoice.lang
      }));
    }
  }, [selectedVoice]);

  // Handle visibility change for mobile browsers
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isSpeaking && !isPaused) {
        // Don't pause automatically on mobile, let user control it
        console.log('Page hidden, speech continues...');
      } else if (!document.hidden && isSpeaking && isPaused) {
        // Optional: Auto-resume when page becomes visible again
        console.log('Page visible again');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSpeaking, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Simple progress simulation since onboundary doesn't work reliably on mobile
  const simulateProgress = useCallback((text, rate) => {
    if (!text || !isSpeaking) return;
    
    const chars = text.length;
    const wordsPerMinute = 200; // Average reading speed
    const charsPerMinute = wordsPerMinute * 5; // Approximate chars per word
    const adjustedSpeed = charsPerMinute * rate;
    const totalTimeMs = (chars / adjustedSpeed) * 60 * 1000;
    const updateInterval = 500; // Update every 500ms
    
    let currentTime = pausedTimeRef.current;
    
    const interval = setInterval(() => {
      if (!isPlayingRef.current) {
        clearInterval(interval);
        return;
      }
      
      currentTime += updateInterval;
      const newProgress = Math.min((currentTime / totalTimeMs) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
      }
    }, updateInterval);
    
    return interval;
  }, [isSpeaking]);

  // Start speaking
  const speak = useCallback((text) => {
    if (!text || !text.trim()) {
      throw new Error('Lütfen bir metin girin.');
    }

    if (!('speechSynthesis' in window)) {
      throw new Error('Tarayıcınız bu özelliği desteklemiyor.');
    }

    // Stop any existing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.rate = speechRate;
    utterance.lang = 'tr-TR';
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Set up event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      isPlayingRef.current = true;
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      setProgress(0);
      setTotalChars(text.length);
      
      // Start progress simulation
      simulateProgress(text, speechRate);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      isPlayingRef.current = false;
      setProgress(100);
      setCurrentText('');
      localStorage.removeItem('tts-current-text');
      localStorage.removeItem('tts-paused-time');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      isPlayingRef.current = false;
      setCurrentText('');
    };

    // Save current text for resume functionality
    setCurrentText(text);
    localStorage.setItem('tts-current-text', text);
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    
    // Add to history
    addToHistory(text);
    
  }, [speechRate, selectedVoice, simulateProgress]);

  // Pause speaking
  const pause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      isPlayingRef.current = false;
      pausedTimeRef.current = Date.now() - (startTimeRef.current || Date.now());
      localStorage.setItem('tts-paused-time', pausedTimeRef.current.toString());
    }
  }, [isSpeaking, isPaused]);

  // Resume speaking
  const resume = useCallback(() => {
    if (isPaused) {
      // Check if speech synthesis is actually paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        isPlayingRef.current = true;
        startTimeRef.current = Date.now() - pausedTimeRef.current;
        simulateProgress(currentText, speechRate);
      } else {
        // If not paused, restart from beginning
        if (currentText) {
          speak(currentText);
        }
      }
    }
  }, [isPaused, currentText, speechRate, speak, simulateProgress]);

  // Stop speaking
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    isPlayingRef.current = false;
    setProgress(0);
    setCurrentText('');
    localStorage.removeItem('tts-current-text');
    localStorage.removeItem('tts-paused-time');
  }, []);

  // Load paused session
  const loadPausedSession = useCallback(() => {
    const savedText = localStorage.getItem('tts-current-text');
    const savedTime = localStorage.getItem('tts-paused-time');
    
    if (savedText && savedTime) {
      setCurrentText(savedText);
      setIsPaused(true);
      pausedTimeRef.current = parseInt(savedTime, 10);
      return { text: savedText, hasSession: true };
    }
    
    return { hasSession: false };
  }, []);

  // Add to history
  const addToHistory = useCallback((text) => {
    const historyItem = {
      id: Date.now(),
      text: text,
      timestamp: new Date().toLocaleString('tr-TR'),
      preview: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      category: 'other',
      isFavorite: false,
      wordCount: text.trim().split(/\s+/).length
    };
    
    const savedHistory = localStorage.getItem('tts-history');
    let history = [];
    if (savedHistory) {
      try {
        history = JSON.parse(savedHistory);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
    
    // Prevent duplicates
    const newHistory = [historyItem, ...history.filter(item => item.text !== text)];
    const limitedHistory = newHistory.slice(0, 150);
    localStorage.setItem('tts-history', JSON.stringify(limitedHistory));
  }, []);

  // Voice selection
  const selectVoice = useCallback((voice) => {
    setSelectedVoice(voice);
  }, []);

  // Speech rate change
  const changeRate = useCallback((rate) => {
    if (rate >= 0.5 && rate <= 2.0) {
      setSpeechRate(rate);
    }
  }, []);

  return {
    // State
    isSpeaking,
    isPaused,
    currentText,
    speechRate,
    selectedVoice,
    voices,
    progress,
    totalChars,
    
    // Actions
    speak,
    pause,
    resume,
    stop,
    selectVoice,
    changeRate,
    loadPausedSession,
    
    // Computed
    hasActiveSession: isSpeaking || isPaused,
    canResume: isPaused && currentText
  };
}; 