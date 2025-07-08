import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-6 justify-between">
        <div className="flex items-center gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `font-semibold text-lg ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/preferences"
            className={({ isActive }) =>
              `font-semibold text-lg ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
            }
          >
            Preferences
          </NavLink>
        </div>
        {user && (
          <button
            onClick={logout}
            className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar; 