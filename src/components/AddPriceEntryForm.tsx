import React, { useState, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button, Input, Select, Card, Loading } from './ui';
import type { CreatePriceEntryInput, Product, Store } from '../types/database';

interface AddPriceEntryFormProps {
  onAddEntry: (entry: CreatePriceEntryInput) => Promise<void>;
  products: Product[];
  stores: Store[];
  loading?: boolean;
}

const UNIT_OPTIONS = [
  { value: 'per lb', label: 'per lb' },
  { value: 'per kg', label: 'per kg' },
  { value: 'each', label: 'each' },
  { value: 'per dozen', label: 'per dozen' },
  { value: 'per gallon', label: 'per gallon' },
];

const AddPriceEntryForm: React.FC<AddPriceEntryFormProps> = React.memo(({ 
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

  // Memoize product and store options
  const productOptions = useMemo(() => [
    { value: '', label: 'Select a product' },
    ...products.map(product => ({
      value: product.id,
      label: `${product.name} (${product.category})`
    }))
  ], [products]);

  const storeOptions = useMemo(() => [
    { value: '', label: 'Select a store' },
    ...stores.map(store => ({
      value: store.id,
      label: `${store.name} (${store.location})`
    }))
  ], [stores]);

  const handleProductChange = useCallback((value: string) => {
    const selectedProduct = products.find(p => p.id === value);
    setForm(prev => ({ 
      ...prev, 
      productId: value, 
      productName: selectedProduct?.name || '',
      unit: selectedProduct?.defaultUnit || prev.unit
    }));
  }, [products]);

  const handleStoreChange = useCallback((value: string) => {
    const selectedStore = stores.find(s => s.id === value);
    setForm(prev => ({ 
      ...prev, 
      storeId: value, 
      storeName: selectedStore?.name || ''
    }));
  }, [stores]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [form, onAddEntry]);

  const isFormValid = form.price && form.storeId && form.productId;

  if (loading) {
    return (
      <Card title="Add New Price Entry">
        <Loading text="Loading form..." />
      </Card>
    );
  }

  return (
    <Card title="Add New Price Entry">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Select
          label="Product"
          options={productOptions}
          value={form.productId}
          onChange={handleProductChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
            placeholder="0.00"
            required
          />
          <Select
            label="Unit"
            options={UNIT_OPTIONS}
            value={form.unit}
            onChange={(value) => setForm(prev => ({ ...prev, unit: value }))}
          />
        </div>

        <Select
          label="Store"
          options={storeOptions}
          value={form.storeId}
          onChange={handleStoreChange}
          required
        />

        <Button
          type="submit"
          disabled={!isFormValid || submitting}
          loading={submitting}
          className="w-full flex justify-center cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2 mt-1" />
          Add Price Entry
        </Button>
      </form>
    </Card>
  );
});

AddPriceEntryForm.displayName = 'AddPriceEntryForm';

export default AddPriceEntryForm; 