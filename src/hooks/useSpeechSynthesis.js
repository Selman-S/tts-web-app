import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, SPEECH_RATE_DEFAULT } from '../constants';
import { saveToStorage, loadFromStorage, removeFromStorage } from '../utils/storageUtils';
import { splitIntoSentences } from '../utils/textUtils';

/**
 * Custom hook for speech synthesis functionality
 * Manages speech state, voice selection, and audio controls
 */
export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentence, setCurrentSentence] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [wordStart, setWordStart] = useState(0);
  const [wordEnd, setWordEnd] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [speechRate, setSpeechRate] = useState(SPEECH_RATE_DEFAULT);

  // Load voices and speech rate on mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices.filter(voice => voice.lang.startsWith('tr')));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Load speech rate from localStorage
    const savedRate = loadFromStorage(STORAGE_KEYS.SPEECH_RATE);
    if (savedRate) {
      const rate = parseFloat(savedRate);
      if (rate >= 0.5 && rate <= 2.0) {
        setSpeechRate(rate);
      }
    }
  }, []);

  // Save speech rate when it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SPEECH_RATE, speechRate.toString());
  }, [speechRate]);

  // Save current reading progress
  const saveProgress = useCallback((textContent, sentenceIndex, sentences) => {
    const progressData = {
      text: textContent,
      currentSentenceIndex: sentenceIndex,
      sentences: sentences,
      timestamp: Date.now()
    };
    saveToStorage(STORAGE_KEYS.CURRENT_PROGRESS, progressData);
  }, []);

  // Load reading progress
  const loadProgress = useCallback(() => {
    const progressData = loadFromStorage(STORAGE_KEYS.CURRENT_PROGRESS);
    if (progressData) {
      return progressData;
    }
    return null;
  }, []);

  // Check if there's saved progress
  const hasProgress = useCallback(() => {
    return loadFromStorage(STORAGE_KEYS.CURRENT_PROGRESS) !== null;
  }, []);

  // Speak from specific sentence index
  const speakFromIndex = useCallback((sentenceArray, startIndex, text) => {
    if (startIndex >= sentenceArray.length) {
      handleStop();
      return;
    }

    const sentence = sentenceArray[startIndex];
    if (!sentence || !sentence.trim()) {
      // Skip empty sentence and continue with next
      if (startIndex < sentenceArray.length - 1) {
        setCurrentSentenceIndex(startIndex + 1);
        speakFromIndex(sentenceArray, startIndex + 1, text);
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

    // Save progress
    saveProgress(text, startIndex, sentenceArray);

    const utterance = new window.SpeechSynthesisUtterance(trimmedSentence);
    utterance.lang = 'tr-TR';
    utterance.rate = speechRate;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Track word boundaries for highlighting
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
        speakFromIndex(sentenceArray, startIndex + 1, text);
      } else {
        handleStop();
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      handleStop();
    };

    window.speechSynthesis.speak(utterance);
  }, [speechRate, selectedVoice, saveProgress]);

  // Start speaking text
  const handleSpeak = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      throw new Error('Tarayıcınız bu özelliği desteklemiyor.');
    }
    if (!text || text.trim() === '') {
      throw new Error('Lütfen bir metin girin.');
    }

    // Split text into sentences
    const textSentences = splitIntoSentences(text);
    if (textSentences.length === 0) {
      throw new Error('Lütfen geçerli bir metin girin.');
    }

    setSentences(textSentences);
    setCurrentSentenceIndex(0);
    setIsSpeaking(true);
    setIsPaused(false);
    
    speakFromIndex(textSentences, 0, text);
  }, [speakFromIndex]);

  // Resume speaking
  const handleResume = useCallback(() => {
    const progress = loadProgress();
    if (progress && progress.sentences && progress.currentSentenceIndex < progress.sentences.length) {
      setSentences(progress.sentences);
      setCurrentSentenceIndex(progress.currentSentenceIndex);
      setIsSpeaking(true);
      setIsPaused(false);
      speakFromIndex(progress.sentences, progress.currentSentenceIndex, progress.text);
      return progress.text; // Return text to update parent component
    } else {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
    return null;
  }, [loadProgress, speakFromIndex]);

  // Pause speaking
  const handlePause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  // Stop speaking
  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentence('');
    setCurrentWord('');
    setCurrentSentenceIndex(0);
    // Clear progress when stopped
    removeFromStorage(STORAGE_KEYS.CURRENT_PROGRESS);
  }, []);

  // Update speech rate
  const updateSpeechRate = useCallback((newRate) => {
    if (newRate >= 0.5 && newRate <= 2.0) {
      setSpeechRate(newRate);
    }
  }, []);

  return {
    // State
    voices,
    selectedVoice,
    isSpeaking,
    isPaused,
    currentSentence,
    currentWord,
    wordStart,
    wordEnd,
    currentSentenceIndex,
    sentences,
    speechRate,
    
    // Actions
    setSelectedVoice,
    handleSpeak,
    handleResume,
    handlePause,
    handleStop,
    updateSpeechRate,
    hasProgress,
    loadProgress
  };
}; 