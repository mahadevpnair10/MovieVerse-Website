// src/components/MovieRow.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Movie {
  id: string;
  title: string;
  posterUrl: string; // Placeholder for actual poster image URL
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  return (
    <section style={movieRowStyles.container}>
      <h2 style={movieRowStyles.title}>{title}</h2>
      <div style={movieRowStyles.moviesScrollContainer}>
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} style={movieRowStyles.movieCard}>
            <div style={movieRowStyles.posterPlaceholder}>
              {/* In a real app, use <img src={movie.posterUrl} alt={movie.title} /> */}
              <div style={movieRowStyles.tempPosterStyle}></div> {/* Temporary visual */}
            </div>
            <p style={movieRowStyles.movieTitle}>{movie.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

const movieRowStyles: { [key: string]: React.CSSProperties } = {
  container: {
    margin: '20px auto', // Center the section
    width: '100%',
    maxWidth: '1200px', // Constrain width for larger screens
    padding: '0 20px', // Add padding for content
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: 'var(--text-light)',
  },
  moviesScrollContainer: {
    display: 'flex',
    overflowX: 'auto', // Enable horizontal scrolling
    paddingBottom: '15px', // Space for scrollbar
    scrollbarWidth: 'thin', // For Firefox
    scrollbarColor: 'var(--text-muted) var(--card-dark)', // For Firefox
    WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
  },
  movieCard: {
    flexShrink: 0, // Prevent items from shrinking
    width: '150px', // Fixed width for each movie card
    marginRight: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'transform 0.2s ease',
  },
  posterPlaceholder: {
    width: '100%',
    paddingTop: '150%', // Aspect ratio for vertical posters (e.g., 2:3)
    backgroundColor: 'var(--card-dark)',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '8px',
  },
  tempPosterStyle: { // A temporary visual for the placeholder
    width: '80%',
    height: '80%',
    backgroundColor: '#333',
    borderRadius: '5px',
  },
  movieTitle: {
    fontSize: '0.9rem',
    color: 'var(--text-light)',
    margin: 0,
  },
};

// Custom scrollbar for Webkit browsers
const styleElement = document.createElement('style');
styleElement.innerHTML = `
.moviesScrollContainer::-webkit-scrollbar {
  height: 8px;
}

.moviesScrollContainer::-webkit-scrollbar-track {
  background: var(--card-dark);
  border-radius: 10px;
}

.moviesScrollContainer::-webkit-scrollbar-thumb {
  background: var(--text-muted);
  border-radius: 10px;
}

.moviesScrollContainer::-webkit-scrollbar-thumb:hover {
  background: var(--text-light);
}
`;
document.head.appendChild(styleElement);

// Hover effects
movieRowStyles.movieCard[':hover'] = {
  transform: 'scale(1.05)',
};

export default MovieRow;