import React, { createContext, useContext, useState } from 'react';

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  description?: string;
  genres?: string[];
}

interface MovieDataContextType {
  trendingMovies: Movie[];
  topPicks: Movie[];
  setTrendingMovies: (movies: Movie[]) => void;
  setTopPicks: (movies: Movie[]) => void;
  isCached: boolean;
  clearCache: () => void;
}

const MovieDataContext = createContext<MovieDataContextType | undefined>(undefined);

export const MovieDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trendingMovies, setTrendingMoviesState] = useState<Movie[]>([]);
  const [topPicks, setTopPicksState] = useState<Movie[]>([]);
  const [isCached, setIsCached] = useState(false);

  const setTrendingMovies = (movies: Movie[]) => {
    setTrendingMoviesState(movies);
    setIsCached(true);
  };

  const setTopPicks = (movies: Movie[]) => {
    setTopPicksState(movies);
    setIsCached(true);
  };

  const clearCache = () => {
    setTrendingMoviesState([]);
    setTopPicksState([]);
    setIsCached(false);
  };

  return (
    <MovieDataContext.Provider value={{
      trendingMovies,
      topPicks,
      setTrendingMovies,
      setTopPicks,
      isCached,
      clearCache
    }}>
      {children}
    </MovieDataContext.Provider>
  );
};

export const useMovieData = () => {
  const context = useContext(MovieDataContext);
  if (!context) {
    throw new Error('useMovieData must be used within MovieDataProvider');
  }
  return context;
};
