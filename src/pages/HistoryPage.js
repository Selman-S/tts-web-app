import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../translations';
import { useHistory } from '../hooks/useHistory';
import Header from '../components/Header/Header';
import History from '../components/History/History';
import { FaArrowLeft } from 'react-icons/fa';

/**
 * History page — uses shared useHistory hook
 */
const HistoryPage = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  const {
    history,
    searchQuery,
    selectedItems,
    showBulkActions,
    selectedCategory,
    toggleFavorite,
    updateItemCategory,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    bulkDelete,
    bulkToggleFavorite,
    clearHistory,
    setSearchQuery,
    setSelectedCategory
  } = useHistory();

  const loadFromHistory = (historyItem) => {
    navigate('/', { state: { text: historyItem.text } });
  };

  return (
    <div className="container">
      <Header />
      <div className="tts-card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              marginRight: '16px',
              color: 'var(--text-secondary)'
            }}
            aria-label={t('nav.home')}
          >
            <FaArrowLeft />
          </button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {t('history.title')}
          </h1>
        </div>

        <History
          show={true}
          history={history}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedItems={selectedItems}
          showBulkActions={showBulkActions}
          onToggleItemSelection={toggleItemSelection}
          onSelectAllItems={selectAllItems}
          onDeselectAllItems={deselectAllItems}
          onBulkDelete={bulkDelete}
          onBulkToggleFavorite={bulkToggleFavorite}
          onToggleFavorite={toggleFavorite}
          onUpdateItemCategory={updateItemCategory}
          onLoadFromHistory={loadFromHistory}
          onClearHistory={clearHistory}
        />
      </div>
    </div>
  );
};

export default HistoryPage;
