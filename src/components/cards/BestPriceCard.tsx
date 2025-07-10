import React from 'react';
import { DollarSign, Store, Calendar } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import type { PriceEntry, Product } from '../../types/database';

interface BestPriceCardProps {
  product: Product;
  bestPrice: PriceEntry | null;
  comparison: PriceEntry[];
  selectedProduct: string | null;
  onToggleComparison: (productId: string) => void;
}

const BestPriceCard: React.FC<BestPriceCardProps> = React.memo(({
  product,
  bestPrice,
  comparison,
  selectedProduct,
  onToggleComparison,
}) => {
  const formatDate = (timestamp: Timestamp | Date) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return date.toLocaleDateString();
  };

  const getPriceTrend = (comparison: PriceEntry[]) => {
    if (comparison.length < 2) return 'stable';
    const sorted = comparison.sort((a, b) => {
      const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
      const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    const latest = sorted[0].price;
    const previous = sorted[1].price;
    
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'stable';
  };

  const trend = getPriceTrend(comparison);
  const isExpanded = selectedProduct === product.id;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {product.category}
        </span>
      </div>

      {bestPrice ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Best Price</p>
                <p className="text-2xl font-bold text-green-900">
                  ${bestPrice.price.toFixed(2)}
                </p>
                <p className="text-sm text-green-600">{bestPrice.unit}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center text-sm text-green-700">
              <Store className="h-4 w-4 mr-1" />
              {bestPrice.storeName}
            </div>
            <div className="flex items-center text-sm text-green-600">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(bestPrice.date)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Price Trend</span>
              <div className="flex items-center">
                {trend === 'up' && (
                  <span className="text-red-500 text-sm">↗ Rising</span>
                )}
                {trend === 'down' && (
                  <span className="text-green-500 text-sm">↘ Falling</span>
                )}
                {trend === 'stable' && (
                  <span className="text-gray-500 text-sm">→ Stable</span>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {comparison.length} price entries
            </div>

            <button
              onClick={() => onToggleComparison(product.id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isExpanded ? 'Hide' : 'Show'} Price Comparison
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No price data available for {product.name}
        </div>
      )}

      {isExpanded && bestPrice && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Price Comparison</h4>
          <div className="space-y-2">
            {comparison.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center text-gray-700 justify-between p-2 rounded ${
                  entry.id === bestPrice?.id ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Store className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">{entry.storeName}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{formatDate(entry.date)}</span>
                  <span className="text-sm font-semibold">${entry.price.toFixed(2)}</span>
                  {entry.id === bestPrice?.id && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Best
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

BestPriceCard.displayName = 'BestPriceCard';

export default BestPriceCard; 