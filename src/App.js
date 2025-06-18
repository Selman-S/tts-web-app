import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const maxChars = 50000;

  // Seslendirme seçeneklerini yükleme
  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices.filter(voice => voice.lang.startsWith('tr'))); // Sadece Türkçe sesler
    };

    loadVoices();
    // Chrome için gerekli olan voice changed event listener
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      setError('Tarayıcınız bu özelliği desteklemiyor.');
      return;
    }
    if (text.trim() === '') {
      setError('Lütfen bir metin girin.');
      return;
    }
    setError('');
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Konuşma bittiğinde state'i güncelle
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleChange = (e) => {
    if (e.target.value.length <= maxChars) {
      setText(e.target.value);
      setError('');
    }
  };

  return (
    <div className="App">
      <div className="tts-card">
        <div className="tts-title">
          <span role="img" aria-label="speaker">🗣️</span>
          Yazıyı Sese Çevir
        </div>
        {error && <div className="tts-error">{error}</div>}
        <textarea
          className="tts-textarea"
          rows="5"
          placeholder="Metni buraya girin..."
          value={text}
          onChange={handleChange}
          maxLength={maxChars}
        />
        <div className="tts-counter">
          {text.length} / {maxChars}
        </div>
        <select 
          className="tts-select"
          value={selectedVoice ? selectedVoice.name : ''}
          onChange={(e) => {
            const voice = voices.find(v => v.name === e.target.value);
            setSelectedVoice(voice);
          }}
        >
          <option value="">Varsayılan ses</option>
          {voices.map(voice => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
        <div className="tts-controls">
          {!isSpeaking ? (
            <button className="tts-btn" onClick={handleSpeak}>
              <span role="img" aria-label="play">▶️</span> Seslendir
            </button>
          ) : (
            <>
              {isPaused ? (
                <button className="tts-btn" onClick={handleResume}>
                  <span role="img" aria-label="resume">▶️</span> Devam Et
                </button>
              ) : (
                <button className="tts-btn pause" onClick={handlePause}>
                  <span role="img" aria-label="pause">⏸️</span> Duraklat
                </button>
              )}
              <button className="tts-btn stop" onClick={handleStop}>
                <span role="img" aria-label="stop">⏹️</span> Durdur
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
