import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useTranslation } from '../translations';
import { analyzeText } from '../utils/textUtils';
import Header from '../components/Header/Header';
import AudioControls from '../components/AudioControls/AudioControls';
import CurrentReading from '../components/CurrentReading/CurrentReading';
import { MAX_CHARS } from '../constants';
import './HomePage.css';

/**
 * Home page — text input, TTS controls, progress and resume
 */
const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  const {
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
    canResume,
    isReady,
    clearError
  } = useSpeechSynthesis();

  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [showResumeCard, setShowResumeCard] = useState(false);
  const [showAutoSaveHint, setShowAutoSaveHint] = useState(false);
  const [showTextStats, setShowTextStats] = useState(false);

  // Stats from local text while typing
  const textAnalysis = useMemo(() => analyzeText(text, speechRate), [text, speechRate]);

  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
      setError('');
      autoSave(newText);
      if (newText.length > 10) {
        setShowAutoSaveHint(true);
        setTimeout(() => setShowAutoSaveHint(false), 2000);
      }
    }
  }, [autoSave]);

  useEffect(() => {
    if (location.state?.text) {
      setText(location.state.text);
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const session = loadPausedSession();
    if (session.hasSession) {
      setText(session.text);
      setShowResumeCard(true);
      return;
    }
    const autoSaved = loadAutoSavedText();
    if (autoSaved && !text) {
      setText(autoSaved.text);
      setShowAutoSaveHint(true);
      setTimeout(() => setShowAutoSaveHint(false), 4000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSpeaking) setShowResumeCard(false);
  }, [isSpeaking]);

  useEffect(() => {
    if (lastError) {
      setError(lastError.message);
      const timer = setTimeout(() => {
        clearError();
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastError, clearError]);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCharLimitStatus = () => {
    const percentage = (text.length / MAX_CHARS) * 100;
    if (percentage > 90) return 'danger';
    if (percentage > 75) return 'warning';
    return 'normal';
  };

  const speedOptions = ['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'];
  const resumePreview = currentText || text;

  return (
    <div className="container">
      <Header />
      <main className="home-page" role="main">

        {showAutoSaveHint && (
          <div className="auto-save-hint">💾 {t('home.autoSaved')}</div>
        )}

        {showResumeCard && canResume && (
          <div className="resume-card enhanced">
            <div className="resume-content">
              <div className="resume-header">
                <h3>📖 {t('home.resumeTitle')}</h3>
                <div className="resume-stats">
                  {textAnalysis && (
                    <>
                      <span>{textAnalysis.wordCount} {t('common.words')}</span>
                      <span>~{Math.round(textAnalysis.estimatedSeconds / 60)} {t('common.minutes')}</span>
                    </>
                  )}
                </div>
              </div>
              <p className="resume-preview">
                {resumePreview.substring(0, 120)}
                {resumePreview.length > 120 ? '...' : ''}
              </p>
              <div className="resume-actions">
                <button className="btn-resume" onClick={handleResume} disabled={isLoading}>
                  {isLoading ? '🔄' : '▶️'} {t('home.resumeButton')}
                </button>
                <button className="btn-dismiss" onClick={handleDismissResume}>
                  ❌ {t('home.dismissButton')}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-input-section enhanced">
          <div className="input-header">
            <div className="input-label-group">
              <label htmlFor="text-input" className="input-label">
                📝 {t('home.inputLabel')}
              </label>
              {text.length > 20 && (
                <button className="stats-toggle" onClick={() => setShowTextStats(!showTextStats)} title={t('home.textStats')}>
                  📊
                </button>
              )}
            </div>
            <div className="input-meta">
              <div className={`char-counter ${getCharLimitStatus()}`}>
                {text.length} / {MAX_CHARS}
              </div>
              {text.length > 0 && (
                <button className="clear-btn" onClick={() => { setText(''); setError(''); }} title={t('home.clearText')}>
                  🗑️
                </button>
              )}
            </div>
          </div>

          {showTextStats && textAnalysis && (
            <div className="text-stats">
              <div className="stat-item">
                <span className="stat-label">{t('home.wordCount')}:</span>
                <span className="stat-value">{textAnalysis.wordCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('home.charCount')}:</span>
                <span className="stat-value">{textAnalysis.charCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('home.estimatedTime')}:</span>
                <span className="stat-value">{formatTime(textAnalysis.estimatedSeconds)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('home.atSpeed')}:</span>
                <span className="stat-value">{formatTime(textAnalysis.estimatedSeconds / speechRate)}</span>
              </div>
            </div>
          )}

          <textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder={`🎯 ${t('home.inputPlaceholder')}`}
            maxLength={MAX_CHARS}
            rows={8}
            className="text-area enhanced"
            aria-describedby={error ? 'error-message' : undefined}
            disabled={isLoading}
          />

          {error && (
            <div id="error-message" className="error-message enhanced" role="alert">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
              <button className="error-close" onClick={() => setError('')} aria-label={t('common.closeError')}>✕</button>
            </div>
          )}
        </div>

        <div className="controls-section enhanced">
          <div className="settings-row">
            <div className="voice-control">
              <label htmlFor="voice-select" className="control-label">
                🎤 {t('home.voiceLabel')}
                {!isReady && <span className="loading-dot">⏳</span>}
              </label>
              <select
                id="voice-select"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find((v) => v.name === e.target.value);
                  selectVoice(voice || null);
                }}
                className="control-select"
                disabled={isLoading}
              >
                <option value="">{t('voiceSelector.defaultVoice')}</option>
                {voices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="speed-control">
              <label htmlFor="speed-select" className="control-label">
                ⚡ {t('home.speedLabel')}: {speechRate}x
                {textAnalysis && (
                  <span className="time-estimate">~{formatTime(textAnalysis.estimatedSeconds / speechRate)}</span>
                )}
              </label>
              <select
                id="speed-select"
                value={speechRate}
                onChange={(e) => changeRate(parseFloat(e.target.value))}
                className="control-select"
                disabled={isLoading}
              >
                {speedOptions.map((rate) => (
                  <option key={rate} value={rate}>
                    {t(`home.speedOptions.${rate}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(isSpeaking || isPaused) && currentSentence && (
            <CurrentReading
              currentSentence={currentSentence}
              currentWord={currentWord}
              wordStart={wordStart}
              wordEnd={wordEnd}
              currentSentenceIndex={currentSentenceIndex}
              totalSentences={totalSentences}
              onPreviousSentence={goToPreviousSentence}
              onNextSentence={goToNextSentence}
            />
          )}

          {(isSpeaking || isPaused) && (
            <div className="progress-section enhanced">
              <div className="progress-header">
                <div className="progress-status">
                  <span className="status-icon">
                    {isLoading ? '🔄' : isPaused ? '⏸️' : '🔊'}
                  </span>
                  <span className="status-text">
                    {isLoading ? t('home.statusPreparing') : isPaused ? t('home.statusPaused') : t('home.statusSpeaking')}
                  </span>
                </div>
                <div className="progress-stats">
                  <span className="progress-percent">{Math.round(progress)}%</span>
                  {readingStats.wordsPerMinute > 0 && (
                    <span className="wpm">{readingStats.wordsPerMinute} {t('progressBar.wordsPerMinute')}</span>
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
                />
              </div>
              <div className="progress-time">
                <span className="time-elapsed">📍 {formatTime(elapsedTime)}</span>
                {estimatedTime > 0 && (
                  <span className="time-remaining">⏱️ {formatTime(estimatedTime)} {t('home.timeRemaining')}</span>
                )}
              </div>
            </div>
          )}

          {readingStats.totalReadTime > 0 && (
            <div className="reading-stats">
              <h4>📊 {t('home.readingStats')}</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">{readingStats.sessionsCompleted}</span>
                  <span className="stat-label">{t('home.completed')}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{formatTime(readingStats.totalReadTime)}</span>
                  <span className="stat-label">{t('home.totalTime')}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{readingStats.wordsPerMinute}</span>
                  <span className="stat-label">{t('progressBar.wordsPerMinute')}</span>
                </div>
              </div>
            </div>
          )}

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
            estimatedMinutes={textAnalysis ? Math.round(textAnalysis.estimatedSeconds / 60) : 0}
          />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
