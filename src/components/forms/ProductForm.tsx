import React, { useState } from 'react';
import { Button, Input, Select, Card } from '../ui';
import type { CreateProductInput } from '../../types/database';

interface ProductFormProps {
  onSubmit: (product: CreateProductInput) => Promise<void>;
  loading?: boolean;
}

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

const DEFAULT_PRODUCT: CreateProductInput = {
  name: 'Apple',
  category: 'Fruits',
  defaultUnit: 'per lb',
};

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, loading = false }) => {
  const [form, setForm] = useState<CreateProductInput>(DEFAULT_PRODUCT);
  const [customCategory, setCustomCategory] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.defaultUnit) return;

    try {
      setSubmitting(true);
      await onSubmit(form);
      setForm(DEFAULT_PRODUCT);
      setCustomCategory('');
      setCustomUnit('');
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'Other') {
      setCustomCategory('');
      setForm(prev => ({ ...prev, category: '' }));
    } else {
      setCustomCategory('');
      setForm(prev => ({ ...prev, category: value }));
    }
  };

  const handleUnitChange = (value: string) => {
    if (value === 'Other') {
      setCustomUnit('');
      setForm(prev => ({ ...prev, defaultUnit: '' }));
    } else {
      setCustomUnit('');
      setForm(prev => ({ ...prev, defaultUnit: value }));
    }
  };

  const categoryOptions = CATEGORY_OPTIONS.map(option => ({ value: option, label: option }));
  const unitOptions = UNIT_OPTIONS.map(option => ({ value: option, label: option }));

  return (
    <Card title="Product Types" className="max-w-md w-full mx-auto p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Product Name"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Product name"
            required
            className="w-full text-base"
          />
          <div className="space-y-2">
            <Select
              label="Category"
              options={categoryOptions}
              value={form.category || 'Other'}
              onChange={handleCategoryChange}
              className="w-full text-base"
            />
            {form.category === '' && (
              <Input
                placeholder="Custom category"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  setForm(prev => ({ ...prev, category: e.target.value }));
                }}
                required
                className="w-full text-base"
              />
            )}
          </div>
          <div className="space-y-2">
            <Select
              label="Unit"
              options={unitOptions}
              value={form.defaultUnit || 'Other'}
              onChange={handleUnitChange}
              className="w-full text-base"
            />
            {form.defaultUnit === '' && (
              <Input
                placeholder="Custom unit"
                value={customUnit}
                onChange={(e) => {
                  setCustomUnit(e.target.value);
                  setForm(prev => ({ ...prev, defaultUnit: e.target.value }));
                }}
                required
                className="w-full text-base"
              />
            )}
          </div>
        </div>
        <Button
          type="submit"
          loading={submitting || loading}
          disabled={!form.name || !form.category || !form.defaultUnit}
          className="w-full py-3 text-base rounded-lg"
        >
          Add Product
        </Button>
      </form>
    </Card>
  );
};

export default ProductForm; 