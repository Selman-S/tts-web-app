import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import BottomNavigation from './components/UI/BottomNavigation';
import './App.css';

/**
 * Main TTS Application Component with Routing
 * Clean, modular structure with page-based routing
 */
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <BottomNavigation />
    </div>
  );
}

/**
 * App wrapper with Language Provider, Theme Provider and Router
 */
function AppWithProviders() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default AppWithProviders;
