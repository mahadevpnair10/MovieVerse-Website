/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

// Updated interface to include onMovieClick prop
interface WatchlistMovieCardProps {
  watchlistId: string; // The ID of the watchlist entry itself (for removal)
  movieId: string;     // The actual movie ID (for linking to /movie/:id)
  title: string;
  description: string;
  posterUrl?: string;  // Optional, as before
  genres: string[];    // Changed to array of strings as per your backend
  ourRating?: number;  // Made optional, as not directly returned by view_watchlist
  imdbRating?: number; // Made optional, as not directly returned by view_watchlist
  onRemove: (watchlistId: string) => void; // Callback for removing the movie
  onMovieClick?: (movieId: string) => void; // Callback for movie click navigation
}

const WatchlistMovieCard: React.FC<WatchlistMovieCardProps> = ({
  watchlistId,
  movieId,
  title,
  description,
  posterUrl,
  genres,
  ourRating,
  imdbRating,
  onRemove,
  onMovieClick,
}) => {
  const handleMovieClick = () => {
    if (onMovieClick) {
      onMovieClick(movieId);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the movie click
    onRemove(watchlistId);
  };

  return (
    <div css={cardWrapperStyle}> {/* Wrapper div to contain both clickable area and button */}
      <div css={containerStyle} onClick={handleMovieClick}> {/* Clickable div instead of Link */}
        <div css={posterWrapperStyle}>
          {posterUrl ? (
            <img src={`https://image.tmdb.org/t/p/w500/${posterUrl}`} alt={title} css={posterImageStyle} />
          ) : (
            <div css={posterPlaceholderStyle}>
              <div css={tempPosterStyle}></div>
            </div>
          )}
        </div>
        <div css={detailsStyle}>
          <h3 css={titleStyle}>{title}</h3>
          {/* Render ratings only if they are provided */}
          {ourRating !== undefined && (
            <p css={ratingStyle}>
              Our Rating: <span css={ratingValueStyle}>{ourRating} / 10</span>
            </p>
          )}
          {imdbRating !== undefined && (
            <p css={ratingStyle}>
              IMDb Rating: <span css={ratingValueStyle}>{imdbRating} / 10</span>
            </p>
          )}
          {/* Render genres, joining array elements with comma */}
          {genres && genres.length > 0 && <p css={genreStyle}>Genre: {genres.join(', ')}</p>}
          <p css={descriptionStyle}>{description}</p>
        </div>
      </div>
      {/* Remove Button */}
      <button
        onClick={handleRemoveClick}
        css={removeButtonStyle}
        aria-label={`Remove ${title} from watchlist`}
      >
        Remove
      </button>
    </div>
  );
};

// ------------------- Styles -------------------

const cardWrapperStyle = css({
  position: 'relative', // For positioning the remove button
  backgroundColor: 'var(--card-dark)',
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.2s ease, transform 0.1s ease',
  overflow: 'hidden', // Ensures button doesn't overflow if positioned outside
  display: 'flex',
  flexDirection: 'column', // Align content vertically
  '&:hover': {
    backgroundColor: '#2b2b2b',
    transform: 'translateY(-3px)',
  },
});

const containerStyle = css({
  padding: '20px',
  display: 'flex',
  gap: '20px',
  alignItems: 'flex-start',
  color: 'var(--text-light)',
  flexGrow: 1, // Allow the clickable area to grow
  cursor: 'pointer', // Add cursor pointer for clickability
});

const posterWrapperStyle = css({
  flexShrink: 0,
  width: '120px',
  height: '180px',
  overflow: 'hidden',
  borderRadius: '8px',
});

const posterImageStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const posterPlaceholderStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: '#333',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const tempPosterStyle = css({
  width: '70%',
  height: '70%',
  backgroundColor: '#555',
  borderRadius: '5px',
});

const detailsStyle = css({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const titleStyle = css({
  fontSize: '1.4rem',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  color: 'var(--text-light)',
});

const ratingStyle = css({
  fontSize: '0.95rem',
  color: 'var(--text-muted)',
  margin: '3px 0',
});

const ratingValueStyle = css({
  fontWeight: 'bold',
  color: 'var(--text-light)',
});

const genreStyle = css({
  fontSize: '0.95rem',
  color: 'var(--text-muted)',
  margin: '3px 0 10px 0',
});

const descriptionStyle = css({
  fontSize: '0.9rem',
  color: 'var(--text-light)',
  margin: 0,
  lineHeight: '1.4',
  maxHeight: '4.2em', // Limit to 3 lines (1.4 * 3 = 4.2)
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
});

const removeButtonStyle = css({
  backgroundColor: 'var(--error-red)',
  color: 'white',
  border: 'none',
  borderRadius: '0 0 15px 15px', // Rounded only at the bottom
  padding: '10px 15px',
  fontSize: '0.95rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  width: '100%', // Make button full width at the bottom
  marginTop: 'auto', // Push to bottom
  '&:hover': {
    backgroundColor: '#cc0000',
  },
});

export default WatchlistMovieCard;
