/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';

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

interface MovieSwipeCardProps {
  movie: Movie;
  x?: number;
  rotation?: number;
  opacity?: number;
  fetchPoster?: (title: string) => Promise<string | null>;
  onMovieClick?: () => void;
}

const MovieSwipeCard: React.FC<MovieSwipeCardProps> = ({
  movie,
  x = 0,
  rotation = 0,
  opacity = 1,
  fetchPoster,
  onMovieClick,
}) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(movie.poster_url || null);
  const [posterLoading, setPosterLoading] = useState(false);
  const [posterError, setPosterError] = useState(false);

  // Sync posterUrl with movie.poster_url when movie changes
  useEffect(() => {
    setPosterUrl(movie.poster_url || null);
    setPosterError(false);
  }, [movie.poster_url, movie.id]);

  // Fetch poster if not available and fetchPoster function is provided
  useEffect(() => {
    const loadPoster = async () => {
      if (!posterUrl && fetchPoster && !posterLoading && !posterError) {
        setPosterLoading(true);
        try {
          const url = await fetchPoster(movie.title);
          setPosterUrl(url);
        } catch (error) {
          console.error('Error fetching poster:', error);
          setPosterError(true);
        } finally {
          setPosterLoading(false);
        }
      }
    };

    loadPoster();
  }, [movie.title, posterUrl, fetchPoster, posterLoading, posterError]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click during drag
    if (Math.abs(x) > 5) return;
    
    if (onMovieClick) {
      onMovieClick();
    }
  };

  // Helper function to format genre
  const formatGenre = (genre?: string) => {
    if (!genre) return 'Unknown Genre';
    return genre;
  };

  // Helper function to format rating
  const formatRating = (rating?: number) => {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
  };

  // Helper function to format description
  const formatDescription = (description?: string) => {
    if (!description) return 'No description available.';
    return description.length > 150 ? `${description.substring(0, 150)}...` : description;
  };

  // Helper function to format year
  const formatYear = (year?: number) => {
    if (!year) return '';
    return ` (${year})`;
  };

  return (
    <div 
      css={cardStyles.container(x, rotation, opacity)} 
      onClick={handleCardClick}
    >
      <div css={cardStyles.mediaPlaceholder}>
        {posterLoading ? (
          <div css={cardStyles.posterLoading}>
            <div css={cardStyles.loadingSpinner}></div>
            <p css={cardStyles.loadingText}>Loading poster...</p>
          </div>
        ) : posterUrl && !posterError ? (
          <img
            src={posterUrl.startsWith('http') ? posterUrl : `https://image.tmdb.org/t/p/w500/${posterUrl}`}
            alt={`${movie.title} poster`}
            css={cardStyles.posterImage}
            onError={() => setPosterError(true)}
          />
        ) : (
          <div css={cardStyles.noPosterContainer}>
            <div css={cardStyles.movieIcon}>🎬</div>
            <p css={cardStyles.noPosterText}>No Poster Available</p>
          </div>
        )}
      </div>

      <div css={cardStyles.details}>
        <h3 css={cardStyles.title}>
          {movie.title}
          {formatYear(movie.year)}
        </h3>
        
        <div css={cardStyles.ratingsContainer}>
          <div css={cardStyles.ratingItem}>
            <span css={cardStyles.ratingLabel}>IMDB:</span>
            <span css={cardStyles.ratingValue}>
              {formatRating(movie.imdb_rating)} / 10
            </span>
          </div>
          {movie.director && (
            <div css={cardStyles.directorItem}>
              <span css={cardStyles.directorLabel}>Director:</span>
              <span css={cardStyles.directorValue}>{movie.director}</span>
            </div>
          )}
        </div>

        <div css={cardStyles.genreContainer}>
          <span css={cardStyles.genreLabel}>Genre:</span>
          <span css={cardStyles.genreValue}>{formatGenre(movie.genre)}</span>
        </div>

        <p css={cardStyles.description}>
          {formatDescription(movie.description)}
        </p>
      </div>
    </div>
  );
};

const cardStyles = {
  container: (x: number, rotation: number, opacity: number) => css`
    background-color: var(--card-dark);
    border-radius: 25px;
    border: 2px solid var(--border-color);
    width: 100%;
    max-width: 380px;
    height: 650px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    position: absolute;
    cursor: pointer;
    will-change: transform, opacity;
    transform: translateX(${x}px) rotate(${rotation}deg);
    opacity: ${opacity};
    touch-action: none;
    transition: ${Math.abs(x) < 5 ? 'transform 0.3s ease-out' : 'none'};
  `,

  mediaPlaceholder: css`
    width: 100%;
    flex-grow: 1;
    min-height: 400px;
    max-height: calc(100% - 180px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--background-dark);
    border-top-left-radius: 23px;
    border-top-right-radius: 23px;
    overflow: hidden;
  `,

  posterImage: css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 23px;
    border-top-right-radius: 23px;
  `,

  posterLoading: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: var(--text-muted);
  `,

  loadingSpinner: css`
    width: 30px;
    height: 30px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--like-green);
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,

  loadingText: css`
    font-size: 0.9rem;
    margin: 0;
  `,

  noPosterContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: var(--text-muted);
  `,

  movieIcon: css`
    font-size: 4rem;
    opacity: 0.5;
  `,

  noPosterText: css`
    font-size: 1rem;
    margin: 0;
  `,

  details: css`
    padding: 25px;
    background-color: var(--card-dark);
    border-bottom-left-radius: 23px;
    border-bottom-right-radius: 23px;
    flex-shrink: 0;
    height: auto;
    min-height: 180px;
  `,

  title: css`
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0 0 15px 0;
    color: var(--text-light);
    line-height: 1.2;
  `,

  ratingsContainer: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 10px;
  `,

  ratingItem: css`
    display: flex;
    align-items: center;
    gap: 5px;
  `,

  ratingLabel: css`
    font-size: 0.9rem;
    color: var(--text-muted);
  `,

  ratingValue: css`
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--like-green);
  `,

  directorItem: css`
    display: flex;
    align-items: center;
    gap: 5px;
    flex: 1;
    min-width: 150px;
  `,

  directorLabel: css`
    font-size: 0.9rem;
    color: var(--text-muted);
  `,

  directorValue: css`
    font-size: 0.9rem;
    color: var(--text-light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  genreContainer: css`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  `,

  genreLabel: css`
    font-size: 0.9rem;
    color: var(--text-muted);
  `,

  genreValue: css`
    font-size: 0.9rem;
    color: var(--text-light);
    background-color: var(--background-dark);
    padding: 4px 8px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
  `,

  description: css`
    font-size: 0.9rem;
    color: var(--text-light);
    margin: 0;
    line-height: 1.4;
    max-height: 4.2em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  `,
};

export default MovieSwipeCard;
