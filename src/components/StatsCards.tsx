import React, { useMemo, useCallback } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { Card, Loading } from './ui';
import type { PriceEntry } from '../types/database';

interface StatsCardsProps {
  priceEntries: PriceEntry[];
  loading?: boolean;
}

const getAveragePrice = (entries: PriceEntry[], productName: string) => {
  const productEntries = entries.filter(entry => entry.productName === productName);
  if (productEntries.length === 0) return '0.00';
  const sum = productEntries.reduce((acc, entry) => acc + entry.price, 0);
  return (sum / productEntries.length).toFixed(2);
};

const getPriceTrend = (entries: PriceEntry[], productName: string) => {
  const productEntries = entries
    .filter(entry => entry.productName === productName)
    .sort((a, b) => {
      const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
      const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  
  if (productEntries.length < 2) return null;
  const latest = productEntries[0].price;
  const previous = productEntries[1].price;
  if (latest > previous) return 'up';
  if (latest < previous) return 'down';
  return 'stable';
};

const StatsCards: React.FC<StatsCardsProps> = React.memo(({ priceEntries, loading = false }) => {
  // Memoize expensive calculations
  const stats = useMemo(() => {
    if (priceEntries.length === 0) {
      return {
        mostTrackedProduct: 'No products',
        averagePrice: '0.00',
        priceTrend: null,
        totalEntries: 0
      };
    }

    // Get the most tracked product (product with most entries)
    const productCounts = priceEntries.reduce((acc, entry) => {
      acc[entry.productName] = (acc[entry.productName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostTrackedProduct = Object.entries(productCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const averagePrice = getAveragePrice(priceEntries, mostTrackedProduct);
    const priceTrend = getPriceTrend(priceEntries, mostTrackedProduct);
    const totalEntries = priceEntries.length;

    return {
      mostTrackedProduct,
      averagePrice,
      priceTrend,
      totalEntries
    };
  }, [priceEntries]);

  const renderPriceTrend = useCallback((trend: string | null) => {
    if (trend === 'up') {
      return (
        <>
          <TrendingUp className="h-5 w-5 text-red-500 mr-1" />
          <span className="text-red-500 font-semibold">Rising</span>
        </>
      );
    }
    if (trend === 'down') {
      return (
        <>
          <TrendingDown className="h-5 w-5 text-green-500 mr-1" />
          <span className="text-green-500 font-semibold">Falling</span>
        </>
      );
    }
    return <span className="text-gray-500 font-semibold">Stable</span>;
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <Loading />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Average Price ({stats.mostTrackedProduct})
            </p>
            <p className="text-2xl font-bold text-gray-900">${stats.averagePrice}</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-500" />
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Price Trend</p>
            <div className="flex items-center">
              {renderPriceTrend(stats.priceTrend)}
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Entries</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
          </div>
          <Calendar className="h-8 w-8 text-blue-500" />
        </div>
      </Card>
    </div>
  );
});

StatsCards.displayName = 'StatsCards';

export default StatsCards; 