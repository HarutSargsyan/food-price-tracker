import type React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute; 