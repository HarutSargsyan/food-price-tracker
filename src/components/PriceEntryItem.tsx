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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
          <span className="font-medium text-gray-900 text-base">{entry.productName}</span>
          <span className="text-lg font-bold text-green-600">${entry.price.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {entry.storeName} • {formatDate(entry.date)} • {entry.unit}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="ml-0 sm:ml-3 mt-2 sm:mt-0 p-2 text-red-500 hover:text-red-700 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-red-300"
        title="Remove entry"
      >
        <Minus className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PriceEntryItem; 