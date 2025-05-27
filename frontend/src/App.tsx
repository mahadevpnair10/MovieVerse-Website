import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MovieDataProvider } from './context/MovieDataContext';
import { TinderDataProvider } from './context/TinderDataContext';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import TinderPage from './pages/TinderPage';
import MoodPage from './pages/MoodPage';
import MoodRecommendationsPage from './pages/MoodRecommendationsPage'; // Add this import
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';

const App: React.FC = () => {
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setNavVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setNavVisible(false); // scrolling down
      } else {
        setNavVisible(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AuthProvider>
      <MovieDataProvider>
        <TinderDataProvider>
          <Router>
            <NavBar isVisible={navVisible} />
            <Routes>

              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />}/>
              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <PrivateRoute>
                    <WatchlistPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tinder"
                element={
                  <PrivateRoute>
                    <TinderPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/mood"
                element={
                  <PrivateRoute>
                    <MoodPage />
                  </PrivateRoute>
                }
              />
              {/* Add Mood Recommendations Route */}
              <Route
                path="/mood-recommendations"
                element={
                  <PrivateRoute>
                    <MoodRecommendationsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              {/* Movie Details Route */}
              <Route
                path="/movies/:id"
                element={
                  <PrivateRoute>
                    <MovieDetailsPage />
                  </PrivateRoute>
                }
              />

              {/* Fallback route for unknown paths */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </TinderDataProvider>
      </MovieDataProvider>
    </AuthProvider>
  );
};

export default App;
