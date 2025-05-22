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

// Component to conditionally render NavBar and handle its visibility
const AppContent: React.FC = () => {
  const location = useLocation();
  const noNavBarPaths = ['/login', '/register']; // Paths where NavBar should never appear

  // State to control NavBar visibility
  const [isNavBarVisible, setIsNavBarVisible] = useState(true);
  const lastScrollY = useRef(0); // To track previous scroll position

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isAuthPage = noNavBarPaths.includes(location.pathname);

      if (isAuthPage) {
        // NavBar should NEVER appear on login/register pages
        setIsNavBarVisible(false);
        return;
      }

      // Logic for show/hide on scroll
      if (currentScrollY === 0) {
        // Always show if at the very top of the page
        setIsNavBarVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down, hide NavBar
        setIsNavBarVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up, show NavBar
        setIsNavBarVisible(true);
      }

      lastScrollY.current = currentScrollY; // Update last scroll Y
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check when component mounts or location changes
    // This is important for correct initial state when navigating directly
    // to a page or refreshing.
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, noNavBarPaths]); // Re-run effect when path or noNavBarPaths changes

  return (
    <>
      {/* Pass isVisible prop to NavBar */}
      <NavBar isVisible={isNavBarVisible} />
      {/* Add a div with padding-top to prevent content from being hidden behind the fixed NavBar */}
      <div style={{ paddingTop: isNavBarVisible && !noNavBarPaths.includes(location.pathname) ? '80px' : '0' }}>
         {/* Adjust 80px to the actual height of your NavBar + any desired spacing */}
         <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path="/search" element={<SearchPage />} />
           <Route path="/watchlist" element={<WatchlistPage />} />
           <Route path="/tinder" element={<TinderPage />} />
           <Route path="/login" element={<LoginPage />} />
           <Route path="/register" element={<RegisterPage />} />
           <Route path="/profile" element={<ProfilePage />} />
           <Route path="/mood" element={<MoodPage />} />
           {/* Fallback for undefined routes */}
           <Route path="*" element={<div>404 - Page Not Found</div>} />
         </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;