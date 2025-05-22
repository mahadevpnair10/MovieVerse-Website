// src/pages/HomePage.tsx
import React from 'react';
import Header from '../components/Header';
import MoodSelector from '../components/MoodSelector';
import MovieRow from '../components/MovieRow';

// Dummy data for demonstration
const dummyMovies = [
  { id: '1', title: 'Movie 1', posterUrl: '' },
  { id: '2', title: 'Movie 2', posterUrl: '' },
  { id: '3', title: 'Movie 3', posterUrl: '' },
  { id: '4', title: 'Movie 4', posterUrl: '' },
  { id: '5', title: 'Movie 5', posterUrl: '' },
  { id: '6', title: 'Movie 6', posterUrl: '' },
  { id: '7', title: 'Movie 7', posterUrl: '' },
  { id: '8', title: 'Movie 8', posterUrl: '' },
];

const HomePage: React.FC = () => {
  const handleSearchSubmit = (term: string) => {
    console.log('Search initiated from Home Page:', term);
    // In a real app, you'd navigate to search results or fetch data
  };

  return (
    <div style={pageStyles.container}>
      <Header onSearchSubmit={handleSearchSubmit} />
      <main style={pageStyles.mainContent}>
        <MoodSelector />
        <MovieRow title="TOP PICKS FOR YOU" movies={dummyMovies} />
        <MovieRow title="Trending Now" movies={dummyMovies} />
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
    flexGrow: 1, // Allows main content to take available vertical space
    paddingBottom: '40px', // Space at the bottom
  },
};

export default HomePage;