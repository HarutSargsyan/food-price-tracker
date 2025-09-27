import React, { useState } from 'react';
import { Button, Input, Card } from '../ui';
import type { CreateStoreInput } from '../../types/database';

interface StoreFormProps {
  onSubmit: (store: CreateStoreInput) => Promise<void>;
  loading?: boolean;
}

const DEFAULT_STORE: CreateStoreInput = {
  name: 'SuperMart',
  location: '123 Main St, Anytown, USA',
};

const StoreForm: React.FC<StoreFormProps> = ({ onSubmit, loading = false }) => {
  const [form, setForm] = useState<CreateStoreInput>(DEFAULT_STORE);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location) return;

    try {
      setSubmitting(true);
      await onSubmit(form);
      setForm(DEFAULT_STORE);
    } catch (error) {
      console.error('Error adding store:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Stores" className="max-w-md w-full mx-auto p-2 sm:p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Store Name"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Store name"
            required
            className="w-full text-base"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Location"
            required
            className="w-full text-base"
          />
        </div>
        <Button
          type="submit"
          loading={submitting || loading}
          disabled={!form.name || !form.location}
          className="w-full py-3 text-base rounded-lg"
        >
          Add Store
        </Button>
      </form>
    </Card>
  );
};

export default StoreForm; 