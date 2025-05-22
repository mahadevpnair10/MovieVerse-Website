// src/pages/TinderPage.tsx
import React, { useState } from 'react';
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
];

const TinderPage: React.FC = () => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  const handleSwipeRight = () => {
    console.log(`Liked movie: ${dummyMoviesToSwipe[currentMovieIndex].title}`);
    // In a real app: Send "like" to Django backend, then move to next movie
    setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % dummyMoviesToSwipe.length);
  };

  const handleSwipeLeft = () => {
    console.log(`Disliked movie: ${dummyMoviesToSwipe[currentMovieIndex].title}`);
    // In a real app: Send "dislike" to Django backend, then move to next movie
    setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % dummyMoviesToSwipe.length);
  };

  const currentMovie = dummyMoviesToSwipe[currentMovieIndex];

  return (
    <div style={pageStyles.container}>
      <header style={pageStyles.header}>
        <h1 style={pageStyles.title}>Feel a match?</h1>
        <p style={pageStyles.instruction}>Swipe right <span style={pageStyles.arrow}>→</span></p>
      </header>

      <main style={pageStyles.mainContent}> {/* This div now acts as the centered container */}
        {currentMovie ? (
          <MovieSwipeCard
            {...currentMovie}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
          />
        ) : (
          <p style={pageStyles.noMoviesMessage}>No more movies to swipe! Check back later.</p>
        )}

        <div style={pageStyles.actionButtons}>
          <button style={pageStyles.dislikeButton} onClick={handleSwipeLeft}>
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
          <button style={pageStyles.likeButton} onClick={handleSwipeRight}>
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

const pageStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 70px)', // Adjust for NavBar height
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-light)',
    alignItems: 'center', // Center content horizontally on the page
    padding: '20px', // General padding
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    marginTop: '20px',
    width: '100%', // Ensure header takes full width to respect maxWidth on mainContent
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0',
  },
  instruction: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    margin: '10px 0 0 0',
  },
  arrow: {
    marginLeft: '5px',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Center card vertically
    width: '100%',
    // --- START MODIFICATION ---
    maxWidth: '450px', // Constrain the main content area (including card and buttons)
    margin: '0 auto', // Center the main content area horizontally
    // --- END MODIFICATION ---
    paddingBottom: '40px', // Space for action buttons
  },
  actionButtons: {
    display: 'flex',
    gap: '40px',
    marginTop: '30px',
  },
  likeButton: {
    backgroundColor: 'var(--accent-blue)',
    color: 'white',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2rem',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    boxShadow: '0 4px 10px rgba(0, 123, 255, 0.4)',
  },
  dislikeButton: {
    backgroundColor: 'var(--card-dark)',
    color: 'var(--text-light)',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2rem',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    border: '1px solid var(--border-color)',
  },
  noMoviesMessage: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
  }
};

// Hover effects for buttons
pageStyles.likeButton[':hover'] = {
  backgroundColor: '#0056b3', // Darken on hover
  transform: 'scale(1.1)',
};
pageStyles.dislikeButton[':hover'] = {
  backgroundColor: '#333', // Slightly lighter on hover
  transform: 'scale(1.1)',
};

export default TinderPage;