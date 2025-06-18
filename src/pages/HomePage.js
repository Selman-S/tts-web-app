import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';
import Header from '../components/Header/Header';
import TextInput from '../components/TextInput/TextInput';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import CurrentReading from '../components/CurrentReading/CurrentReading';
import AudioControls from '../components/AudioControls/AudioControls';
import { MAX_CHARS } from '../constants';

/**
 * Home Page component with main TTS functionality
 */
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  // Text and UI state
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  
  // Speech synthesis state
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  
  // Reading progress state
  const [currentSentence, setCurrentSentence] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [wordStart, setWordStart] = useState(0);
  const [wordEnd, setWordEnd] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalWords, setTotalWords] = useState(0);
  


  // Load text from history if passed via navigation
  useEffect(() => {
    if (location.state && location.state.text) {
      setText(location.state.text);
      // Clear the state to prevent reloading on refresh
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  // Load voices and settings on mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const langPrefix = currentLanguage === 'en' ? 'en' : 'tr';
      setVoices(availableVoices.filter(voice => voice.lang.startsWith(langPrefix)));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Load saved settings
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

    const savedVoice = localStorage.getItem('tts-selected-voice');
    if (savedVoice) {
      try {
        const voiceData = JSON.parse(savedVoice);
        // Will be set when voices load
        setTimeout(() => {
          const voice = window.speechSynthesis.getVoices().find(v => v.name === voiceData.name);
          if (voice) setSelectedVoice(voice);
        }, 100);
      } catch (e) {
        console.error('Error loading voice:', e);
      }
    }
  }, [currentLanguage]);

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

  // Speech synthesis
  const speakFromIndex = (sentenceArray, startIndex) => {
    if (startIndex >= sentenceArray.length) {
      handleStop();
      return;
    }

    const sentence = sentenceArray[startIndex];
    if (!sentence || !sentence.trim()) {
      if (startIndex < sentenceArray.length - 1) {
        setCurrentSentenceIndex(startIndex + 1);
        speakFromIndex(sentenceArray, startIndex + 1);
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
        speakFromIndex(sentenceArray, startIndex + 1);
      } else {
        handleStop();
      }
    };

    utterance.onerror = (event) => {
      // Only log actual errors, not interruptions
      if (event.error !== 'interrupted') {
        console.error('Speech synthesis error:', event);
      }
      
      // Handle different error types
      if (event.error === 'interrupted') {
        // Interrupted is normal when user stops/changes speech
        return;
      } else if (event.error === 'canceled') {
        // Canceled is normal when user stops speech
        return;
      } else {
        // Other errors should stop the speech
        console.error('Unexpected speech synthesis error:', event.error);
        handleStop();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Event handlers
  const handleChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
      setError('');
    }
  };

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
  };

  const handleSpeedChange = (newRate) => {
    if (newRate >= 0.5 && newRate <= 2.0) {
      setSpeechRate(newRate);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      setError(t('textInput.browserNotSupported'));
      return;
    }
    if (!text || text.trim() === '') {
      setError(t('textInput.enterText'));
      return;
    }
    
    // Stop any currently playing speech before starting new one
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
      // Wait a moment for the cancellation to complete
      setTimeout(() => {
        startSpeaking();
      }, 100);
    } else {
      startSpeaking();
    }
  };

  const startSpeaking = () => {
    setError('');

    addToHistory(text);
    const textSentences = splitIntoSentences(text);
    if (textSentences.length === 0) {
      setError(t('textInput.validTextRequired'));
      return;
    }

    // Calculate total words and set start time
    const wordCount = text.trim().split(/\s+/).length;
    setTotalWords(wordCount);
    setStartTime(Date.now());

    setSentences(textSentences);
    setCurrentSentenceIndex(0);
    setIsSpeaking(true);
    setIsPaused(false);
    speakFromIndex(textSentences, 0);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    // Cancel speech synthesis if it's currently speaking
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    
    // Reset all state
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentence('');
    setCurrentWord('');
    setCurrentSentenceIndex(0);
    setStartTime(null);
    setTotalWords(0);
  };



  return (
    <div className="container">
      <main className="tts-card" role="main" itemScope itemType="https://schema.org/WebApplication">
        <Header />

        <TextInput
          text={text}
          onChange={handleChange}
          error={error}
          selectedVoice={selectedVoice}
          speechRate={speechRate}
          voices={voices}
          onVoiceSelect={handleVoiceSelect}
          onSpeedChange={handleSpeedChange}
        />

        <ProgressBar
          currentSentenceIndex={currentSentenceIndex}
          totalSentences={sentences.length}
          isSpeaking={isSpeaking}
          isPaused={isPaused}
          speechRate={speechRate}
          totalWords={totalWords}
          startTime={startTime}
          show={isSpeaking || isPaused}
        />

        <CurrentReading
          currentSentence={currentSentence}
          currentWord={currentWord}
          wordStart={wordStart}
          wordEnd={wordEnd}
          currentSentenceIndex={currentSentenceIndex}
          totalSentences={sentences.length}
        />

        <AudioControls
          isSpeaking={isSpeaking}
          isPaused={isPaused}
          onSpeak={handleSpeak}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
        />
      </main>
    </div>
  );
};

export default HomePage; 