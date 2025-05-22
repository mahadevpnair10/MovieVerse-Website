// src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import MovieRow from '../components/MovieRow';
import DiscoveryCard from '../components/DiscoveryCard';

// Dummy data for demonstration
const dummySearchResults = [
  { id: 's1', title: 'Search Result 1', posterUrl: '' },
  { id: 's2', title: 'Search Result 2', posterUrl: '' },
  { id: 's3', title: 'Search Result 3', posterUrl: '' },
  { id: 's4', title: 'Search Result 4', posterUrl: '' },
];

const dummyTrending = [
  { id: 't1', title: 'Trend Movie A', posterUrl: '' },
  { id: 't2', title: 'Trend Movie B', posterUrl: '' },
  { id: 't3', title: 'Trend Movie C', posterUrl: '' },
  { id: 't4', title: 'Trend Movie D', posterUrl: '' },
];

const SearchPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const [currentSearchTerm, setCurrentSearchTerm] = useState(initialQuery);

  // Simulate fetching search results based on query param
  useEffect(() => {
    if (currentSearchTerm) {
      console.log(`Workspaceing results for: ${currentSearchTerm}`);
      // In a real app: make API call to your Django backend here
      // setActualSearchResults(fetchResults(currentSearchTerm));
    }
  }, [currentSearchTerm]);

  const handleSearchSubmit = (term: string) => {
    setCurrentSearchTerm(term);
    console.log('Search initiated from Search Page:', term);
    // Router automatically updates URL, useEffect will then fetch
  };

  return (
    <div style={pageStyles.container}>
      {/* Header with search bar, possibly showing initial query */}
      <Header initialSearchTerm={initialQuery} onSearchSubmit={handleSearchSubmit} />
      <main style={pageStyles.mainContent}>
        {currentSearchTerm && (
          <MovieRow title={`Results for "${currentSearchTerm}"`} movies={dummySearchResults} />
        )}
        <MovieRow title="Trending Now" movies={dummyTrending} />
        <div style={pageStyles.discoveryCardsContainer}>
          <DiscoveryCard
            title="Free Weekend?"
            description="Populate your watchlist for bingewatching"
            linkTo="/watchlist-matches"
          />
          <DiscoveryCard
            title="Find people who have the same taste as you...."
            description="Swipe right to find your matches →"
            linkTo="/taste-matches"
          />
        </div>
      </main>
    </div>
  );
};

const pageStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--background-dark)',
  },
  mainContent: {
    flexGrow: 1,
    padding: '0 20px 40px 20px', // Add horizontal padding and bottom space
    maxWidth: '1200px', // Constrain width
    margin: '0 auto', // Center
  },
  discoveryCardsContainer: {
    marginTop: '20px',
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Responsive grid for cards
  },
};

export default SearchPage;