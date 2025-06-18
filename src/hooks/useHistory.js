import { useState, useEffect, useCallback } from 'react';
import { MAX_HISTORY, STORAGE_KEYS } from '../constants';
import { saveToStorage, loadFromStorage, removeFromStorage } from '../utils/storageUtils';
import { getWordCount, createPreview } from '../utils/textUtils';

/**
 * Custom hook for managing reading history
 * Handles history state, filtering, and bulk operations
 */
export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = loadFromStorage(STORAGE_KEYS.HISTORY, []);
    setHistory(savedHistory);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      saveToStorage(STORAGE_KEYS.HISTORY, history);
    }
  }, [history]);

  // Add text to history with category and favorite status
  const addToHistory = useCallback((textContent, category = 'other') => {
    const historyItem = {
      id: Date.now(),
      text: textContent,
      timestamp: new Date().toLocaleString('tr-TR'),
      preview: createPreview(textContent, 100),
      category: category,
      isFavorite: false,
      wordCount: getWordCount(textContent)
    };
    
    setHistory(prev => {
      const newHistory = [historyItem, ...prev.filter(item => item.text !== textContent)];
      return newHistory.slice(0, MAX_HISTORY);
    });
  }, []);

  // Filter history based on search and category
  const getFilteredHistory = useCallback(() => {
    let filtered = history;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.preview.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        filtered = filtered.filter(item => item.isFavorite);
      } else {
        filtered = filtered.filter(item => item.category === selectedCategory);
      }
    }

    return filtered;
  }, [history, searchQuery, selectedCategory]);

  // Toggle favorite status
  const toggleFavorite = useCallback((itemId) => {
    setHistory(prev => prev.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  }, []);

  // Update item category
  const updateItemCategory = useCallback((itemId, newCategory) => {
    setHistory(prev => prev.map(item => 
      item.id === itemId ? { ...item, category: newCategory } : item
    ));
  }, []);

  // Toggle item selection for bulk operations
  const toggleItemSelection = useCallback((itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
    setShowBulkActions(newSelected.size > 0);
  }, [selectedItems]);

  // Select all filtered items
  const selectAllItems = useCallback(() => {
    const filteredItems = getFilteredHistory();
    const allIds = new Set(filteredItems.map(item => item.id));
    setSelectedItems(allIds);
    setShowBulkActions(allIds.size > 0);
  }, [getFilteredHistory]);

  // Deselect all items
  const deselectAllItems = useCallback(() => {
    setSelectedItems(new Set());
    setShowBulkActions(false);
  }, []);

  // Bulk delete selected items
  const bulkDelete = useCallback(() => {
    setHistory(prev => prev.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
    setShowBulkActions(false);
  }, [selectedItems]);

  // Bulk toggle favorite status
  const bulkToggleFavorite = useCallback(() => {
    setHistory(prev => prev.map(item => 
      selectedItems.has(item.id) ? { ...item, isFavorite: !item.isFavorite } : item
    ));
    setSelectedItems(new Set());
    setShowBulkActions(false);
  }, [selectedItems]);

  // Bulk update category
  const bulkUpdateCategory = useCallback((newCategory) => {
    setHistory(prev => prev.map(item => 
      selectedItems.has(item.id) ? { ...item, category: newCategory } : item
    ));
    setSelectedItems(new Set());
    setShowBulkActions(false);
  }, [selectedItems]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setSelectedItems(new Set());
    setShowBulkActions(false);
    removeFromStorage(STORAGE_KEYS.HISTORY);
  }, []);

  return {
    // State
    history,
    searchQuery,
    selectedItems,
    showBulkActions,
    selectedCategory,
    
    // Computed
    filteredHistory: getFilteredHistory(),
    
    // Actions
    addToHistory,
    toggleFavorite,
    updateItemCategory,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    bulkDelete,
    bulkToggleFavorite,
    bulkUpdateCategory,
    clearHistory,
    setSearchQuery,
    setSelectedCategory
  };
}; 