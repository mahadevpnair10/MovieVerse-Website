/** @jsxImportSource @emotion/react */
import React from 'react';
import { css, Global } from '@emotion/react';

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movieId: string) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick }) => {
  const handleMovieClick = (movieId: string) => {
    if (onMovieClick) {
      onMovieClick(movieId);
    }
  };

  return (
    <section css={containerStyle}>
      <Global styles={scrollbarHideStyles} />

      <h2 css={titleStyle}>{title}</h2>
      <div css={scrollContainerWrapperStyle}>
        <div className="moviesScrollContainer" css={scrollContainerStyle}>
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              css={movieCardStyle}
              onClick={() => handleMovieClick(movie.id)}
            >
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} css={posterStyle} />
              ) : (
                <div css={posterPlaceholderStyle}>
                  <div css={tempPosterStyle}></div>
                </div>
              )}
              <p css={movieTitleStyle}>{movie.title}</p>
            </div>
          ))}
        </div>
        {/* Fade overlay on the right */}
        <div css={fadeOverlayStyle}></div>
      </div>
    </section>
  );
};

export default MovieRow;

// --- Emotion Styles ---

const containerStyle = css`
  margin: 20px auto;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
`;

const titleStyle = css`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--text-light);
  padding-left: 0;
`;

const scrollContainerWrapperStyle = css`
  position: relative;
`;

const scrollContainerStyle = css`
  display: flex;
  overflow-x: scroll;
  padding-bottom: 15px;
  -webkit-overflow-scrolling: touch;
  gap: 15px; /* Use gap instead of margin-right for better spacing */
`;

const movieCardStyle = css`
  flex-shrink: 0;
  width: 140px; /* Slightly smaller to fit more movies */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
  }
  
  /* Remove margin-right since we're using gap now */
  margin-right: 0;
`;

const posterStyle = css`
  width: 100%;
  height: 210px; /* Slightly smaller height to accommodate more movies */
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 8px;
  background-color: var(--card-dark);
`;

const posterPlaceholderStyle = css`
  width: 100%;
  height: 210px; /* Match poster height */
  background-color: var(--card-dark);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const tempPosterStyle = css`
  width: 80%;
  height: 80%;
  background-color: #333;
  border-radius: 5px;
`;

const movieTitleStyle = css`
  font-size: 0.85rem; /* Slightly smaller font */
  color: var(--text-light);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  line-height: 1.2;
`;

const fadeOverlayStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 80px;
  background: linear-gradient(to right, rgba(18,18,18,0) 0%, var(--background-dark) 100%);
  pointer-events: none;
`;

// Global styles to hide scrollbar
const scrollbarHideStyles = css`
  .moviesScrollContainer {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .moviesScrollContainer::-webkit-scrollbar {
    display: none;
  }
`;
