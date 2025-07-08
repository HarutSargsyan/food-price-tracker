import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FoodPriceTracker from './pages/FoodPriceTracker';
import Home from './pages/Home';
import UserPreferences from './pages/UserPreferences';
import NavBar from './components/NavBar';
import { AuthProvider, useAuth } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <FoodPriceTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preferences"
          element={
            <ProtectedRoute>
              <UserPreferences />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
