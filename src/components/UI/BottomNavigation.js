import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../translations';
import { FaHome, FaHistory, FaCog } from 'react-icons/fa';
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
        <FaHome className="nav-icon" />
        <span className="nav-label">{t('nav.home')}</span>
      </button>

      <button 
        className={`nav-item ${isActive('/history') ? 'active' : ''}`}
        onClick={() => navigate('/history')}
        title={t('nav.history')}
      >
        <FaHistory className="nav-icon" />
        <span className="nav-label">{t('nav.history')}</span>
      </button>

      <button 
        className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
        onClick={() => navigate('/settings')}
        title={t('nav.settings')}
      >
        <FaCog className="nav-icon" />
        <span className="nav-label">{t('nav.settings')}</span>
      </button>
    </nav>
  );
};

export default BottomNavigation; 