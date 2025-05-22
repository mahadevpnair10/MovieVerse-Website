// src/pages/WatchlistPage.tsx
import React, { useState } from 'react';
import WatchlistMovieCard from '../components/WatchlistMovieCard';

// Dummy data for demonstration
const dummyWatchlistMovies = [
  {
    id: 'w1',
    title: 'The Great Journey',
    ourRating: 8.5,
    imdbRating: 7.9,
    genre: 'Adventure, Sci-Fi',
    description: 'A thrilling space odyssey across uncharted galaxies, where humanity faces its greatest challenge yet.',
  },
  {
    id: 'w2',
    title: 'Silent Echoes',
    ourRating: 7.8,
    imdbRating: 7.5,
    genre: 'Thriller, Mystery',
    description: 'A detective is haunted by a cold case, as he uncovers dark secrets in a small, isolated town.',
  },
  {
    id: 'w3',
    title: 'City of Dreams',
    ourRating: 9.1,
    imdbRating: 8.8,
    genre: 'Drama, Romance',
    description: 'Two aspiring artists navigate the vibrant but harsh realities of a bustling metropolis.',
  },
  {
    id: 'w4',
    title: 'Code Breaker',
    ourRating: 8.2,
    imdbRating: 7.7,
    genre: 'Action, Espionage',
    description: 'A brilliant hacker is recruited by a secret agency to prevent a global cyber-attack.',
  },
  {
    id: 'w5',
    title: 'Fantasy Realm',
    ourRating: 8.9,
    imdbRating: 8.3,
    genre: 'Fantasy, Animation',
    description: 'A young hero discovers a hidden magical world and must protect it from an ancient evil.',
  },
];

const WatchlistPage: React.FC = () => {
  const [filter, setFilter] = useState('watchlater'); // 'watchlater', 'watched', 'favorites', etc.

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    // In a real app, you'd fetch/filter movies based on this selection
    console.log(`Watchlist filter changed to: ${e.target.value}`);
  };

  return (
    <div style={pageStyles.container}>
      <header style={pageStyles.header}>
        <h1 style={pageStyles.title}>Your Watchlist</h1>
        <div style={pageStyles.filterContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={pageStyles.filterIcon}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <select
            value={filter}
            onChange={handleFilterChange}
            style={pageStyles.filterSelect}
          >
            <option value="watchlater">WatchLater</option>
            <option value="watched">Watched</option>
            <option value="favorites">Favorites</option>
            <option value="all">All</option>
          </select>
        </div>
      </header>
      <main style={pageStyles.mainContent}>
        <div style={pageStyles.gridContainer}>
          {dummyWatchlistMovies.map((movie) => (
            <WatchlistMovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </main>
    </div>
  );
};

const pageStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 70px)', // Adjust for NavBar height (approx 70px)
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-light)',
    paddingTop: '20px', // Space below NavBar
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '0 20px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'row', // Default for web, will stack on small screens
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', // Allow wrapping on small screens
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
    marginBottom: '10px', // For stacking on small screens
    flexShrink: 0, // Prevent title from shrinking
  },
  filterContainer: {
    backgroundColor: 'var(--card-dark)',
    borderRadius: '10px',
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid var(--border-color)',
    flexGrow: 0, // Prevent filter from growing too much
  },
  filterIcon: {
    color: 'var(--text-muted)',
  },
  filterSelect: {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-light)',
    fontSize: '1rem',
    fontWeight: '600',
    appearance: 'none', // Remove default dropdown arrow
    paddingRight: '20px', // Space for custom arrow if desired
    cursor: 'pointer',
  },
  mainContent: {
    flexGrow: 1,
    padding: '0 20px 40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  gridContainer: {
    display: 'grid',
    gap: '25px', // Space between cards
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive grid
  },
};

// Media query for small screens to stack header elements
const headerMediaQuery = document.createElement('style');
headerMediaQuery.innerHTML = `
@media (max-width: 600px) {
  [data-styles-id="watchlist-header-wrapper"] {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;
document.head.appendChild(headerMediaQuery);
pageStyles.header['data-styles-id'] = "watchlist-header-wrapper"; // Apply this data-attribute for media query

// Custom dropdown arrow for web select
const selectArrowStyle = document.createElement('style');
selectArrowStyle.innerHTML = `
.filterSelect {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 0.8rem 0.8rem;
}
`;
document.head.appendChild(selectArrowStyle);
pageStyles.filterSelect['className'] = 'filterSelect'; // Apply this class for custom arrow


export default WatchlistPage;