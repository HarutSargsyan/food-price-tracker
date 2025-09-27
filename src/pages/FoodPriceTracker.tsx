import StatsCards from '../components/StatsCards';
import AddPriceEntryForm from '../components/AddPriceEntryForm';
import PriceEntryList from '../components/PriceEntryList';
import BestPricesDisplay from '../components/BestPricesDisplay';
import { usePriceEntries } from '../hooks/usePriceEntries';

const FoodPriceTracker = () => {
  const {
    priceEntries,
    products,
    stores,
    loading,
    error,
    addEntry,
    removeEntry,
    getBestPriceForProduct,
    getPriceComparison,
  } = usePriceEntries();

  return (
    <div className="bg-gray-50 p-2 sm:p-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Food Price Tracker</h1>
          <p className="text-gray-600 text-base sm:text-lg">Track and monitor food prices across different stores</p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        <StatsCards priceEntries={priceEntries} loading={loading} />
        
        <div className="mb-8">
          <BestPricesDisplay
            products={products}
            getBestPriceForProduct={getBestPriceForProduct}
            getPriceComparison={getPriceComparison}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AddPriceEntryForm
            onAddEntry={addEntry}
            products={products}
            stores={stores}
            loading={loading}
          />
          <PriceEntryList
            priceEntries={priceEntries}
            onRemoveEntry={removeEntry}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default FoodPriceTracker; 