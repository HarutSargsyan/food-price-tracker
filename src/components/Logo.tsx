import React from 'react';
import { NavLink } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', clickable = true, className = '' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const logoElement = (
    <h1 className={`font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent ${sizeClasses[size]} ${className}`}>
      GroceryScout
    </h1>
  );

  if (clickable) {
    return (
      <NavLink to="/" className="flex items-center">
        {logoElement}
      </NavLink>
    );
  }

  return logoElement;
};

export default Logo; 