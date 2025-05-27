/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { backendApi, useAuth } from '../context/AuthContext';
import MovieRow from '../components/MovieRow';
import styled from '@emotion/styled';

// Define the Movie interface
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  description?: string;
  genres?: string[];
}

interface MoodRecommendation {
  genre: string;
  recommendations: Array<{
    id: number;
    title: string;
    director: string;
    imdb_rating: number;
    poster_url: string;
    description: string;
  }>;
}

// Styled Components (keeping the same as before)
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-dark);
  color: var(--text-light);
  padding-top: 70px;
`;

const BackButton = styled.button`
  position: fixed;
  top: 90px;
  left: 20px;
  background: rgba(30, 34, 54, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  font-size: 1.5rem;
  z-index: 100;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(30, 34, 54, 1);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    top: 80px;
    left: 15px;
    width: 45px;
    height: 45px;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, rgba(30, 34, 54, 0.9), rgba(15, 17, 27, 0.95));
  margin-bottom: 40px;
`;

const MoodTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 20px 0;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const MoodSubtitle = styled.p`
  font-size: 1.2rem;
  color: #b8c1ec;
  margin: 0;
  opacity: 0.9;
`;

const GenreBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #007BFF, #00c6ff);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 0 20px 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: var(--text-light);
  font-size: 1.2rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid #007BFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: var(--error-red);
  font-size: 1.1rem;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 12px 24px;
  margin-top: 20px;
  border-radius: 8px;
  border: none;
  background-color: var(--accent-blue);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const MoodRecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [mood, setMood] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get mood from URL params
  const moodParam = searchParams.get('mood');

  // Restore scroll position when coming back from movie details
  useLayoutEffect(() => {
    if (location.state?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition);
      }, 0);
    }
  }, [location.state]);

  useEffect(() => {
    if (moodParam) {
      setMood(moodParam);
      fetchMoodRecommendations(moodParam);
    } else {
      setError('No mood specified');
      setLoading(false);
    }
  }, [moodParam]);

  const fetchMoodRecommendations = async (userMood: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await backendApi.post('ai/recommend/', {
        mood: userMood
      });

      const data: MoodRecommendation = response.data;
      setGenre(data.genre);

      // Transform the recommendations to match our Movie interface
      const transformedMovies: Movie[] = data.recommendations.map((movie) => ({
        id: movie.id.toString(),
        title: movie.title,
        posterUrl: movie.poster_url || '',
        description: movie.description,
        genres: [data.genre] // Use the predicted genre
      }));

      setRecommendations(transformedMovies);
    } catch (err: any) {
      console.error('Error fetching mood recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const handleBackNavigation = () => {
  if (location.state?.fromHomePage && location.state?.scrollPosition !== undefined) {
    // Go back to homepage
    navigate('/', { 
      state: { 
        scrollPosition: location.state.scrollPosition 
      },
      replace: true
    });
  } else if (location.state?.fromMoodPage && location.state?.scrollPosition !== undefined) {
    // Go back to mood page
    navigate('/mood', { 
      state: { 
        scrollPosition: location.state.scrollPosition 
      },
      replace: true
    });
  } else {
    // Fallback - go to previous page
    navigate(-1);
  }
};


  const handleMovieClick = (movieId: string) => {
    const scrollPosition = window.scrollY;
    // Use replace: true to avoid stacking multiple movie detail pages
    navigate(`/movies/${movieId}`, {
      state: { 
        fromMoodRecommendationsPage: true,
        scrollPosition: scrollPosition,
        mood: mood,
        homePageScrollPosition: location.state?.scrollPosition // Pass through homepage scroll position
      },
      replace: true // KEY FIX: Use replace to avoid history stacking
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <Spinner />
          <p>Finding perfect movies for your mood...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <BackButton onClick={handleBackNavigation}>
          ←
        </BackButton>
        <ErrorContainer>
          <p>Error: {error}</p>
          <RetryButton onClick={() => moodParam && fetchMoodRecommendations(moodParam)}>
            Retry
          </RetryButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackButton onClick={handleBackNavigation}>
        ←
      </BackButton>

      <HeaderSection>
        <MoodTitle>Movies for Your Mood</MoodTitle>
        <MoodSubtitle>
          Based on your mood: <strong>"{mood}"</strong>
        </MoodSubtitle>
        {genre && (
          <GenreBadge>
            Recommended Genre: {genre}
          </GenreBadge>
        )}
      </HeaderSection>

      <MainContent>
        {recommendations.length > 0 ? (
          <MovieRow 
            title={`Perfect ${genre} Movies for You`}
            movies={recommendations}
            onMovieClick={handleMovieClick}
          />
        ) : (
          <ErrorContainer>
            <p>No recommendations found for your mood.</p>
            <RetryButton onClick={() => moodParam && fetchMoodRecommendations(moodParam)}>
              Try Again
            </RetryButton>
          </ErrorContainer>
        )}
      </MainContent>
    </PageContainer>
  );
};

export default MoodRecommendationsPage;
