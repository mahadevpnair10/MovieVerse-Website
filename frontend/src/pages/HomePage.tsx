// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MoodSelector from '../components/MoodSelector';
import MovieRow from '../components/MovieRow';
import { backendApi, useAuth } from '../context/AuthContext'; // Import backendApi and useAuth

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  // Add other fields as per your backend movie model
}

const HomePage: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth(); // You might want to display user info or logout
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topPicks, setTopPicks] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        // Example: Fetching trending movies
        // Assuming your backend has an endpoint like /api/movies/trending/ that requires authentication
        const trendingResponse = await backendApi.get('api/movies/trending/');
        // Example: Fetching top picks
        const topPicksResponse = await backendApi.get('api/movies/top-picks/');

        setTrendingMovies(trendingResponse.data.results.map((m: any) => ({ // Adjust based on your backend response structure
          id: m.id.toString(),
          title: m.title,
          posterUrl: m.poster_url || m.poster || 'https://via.placeholder.com/150x225/1A1A1A/FFFFFF?text=No+Poster',
        })));
        setTopPicks(topPicksResponse.data.results.map((m: any) => ({
          id: m.id.toString(),
          title: m.title,
          posterUrl: m.poster_url || m.poster || 'https://via.placeholder.com/150x225/1A1A1A/FFFFFF?text=No+Poster',
        })));

      } catch (err: any) {
        console.error('Error fetching movies:', err.response?.data || err.message);
        setError(err.response?.data?.detail || 'Failed to load movie data.');
        // If 401/403, PrivateRoute will handle redirection, but you can also explicitly logout
        if (err.response?.status === 401 || err.response?.status === 403) {
            console.log("Session likely expired. Redirecting to login.");
            logout(); // Force a logout on frontend if session is invalid
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if logged in
    if (isLoggedIn) {
      fetchMovies();
    } else {
        setLoading(false); // If not logged in, no data to fetch.
        setError("Please log in to view content.");
    }
  }, [isLoggedIn, logout]); // Depend on isLoggedIn to re-fetch when auth state changes

  const handleSearchSubmit = (term: string) => {
    console.log('Search initiated from Home Page:', term);
    // This would use a backend search API
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-light)'}}>Loading movies...</div>;
  }

  if (error) {
    return <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--error-red)'}}>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} style={{padding: '10px 20px', marginTop: '20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent-blue)', color: 'white', cursor: 'pointer'}}>Retry</button>
    </div>;
  }

  return (
    <div style={pageStyles.container}>
      <Header onSearchSubmit={handleSearchSubmit} />
      <main style={pageStyles.mainContent}>
        <MoodSelector />
        <MovieRow title="TOP PICKS FOR YOU" movies={topPicks} />
        <MovieRow title="Trending Now" movies={trendingMovies} />
      </main>
    </div>
  );
};

const pageStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--background-dark)',
  },
  mainContent: {
    flexGrow: 1,
    paddingBottom: '40px',
  },
};

export default HomePage;