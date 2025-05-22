// src/components/WatchlistMovieCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface WatchlistMovieCardProps {
  id: string;
  title: string;
  ourRating: number;
  imdbRating: number;
  genre: string;
  description: string;
  posterUrl?: string; // Optional: real poster URL
}

const WatchlistMovieCard: React.FC<WatchlistMovieCardProps> = ({
  id,
  title,
  ourRating,
  imdbRating,
  genre,
  description,
  posterUrl,
}) => {
  return (
    <Link to={`/movie/${id}`} style={cardStyles.container}>
      <div style={cardStyles.posterWrapper}>
        {posterUrl ? (
          <img src={posterUrl} alt={title} style={cardStyles.posterImage} />
        ) : (
          <div style={cardStyles.posterPlaceholder}>
            <div style={cardStyles.tempPosterStyle}></div>
          </div>
        )}
      </div>
      <div style={cardStyles.details}>
        <h3 style={cardStyles.title}>{title}</h3>
        <p style={cardStyles.rating}>Our Rating: <span style={cardStyles.ratingValue}>{ourRating} / 10</span></p>
        <p style={cardStyles.rating}>IMDB Rating: <span style={cardStyles.ratingValue}>{imdbRating} / 10</span></p>
        <p style={cardStyles.genre}>Genre: {genre}</p>
        <p style={cardStyles.description}>{description}</p>
      </div>
    </Link>
  );
};

const cardStyles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'var(--card-dark)',
    borderRadius: '15px',
    padding: '20px',
    display: 'flex',
    gap: '20px', // Space between poster and details
    alignItems: 'flex-start',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    textDecoration: 'none', // Remove underline from Link
    color: 'var(--text-light)', // Inherit text color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow
  },
  posterWrapper: {
    flexShrink: 0, // Prevent poster from shrinking
    width: '120px', // Fixed width for poster on web
    height: '180px', // Standard poster aspect ratio (2:3)
    overflow: 'hidden',
    borderRadius: '8px',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempPosterStyle: {
    width: '70%',
    height: '70%',
    backgroundColor: '#555',
    borderRadius: '5px',
  },
  details: {
    flexGrow: 1, // Allow details to take remaining space
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: 'var(--text-light)',
  },
  rating: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    margin: '3px 0',
  },
  ratingValue: {
    fontWeight: 'bold',
    color: 'var(--text-light)',
  },
  genre: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    margin: '3px 0 10px 0',
  },
  description: {
    fontSize: '0.9rem',
    color: 'var(--text-light)',
    margin: 0,
    lineHeight: '1.4',
    maxHeight: '4.2em', // Limit description to 3 lines (1.4 * 3)
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
};

// Hover effects
cardStyles.container[':hover'] = {
  backgroundColor: '#2b2b2b',
  transform: 'translateY(-3px)',
};

export default WatchlistMovieCard;