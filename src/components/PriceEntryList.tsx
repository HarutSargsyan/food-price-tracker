import React from 'react';
import type { PriceEntry } from '../types/database';
import PriceEntryItem from './PriceEntryItem';

interface PriceEntryListProps {
  priceEntries: PriceEntry[];
  onRemoveEntry: (id: string) => Promise<void>;
  loading?: boolean;
}

const PriceEntryList: React.FC<PriceEntryListProps> = ({ 
  priceEntries, 
  onRemoveEntry, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Price Entries</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Price Entries</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {priceEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No price entries yet</p>
        ) : (
          priceEntries.map((entry) => (
            <PriceEntryItem key={entry.id} entry={entry} onRemove={() => onRemoveEntry(entry.id)} />
          ))
        )}
      </div>
    </div>
  );
};

export default PriceEntryList; 