import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useTranslation } from '../translations';
import Header from '../components/Header/Header';
import AudioControls from '../components/AudioControls/AudioControls';
import { MAX_CHARS } from '../constants';
import './HomePage.css';

/**
 * Enhanced Home Page with smart features 🚀
 * Auto-save, statistics, visual feedback, improved mobile experience
 */
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  // Enhanced speech synthesis hook
  const {
    // Core state
    isSpeaking,
    isPaused,
    currentText,
    speechRate,
    selectedVoice,
    voices,
    
    // Enhanced features
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
    canResume,
    isReady,
    clearError
  } = useSpeechSynthesis();
  
  // Local UI state
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [showResumeCard, setShowResumeCard] = useState(false);
  const [showAutoSaveHint, setShowAutoSaveHint] = useState(false);
  const [showTextStats, setShowTextStats] = useState(false);

  // Debounced auto-save on text change
  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
      setError('');
      
      // Trigger auto-save
      autoSave(newText);
      
      // Show auto-save hint briefly
      if (newText.length > 10) {
        setShowAutoSaveHint(true);
        setTimeout(() => setShowAutoSaveHint(false), 2000);
      }
    }
  }, [autoSave]);

  // Load text from history/navigation
  useEffect(() => {
    if (location.state && location.state.text) {
      setText(location.state.text);
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  // Check for paused session and auto-saved text on mount
  useEffect(() => {
    const session = loadPausedSession();
    if (session.hasSession) {
      setText(session.text);
      setShowResumeCard(true);
      return;
    }

    // Check for auto-saved text
    const autoSaved = loadAutoSavedText();
    if (autoSaved && !text) {
      setText(autoSaved.text);
      setShowAutoSaveHint(true);
      setTimeout(() => setShowAutoSaveHint(false), 4000);
    }
  }, [loadPausedSession, loadAutoSavedText, text]);

  // Hide resume card when speaking starts
  useEffect(() => {
    if (isSpeaking) {
      setShowResumeCard(false);
    }
  }, [isSpeaking]);

  // Sync errors
  useEffect(() => {
    if (lastError) {
      setError(lastError.message);
      setTimeout(() => {
        clearError();
        setError('');
      }, 5000);
    }
  }, [lastError, clearError]);

  // Event handlers
  const handleSpeak = useCallback(() => {
    try {
      speak(text);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [speak, text]);

  const handleResume = useCallback(() => {
    try {
      resume();
      setShowResumeCard(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [resume]);

  const handleStop = useCallback(() => {
    stop();
    setShowResumeCard(false);
  }, [stop]);

  const handleDismissResume = useCallback(() => {
    setShowResumeCard(false);
    stop();
    setText('');
  }, [stop]);

  // Quick actions
  const handleClearText = useCallback(() => {
    setText('');
    setError('');
  }, []);

  const handleTextStats = useCallback(() => {
    setShowTextStats(!showTextStats);
  }, [showTextStats]);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get character limit status
  const getCharLimitStatus = () => {
    const percentage = (text.length / MAX_CHARS) * 100;
    if (percentage > 90) return 'danger';
    if (percentage > 75) return 'warning';
    return 'normal';
  };

  return (
    <div className="container">
      <Header />
      <main className="home-page" role="main">
        
        {/* Auto-save indicator */}
        {showAutoSaveHint && (
          <div className="auto-save-hint">
            💾 Metin otomatik kaydedildi
          </div>
        )}

        {/* Resume Reading Card - Enhanced */}
        {showResumeCard && canResume && (
          <div className="resume-card enhanced">
            <div className="resume-content">
              <div className="resume-header">
                <h3>📖 Kaldığınız Yerden Devam Edin</h3>
                <div className="resume-stats">
                  {processedText && (
                    <>
                      <span>{processedText.wordCount} kelime</span>
                      <span>~{Math.round(processedText.estimatedSeconds / 60)} dk</span>
                    </>
                  )}
                </div>
              </div>
              <p className="resume-preview">
                {currentText.substring(0, 120)}
                {currentText.length > 120 ? '...' : ''}
              </p>
              <div className="resume-actions">
                <button 
                  className="btn-resume" 
                  onClick={handleResume}
                  disabled={isLoading}
                >
                  {isLoading ? '🔄' : '▶️'} Devam Et
                </button>
                <button 
                  className="btn-dismiss" 
                  onClick={handleDismissResume}
                >
                  ❌ Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Text Input Section - Enhanced */}
        <div className="text-input-section enhanced">
          <div className="input-header">
            <div className="input-label-group">
              <label htmlFor="text-input" className="input-label">
                📝 Metninizi buraya yazın veya yapıştırın
              </label>
              {text.length > 20 && (
                <button 
                  className="stats-toggle"
                  onClick={handleTextStats}
                  title="Metin istatistikleri"
                >
                  📊
                </button>
              )}
            </div>
            <div className="input-meta">
              <div className={`char-counter ${getCharLimitStatus()}`}>
                {text.length} / {MAX_CHARS}
              </div>
              {text.length > 0 && (
                <button 
                  className="clear-btn"
                  onClick={handleClearText}
                  title="Metni temizle"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>

          {/* Text statistics */}
          {showTextStats && processedText && (
            <div className="text-stats">
              <div className="stat-item">
                <span className="stat-label">Kelime:</span>
                <span className="stat-value">{processedText.wordCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Karakter:</span>
                <span className="stat-value">{processedText.charCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tahmini süre:</span>
                <span className="stat-value">{formatTime(processedText.estimatedSeconds)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Hız ile:</span>
                <span className="stat-value">{formatTime(processedText.estimatedSeconds / speechRate)}</span>
              </div>
            </div>
          )}
          
          <textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="🎯 İpucu: Metniniz yazarken otomatik kaydedilir..."
            maxLength={MAX_CHARS}
            rows={8}
            className="text-area enhanced"
            aria-describedby={error ? "error-message" : undefined}
            disabled={isLoading}
          />
          
          {error && (
            <div id="error-message" className="error-message enhanced" role="alert">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
              <button 
                className="error-close"
                onClick={() => setError('')}
                aria-label="Hatayı kapat"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Controls Section - Enhanced */}
        <div className="controls-section enhanced">
          
          {/* Voice and Speed Controls */}
          <div className="settings-row">
            <div className="voice-control">
              <label htmlFor="voice-select" className="control-label">
                🎤 Ses Seçimi
                {!isReady && <span className="loading-dot">⏳</span>}
              </label>
              <select
                id="voice-select"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value);
                  if (voice) selectVoice(voice);
                }}
                className="control-select"
                disabled={isLoading}
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
                {processedText && (
                  <span className="time-estimate">
                    ~{formatTime(processedText.estimatedSeconds / speechRate)}
                  </span>
                )}
              </label>
              <select
                id="speed-select"
                value={speechRate}
                onChange={(e) => changeRate(parseFloat(e.target.value))}
                className="control-select"
                disabled={isLoading}
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

          {/* Enhanced Progress Section */}
          {(isSpeaking || isPaused) && (
            <div className="progress-section enhanced">
              <div className="progress-header">
                <div className="progress-status">
                  <span className="status-icon">
                    {isLoading ? '🔄' : isPaused ? '⏸️' : '🔊'}
                  </span>
                  <span className="status-text">
                    {isLoading ? 'Hazırlanıyor...' : isPaused ? 'Duraklatıldı' : 'Okunuyor...'}
                  </span>
                </div>
                <div className="progress-stats">
                  <span className="progress-percent">{Math.round(progress)}%</span>
                  {readingStats.wordsPerMinute > 0 && (
                    <span className="wpm">{readingStats.wordsPerMinute} WPM</span>
                  )}
                </div>
              </div>
              
              <div className="progress-bar enhanced">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${progress}%`,
                    background: isPaused ? '#f59e0b' : 'linear-gradient(90deg, #667eea, #764ba2)'
                  }}
                ></div>
              </div>
              
              <div className="progress-time">
                <span className="time-elapsed">
                  📍 {formatTime(elapsedTime)}
                </span>
                {estimatedTime > 0 && (
                  <span className="time-remaining">
                    ⏱️ {formatTime(estimatedTime)} kaldı
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Reading Statistics */}
          {readingStats.totalReadTime > 0 && (
            <div className="reading-stats">
              <h4>📊 Okuma İstatistikleri</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">{readingStats.sessionsCompleted}</span>
                  <span className="stat-label">Tamamlanan</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{formatTime(readingStats.totalReadTime)}</span>
                  <span className="stat-label">Toplam Süre</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{readingStats.wordsPerMinute}</span>
                  <span className="stat-label">WPM</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Audio Controls */}
          <AudioControls
            isSpeaking={isSpeaking}
            isPaused={isPaused}
            onSpeak={handleSpeak}
            onPause={pause}
            onResume={handleResume}
            onStop={handleStop}
            disabled={isLoading || !isReady}
            isLoading={isLoading}
            textLength={text.trim().length}
          />
        </div>

      </main>
    </div>
  );
};

export default HomePage; 