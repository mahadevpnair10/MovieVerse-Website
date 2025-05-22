// src/components/MovieSwipeCard.tsx
import React from 'react';

interface MovieSwipeCardProps {
  id: string;
  title: string;
  imdbRating: number;
  ourRating: number;
  genre: string;
  description: string;
  posterUrl?: string; // Optional: for a real movie poster
  onSwipeRight?: () => void; // Callback for a "like" action
  onSwipeLeft?: () => void;  // Callback for a "dislike" action
}

const MovieSwipeCard: React.FC<MovieSwipeCardProps> = ({
  id,
  title,
  imdbRating,
  ourRating,
  genre,
  description,
  posterUrl,
  onSwipeRight,
  onSwipeLeft,
}) => {
  return (
    <div style={cardStyles.container}>
      <div style={cardStyles.mediaPlaceholder}>
        {/* In a real app, you'd use <img src={posterUrl} alt={title} /> or a video player */}
        <div style={cardStyles.tempContentStyle}></div> {/* Temporary visual */}
      </div>

      <div style={cardStyles.details}>
        <h3 style={cardStyles.title}>{title}</h3>
        <div style={cardStyles.ratingsContainer}>
          <p style={cardStyles.rating}>IMDB Rating: <span style={cardStyles.ratingValue}>{imdbRating} / 10</span></p>
          <p style={cardStyles.rating}>Our Rating: <span style={cardStyles.ratingValue}>{ourRating} / 10</span></p>
        </div>
        <p style={cardStyles.genre}>Genre: {genre}</p>
        <p style={cardStyles.description}>{description}</p>
      </div>
    </div>
  );
};

const cardStyles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'var(--background-dark)',
    borderRadius: '25px',
    border: '2px solid var(--border-color)',
    width: '100%',
    // --- START MODIFICATION ---
    maxWidth: '380px', // Make it narrower, phone-like width
    // Use a fixed height or min-height for better aspect ratio control on web
    height: '650px', // Adjusted height to be taller, roughly 16:9 aspect ratio in reverse
    // --- END MODIFICATION ---
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
  },
  mediaPlaceholder: {
    width: '100%',
    // --- START MODIFICATION ---
    flexGrow: 1, // Allow this to take up available space in the column
    minHeight: '400px', // Ensure it has a good minimum height for the visual area
    maxHeight: 'calc(100% - 150px)', // Occupy most of the card height, leaving space for details
    // --- END MODIFICATION ---
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--card-dark)',
    borderTopLeftRadius: '23px',
    borderTopRightRadius: '23px',
    overflow: 'hidden',
  },
  tempContentStyle: {
    width: '80%',
    height: '80%',
    backgroundColor: '#333',
    borderRadius: '10px',
  },
  details: {
    padding: '25px',
    backgroundColor: 'var(--card-dark)',
    borderBottomLeftRadius: '23px',
    borderBottomRightRadius: '23px',
    // --- START MODIFICATION ---
    // Ensure details section has a fixed height or grows predictably
    // This allows the media placeholder to fill the rest of the space
    flexShrink: 0, // Prevent shrinking if content is too much
    height: 'auto', // Allow content to dictate height, but responsive
    minHeight: '150px', // Minimum height for details
    // --- END MODIFICATION ---
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
    color: 'var(--text-light)',
  },
  ratingsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    margin: '0',
  },
  ratingValue: {
    fontWeight: 'bold',
    color: 'var(--text-light)',
  },
  genre: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
    margin: '0 0 10px 0',
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

export default MovieSwipeCard;