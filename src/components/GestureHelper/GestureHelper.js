import React, { useEffect, useRef, useState } from 'react';
import './GestureHelper.css';

/**
 * Gesture Helper component for touch interactions
 * Handles swipe, tap, double-tap, and long press gestures
 */
const GestureHelper = ({
  isSpeaking,
  isPaused,
  currentSentenceIndex,
  totalSentences,
  onPause,
  onResume,
  onStop,
  onPreviousSentence,
  onNextSentence,
  onRestartSentence,
  children
}) => {
  const gestureRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [lastTap, setLastTap] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState(false);

  // Minimum distance for swipe detection
  const minSwipeDistance = 50;

  // Touch start handler
  const handleTouchStart = (e) => {
    // Only activate gestures during speech or pause, and not on interactive elements
    if (!isSpeaking && !isPaused) return;
    
    // Check if the touch target is an interactive element
    const target = e.target;
    const isInteractiveElement = target.closest('button') || 
                                target.closest('input') || 
                                target.closest('select') || 
                                target.closest('textarea') ||
                                target.closest('.history-panel') ||
                                target.closest('.voice-selector-panel') ||
                                target.closest('.speed-control-panel') ||
                                target.closest('.bottom-navigation') ||
                                target.closest('a');
    
    if (isInteractiveElement) return;
    
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    
    // Start long press timer
    const timer = setTimeout(() => {
      setShowOptionsMenu(true);
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 800);
    setLongPressTimer(timer);
  };

  // Touch move handler
  const handleTouchMove = (e) => {
    if (!isSpeaking && !isPaused) return;
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Touch end handler
  const handleTouchEnd = (e) => {
    if (!isSpeaking && !isPaused) return;
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // Check if the touch target is an interactive element
    const target = e.target;
    const isInteractiveElement = target.closest('button') || 
                                target.closest('input') || 
                                target.closest('select') || 
                                target.closest('textarea') ||
                                target.closest('.history-panel') ||
                                target.closest('.voice-selector-panel') ||
                                target.closest('.speed-control-panel') ||
                                target.closest('.bottom-navigation') ||
                                target.closest('a');
    
    if (isInteractiveElement) return;

    if (!touchStart || !touchEnd) {
      // Handle tap gestures
      handleTap(e);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSentenceIndex < totalSentences - 1) {
      // Swipe left - next sentence
      onNextSentence();
      showGestureIndicator('⏭️', 'Next sentence');
    }
    
    if (isRightSwipe && currentSentenceIndex > 0) {
      // Swipe right - previous sentence
      onPreviousSentence();
      showGestureIndicator('⏮️', 'Previous sentence');
    }
  };

  // Handle tap gestures
  const handleTap = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 500 && tapLength > 0) {
      // Double tap - restart current sentence
      onRestartSentence();
      showGestureIndicator('🔄', 'Sentence restarted');
    } else {
      // Single tap - pause/resume
      if (isSpeaking && !isPaused) {
        onPause();
        showGestureIndicator('⏸️', 'Paused');
      } else if (isPaused) {
        onResume();
        showGestureIndicator('▶️', 'Resumed');
      }
    }

    setLastTap(currentTime);
  };

  // Show gesture indicator
  const showGestureIndicator = (icon, message) => {
    setShowGestureHint({ icon, message });
    setTimeout(() => setShowGestureHint(false), 1500);
  };

  // Close options menu
  const closeOptionsMenu = () => {
    setShowOptionsMenu(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  // Show initial gesture hint
  useEffect(() => {
    if (isSpeaking && !localStorage.getItem('gesture-hint-shown')) {
      setTimeout(() => {
        setShowGestureHint({ 
          icon: '👆', 
          message: 'Touch gestures active!' 
        });
        localStorage.setItem('gesture-hint-shown', 'true');
      }, 2000);
    }
  }, [isSpeaking]);

  return (
    <div 
      ref={gestureRef}
      className={`gesture-container ${(isSpeaking || isPaused) ? 'gesture-active' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      
      {/* Gesture Hint */}
      {showGestureHint && (
        <div className="gesture-hint">
          <span className="gesture-icon">{showGestureHint.icon}</span>
          <span className="gesture-message">{showGestureHint.message}</span>
        </div>
      )}

      {/* Options Menu */}
      {showOptionsMenu && (
        <div className="gesture-options-menu">
          <div className="options-backdrop" onClick={closeOptionsMenu}></div>
          <div className="options-content">
            <h3>Okuma Kontrolleri</h3>
            <div className="gesture-options">
              <button 
                className="gesture-option"
                onClick={() => {
                  if (isSpeaking && !isPaused) onPause();
                  else if (isPaused) onResume();
                  closeOptionsMenu();
                }}
              >
                <span className="option-icon">
                  {isSpeaking && !isPaused ? '⏸️' : '▶️'}
                </span>
                <span className="option-text">
                  {isSpeaking && !isPaused ? 'Duraklat' : 'Devam Et'}
                </span>
              </button>

              <button 
                className="gesture-option"
                onClick={() => {
                  onRestartSentence();
                  closeOptionsMenu();
                }}
              >
                <span className="option-icon">🔄</span>
                <span className="option-text">Cümleyi Yeniden Başlat</span>
              </button>

              {currentSentenceIndex > 0 && (
                <button 
                  className="gesture-option"
                  onClick={() => {
                    onPreviousSentence();
                    closeOptionsMenu();
                  }}
                >
                  <span className="option-icon">⏮️</span>
                  <span className="option-text">Önceki Cümle</span>
                </button>
              )}

              {currentSentenceIndex < totalSentences - 1 && (
                <button 
                  className="gesture-option"
                  onClick={() => {
                    onNextSentence();
                    closeOptionsMenu();
                  }}
                >
                  <span className="option-icon">⏭️</span>
                  <span className="option-text">Sonraki Cümle</span>
                </button>
              )}

              <button 
                className="gesture-option danger"
                onClick={() => {
                  onStop();
                  closeOptionsMenu();
                }}
              >
                <span className="option-icon">⏹️</span>
                <span className="option-text">Durdur</span>
              </button>
            </div>

            <div className="gesture-help">
              <h4>Dokunma Hareketleri:</h4>
              <div className="help-items">
                <div className="help-item">
                  <span className="help-icon">👆</span>
                  <span className="help-text">Tek dokunma: Duraklat/Devam</span>
                </div>
                <div className="help-item">
                  <span className="help-icon">👆👆</span>
                  <span className="help-text">Çift dokunma: Cümleyi yeniden başlat</span>
                </div>
                <div className="help-item">
                  <span className="help-icon">👈</span>
                  <span className="help-text">Sola kaydır: Sonraki cümle</span>
                </div>
                <div className="help-item">
                  <span className="help-icon">👉</span>
                  <span className="help-text">Sağa kaydır: Önceki cümle</span>
                </div>
                <div className="help-item">
                  <span className="help-icon">👇</span>
                  <span className="help-text">Uzun bas: Bu menü</span>
                </div>
              </div>
            </div>

            <button 
              className="close-options-btn"
              onClick={closeOptionsMenu}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestureHelper; 