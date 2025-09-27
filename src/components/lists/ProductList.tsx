import React from 'react';
import type { Product } from '../../types/database';

interface ProductListProps {
  products: Product[];
  onRemove: (id: string) => Promise<void>;
  defaultProductName?: string;
  loading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onRemove, 
  defaultProductName = 'Apple',
  loading = false 
}) => {
  const handleRemove = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product || product.name.toLowerCase() === defaultProductName.toLowerCase()) {
      return;
    }
    
    try {
      await onRemove(id);
    } catch (error) {
      console.error('Error removing product:', error);
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

  if (products.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No products found. Add your first product above.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 w-full max-w-md mx-auto bg-white rounded-lg shadow p-2 sm:p-4">
      {products.map(product => (
        <li key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 px-2 gap-2">
          <span className="font-medium text-gray-900 text-base">
            {product.name} 
            <span className="text-xs text-gray-500 ml-1">
              ({product.category}, {product.defaultUnit})
            </span>
          </span>
          {product.name.toLowerCase() !== defaultProductName.toLowerCase() && (
            <button 
              onClick={() => handleRemove(product.id)}
              className="text-red-500 text-base hover:underline transition-colors py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Remove
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ProductList; 