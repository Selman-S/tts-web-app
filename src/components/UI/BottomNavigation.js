import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import './BottomNavigation.css';

/**
 * Bottom Navigation component with routing and language support
 * Similar to mobile app design
 */
const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-navigation" role="navigation" aria-label="Ana navigasyon">
      <button 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
        title={t('nav.home')}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">{t('nav.home')}</span>
      </button>

      <button 
        className={`nav-item ${isActive('/history') ? 'active' : ''}`}
        onClick={() => navigate('/history')}
        title={t('nav.history')}
      >
        <span className="nav-icon">📚</span>
        <span className="nav-label">{t('nav.history')}</span>
      </button>

      <button 
        className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
        onClick={() => navigate('/settings')}
        title={t('nav.settings')}
      >
        <span className="nav-icon">⚙️</span>
        <span className="nav-label">{t('nav.settings')}</span>
      </button>
    </nav>
  );
};

export default BottomNavigation; 