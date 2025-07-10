import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Loading } from './ui';
import BestPriceCard from './cards/BestPriceCard';
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

const BestPricesDisplay: React.FC<BestPricesDisplayProps> = React.memo(({
  products,
  getBestPriceForProduct,
  getPriceComparison,
}) => {
  const [bestPricesData, setBestPricesData] = useState<BestPriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const loadBestPrices = useCallback(async () => {
    if (products.length === 0) {
      setBestPricesData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const data: BestPriceData[] = [];

    try {
      for (const product of products) {
        const [bestPrice, comparison] = await Promise.all([
          getBestPriceForProduct(product.id),
          getPriceComparison(product.id),
        ]);
        
        data.push({
          product,
          bestPrice,
          comparison,
        });
      }

      setBestPricesData(data);
    } catch (error) {
      console.error('Error loading best prices:', error);
    } finally {
      setLoading(false);
    }
  }, [products, getBestPriceForProduct, getPriceComparison]);

  useEffect(() => {
    loadBestPrices();
  }, [loadBestPrices]);

  const handleToggleComparison = useCallback((productId: string) => {
    setSelectedProduct(prev => prev === productId ? null : productId);
  }, []);

  const sortedBestPricesData = useMemo(() => {
    return [...bestPricesData].sort((a, b) => {
      // Sort by product name
      return a.product.name.localeCompare(b.product.name);
    });
  }, [bestPricesData]);

  if (loading) {
    return (
      <Card title="Best Prices by Product">
        <Loading text="Loading best prices..." />
      </Card>
    );
  }

  return (
    <Card title="Best Prices by Product">
      <div className="space-y-4">
        {sortedBestPricesData.map(({ product, bestPrice, comparison }) => (
          <BestPriceCard
            key={product.id}
            product={product}
            bestPrice={bestPrice}
            comparison={comparison}
            selectedProduct={selectedProduct}
            onToggleComparison={handleToggleComparison}
          />
        ))}
      </div>

      {sortedBestPricesData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found. Add some price entries to see best prices.
        </div>
      )}
    </Card>
  );
});

BestPricesDisplay.displayName = 'BestPricesDisplay';

export default BestPricesDisplay; 