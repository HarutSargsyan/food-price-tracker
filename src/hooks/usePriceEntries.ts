import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/AuthProvider';
import { PriceEntryService } from '../services/priceEntryService';
import { ProductService } from '../services/productService';
import { StoreService } from '../services/storeService';
import type { PriceEntry, CreatePriceEntryInput, Product, Store } from '../types/database';

interface UsePriceEntriesReturn {
  priceEntries: PriceEntry[];
  products: Product[];
  stores: Store[];
  loading: boolean;
  error: string | null;
  addEntry: (input: CreatePriceEntryInput) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  getBestPriceForProduct: (productId: string) => Promise<PriceEntry | null>;
  getPriceComparison: (productId: string) => Promise<PriceEntry[]>;
  refreshData: () => Promise<void>;
}

export const usePriceEntries = (): UsePriceEntriesReturn => {
  const { user } = useAuth();
  const [priceEntries, setPriceEntries] = useState<PriceEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) {
      setPriceEntries([]);
      setProducts([]);
      setStores([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load products and stores in parallel
      const [productsData, storesData] = await Promise.all([
        ProductService.getProducts(user.uid),
        StoreService.getStores(user.uid),
      ]);

      setProducts(productsData);
      setStores(storesData);

      // Initialize default data if empty
      if (productsData.length === 0) {
        await ProductService.initializeDefaultProducts(user.uid);
        const newProducts = await ProductService.getProducts(user.uid);
        setProducts(newProducts);
      }

      if (storesData.length === 0) {
        await StoreService.initializeDefaultStores(user.uid);
        const newStores = await StoreService.getStores(user.uid);
        setStores(newStores);
      }

      // Load price entries
      const entries = await PriceEntryService.getPriceEntries(user.uid);
      setPriceEntries(entries);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addEntry = useCallback(async (input: CreatePriceEntryInput) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      // Check for existing entry for this product and store
      const existing = await PriceEntryService.findEntryByProductAndStore(
        input.productId,
        input.storeId,
        user.uid
      );
      if (existing) {
        // Update price and date
        await PriceEntryService.updatePriceEntry(existing.id, {
          price: input.price,
          unit: input.unit,
          productName: input.productName,
          storeName: input.storeName,
          date: new Date(),
        });
      } else {
        await PriceEntryService.addPriceEntry(input, user.uid);
      }
      await loadData(); // Refresh the data
    } catch (err) {
      console.error('Error adding entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to add entry');
      throw err;
    }
  }, [user, loadData]);

  const removeEntry = useCallback(async (id: string) => {
    try {
      setError(null);
      await PriceEntryService.deletePriceEntry(id);
      await loadData(); // Refresh all data so best prices update
    } catch (err) {
      console.error('Error removing entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove entry');
      throw err;
    }
  }, [loadData]);

  const getBestPriceForProduct = useCallback(async (productId: string): Promise<PriceEntry | null> => {
    if (!user) return null;

    try {
      return await PriceEntryService.getBestPriceForProduct(productId, user.uid);
    } catch (err) {
      console.error('Error getting best price:', err);
      setError(err instanceof Error ? err.message : 'Failed to get best price');
      return null;
    }
  }, [user]);

  const getPriceComparison = useCallback(async (productId: string): Promise<PriceEntry[]> => {
    if (!user) return [];

    try {
      return await PriceEntryService.getPriceComparisonByProduct(productId, user.uid);
    } catch (err) {
      console.error('Error getting price comparison:', err);
      setError(err instanceof Error ? err.message : 'Failed to get price comparison');
      return [];
    }
  }, [user]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    priceEntries,
    products,
    stores,
    loading,
    error,
    addEntry,
    removeEntry,
    getBestPriceForProduct,
    getPriceComparison,
    refreshData,
  };
}; 