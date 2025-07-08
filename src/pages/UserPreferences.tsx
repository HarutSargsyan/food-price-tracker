import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { ProductService } from '../services/productService';
import { StoreService } from '../services/storeService';
import { PriceEntryService } from '../services/priceEntryService';
import type { Product, Store, CreateProductInput, CreateStoreInput } from '../types/database';

const DEFAULT_PRODUCT = {
  name: 'Apple',
  category: 'Fruits',
  defaultUnit: 'per lb',
};

const DEFAULT_STORE = {
  name: 'SuperMart',
  location: '123 Main St, Anytown, USA',
};

const CATEGORY_OPTIONS = [
  'Fruits',
  'Vegetables',
  'Meat',
  'Dairy',
  'Bakery',
  'Seafood',
  'Beverages',
  'Snacks',
  'Canned Goods',
  'Frozen Foods',
  'Condiments',
  'Grains',
  'Cellary',
  'Bread',
  'Other',
];

const UNIT_OPTIONS = [
  'per lb',
  'per kg',
  'per item',
  'per dozen',
  'per gallon',
  'per pack',
  'each',
  'Other',
];

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 text-gray-900';
const buttonClass =
  'w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center font-semibold';

const UserPreferences: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [productForm, setProductForm] = useState<CreateProductInput>(DEFAULT_PRODUCT);
  const [storeForm, setStoreForm] = useState<CreateStoreInput>(DEFAULT_STORE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState('');
  const [customUnit, setCustomUnit] = useState('');

  // Fetch user-specific products and stores
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userProducts = await ProductService.getProducts(user.uid);
        const userStores = await StoreService.getStores(user.uid);
        setProducts(userProducts);
        setStores(userStores);
      } catch {
        setError('Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Add product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await ProductService.addProduct(productForm, user.uid);
      setProductForm(DEFAULT_PRODUCT);
      setCustomCategory('');
      setCustomUnit('');
      const userProducts = await ProductService.getProducts(user.uid);
      setProducts(userProducts);
    } catch {
      setError('Failed to add product');
    }
  };

  // Remove product
  const handleRemoveProduct = async (id: string) => {
    if (!user) return;
    const product = products.find(p => p.id === id);
    if (!product || product.name.toLowerCase() === DEFAULT_PRODUCT.name.toLowerCase()) return;
    try {
      await ProductService.deleteProduct(id);
      await PriceEntryService.deleteEntriesByProduct(id, user.uid);
      const userProducts = await ProductService.getProducts(user.uid);
      setProducts(userProducts);
    } catch {
      setError('Failed to remove product');
    }
  };

  // Add store
  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await StoreService.addStore(storeForm, user.uid);
      setStoreForm(DEFAULT_STORE);
      const userStores = await StoreService.getStores(user.uid);
      setStores(userStores);
    } catch {
      setError('Failed to add store');
    }
  };

  // Remove store
  const handleRemoveStore = async (id: string) => {
    if (!user) return;
    const store = stores.find(s => s.id === id);
    if (!store || store.name.toLowerCase() === DEFAULT_STORE.name.toLowerCase()) return;
    try {
      await StoreService.deleteStore(id);
      await PriceEntryService.deleteEntriesByStore(id, user.uid);
      const userStores = await StoreService.getStores(user.uid);
      setStores(userStores);
    } catch {
      setError('Failed to remove store');
    }
  };

  // Handle category select or custom
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'Other') {
      setCustomCategory('');
      setProductForm(f => ({ ...f, category: '' }));
    } else {
      setCustomCategory('');
      setProductForm(f => ({ ...f, category: value }));
    }
  };
  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
    setProductForm(f => ({ ...f, category: e.target.value }));
  };

  // Handle unit select or custom
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'Other') {
      setCustomUnit('');
      setProductForm(f => ({ ...f, defaultUnit: '' }));
    } else {
      setCustomUnit('');
      setProductForm(f => ({ ...f, defaultUnit: value }));
    }
  };
  const handleCustomUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUnit(e.target.value);
    setProductForm(f => ({ ...f, defaultUnit: e.target.value }));
  };

  if (!user) {
    return <div className="p-8 text-center">Please sign in to manage your preferences.</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Your Shopping Preferences</h2>
          <p className="text-gray-600 mb-4">Customize the stores and product types you shop for.</p>
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Product Types</h3>
              <form onSubmit={handleAddProduct} className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Product name"
                    value={productForm.name}
                    onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                  <div>
                    <select
                      className={inputClass}
                      value={productForm.category || 'Other'}
                      onChange={handleCategoryChange}
                    >
                      {CATEGORY_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {productForm.category === '' && (
                      <input
                        type="text"
                        className={inputClass + ' mt-2'}
                        placeholder="Custom category"
                        value={customCategory}
                        onChange={handleCustomCategoryChange}
                        required
                      />
                    )}
                  </div>
                  <div>
                    <select
                      className={inputClass}
                      value={productForm.defaultUnit || 'Other'}
                      onChange={handleUnitChange}
                    >
                      {UNIT_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {productForm.defaultUnit === '' && (
                      <input
                        type="text"
                        className={inputClass + ' mt-2'}
                        placeholder="Custom unit"
                        value={customUnit}
                        onChange={handleCustomUnitChange}
                        required
                      />
                    )}
                  </div>
                </div>
                <button type="submit" className={buttonClass}>
                  Add Product
                </button>
              </form>
              <ul className="divide-y divide-gray-200">
                {products.map(product => (
                  <li key={product.id} className="flex items-center justify-between py-2">
                    <span className="font-medium text-gray-900">{product.name} <span className="text-xs text-gray-500">({product.category}, {product.defaultUnit})</span></span>
                    {product.name.toLowerCase() !== DEFAULT_PRODUCT.name.toLowerCase() && (
                      <button onClick={() => handleRemoveProduct(product.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Stores */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Stores</h3>
              <form onSubmit={handleAddStore} className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Store name"
                    value={storeForm.name}
                    onChange={e => setStoreForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Location"
                    value={storeForm.location}
                    onChange={e => setStoreForm(f => ({ ...f, location: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className={buttonClass}>
                  Add Store
                </button>
              </form>
              <ul className="divide-y divide-gray-200">
                {stores.map(store => (
                  <li key={store.id} className="flex items-center justify-between py-2">
                    <span className="font-medium text-gray-900">{store.name} <span className="text-xs text-gray-500">({store.location})</span></span>
                    {store.name.toLowerCase() !== DEFAULT_STORE.name.toLowerCase() && (
                      <button onClick={() => handleRemoveStore(store.id)} className="text-red-500 text-xs hover:underline">Remove</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPreferences; 