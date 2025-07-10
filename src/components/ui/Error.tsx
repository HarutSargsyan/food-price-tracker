import React from 'react';
import { AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface ErrorProps {
  message: string;
  className?: string;
  variant?: 'default' | 'inline';
}

const Error: React.FC<ErrorProps> = ({ message, className, variant = 'default' }) => {
  if (variant === 'inline') {
    return (
      <div className={clsx('flex items-center text-sm text-red-600', className)}>
        <AlertCircle className="h-4 w-4 mr-1" />
        {message}
      </div>
    );
  }

  return (
    <div className={clsx('p-3 bg-red-100 border border-red-400 text-red-700 rounded', className)}>
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        {message}
      </div>
    </div>
  );
};

export default Error; 