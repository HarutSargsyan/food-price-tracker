import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { ProductForm, StoreForm } from '../components/forms';
import { ProductList, StoreList } from '../components/lists';
import { Error, Loading } from '../components/ui';
import { useProducts, useStores } from '../hooks';

const UserPreferences: React.FC = () => {
  const { user } = useAuth();
  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    addProduct, 
    removeProduct 
  } = useProducts(user?.uid || null);
  
  const { 
    stores, 
    loading: storesLoading, 
    error: storesError, 
    addStore, 
    removeStore 
  } = useStores(user?.uid || null);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to manage your preferences.</p>
        </div>
      </div>
    );
  }

  const isLoading = productsLoading || storesLoading;
  const error = productsError || storesError;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Your Shopping Preferences</h2>
          <p className="text-gray-600 mb-4">Customize the stores and product types you shop for.</p>
          {error && <Error message={error} className="mb-4" />}
        </div>
        
        {isLoading ? (
          <Loading text="Loading preferences..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Products Section */}
            <div className="space-y-4">
              <ProductForm onSubmit={addProduct} loading={productsLoading} />
              <ProductList 
                products={products}
                onRemove={removeProduct}
                loading={productsLoading}
              />
            </div>

            {/* Stores Section */}
            <div className="space-y-4">
              <StoreForm onSubmit={addStore} loading={storesLoading} />
              <StoreList 
                stores={stores}
                onRemove={removeStore}
                loading={storesLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPreferences; 