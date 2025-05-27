/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import MoodSelector from '../components/MoodSelector';
import MovieRow from '../components/MovieRow';
import SearchResultsOverlay from '../components/SearchResultsOverlay';
import { backendApi, useAuth } from '../context/AuthContext';
import { useMovieData } from '../context/MovieDataContext';
import styled from '@emotion/styled';

// Define the Movie interface
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  description?: string;
  genres?: string[];
}

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-dark);
  color: var(--text-light);
  padding-top: 120px; /* Increased from 70px to 120px to account for both navbar and header */
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding-bottom: 40px;
  margin-top: 20px; /* Add extra margin for breathing room */
`;

const CenteredMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px); /* Adjusted for new padding */
  color: var(--text-light);
  font-size: 1.2rem;
  text-align: center;
  padding: 20px;
`;

const ErrorContainer = styled(CenteredMessage)`
  color: var(--error-red);
  font-size: 1.1rem;
`;

const RetryButton = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 8px;
  border: none;
  background-color: var(--accent-blue);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Utility function to remove duplicates from movie array
const removeDuplicateMovies = (movies: Movie[]): Movie[] => {
  const seen = new Set<string>();
  return movies.filter(movie => {
    if (seen.has(movie.id)) {
      return false; // Skip duplicate
    }
    seen.add(movie.id);
    return true; // Keep first occurrence
  });
};

const HomePage: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    trendingMovies, 
    topPicks, 
    setTrendingMovies, 
    setTopPicks, 
    isCached 
  } = useMovieData();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const hasFetched = useRef(false);

  // Check for search query in URL on component mount
  useEffect(() => {
    const query = searchParams.get('q');
    console.log('URL search query:', query);
    if (query && query.trim()) {
      console.log('Setting search from URL:', query);
      setSearchTerm(query.trim());
      setIsSearchVisible(true);
    }
  }, [searchParams]);

  // Debug log for search visibility state
  useEffect(() => {
    console.log('Search visibility state changed:', isSearchVisible, 'Search term:', searchTerm);
  }, [isSearchVisible, searchTerm]);

  // Restore scroll position when coming back from movie details
  useLayoutEffect(() => {
    if (location.state?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition);
      }, 0);
    }
  }, [location.state]);

  useEffect(() => {
    // Skip fetch if data is already cached and available
    if (isCached && trendingMovies.length > 0 && topPicks.length > 0) {
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const trendingResponse = await backendApi.get('api/Trending/');

        if (!user?.username) {
          setError("User information not available for personalized recommendations.");
          setLoading(false);
          return;
        }

        const topPicksResponse = await backendApi.get('api/recommendations/from-ratings/', {
          params: { username: user.username },
        });

        const processedTrending = trendingResponse.data.map((m: any) => ({
          id: m.id.toString(),
          title: m.title,
          posterUrl: (m.poster_url && m.poster_url.startsWith('http')) ? m.poster_url : `https://image.tmdb.org/t/p/original/${m.poster_url}`,
        }));

        const processedTopPicks = topPicksResponse.data.recommendations ? 
          topPicksResponse.data.recommendations.map((m: any) => ({
            id: m.id.toString(),
            title: m.title,
            posterUrl: (m.poster_url && m.poster_url.startsWith('http')) ? m.poster_url : `https://image.tmdb.org/t/p/original/${m.poster_url}`,
          })) : [];

        // Remove duplicates from both arrays
        const uniqueTrendingMovies = removeDuplicateMovies(processedTrending);
        const uniqueTopPicks = removeDuplicateMovies(processedTopPicks);

        console.log('Original trending count:', processedTrending.length);
        console.log('Deduplicated trending count:', uniqueTrendingMovies.length);
        console.log('Original top picks count:', processedTopPicks.length);
        console.log('Deduplicated top picks count:', uniqueTopPicks.length);

        setTrendingMovies(uniqueTrendingMovies);
        setTopPicks(uniqueTopPicks);

      } catch (err: any) {
        console.error('Error fetching movies:', err.response?.data || err.message);
        setError(err.response?.data?.detail || 'Failed to load movie data. Please try again.');

        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && user) {
      fetchMovies();
    } else if (!isLoggedIn) {
      setLoading(false);
      setError(null);
    }
  }, [isLoggedIn, user, logout, isCached, trendingMovies.length, topPicks.length, setTrendingMovies, setTopPicks]);

  const handleSearchSubmit = (term: string) => {
    console.log('🔍 HomePage: Search initiated with term:', term);
    
    if (!term || !term.trim()) {
      console.log('❌ Empty search term, aborting');
      return;
    }

    const trimmedTerm = term.trim();
    console.log('✅ Setting search term:', trimmedTerm);
    console.log('✅ Setting search visible to true');
    
    // Set state
    setSearchTerm(trimmedTerm);
    setIsSearchVisible(true);
    
    // Update URL with search query
    setSearchParams({ q: trimmedTerm });
  };

  const handleSearchClose = () => {
    console.log('❌ Closing search overlay');
    setIsSearchVisible(false);
    setSearchTerm('');
    setSearchParams({});
  };

  const handleMovieClick = (movieId: string) => {
    const scrollPosition = window.scrollY;
    navigate(`/movies/${movieId}`, {
      state: { 
        fromHomePage: true,
        scrollPosition: scrollPosition 
      }
    });
  };

  const handleSearchMovieClick = (movieId: string) => {
    const scrollPosition = window.scrollY;
    navigate(`/movies/${movieId}`, {
      state: { 
        fromSearchResults: true,
        scrollPosition: scrollPosition,
        searchTerm: searchTerm
      }
    });
  };

  if (loading) {
    return <CenteredMessage>Loading movies...</CenteredMessage>;
  }

  if (error) {
    return (
      <ErrorContainer>
        <p>Error: {error}</p>
        <RetryButton onClick={() => window.location.reload()}>Retry</RetryButton>
      </ErrorContainer>
    );
  }

  if (!isLoggedIn) {
    return (
      <CenteredMessage>
        You must be logged in to view movies.
      </CenteredMessage>
    );
  }

  return (
    <PageContainer>
      <Header onSearchSubmit={handleSearchSubmit} />
      <MainContent>
        <MoodSelector />
        <MovieRow 
          title="TOP PICKS FOR YOU" 
          movies={topPicks} 
          onMovieClick={handleMovieClick}
        />
        <MovieRow 
          title="Trending Now" 
          movies={trendingMovies} 
          onMovieClick={handleMovieClick}
        />
      </MainContent>
      
      <SearchResultsOverlay
        searchTerm={searchTerm}
        isVisible={isSearchVisible}
        onClose={handleSearchClose}
        onMovieClick={handleSearchMovieClick}
      />
    </PageContainer>
  );
};

export default HomePage;
