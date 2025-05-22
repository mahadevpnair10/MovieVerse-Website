// src/pages/TinderPage.tsx
/** @jsxImportSource @emotion/react */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { css } from '@emotion/react'; // Import css from emotion
import MovieSwipeCard from '../components/MovieSwipeCard';

// Dummy movie data for demonstration
const dummyMoviesToSwipe = [
  {
    id: 'm1',
    title: 'The Cosmic Drift',
    imdbRating: 8.2,
    ourRating: 8.5,
    genre: 'Sci-Fi, Drama',
    description: 'A lone astronaut discovers an anomaly that redefines his understanding of the universe.',
  },
  {
    id: 'm2',
    title: 'Whispers in the Woods',
    imdbRating: 7.5,
    ourRating: 7.9,
    genre: 'Horror, Thriller',
    description: 'A group of friends on a camping trip uncover an ancient, terrifying secret in the forest.',
  },
  {
    id: 'm3',
    title: 'Digital Heartbeat',
    imdbRating: 9.0,
    ourRating: 9.2,
    genre: 'Cyberpunk, Action',
    description: 'In a dystopian future, a hacker fights for justice in a world dominated by mega-corporations.',
  },
  {
    id: 'm4',
    title: 'The Great Outdoors',
    imdbRating: 6.8,
    ourRating: 7.0,
    genre: 'Comedy, Adventure',
    description: 'A family vacation takes an unexpected turn when they encounter eccentric locals.',
  },
  {
    id: 'm5',
    title: 'Lost in Time',
    imdbRating: 8.0,
    ourRating: 8.3,
    genre: 'Fantasy, Mystery',
    description: 'A historian finds himself stranded in a different era with no way back.',
  },
];

const SWIPE_THRESHOLD = 150; // Pixels to swipe before it's considered a full swipe

const TinderPage: React.FC = () => {
  const [movies, setMovies] = useState(dummyMoviesToSwipe);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    // For now, just move to the next movie
    // In a real app, you'd send to backend BEFORE moving to next or handling response
    if (direction === 'right') {
      console.log(`Liked movie: ${movies[currentMovieIndex]?.title}`);
      // TODO: Add to watchlist (backend integration)
    } else {
      console.log(`Disliked movie: ${movies[currentMovieIndex]?.title}`);
    }

    // Move to the next movie in the list, looping if necessary
    setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
    // Reset position for the next card immediately
    setCurrentX(0);
  }, [currentMovieIndex, movies]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(0); // Reset currentX at start of new drag
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
      setCurrentX(0); // Snap back to center
    }
  }, [isDragging, currentX, handleSwipe]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(0);
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
      setCurrentX(0); // Snap back to center
    }
  }, [isDragging, currentX, handleSwipe]);


  // Calculate rotation and opacity for the card based on drag position
  const rotation = currentX * 0.1; // Rotate slightly as it moves
  const opacity = 1 - Math.abs(currentX) / window.innerWidth; // Fade out as it moves off screen

  const currentMovie = movies[currentMovieIndex];

  return (
    <div css={pageStyles.container}>
      <header css={pageStyles.header}>
        <h1 css={pageStyles.title}>Feel a match?</h1>
        <p css={pageStyles.instruction}>Swipe right <span css={pageStyles.arrow}>→</span></p>
      </header>

      <main css={pageStyles.mainContent}>
        {currentMovie ? (
          <div
            ref={cardRef}
            css={pageStyles.swipeCardWrapper(isDragging)} // Apply transition based on dragging
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp} // Important: If mouse leaves while dragging
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <MovieSwipeCard
              {...currentMovie}
              x={currentX}
              rotation={rotation}
              opacity={opacity}
              // onSwipeRight and onSwipeLeft on MovieSwipeCard are now handled by parent
            />
          </div>
        ) : (
          <p css={pageStyles.noMoviesMessage}>No more movies to swipe! Check back later.</p>
        )}

        <div css={pageStyles.actionButtons}>
          <button css={pageStyles.dislikeButton} onClick={() => handleSwipe('left')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button css={pageStyles.likeButton} onClick={() => handleSwipe('right')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
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
    min-height: calc(100vh - 70px);
    background-color: var(--background-dark);
    color: var(--text-light);
    align-items: center;
    padding: 20px;
  `,
  header: css`
    text-align: center;
    margin-bottom: 30px;
    margin-top: 20px;
    width: 100%;
  `,
  title: css`
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
  `,
  instruction: css`
    font-size: 1.2rem;
    color: var(--text-muted);
    margin: 10px 0 0 0;
  `,
  arrow: css`
    margin-left: 5px;
  `,
  mainContent: css`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    padding-bottom: 40px;
    position: relative; /* For absolute positioning of the swipe card */
    min-height: 700px; /* Ensure enough space for the card */
  `,
  swipeCardWrapper: (isDragging: boolean) => css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 380px;
    height: 650px;
    /* Add transition for smooth snap back when not dragging */
    transition: ${isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'};
  `,
  actionButtons: css`
    display: flex;
    gap: 40px;
    margin-top: auto; /* Push buttons to the bottom of mainContent */
    padding-top: 30px; /* Space above buttons */
    z-index: 10; /* Ensure buttons are above the card */
  `,
  likeButton: css`
    background-color: var(--accent-blue);
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);
    &:hover { /* Emotion pseudo-class */
      background-color: #0056b3;
      transform: scale(1.1);
    }
    &:active { /* For click feedback */
      transform: scale(0.95);
    }
  `,
  dislikeButton: css`
    background-color: var(--card-dark);
    color: var(--text-light);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    border: 1px solid var(--border-color);
    cursor: pointer;
    &:hover { /* Emotion pseudo-class */
      background-color: #333;
      transform: scale(1.1);
    }
    &:active { /* For click feedback */
      transform: scale(0.95);
    }
  `,
  noMoviesMessage: css`
    font-size: 1.2rem;
    color: var(--text-muted);
    text-align: center;
    margin-top: 50px;
  `,
};

export default TinderPage;