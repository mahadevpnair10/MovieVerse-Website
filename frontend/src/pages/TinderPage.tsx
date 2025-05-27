/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { css } from '@emotion/react';
import { backendApi, useAuth } from '../context/AuthContext';
import { useTinderData } from '../context/TinderDataContext';
import MovieSwipeCard from '../components/MovieSwipeCard';

// Define the Movie interface based on your Django model
interface Movie {
  id: number;
  title: string;
  year?: number;
  genre?: string;
  director?: string;
  description?: string;
  imdb_rating?: number;
  poster_url?: string;
  created_at?: string;
}

const SWIPE_THRESHOLD = 150;

const TinderPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    movies, 
    currentMovieIndex, 
    setMovies, 
    setCurrentMovieIndex, 
    isCached 
  } = useTinderData();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);

  // Restore scroll position when coming back from movie details
  useLayoutEffect(() => {
    if (location.state?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition);
      }, 0);
    }
  }, [location.state]);

  // Fetch movies from backend
  const fetchTinderMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await backendApi.get('api/TinderMovies/');
      console.log(response.data);
      setMovies(response.data);
      setCurrentMovieIndex(0);
    } catch (error) {
      console.error('Error fetching tinder movies:', error);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add movie to watchlist
  const addToWatchlist = async (movieId: number): Promise<boolean> => {
    if (!user?.username) {
      console.error('User not authenticated');
      return false;
    }

    try {
      setAddingToWatchlist(true);
      const response = await backendApi.post('api/watchlist/add/', {
        username: user.username,
        movie_id: movieId
      });
      
      console.log('Movie added to watchlist:', response.data);
      return true;
    } catch (error: any) {
      console.error('Error adding movie to watchlist:', error);
      
      if (error.response?.data?.message === "Movie already in watchlist") {
        console.log('Movie already in watchlist');
        return true;
      }
      
      setError('Failed to add movie to watchlist. Please try again.');
      setTimeout(() => setError(null), 3000);
      return false;
    } finally {
      setAddingToWatchlist(false);
    }
  };

  // Fetch movie poster
  const fetchMoviePoster = async (movieTitle: string): Promise<string | null> => {
    try {
      console.log("trying...");
      const response = await backendApi.get(`api/getMoviePoster/${encodeURIComponent(movieTitle)}/`);
      console.log('Poster data:', response.data);
      return response.data.poster_url || null;
    } catch (error) {
      console.error('Error fetching movie poster:', error);
      return null;
    }
  };

  // Load movies on component mount
  useEffect(() => {
    if (isCached && movies.length > 0) {
      return;
    }
    fetchTinderMovies();
  }, [isCached, movies.length]);

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    const currentMovie = movies[currentMovieIndex];
    if (!currentMovie) return;

    setHasSwiped(true);

    if (direction === 'right') {
      console.log(`Liked movie: ${currentMovie.title}`);
      
      const success = await addToWatchlist(currentMovie.id);
      
      if (success) {
        console.log(`${currentMovie.title} added to watchlist!`);
      }
    } else {
      console.log(`Disliked movie: ${currentMovie.title}`);
    }

    if (currentMovieIndex + 1 >= movies.length) {
      await fetchTinderMovies();
    } else {
      setCurrentMovieIndex(currentMovieIndex + 1);
    }
    
    setCurrentX(0);
    setTimeout(() => setHasSwiped(false), 100);
  }, [currentMovieIndex, movies, setCurrentMovieIndex, user?.username]);

  const handleMovieClick = () => {
    if (hasSwiped) return;
    
    const currentMovie = movies[currentMovieIndex];
    if (!currentMovie) return;

    const scrollPosition = window.scrollY;
    navigate(`/movies/${currentMovie.id}`, {
      state: { 
        fromTinderPage: true,
        scrollPosition: scrollPosition,
        tinderIndex: currentMovieIndex
      }
    });
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(0);
    setHasSwiped(false);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setCurrentX(deltaX);
  }, [isDragging, startX]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    if (Math.abs(currentX) > SWIPE_THRESHOLD) {
      handleSwipe(currentX > 0 ? 'right' : 'left');
    } else {
      setCurrentX(0);
      setHasSwiped(false);
    }
  }, [currentX, handleSwipe]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(0);
    setHasSwiped(false);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    setCurrentX(deltaX);
  }, [isDragging, startX]);

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (Math.abs(currentX) > SWIPE_THRESHOLD) {
      handleSwipe(currentX > 0 ? 'right' : 'left');
    } else {
      setCurrentX(0);
      setHasSwiped(false);
    }
  }, [currentX, handleSwipe]);

  const rotation = currentX * 0.1;
  const opacity = 1 - Math.abs(currentX) / window.innerWidth;

  const currentMovie = movies[currentMovieIndex];

  // Loading state
  if (loading) {
    return (
      <div css={pageStyles.container}>
        <div css={pageStyles.loadingContainer}>
          <div css={pageStyles.spinner}></div>
          <p css={pageStyles.loadingText}>Loading movies...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div css={pageStyles.container}>
        <div css={pageStyles.errorContainer}>
          <p css={pageStyles.errorText}>{error}</p>
          <button css={pageStyles.retryButton} onClick={fetchTinderMovies}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div css={pageStyles.container}>
      <header css={pageStyles.header}>
        <h1 css={pageStyles.title}>Feel a match?</h1>
        <p css={pageStyles.instruction}>
          Swipe right to add to watchlist <span css={pageStyles.arrow}>→</span>
        </p>
        <p css={pageStyles.subInstruction}>
          Tap on card to view details
        </p>
      </header>

      {/* Show adding to watchlist feedback */}
      {addingToWatchlist && (
        <div css={pageStyles.feedbackContainer}>
          <div css={pageStyles.feedbackMessage}>
            <div css={pageStyles.feedbackSpinner}></div>
            Adding to watchlist...
          </div>
        </div>
      )}

      <main css={pageStyles.mainContent}>
        {currentMovie ? (
          <div
            ref={cardRef}
            css={pageStyles.swipeCardWrapper(isDragging)}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <MovieSwipeCard
              movie={currentMovie}
              x={currentX}
              rotation={rotation}
              opacity={opacity}
              fetchPoster={fetchMoviePoster}
              onMovieClick={handleMovieClick}
            />
          </div>
        ) : (
          <div css={pageStyles.noMoviesContainer}>
            <p css={pageStyles.noMoviesMessage}>No more movies to swipe!</p>
            <button css={pageStyles.reloadButton} onClick={fetchTinderMovies}>
              Load More Movies
            </button>
          </div>
        )}

        <div css={pageStyles.actionButtons}>
          <button 
            css={pageStyles.dislikeButton} 
            onClick={() => handleSwipe('left')}
            disabled={addingToWatchlist}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button 
            css={pageStyles.likeButton} 
            onClick={() => handleSwipe('right')}
            disabled={addingToWatchlist}
          >
            {addingToWatchlist ? (
              <div css={pageStyles.buttonSpinner}></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

const pageStyles = {
  container: css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--background-dark) 0%, rgba(15, 17, 27, 0.95) 100%);
    color: var(--text-light);
    align-items: center;
    padding: 20px;
    padding-top: 100px;
    position: relative;
    overflow-x: hidden;
  `,
  
  header: css`
    text-align: center;
    margin-bottom: 50px;
    margin-top: 20px;
    width: 100%;
    max-width: 500px;
    z-index: 10;
  `,
  
  title: css`
    font-size: 3.2rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: 1.5px;
    background: linear-gradient(135deg, #fff 0%, #b8c1ec 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: 2.6rem;
    }
  `,
  
  instruction: css`
    font-size: 1.4rem;
    color: #b8c1ec;
    margin: 20px 0 0 0;
    font-weight: 500;
    opacity: 0.9;
  `,
  
  subInstruction: css`
    font-size: 1.1rem;
    color: #888;
    margin: 8px 0 0 0;
    opacity: 0.8;
    font-weight: 400;
  `,
  
  arrow: css`
    margin-left: 8px;
    font-weight: 700;
    color: #007BFF;
  `,
  
  feedbackContainer: css`
    position: fixed;
    top: 130px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: linear-gradient(135deg, rgba(50, 200, 50, 0.95), rgba(40, 180, 40, 0.95));
    color: white;
    padding: 16px 28px;
    border-radius: 35px;
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    font-weight: 600;
    font-size: 1.1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  `,
  
  feedbackMessage: css`
    display: flex;
    align-items: center;
    gap: 14px;
  `,
  
  feedbackSpinner: css`
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  
  mainContent: css`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 500px;
    padding: 0 15px;
    position: relative;
  `,
  
  swipeCardWrapper: (isDragging: boolean) => css`
    cursor: ${isDragging ? 'grabbing' : 'grab'};
    user-select: none;
    touch-action: none;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    position: relative;
    height: 650px;
    filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.6));
    transition: ${isDragging ? 'none' : 'filter 0.3s ease'};
    
    &:hover {
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.7));
    }
    
    @media (max-width: 768px) {
      max-width: 350px;
      height: 580px;
    }
  `,
  
  noMoviesContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    margin-top: 60px;
    text-align: center;
  `,
  
  noMoviesMessage: css`
    font-size: 1.8rem;
    color: #b8c1ec;
    font-weight: 600;
    line-height: 1.4;
  `,
  
  reloadButton: css`
    background: linear-gradient(135deg, #32c852, #28a745);
    border: none;
    padding: 16px 32px;
    border-radius: 35px;
    cursor: pointer;
    color: white;
    font-size: 1.2rem;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(50, 200, 50, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(50, 200, 50, 0.5);
    }

    &:active {
      transform: translateY(0);
    }
  `,
  
  actionButtons: css`
    display: flex;
    justify-content: center;
    margin-top: 40px;
    gap: 60px;
    width: 100%;
    max-width: 400px;
    
    @media (max-width: 768px) {
      gap: 50px;
      margin-top: 35px;
    }
  `,
  
  likeButton: css`
    background: linear-gradient(135deg, #32c852, #28a745);
    border: none;
    padding: 20px;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    box-shadow: 0 8px 20px rgba(50, 200, 50, 0.5);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 75px;
    height: 75px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    &:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 12px 25px rgba(50, 200, 50, 0.6);
      
      &:before {
        left: 100%;
      }
    }

    &:active:not(:disabled) {
      transform: translateY(-1px) scale(1.02);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `,
  
  dislikeButton: css`
    background: linear-gradient(135deg, #ff4757, #ff3742);
    border: none;
    padding: 20px;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    box-shadow: 0 8px 20px rgba(255, 50, 50, 0.5);
    transition: all 0.3s ease;
    width: 75px;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    &:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 12px 25px rgba(255, 50, 50, 0.6);
      
      &:before {
        left: 100%;
      }
    }

    &:active:not(:disabled) {
      transform: translateY(-1px) scale(1.02);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `,
  
  buttonSpinner: css`
    width: 26px;
    height: 26px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  
  // Loading styles
  loadingContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 500px;
    gap: 30px;
  `,
  
  spinner: css`
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.1);
    border-top: 5px solid #32c852;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  
  loadingText: css`
    font-size: 1.4rem;
    color: #b8c1ec;
    font-weight: 500;
  `,
  
  // Error styles
  errorContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 500px;
    gap: 30px;
    text-align: center;
  `,
  
  errorText: css`
    font-size: 1.4rem;
    color: #ff4757;
    font-weight: 500;
    line-height: 1.4;
  `,
  
  retryButton: css`
    background: linear-gradient(135deg, #ff4757, #ff3742);
    border: none;
    padding: 16px 32px;
    border-radius: 35px;
    cursor: pointer;
    color: white;
    font-size: 1.2rem;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(255, 50, 50, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(255, 50, 50, 0.5);
    }

    &:active {
      transform: translateY(0);
    }
  `,
};

export default TinderPage;
