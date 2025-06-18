import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
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
    window.speechSynthesis.speak(utterance);
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
        <button className="tts-btn" onClick={handleSpeak}>
          Seslendir
        </button>
      </div>
    </div>
  );
}

export default App;
