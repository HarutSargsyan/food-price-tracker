import { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../services/productService';
import { PriceEntryService } from '../services/priceEntryService';
import type { Product, CreateProductInput } from '../types/database';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: CreateProductInput) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export const useProducts = (userId: string | null): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const userProducts = await ProductService.getProducts(userId);
      setProducts(userProducts);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addProduct = useCallback(async (product: CreateProductInput) => {
    if (!userId) throw new Error('User not authenticated');
    
    try {
      setError(null);
      await ProductService.addProduct(product, userId);
      await fetchProducts(); // Refresh the list
    } catch (err) {
      setError('Failed to add product');
      console.error('Error adding product:', err);
      throw err;
    }
  }, [userId, fetchProducts]);

  const removeProduct = useCallback(async (id: string) => {
    if (!userId) throw new Error('User not authenticated');
    
    try {
      setError(null);
      await ProductService.deleteProduct(id);
      await PriceEntryService.deleteEntriesByProduct(id, userId);
      await fetchProducts(); // Refresh the list
    } catch (err) {
      setError('Failed to remove product');
      console.error('Error removing product:', err);
      throw err;
    }
  }, [userId, fetchProducts]);

  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    addProduct,
    removeProduct,
    refreshProducts,
  };
}; 