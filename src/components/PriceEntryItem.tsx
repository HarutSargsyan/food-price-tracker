import React from 'react';
import { Minus } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import type { PriceEntry } from '../types/database';

interface PriceEntryItemProps {
  entry: PriceEntry;
  onRemove: () => void;
}

const PriceEntryItem: React.FC<PriceEntryItemProps> = ({ entry, onRemove }) => {
  const formatDate = (timestamp: Timestamp | Date) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">{entry.productName}</span>
          <span className="text-lg font-bold text-green-600">${entry.price.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-500">
          {entry.storeName} • {formatDate(entry.date)} • {entry.unit}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="ml-3 p-1 text-red-500 hover:text-red-700 transition-colors"
        title="Remove entry"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PriceEntryItem; 