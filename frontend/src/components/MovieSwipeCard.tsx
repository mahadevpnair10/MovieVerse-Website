// src/components/MovieSwipeCard.tsx
/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react'; // Import css from emotion

interface MovieSwipeCardProps {
  id: string;
  title: string;
  imdbRating: number;
  ourRating: number;
  genre: string;
  description: string;
  posterUrl?: string;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  // New props for controlling card position and animation
  x?: number;
  rotation?: number;
  opacity?: number;
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
  x = 0,
  rotation = 0,
  opacity = 1,
}) => {
  return (
    <div
      css={cardStyles.container(x, rotation, opacity)} // Apply dynamic styles
    >
      <div css={cardStyles.mediaPlaceholder}>
        {/* In a real app, you'd use <img src={posterUrl} alt={title} /> or a video player */}
        <div css={cardStyles.tempContentStyle}></div> {/* Temporary visual */}
      </div>

      <div css={cardStyles.details}>
        <h3 css={cardStyles.title}>{title}</h3>
        <div css={cardStyles.ratingsContainer}>
          <p css={cardStyles.rating}>IMDB Rating: <span css={cardStyles.ratingValue}>{imdbRating} / 10</span></p>
          <p css={cardStyles.rating}>Our Rating: <span css={cardStyles.ratingValue}>{ourRating} / 10</span></p>
        </div>
        <p css={cardStyles.genre}>Genre: {genre}</p>
        <p css={cardStyles.description}>{description}</p>
      </div>
    </div>
  );
};

// Use css function for styling
const cardStyles = {
  container: (x: number, rotation: number, opacity: number) => css`
    background-color: var(--background-dark);
    border-radius: 25px;
    border: 2px solid var(--border-color);
    width: 100%;
    max-width: 380px;
    height: 650px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    position: absolute; /* Position it for swiping */
    cursor: grab;
    will-change: transform, opacity; /* Optimize for animation */
    transform: translateX(${x}px) rotate(${rotation}deg);
    opacity: ${opacity};
    touch-action: none; /* Prevent browser touch actions like scrolling */
  `,
  mediaPlaceholder: css`
    width: 100%;
    flex-grow: 1;
    min-height: 400px;
    max-height: calc(100% - 150px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--card-dark);
    border-top-left-radius: 23px;
    border-top-right-radius: 23px;
    overflow: hidden;
  `,
  tempContentStyle: css`
    width: 80%;
    height: 80%;
    background-color: #333;
    border-radius: 10px;
  `,
  details: css`
    padding: 25px;
    background-color: var(--card-dark);
    border-bottom-left-radius: 23px;
    border-bottom-right-radius: 23px;
    flex-shrink: 0;
    height: auto;
    min-height: 150px;
  `,
  title: css`
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0 0 15px 0;
    color: var(--text-light);
  `,
  ratingsContainer: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-wrap: wrap;
  `,
  rating: css`
    font-size: 1rem;
    color: var(--text-muted);
    margin: 0;
  `,
  ratingValue: css`
    font-weight: bold;
    color: var(--text-light);
  `,
  genre: css`
    font-size: 1rem;
    color: var(--text-muted);
    margin: 0 0 10px 0;
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