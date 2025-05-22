/** @jsxImportSource @emotion/react */
import React from 'react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';

interface WatchlistMovieCardProps {
  id: string;
  title: string;
  ourRating: number;
  imdbRating: number;
  genre: string;
  description: string;
  posterUrl?: string;
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
    <Link to={`/movie/${id}`} css={containerStyle}>
      <div css={posterWrapperStyle}>
        {posterUrl ? (
          <img src={posterUrl} alt={title} css={posterImageStyle} />
        ) : (
          <div css={posterPlaceholderStyle}>
            <div css={tempPosterStyle}></div>
          </div>
        )}
      </div>
      <div css={detailsStyle}>
        <h3 css={titleStyle}>{title}</h3>
        <p css={ratingStyle}>
          Our Rating: <span css={ratingValueStyle}>{ourRating} / 10</span>
        </p>
        <p css={ratingStyle}>
          IMDB Rating: <span css={ratingValueStyle}>{imdbRating} / 10</span>
        </p>
        <p css={genreStyle}>Genre: {genre}</p>
        <p css={descriptionStyle}>{description}</p>
      </div>
    </Link>
  );
};

// ------------------- Styles -------------------

const containerStyle = css({
  backgroundColor: 'var(--card-dark)',
  borderRadius: '15px',
  padding: '20px',
  display: 'flex',
  gap: '20px',
  alignItems: 'flex-start',
  transition: 'background-color 0.2s ease, transform 0.1s ease',
  textDecoration: 'none',
  color: 'var(--text-light)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#2b2b2b',
    transform: 'translateY(-3px)',
  },
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
  maxHeight: '4.2em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
});

export default WatchlistMovieCard;
