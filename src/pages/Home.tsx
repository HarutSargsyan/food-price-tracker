import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { Navigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-screen h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-8 flex flex-col items-center">
        <Logo size="lg" clickable={false} className="mb-2" />
        <p className="text-gray-600 mb-6 text-center">Track and monitor food prices across different stores</p>
        <button
          onClick={login}
          className="flex cursor-pointer items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors font-semibold shadow-sm mb-2"
        >
          <FcGoogle className="w-5 h-5 mr-3" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Home; 