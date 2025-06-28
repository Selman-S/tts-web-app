import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useTranslation } from '../translations';
import Header from '../components/Header/Header';
import AudioControls from '../components/AudioControls/AudioControls';
import { MAX_CHARS } from '../constants';
import './HomePage.css';

/**
 * Simplified Home Page with reliable TTS functionality
 * Focuses on core features that work consistently on mobile browsers
 */
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  // Speech synthesis hook
  const {
    isSpeaking,
    isPaused,
    currentText,
    speechRate,
    selectedVoice,
    voices,
    progress,
    speak,
    pause,
    resume,
    stop,
    selectVoice,
    changeRate,
    loadPausedSession,
    canResume
  } = useSpeechSynthesis();
  
  // Local UI state
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [showResumeCard, setShowResumeCard] = useState(false);

  // Load text from history if passed via navigation
  useEffect(() => {
    if (location.state && location.state.text) {
      setText(location.state.text);
      // Clear the state to prevent reloading on refresh
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  // Check for paused session on mount
  useEffect(() => {
    const session = loadPausedSession();
    if (session.hasSession) {
      setText(session.text);
      setShowResumeCard(true);
    }
  }, [loadPausedSession]);

  // Hide resume card when speaking starts
  useEffect(() => {
    if (isSpeaking) {
      setShowResumeCard(false);
    }
  }, [isSpeaking]);

  // Event handlers
  const handleTextChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
      setError('');
    }
  };

  const handleSpeak = () => {
    try {
      speak(text);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResume = () => {
    try {
      resume();
      setShowResumeCard(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStop = () => {
    stop();
    setShowResumeCard(false);
  };

  const handleDismissResume = () => {
    setShowResumeCard(false);
    stop();
    setText('');
  };

  return (
    <div className="container">
      <Header />
      <main className="home-page" role="main">
        
        {/* Resume Reading Card - Simplified */}
        {showResumeCard && canResume && (
          <div className="resume-card">
            <div className="resume-content">
              <h3>📖 Kaldığınız Yerden Devam Edin</h3>
              <p className="resume-preview">
                {currentText.substring(0, 100)}
                {currentText.length > 100 ? '...' : ''}
              </p>
              <div className="resume-actions">
                <button 
                  className="btn-resume" 
                  onClick={handleResume}
                  aria-label="Kaldığınız yerden devam edin"
                >
                  ▶️ Devam Et
                </button>
                <button 
                  className="btn-dismiss" 
                  onClick={handleDismissResume}
                  aria-label="Duraklatılan okumayı iptal et"
                >
                  ❌ Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Text Input Section */}
        <div className="text-input-section">
          <div className="input-header">
            <label htmlFor="text-input" className="input-label">
              📝 Metninizi buraya yazın veya yapıştırın
            </label>
            <div className="char-counter">
              {text.length} / {MAX_CHARS}
            </div>
          </div>
          
          <textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="Seslendirilecek metni buraya yazın..."
            maxLength={MAX_CHARS}
            rows={8}
            className="text-area"
            aria-describedby={error ? "error-message" : undefined}
          />
          
          {error && (
            <div id="error-message" className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          
          {/* Voice and Speed Controls */}
          <div className="settings-row">
            <div className="voice-control">
              <label htmlFor="voice-select" className="control-label">
                🎤 Ses Seçimi
              </label>
              <select
                id="voice-select"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  if (voice) selectVoice(voice);
                }}
                className="control-select"
              >
                <option value="">Varsayılan Ses</option>
                {voices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="speed-control">
              <label htmlFor="speed-select" className="control-label">
                ⚡ Hız: {speechRate}x
              </label>
              <select
                id="speed-select"
                value={speechRate}
                onChange={(e) => changeRate(parseFloat(e.target.value))}
                className="control-select"
              >
                <option value={0.5}>0.5x - Çok Yavaş</option>
                <option value={0.75}>0.75x - Yavaş</option>
                <option value={1.0}>1.0x - Normal</option>
                <option value={1.25}>1.25x - Hızlı</option>
                <option value={1.5}>1.5x - Çok Hızlı</option>
                <option value={1.75}>1.75x - Ultra Hızlı</option>
                <option value={2.0}>2.0x - Maksimum</option>
              </select>
            </div>
          </div>

          {/* Progress Bar - Simplified */}
          {(isSpeaking || isPaused) && (
            <div className="progress-section">
              <div className="progress-info">
                <span className="progress-text">
                  {isPaused ? '⏸️ Duraklatıldı' : '🔊 Okunuyor...'}
                </span>
                <span className="progress-percent">{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Audio Controls */}
          <AudioControls
            isSpeaking={isSpeaking}
            isPaused={isPaused}
            onSpeak={handleSpeak}
            onPause={pause}
            onResume={handleResume}
            onStop={handleStop}
          />
        </div>

      </main>
    </div>
  );
};

export default HomePage; 