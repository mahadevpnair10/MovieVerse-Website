/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { backendApi } from '../context/AuthContext';
import styled from '@emotion/styled';

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  description?: string;
  genres?: string[];
}

interface SearchResultsOverlayProps {
  searchTerm: string;
  isVisible: boolean;
  onClose: () => void;
  onMovieClick: (movieId: string) => void;
}

const OverlayContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  justify-content: center;
  align-items: flex-start;
  padding: 80px 20px 20px 20px;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const SearchContainer = styled.div`
  background: var(--background-dark);
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const SearchHeader = styled.div`
  padding: 30px;
  background: linear-gradient(135deg, rgba(30, 34, 54, 0.95), rgba(15, 17, 27, 0.95));
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchTitle = styled.h2`
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const SearchTerm = styled.span`
  color: #007BFF;
  font-weight: 800;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }
`;

const SearchContent = styled.div`
  padding: 30px;
  overflow-y: auto;
  max-height: calc(80vh - 120px);
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const MovieCard = styled.div`
  background: rgba(30, 34, 54, 0.6);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3);
    border-color: #007BFF;
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
`;

const PosterPlaceholder = styled.div`
  width: 100%;
  height: 280px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 3rem;
`;

const MovieInfo = styled.div`
  padding: 15px;
`;

const MovieTitle = styled.h3`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MovieDescription = styled.p`
  color: #b8c1ec;
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #b8c1ec;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #007BFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #ff6b6b;
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #b8c1ec;
`;

const SearchResultsOverlay: React.FC<SearchResultsOverlayProps> = ({
  searchTerm,
  isVisible,
  onClose,
  onMovieClick
}) => {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('SearchResultsOverlay render:', { searchTerm, isVisible, resultsCount: results.length });

  useEffect(() => {
    if (searchTerm && isVisible) {
      console.log('Triggering search for:', searchTerm);
      searchMovies(searchTerm);
    }
  }, [searchTerm, isVisible]);

  const searchMovies = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Searching for:', query);
      const response = await backendApi.get(`api/searchMovie/${encodeURIComponent(query)}/`);
      console.log('Search response:', response.data);
      
      const moviesData = Array.isArray(response.data) ? response.data : [];
      
      const transformedResults: Movie[] = moviesData.map((movie: any) => ({
        id: movie.id.toString(),
        title: movie.title,
        posterUrl: movie.poster_url ? 
          (movie.poster_url.startsWith('http') ? movie.poster_url : `https://image.tmdb.org/t/p/w500/${movie.poster_url}`) 
          : '',
        description: movie.description || movie.movie_info || 'No description available',
        genres: Array.isArray(movie.genres) ? movie.genres : []
      }));

      console.log('Transformed results:', transformedResults);
      setResults(transformedResults);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(`Failed to search movies: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMovieClick = (movieId: string) => {
    onMovieClick(movieId);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <OverlayContainer isVisible={isVisible} onClick={handleOverlayClick}>
      <SearchContainer>
        <SearchHeader>
          <SearchTitle>
            Search results for "<SearchTerm>{searchTerm}</SearchTerm>"
          </SearchTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </SearchHeader>
        
        <SearchContent>
          {loading ? (
            <LoadingContainer>
              <Spinner />
              <p>Searching movies...</p>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <p>{error}</p>
              <button 
                onClick={() => searchMovies(searchTerm)}
                style={{
                  background: '#007BFF',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Try Again
              </button>
            </ErrorContainer>
          ) : results.length === 0 ? (
            <NoResultsContainer>
              <p>No movies found for "{searchTerm}"</p>
              <p>Try searching with different keywords</p>
            </NoResultsContainer>
          ) : (
            <ResultsGrid>
              {results.map((movie) => (
                <MovieCard key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                  {movie.posterUrl ? (
                    <MoviePoster 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const nextSibling = target.nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <PosterPlaceholder style={{ display: movie.posterUrl ? 'none' : 'flex' }}>
                    🎬
                  </PosterPlaceholder>
                  <MovieInfo>
                    <MovieTitle>{movie.title}</MovieTitle>
                    <MovieDescription>{movie.description}</MovieDescription>
                  </MovieInfo>
                </MovieCard>
              ))}
            </ResultsGrid>
          )}
        </SearchContent>
      </SearchContainer>
    </OverlayContainer>
  );
};

export default SearchResultsOverlay;
