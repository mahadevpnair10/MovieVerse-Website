// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import WatchlistPage from './pages/WatchlistPage';
import TinderPage from './pages/TinderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MoodPage from './pages/MoodPage'; // <-- Import the new page
import NavBar from './components/NavBar';

// Component to conditionally render NavBar
const AppContent: React.FC = () => {
  const location = useLocation();
  const noNavBarPaths = ['/login', '/register'];

  const shouldShowNavBar = !noNavBarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/tinder" element={<TinderPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/mood" element={<MoodPage />} /> {/* <-- Add Mood Route */}
        {/* Add more routes here as needed */}
        <Route path="/movie/:id" element={<div>Movie Detail Page for ID: { /* Use useParams here */ } (Coming Soon!)</div>} />
        {/* Fallback for undefined routes */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
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