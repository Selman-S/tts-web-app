import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import SpeedControl from './components/SpeedControl/SpeedControl';
import VoiceSelector from './components/VoiceSelector/VoiceSelector';
import History from './components/History/History';
import TextInput from './components/TextInput/TextInput';
import CurrentReading from './components/CurrentReading/CurrentReading';
import AudioControls from './components/AudioControls/AudioControls';
import { MAX_CHARS } from './constants';
import './App.css';

/**
 * Main TTS Application Component
 * Clean, modular structure with extracted components
 */
function App() {
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
  
  // History and UI panels state
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load voices and settings on mount
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices.filter(voice => voice.lang.startsWith('tr')));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Load saved data from localStorage
    const savedHistory = localStorage.getItem('tts-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }

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
  }, []);

  // Save data to localStorage when changed
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('tts-history', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    localStorage.setItem('tts-speech-rate', speechRate.toString());
  }, [speechRate]);

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

  // Progress management
  const saveProgress = (textContent, sentenceIndex, sentences) => {
    const progressData = {
      text: textContent,
      currentSentenceIndex: sentenceIndex,
      sentences: sentences,
      timestamp: Date.now()
    };
    localStorage.setItem('tts-current-progress', JSON.stringify(progressData));
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('tts-current-progress');
    if (saved) {
      try {
        const progressData = JSON.parse(saved);
        setText(progressData.text);
        setCurrentSentenceIndex(progressData.currentSentenceIndex);
        setSentences(progressData.sentences);
        return progressData;
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }
    return null;
  };

  const hasProgress = () => {
    const saved = localStorage.getItem('tts-current-progress');
    return saved ? true : false;
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
    
    setHistory(prev => {
      const newHistory = [historyItem, ...prev.filter(item => item.text !== textContent)];
      return newHistory.slice(0, 150); // Keep max 150 items
    });
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

    saveProgress(text, startIndex, sentenceArray);

    const utterance = new window.SpeechSynthesisUtterance(trimmedSentence);
    utterance.lang = 'tr-TR';
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
      console.error('Speech synthesis error:', event);
      handleStop();
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

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      setError('Tarayıcınız bu özelliği desteklemiyor.');
      return;
    }
    if (!text || text.trim() === '') {
      setError('Lütfen bir metin girin.');
      return;
    }
    setError('');

    addToHistory(text);
    const textSentences = splitIntoSentences(text);
    if (textSentences.length === 0) {
      setError('Lütfen geçerli bir metin girin.');
      return;
    }

    setSentences(textSentences);
    setCurrentSentenceIndex(0);
    setIsSpeaking(true);
    setIsPaused(false);
    speakFromIndex(textSentences, 0);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    const progress = loadProgress();
    if (progress && progress.sentences && progress.currentSentenceIndex < progress.sentences.length) {
      setText(progress.text);
      setSentences(progress.sentences);
      setCurrentSentenceIndex(progress.currentSentenceIndex);
      setIsSpeaking(true);
      setIsPaused(false);
      speakFromIndex(progress.sentences, progress.currentSentenceIndex);
    } else {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentence('');
    setCurrentWord('');
    setCurrentSentenceIndex(0);
    localStorage.removeItem('tts-current-progress');
  };

  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);
    setShowVoiceSelector(false);
  };

  const handleSpeedChange = (newRate) => {
    if (newRate >= 0.5 && newRate <= 2.0) {
      setSpeechRate(newRate);
    }
  };

  const handleSpeedPreset = (rate) => {
    setSpeechRate(rate);
    setShowSpeedControl(false);
  };

  // History event handlers
  const toggleFavorite = (itemId) => {
    setHistory(prev => prev.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const updateItemCategory = (itemId, newCategory) => {
    setHistory(prev => prev.map(item => 
      item.id === itemId ? { ...item, category: newCategory } : item
    ));
  };

  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const selectAllItems = () => {
    const allIds = new Set(history.map(item => item.id));
    setSelectedItems(allIds);
    setShowBulkActions(allIds.size > 0);
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const bulkDelete = () => {
    setHistory(prev => prev.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const bulkToggleFavorite = () => {
    setHistory(prev => prev.map(item => 
      selectedItems.has(item.id) ? { ...item, isFavorite: !item.isFavorite } : item
    ));
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const loadFromHistory = (historyItem) => {
    setText(historyItem.text);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    setSelectedItems(new Set());
    setShowBulkActions(false);
    localStorage.removeItem('tts-history');
  };

  return (
    <div className="App">
      <div className="container">
        <main className="tts-card" role="main" itemScope itemType="https://schema.org/WebApplication">
          <Header
            showSpeedControl={showSpeedControl}
            setShowSpeedControl={setShowSpeedControl}
            showVoiceSelector={showVoiceSelector}
            setShowVoiceSelector={setShowVoiceSelector}
            showHistory={showHistory}
            setShowHistory={setShowHistory}
            selectedVoice={selectedVoice}
            speechRate={speechRate}
            hasProgress={hasProgress() && !isSpeaking}
            onResume={handleResume}
          />

          <SpeedControl
            show={showSpeedControl}
            speechRate={speechRate}
            onSpeedChange={handleSpeedChange}
            onPresetSelect={handleSpeedPreset}
            onClose={() => setShowSpeedControl(false)}
          />

          <VoiceSelector
            show={showVoiceSelector}
            voices={voices}
            selectedVoice={selectedVoice}
            onVoiceSelect={handleVoiceSelect}
            onClose={() => setShowVoiceSelector(false)}
          />

          <History
            show={showHistory}
            history={history}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedItems={selectedItems}
            showBulkActions={showBulkActions}
            onToggleItemSelection={toggleItemSelection}
            onSelectAllItems={selectAllItems}
            onDeselectAllItems={deselectAllItems}
            onBulkDelete={bulkDelete}
            onBulkToggleFavorite={bulkToggleFavorite}
            onToggleFavorite={toggleFavorite}
            onUpdateItemCategory={updateItemCategory}
            onLoadFromHistory={loadFromHistory}
            onClearHistory={clearHistory}
          />

          <TextInput
            text={text}
            onChange={handleChange}
            error={error}
            selectedVoice={selectedVoice}
            speechRate={speechRate}
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
    </div>
  );
}

/**
 * App wrapper with Theme Provider
 */
function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWithTheme;
