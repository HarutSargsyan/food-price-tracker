import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { CreatePriceEntryInput, Product, Store } from '../types/database';

interface AddPriceEntryFormProps {
  onAddEntry: (entry: CreatePriceEntryInput) => Promise<void>;
  products: Product[];
  stores: Store[];
  loading?: boolean;
}

const AddPriceEntryForm: React.FC<AddPriceEntryFormProps> = ({ 
  onAddEntry, 
  products, 
  stores, 
  loading = false 
}) => {
  const [form, setForm] = useState({
    productId: '',
    productName: '',
    price: '',
    storeId: '',
    storeName: '',
    unit: 'per lb',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Auto-fill product name when product is selected
    if (name === 'productId') {
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        setForm(prev => ({ 
          ...prev, 
          productId: value, 
          productName: selectedProduct.name,
          unit: selectedProduct.defaultUnit 
        }));
      }
    }

    // Auto-fill store name when store is selected
    if (name === 'storeId') {
      const selectedStore = stores.find(s => s.id === value);
      if (selectedStore) {
        setForm(prev => ({ 
          ...prev, 
          storeId: value, 
          storeName: selectedStore.name 
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.price || !form.storeId || !form.productId) return;

    try {
      setSubmitting(true);
      await onAddEntry({
        productId: form.productId,
        productName: form.productName,
        price: parseFloat(form.price),
        storeId: form.storeId,
        storeName: form.storeName,
        unit: form.unit,
      });
      
      // Reset form
      setForm({
        productId: '',
        productName: '',
        price: '',
        storeId: '',
        storeName: '',
        unit: 'per lb',
      });
    } catch (error) {
      console.error('Error adding entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Add these style classes for select
  const selectClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900';

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Price Entry</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Price Entry</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className={selectClass}
            required
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.category})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="per lb">per lb</option>
              <option value="per kg">per kg</option>
              <option value="each">each</option>
              <option value="per dozen">per dozen</option>
              <option value="per gallon">per gallon</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store</label>
          <select
            name="storeId"
            value={form.storeId}
            onChange={handleChange}
            className={selectClass}
            required
          >
            <option value="">Select a store</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name} ({store.location})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting || !form.productId || !form.price || !form.storeId}
          className="w-full bg-blue-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {submitting ? 'Adding...' : 'Add Price Entry'}
        </button>
      </form>
    </div>
  );
};

export default AddPriceEntryForm; 