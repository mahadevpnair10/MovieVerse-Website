/** @jsxImportSource @emotion/react */
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { backendApi } from '../context/AuthContext';
import WatchlistMovieCard from '../components/WatchlistMovieCard';
import styled from '@emotion/styled';

// Styled Components for theme consistency with HomePage
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-dark);
  color: var(--text-light);
  padding-top: 90px; /* Make space for fixed NavBar at top */
`;

const CardContainer = styled.div`
  background: rgba(30, 34, 54, 0.95);
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
  padding: 32px 32px 24px 32px;
  margin-top: 32px;
  width: 100%;
  max-width: 1200px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  width: 100%;
  margin-top: 16px;
`;

const EmptyState = styled.div`
  color: #b8c1ec;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 48px;
  opacity: 0.85;
  display: flex;
  flex-direction: column;
  align-items: center;
  svg {
    margin-bottom: 16px;
    opacity: 0.7;
  }
`;

const Heading = styled.h2`
  color: #fff;
  font-size: 2.3rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-top: 40px;
  margin-bottom: 0;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
`;

const WatchlistPage: React.FC = () => {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Restore scroll position when coming back from movie details
  useLayoutEffect(() => {
    if (location.state?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition);
      }, 0);
    }
  }, [location.state]);

  const fetchWatchlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      console.log(user.username);
      const response = await backendApi.post('api/watchlist/', { username: user.username });
      setWatchlist(response.data);
      console.log("Inside watchlist data:",response.data)
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return;
    try {
      await backendApi.post(`api/watchlist/remove/${movieId}/`, { username: user.username });
      setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error('Failed to remove movie:', error);
    }
  };

  const handleMovieClick = (movieId: string) => {
    // Store current scroll position before navigating
    const scrollPosition = window.scrollY;
    navigate(`/movies/${movieId}`, {
      state: { 
        fromWatchlistPage: true,
        scrollPosition: scrollPosition 
      }
    });
  };

  useEffect(() => {
    if (user && isLoggedIn) {
      fetchWatchlist();
    }
  }, [user, isLoggedIn]);

  if (authLoading) {
    return <p style={{ textAlign: 'center' }}>Checking authentication...</p>;
  }

  if (!isLoggedIn) {
    return <p style={{ textAlign: 'center' }}>Please log in to view your watchlist.</p>;
  }

  return (
    <PageContainer>
      <Heading>My Watchlist</Heading>
      <CardContainer>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#b8c1ec', marginTop: 40 }}>Loading...</p>
        ) : watchlist.length === 0 ? (
          <EmptyState>
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24"><path fill="#b8c1ec" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <span>No movies in your watchlist yet.<br/>Start adding some!</span>
          </EmptyState>
        ) : (
          <GridContainer>
            {watchlist.map((movie) => (
              <WatchlistMovieCard
                key={movie.id}
                watchlistId={movie.id?.toString() || movie.watchlistId?.toString() || ''}
                movieId={movie.movie_id?.toString() || movie.movieId?.toString() || ''}
                title={movie.title}
                description={movie.description}
                posterUrl={movie.poster_url || movie.posterUrl}
                genres={movie.genres || []}
                ourRating={movie.our_rating}
                imdbRating={movie.imdb_rating}
                onRemove={() => removeFromWatchlist(movie.id)}
                onMovieClick={handleMovieClick}
              />
            ))}
          </GridContainer>
        )}
      </CardContainer>
    </PageContainer>
  );
};

export default WatchlistPage;
