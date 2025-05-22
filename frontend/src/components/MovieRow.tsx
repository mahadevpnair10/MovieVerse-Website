/** @jsxImportSource @emotion/react */
import React from 'react';
import { Link } from 'react-router-dom';
import { css, Global } from '@emotion/react';

interface Movie {
  id: string;
  title: string;
  posterUrl: string; // Ensure your dummyMovies have posterUrl
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  return (
    <section css={containerStyle}>
      {/* Global scrollbar styles to hide them for this specific container */}
      <Global styles={scrollbarHideStyles} />

      <h2 css={titleStyle}>{title}</h2>
      <div css={scrollContainerWrapperStyle}> {/* New wrapper for the fade effect */}
        <div className="moviesScrollContainer" css={scrollContainerStyle}>
          {movies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} css={movieCardStyle}>
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} css={posterStyle} />
              ) : (
                <div css={posterPlaceholderStyle}>
                  <div css={tempPosterStyle}></div>
                </div>
              )}
              <p css={movieTitleStyle}>{movie.title}</p>
            </Link>
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
  padding: 0 20px; /* Consistent horizontal padding for the entire row */
`;

const titleStyle = css`
  font-size: 1.8rem; /* Increased size to match typical streaming UIs */
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--text-light);
  /* Ensure title is aligned with the start of the movies */
  padding-left: 0;
`;

const scrollContainerWrapperStyle = css`
  position: relative; /* Context for fadeOverlay */
  /* This div ensures the fade overlay sits directly over the scrollable content */
`;

const scrollContainerStyle = css`
  display: flex;
  overflow-x: scroll; /* Enable horizontal scrolling */
  padding-bottom: 15px; /* Space for potential scrollbar track, even if thumb is hidden */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  /* scrollbar-width: none; // No need for this if using Global styles for hiding */
  /* scrollbar-color: var(--text-muted) var(--card-dark); // No need for this if hiding */
`;

const movieCardStyle = css`
  flex-shrink: 0; /* Prevent cards from shrinking */
  width: 150px;
  margin-right: 15px; /* Space between cards */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease;
  text-decoration: none;
  &:hover {
    transform: scale(1.05);
  }
`;

const posterStyle = css`
  width: 100%;
  height: 225px; /* Standard poster aspect ratio (e.g., 3:2 for 150px width) */
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 8px;
  background-color: var(--card-dark); /* Fallback background */
`;

const posterPlaceholderStyle = css`
  width: 100%;
  height: 225px; /* Match posterStyle height */
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
  background-color: #333; /* Darker grey for placeholder content */
  border-radius: 5px;
`;

const movieTitleStyle = css`
  font-size: 0.9rem;
  color: var(--text-light);
  margin: 0;
  white-space: nowrap; /* Prevent title from wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Add ellipsis for long titles */
  width: 100%; /* Ensure ellipsis works within the card width */
`;

const fadeOverlayStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 80px; /* Width of the fade effect - adjust as needed */
  background: linear-gradient(to right, rgba(18,18,18,0) 0%, var(--background-dark) 100%);
  pointer-events: none; /* Allows clicking through the overlay */
  /* Optionally, for a subtle left fade if user can scroll back */
  /*
  box-shadow: inset 70px 0 30px -30px var(--background-dark), inset -70px 0 30px -30px var(--background-dark);
  background: linear-gradient(to right,
      var(--background-dark) 0%,
      rgba(18,18,18,0) 10%,
      rgba(18,18,18,0) 90%,
      var(--background-dark) 100%);
  */
`;


// Global styles to hide scrollbar for all browsers for elements with .moviesScrollContainer
const scrollbarHideStyles = css`
  .moviesScrollContainer {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  /* For Webkit browsers (Chrome, Safari, Opera) */
  .moviesScrollContainer::-webkit-scrollbar {
    display: none;
  }
`;