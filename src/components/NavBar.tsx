import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="hidden sm:flex items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            <Logo size="md" />
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `font-semibold text-lg px-2 py-2 rounded ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/preferences"
              className={({ isActive }) =>
                `font-semibold text-lg px-2 py-2 rounded ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
              }
            >
              Preferences
            </NavLink>
          </div>
          {user && (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex items-center justify-between">
          <Logo size="md" />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `font-semibold text-base px-4 py-3 rounded-md ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/preferences"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `font-semibold text-base px-4 py-3 rounded-md ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`
                }
              >
                Preferences
              </NavLink>
              {user && (
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-md font-semibold transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar; 