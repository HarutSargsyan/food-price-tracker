import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Store, Calendar } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import type { PriceEntry, Product } from '../types/database';

interface BestPricesDisplayProps {
  products: Product[];
  getBestPriceForProduct: (productId: string) => Promise<PriceEntry | null>;
  getPriceComparison: (productId: string) => Promise<PriceEntry[]>;
}

interface BestPriceData {
  product: Product;
  bestPrice: PriceEntry | null;
  comparison: PriceEntry[];
}

const BestPricesDisplay: React.FC<BestPricesDisplayProps> = ({
  products,
  getBestPriceForProduct,
  getPriceComparison,
}) => {
  const [bestPricesData, setBestPricesData] = useState<BestPriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    const loadBestPrices = async () => {
      setLoading(true);
      const data: BestPriceData[] = [];

      for (const product of products) {
        const bestPrice = await getBestPriceForProduct(product.id);
        const comparison = await getPriceComparison(product.id);
        
        data.push({
          product,
          bestPrice,
          comparison,
        });
      }

      setBestPricesData(data);
      setLoading(false);
    };

    if (products.length > 0) {
      loadBestPrices();
    }
  }, [products, getBestPriceForProduct, getPriceComparison]);

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Best Prices</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Best Prices by Product</h2>
      
      <div className="space-y-4">
        {bestPricesData.map(({ product, bestPrice, comparison }) => (
          <div key={product.id} className="border rounded-lg p-4">
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
                      {getPriceTrend(comparison) === 'up' && (
                        <>
                          <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-500 text-sm">Rising</span>
                        </>
                      )}
                      {getPriceTrend(comparison) === 'down' && (
                        <>
                          <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500 text-sm">Falling</span>
                        </>
                      )}
                      {getPriceTrend(comparison) === 'stable' && (
                        <span className="text-gray-500 text-sm">Stable</span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    {comparison.length} price entries
                  </div>

                  <button
                    onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {selectedProduct === product.id ? 'Hide' : 'Show'} Price Comparison
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No price data available for {product.name}
              </div>
            )}

            {selectedProduct === product.id && bestPrice && (
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
        ))}
      </div>

      {bestPricesData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found. Add some price entries to see best prices.
        </div>
      )}
    </div>
  );
};

export default BestPricesDisplay; 