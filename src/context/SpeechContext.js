import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';

// Create Speech Context
const SpeechContext = createContext();

// Custom hook to use Speech Context
export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};

// Speech Provider Component
export const SpeechProvider = ({ children }) => {
  // Get current language from LanguageContext
  const { currentLanguage } = useLanguage();
  
  // Speech synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  
  // Reading progress state
  const [currentSentence, setCurrentSentence] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [wordStart, setWordStart] = useState(0);
  const [wordEnd, setWordEnd] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalWords, setTotalWords] = useState(0);
  
  // Refs for cleanup
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load settings on mount
  useEffect(() => {
    // Load speech rate
    const savedRate = localStorage.getItem('tts-speech-rate');
    if (savedRate) {
      try {
        const rate = parseFloat(savedRate);
        if (rate >= 0.5 && rate <= 2.0) {
          setSpeechRate(rate);
        }
      } catch (e) {
        console.error('Error loading speech rate:', e);
      }
    }

    // Load selected voice
    const savedVoice = localStorage.getItem('tts-selected-voice');
    if (savedVoice) {
      try {
        const voiceData = JSON.parse(savedVoice);
        setTimeout(() => {
          const voice = window.speechSynthesis.getVoices().find(v => v.name === voiceData.name);
          if (voice) setSelectedVoice(voice);
        }, 100);
      } catch (e) {
        console.error('Error loading voice:', e);
      }
    }

    // Load active speech state
    const savedSpeechState = localStorage.getItem('tts-active-speech');
    if (savedSpeechState) {
      try {
        const speechState = JSON.parse(savedSpeechState);
        if (speechState.isSpeaking || speechState.isPaused) {
          setCurrentText(speechState.text || '');
          setCurrentSentenceIndex(speechState.currentSentenceIndex || 0);
          setSentences(speechState.sentences || []);
          setTotalWords(speechState.totalWords || 0);
          setStartTime(speechState.startTime || null);
          setIsSpeaking(speechState.isSpeaking || false);
          setIsPaused(speechState.isPaused || false);
        }
      } catch (e) {
        console.error('Error loading speech state:', e);
      }
    }
  }, []);

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

  // Save active speech state
  useEffect(() => {
    const speechState = {
      isSpeaking,
      isPaused,
      text: currentText,
      currentSentenceIndex,
      sentences,
      totalWords,
      startTime
    };
    
    if (isSpeaking || isPaused) {
      localStorage.setItem('tts-active-speech', JSON.stringify(speechState));
    } else {
      localStorage.removeItem('tts-active-speech');
    }
  }, [isSpeaking, isPaused, currentText, currentSentenceIndex, sentences, totalWords, startTime]);

  // Text processing utilities
  const splitIntoSentences = (text) => {
    if (!text || typeof text !== 'string') return [];
    const cleanText = text.trim();
    if (!cleanText) return [];
    
    const sentencePattern = /[.!?]+\s*/g;
    let sentences = cleanText.split(sentencePattern).filter(s => s.trim());
    
    if (sentences.length <= 1) {
      sentences = cleanText.split(/\n+/).filter(s => s.trim());
    }
    
    if (sentences.length === 0) {
      sentences = [cleanText];
    }
    
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
  };

  // History management
  const addToHistory = (textContent, category = 'other') => {
    const historyItem = {
      id: Date.now(),
      text: textContent,
      timestamp: new Date().toLocaleString('tr-TR'),
      preview: textContent.substring(0, 100) + (textContent.length > 100 ? '...' : ''),
      category: category,
      isFavorite: false,
      wordCount: textContent.trim().split(/\s+/).length
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
    
    const newHistory = [historyItem, ...history.filter(item => item.text !== textContent)];
    const limitedHistory = newHistory.slice(0, 150);
    localStorage.setItem('tts-history', JSON.stringify(limitedHistory));
  };

  // Speech synthesis functions
  const speakFromIndex = (sentenceArray, startIndex, currentLanguage) => {
    if (startIndex >= sentenceArray.length) {
      handleStop();
      return;
    }

    const sentence = sentenceArray[startIndex];
    if (!sentence || !sentence.trim()) {
      if (startIndex < sentenceArray.length - 1) {
        setCurrentSentenceIndex(startIndex + 1);
        speakFromIndex(sentenceArray, startIndex + 1, currentLanguage);
      } else {
        handleStop();
      }
      return;
    }

    const trimmedSentence = sentence.trim();
    setCurrentSentence(trimmedSentence);
    setCurrentWord('');
    setWordStart(0);
    setWordEnd(0);
    setCurrentSentenceIndex(startIndex);

    const utterance = new window.SpeechSynthesisUtterance(trimmedSentence);
    utterance.lang = currentLanguage === 'en' ? 'en-US' : 'tr-TR';
    utterance.rate = speechRate;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word' && event.charIndex !== undefined && event.charLength !== undefined) {
        const word = trimmedSentence.substring(event.charIndex, event.charIndex + event.charLength);
        if (word && word.trim()) {
          setCurrentWord(word);
          setWordStart(event.charIndex);
          setWordEnd(event.charIndex + event.charLength);
        }
      }
    };

    utterance.onend = () => {
      if (startIndex < sentenceArray.length - 1) {
        setCurrentSentenceIndex(startIndex + 1);
        speakFromIndex(sentenceArray, startIndex + 1, currentLanguage);
      } else {
        handleStop();
      }
    };

    utterance.onerror = (event) => {
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Unexpected speech synthesis error:', event.error);
        handleStop();
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Event handlers
  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
  };

  const handleSpeedChange = (newRate) => {
    if (newRate >= 0.5 && newRate <= 2.0) {
      setSpeechRate(newRate);
    }
  };

  const startSpeaking = (text, currentLanguage) => {
    if (!text || text.trim() === '') {
      return { success: false, error: 'textInput.enterText' };
    }

    // Stop any currently playing speech
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }

    addToHistory(text);
    const textSentences = splitIntoSentences(text);
    if (textSentences.length === 0) {
      return { success: false, error: 'textInput.validTextRequired' };
    }

    // Calculate total words and set start time
    const wordCount = text.trim().split(/\s+/).length;
    setTotalWords(wordCount);
    setStartTime(Date.now());
    setCurrentText(text);
    setSentences(textSentences);
    setCurrentSentenceIndex(0);
    setIsSpeaking(true);
    setIsPaused(false);
    
    // Small delay to ensure state is updated
    timeoutRef.current = setTimeout(() => {
      speakFromIndex(textSentences, 0, currentLanguage);
    }, 100);

    return { success: true };
  };

  const handlePause = () => {
    if (isSpeaking && !isPaused) {
      // Cancel current speech and set paused state
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (isPaused && sentences.length > 0 && currentSentenceIndex < sentences.length) {
      // Always start from current sentence when resuming, regardless of speechSynthesis state
      setIsPaused(false);
      timeoutRef.current = setTimeout(() => {
        speakFromIndex(sentences, currentSentenceIndex, currentLanguage);
      }, 100);
    }
  };

  const handleStop = () => {
    // Cancel speech synthesis
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    
    // Clear timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Reset all state
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentence('');
    setCurrentWord('');
    setCurrentSentenceIndex(0);
    setStartTime(null);
    setTotalWords(0);
    utteranceRef.current = null;
  };

    // Sentence navigation functions
  const goToNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      // Cancel current speech
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      
      // Move to next sentence
      const nextIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIndex);
      
      // Update current sentence display
      if (sentences[nextIndex]) {
        setCurrentSentence(sentences[nextIndex]);
        setCurrentWord('');
        setWordStart(0);
        setWordEnd(0);
      }
      
      // Continue speaking only if not paused
      if (isSpeaking && !isPaused) {
        timeoutRef.current = setTimeout(() => {
          speakFromIndex(sentences, nextIndex, currentLanguage);
        }, 100);
      }
    }
  };

  const goToPreviousSentence = () => {
    if (currentSentenceIndex > 0) {
      // Cancel current speech
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      
      // Move to previous sentence
      const prevIndex = currentSentenceIndex - 1;
      setCurrentSentenceIndex(prevIndex);
      
      // Update current sentence display
      if (sentences[prevIndex]) {
        setCurrentSentence(sentences[prevIndex]);
        setCurrentWord('');
        setWordStart(0);
        setWordEnd(0);
      }
      
      // Continue speaking only if not paused
      if (isSpeaking && !isPaused) {
        timeoutRef.current = setTimeout(() => {
          speakFromIndex(sentences, prevIndex, currentLanguage);
        }, 100);
      }
    }
  };

  const contextValue = {
    // State
    isSpeaking,
    isPaused,
    currentText,
    speechRate,
    selectedVoice,
    currentSentence,
    currentWord,
    wordStart,
    wordEnd,
    currentSentenceIndex,
    sentences,
    startTime,
    totalWords,
    
    // Actions
    startSpeaking,
    handlePause,
    handleResume,
    handleStop,
    handleVoiceSelect,
    handleSpeedChange,
    setCurrentText,
    goToNextSentence,
    goToPreviousSentence
  };

  return (
    <SpeechContext.Provider value={contextValue}>
      {children}
    </SpeechContext.Provider>
  );
}; 