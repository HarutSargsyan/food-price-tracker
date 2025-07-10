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
    <ul className="divide-y divide-gray-200">
      {products.map(product => (
        <li key={product.id} className="flex items-center justify-between py-2">
          <span className="font-medium text-gray-900">
            {product.name} 
            <span className="text-xs text-gray-500 ml-1">
              ({product.category}, {product.defaultUnit})
            </span>
          </span>
          {product.name.toLowerCase() !== defaultProductName.toLowerCase() && (
            <button 
              onClick={() => handleRemove(product.id)}
              className="text-red-500 text-xs hover:underline transition-colors"
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