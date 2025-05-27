import React, { createContext, useContext, useState } from 'react';

interface TinderMovie {
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

interface TinderDataContextType {
  movies: TinderMovie[];
  currentMovieIndex: number;
  setMovies: (movies: TinderMovie[]) => void;
  setCurrentMovieIndex: (index: number) => void;
  isCached: boolean;
  clearCache: () => void;
}

const TinderDataContext = createContext<TinderDataContextType | undefined>(undefined);

export const TinderDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMoviesState] = useState<TinderMovie[]>([]);
  const [currentMovieIndex, setCurrentMovieIndexState] = useState(0);
  const [isCached, setIsCached] = useState(false);

  const setMovies = (newMovies: TinderMovie[]) => {
    setMoviesState(newMovies);
    setIsCached(true);
  };

  const setCurrentMovieIndex = (index: number) => {
    setCurrentMovieIndexState(index);
  };

  const clearCache = () => {
    setMoviesState([]);
    setCurrentMovieIndexState(0);
    setIsCached(false);
  };

  return (
    <TinderDataContext.Provider value={{
      movies,
      currentMovieIndex,
      setMovies,
      setCurrentMovieIndex,
      isCached,
      clearCache
    }}>
      {children}
    </TinderDataContext.Provider>
  );
};

export const useTinderData = () => {
  const context = useContext(TinderDataContext);
  if (!context) {
    throw new Error('useTinderData must be used within TinderDataProvider');
  }
  return context;
};
