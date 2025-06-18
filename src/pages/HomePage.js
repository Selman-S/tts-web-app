import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSpeech } from '../context/SpeechContext';
import { useTranslation } from '../translations';
import Header from '../components/Header/Header';
import TextInput from '../components/TextInput/TextInput';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import CurrentReading from '../components/CurrentReading/CurrentReading';
import AudioControls from '../components/AudioControls/AudioControls';
import ResumeReading from '../components/ResumeReading/ResumeReading';
import { MAX_CHARS } from '../constants';

/**
 * Home Page component with main TTS functionality
 */
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  // Global speech context
  const {
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
    startSpeaking,
    handlePause,
    handleResume,
    handleStop,
    handleVoiceSelect,
    handleSpeedChange,
    setCurrentText,
    dismissPausedReading
  } = useSpeech();
  
  // Local UI state
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [showResumeCard, setShowResumeCard] = useState(false);
  


  // Load text from history if passed via navigation
  useEffect(() => {
    if (location.state && location.state.text) {
      setText(location.state.text);
      setCurrentText(location.state.text);
      // Clear the state to prevent reloading on refresh
      navigate('/', { replace: true });
    }
  }, [location.state, navigate, setCurrentText]);

  // Load voices on mount and when language changes
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const langPrefix = currentLanguage === 'en' ? 'en' : 'tr';
      setVoices(availableVoices.filter(voice => voice.lang.startsWith(langPrefix)));
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [currentLanguage]);

  // Sync local text with global current text when there's an active speech
  useEffect(() => {
    if (currentText && currentText !== text) {
      setText(currentText);
    }
  }, [currentText, text]);

  // Show resume card when there's a paused reading session
  useEffect(() => {
    // Show resume card if:
    // 1. There's paused content
    // 2. User is not currently in an active reading session
    // 3. There's text and sentences available
    const shouldShowResume = isPaused && !isSpeaking && currentText && sentences.length > 0;
    setShowResumeCard(shouldShowResume);
  }, [isPaused, isSpeaking, currentText, sentences.length]);

  // Event handlers
  const handleChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
      setCurrentText(e.target.value);
      setError('');
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
    
    setError('');
    const result = startSpeaking(text, currentLanguage);
    if (!result.success) {
      setError(t(result.error));
    }
  };

  // Resume reading from where user left off
  const handleResumeReading = () => {
    setShowResumeCard(false);
    handleResume();
  };

  // Dismiss paused reading session
  const handleDismissReading = () => {
    setShowResumeCard(false);
    dismissPausedReading();
    setText(''); // Clear local text as well
  };



  return (
    <div className="container">
      <Header />
      <main className="tts-card" role="main" itemScope itemType="https://schema.org/WebApplication">

        <ResumeReading
          show={showResumeCard}
          currentText={currentText}
          currentSentenceIndex={currentSentenceIndex}
          totalSentences={sentences.length}
          currentSentence={currentSentence}
          onResume={handleResumeReading}
          onDismiss={handleDismissReading}
        />

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