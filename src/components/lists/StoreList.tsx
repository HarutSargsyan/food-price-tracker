import React from 'react';
import type { Store } from '../../types/database';

interface StoreListProps {
  stores: Store[];
  onRemove: (id: string) => Promise<void>;
  defaultStoreName?: string;
  loading?: boolean;
}

const StoreList: React.FC<StoreListProps> = ({ 
  stores, 
  onRemove, 
  defaultStoreName = 'SuperMart',
  loading = false 
}) => {
  const handleRemove = async (id: string) => {
    const store = stores.find(s => s.id === id);
    if (!store || store.name.toLowerCase() === defaultStoreName.toLowerCase()) {
      return;
    }
    
    try {
      await onRemove(id);
    } catch (error) {
      console.error('Error removing store:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No stores found. Add your first store above.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {stores.map(store => (
        <li key={store.id} className="flex items-center justify-between py-2">
          <span className="font-medium text-gray-900">
            {store.name} 
            <span className="text-xs text-gray-500 ml-1">
              ({store.location})
            </span>
          </span>
          {store.name.toLowerCase() !== defaultStoreName.toLowerCase() && (
            <button 
              onClick={() => handleRemove(store.id)}
              className="text-red-500 text-xs hover:underline transition-colors"
            >
              Remove
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default StoreList; 