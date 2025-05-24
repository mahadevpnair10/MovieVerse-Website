// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import WatchlistPage from './pages/WatchlistPage';
import TinderPage from './pages/TinderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MoodPage from './pages/MoodPage';
import NavBar from './components/NavBar';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// AppContent and App structure remain the same as before
const AppContent: React.FC = () => {
  const location = useLocation();
  const noNavBarPaths = ['/login', '/register'];

  const [isNavBarVisible, setIsNavBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isAuthPage = noNavBarPaths.includes(location.pathname);

      if (isAuthPage) {
        setIsNavBarVisible(false);
        return;
      }

      if (currentScrollY === 0) {
        setIsNavBarVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsNavBarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsNavBarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, noNavBarPaths]);

  return (
    <>
      <NavBar isVisible={isNavBarVisible && !noNavBarPaths.includes(location.pathname)} />
      <div style={{ paddingTop: isNavBarVisible && !noNavBarPaths.includes(location.pathname) ? '80px' : '0' }}>
         <Routes>
           <Route path="/login" element={<LoginPage />} />
           <Route path="/register" element={<RegisterPage />} />

           <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
           <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
           <Route path="/watchlist" element={<PrivateRoute><WatchlistPage /></PrivateRoute>} />
           <Route path="/tinder" element={<PrivateRoute><TinderPage /></PrivateRoute>} />
           <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
           <Route path="/mood" element={<PrivateRoute><MoodPage /></PrivateRoute>} />
           <Route path="*" element={<div>404 - Page Not Found</div>} />
         </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;