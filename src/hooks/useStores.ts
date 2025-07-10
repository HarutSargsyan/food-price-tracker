import { useState, useEffect, useCallback } from 'react';
import { StoreService } from '../services/storeService';
import { PriceEntryService } from '../services/priceEntryService';
import type { Store, CreateStoreInput } from '../types/database';

interface UseStoresReturn {
  stores: Store[];
  loading: boolean;
  error: string | null;
  addStore: (store: CreateStoreInput) => Promise<void>;
  removeStore: (id: string) => Promise<void>;
  refreshStores: () => Promise<void>;
}

export const useStores = (userId: string | null): UseStoresReturn => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const userStores = await StoreService.getStores(userId);
      setStores(userStores);
    } catch (err) {
      setError('Failed to load stores');
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addStore = useCallback(async (store: CreateStoreInput) => {
    if (!userId) throw new Error('User not authenticated');
    
    try {
      setError(null);
      await StoreService.addStore(store, userId);
      await fetchStores(); // Refresh the list
    } catch (err) {
      setError('Failed to add store');
      console.error('Error adding store:', err);
      throw err;
    }
  }, [userId, fetchStores]);

  const removeStore = useCallback(async (id: string) => {
    if (!userId) throw new Error('User not authenticated');
    
    try {
      setError(null);
      await StoreService.deleteStore(id);
      await PriceEntryService.deleteEntriesByStore(id, userId);
      await fetchStores(); // Refresh the list
    } catch (err) {
      setError('Failed to remove store');
      console.error('Error removing store:', err);
      throw err;
    }
  }, [userId, fetchStores]);

  const refreshStores = useCallback(async () => {
    await fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    stores,
    loading,
    error,
    addStore,
    removeStore,
    refreshStores,
  };
}; 