/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { backendApi, useAuth } from '../context/AuthContext';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

// Define the Movie interface matching your backend response
interface MovieDetails {
  id: string;
  title: string;
  movie_info: string; // Your backend returns 'movie_info' not 'description'
  poster_url: string;
  genres: string[];
  our_rating?: number;
  imdb_rating?: number;
  director?: string;
  star1?: string;
  star2?: string;
  release_date?: string;
}

// Styled Components (keeping the same styles as before)
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

const HeroSection = styled.div`
  position: relative;
  height: 60vh;
  background: linear-gradient(135deg, rgba(30, 34, 54, 0.9), rgba(15, 17, 27, 0.95));
  display: flex;
  align-items: center;
  padding: 0 40px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 50vh;
    padding: 0 20px;
    flex-direction: column;
    justify-content: center;
  }
`;

const PosterContainer = styled.div`
  flex-shrink: 0;
  margin-right: 40px;
  position: relative;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const PosterImage = styled.img`
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    width: 250px;
    height: 375px;
  }
`;

const MovieInfo = styled.div`
  flex: 1;
  max-width: 600px;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const MovieTitle = styled.h1`
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

const GenreContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 25px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const GenreTag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;

  ${props => props.variant === 'primary' ? css`
    background: linear-gradient(135deg, #007BFF, #00c6ff);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
    }
  ` : css`
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  `}
`;

const ContentSection = styled.div`
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #fff;
`;

const Overview = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #b8c1ec;
  margin-bottom: 40px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const InfoItem = styled.div`
  background: rgba(30, 34, 54, 0.6);
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const InfoLabel = styled.span`
  color: #888;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 8px;
`;

const InfoValue = styled.span`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
`;

const RatingSection = styled.div`
  background: rgba(30, 34, 54, 0.8);
  padding: 40px;
  border-radius: 18px;
  margin-top: 40px;
  text-align: center;
`;

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;

const Star = styled.button<{ filled: boolean }>`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: ${props => props.filled ? '#ffd700' : '#666'};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    color: #ffd700;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  color: var(--text-light);
  font-size: 1.2rem;
`;

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Use your existing fetchMovieInfo endpoint
        const response = await backendApi.get(`api/fetchMovieInfo/${id}/`);
        setMovie(response.data);
        
        // Check if movie is in watchlist
        if (user?.username) {
          try {
            const watchlistResponse = await backendApi.post('api/watchlist/', { 
              username: user.username 
            });
            const isInList = watchlistResponse.data.some((item: any) => 
              item.movie_id.toString() === id
            );
            setIsInWatchlist(isInList);
          } catch (error) {
            console.error('Error checking watchlist:', error);
          }
        }

        // Get user's current rating for this movie
        if (user?.username) {
          try {
            const ratingResponse = await backendApi.get(`api/getRatings/${user.username}/${id}/`);
            if (ratingResponse.data.rating) {
              setUserRating(ratingResponse.data.rating * 2); // Convert from 0-2.5 to 0-5 scale
            }
          } catch (error) {
            console.error('Error fetching user rating:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, user?.username]);

const handleBackNavigation = () => {
  if (location.state?.fromHomePage) {
    // Navigate back to homepage with stored scroll position
    navigate('/', {
      state: { 
        scrollPosition: location.state.scrollPosition 
      },
      replace: false 
    });
  } else if (location.state?.fromWatchlistPage) {
    // Navigate back to watchlist with stored scroll position
    navigate('/watchlist', { 
      state: { 
        scrollPosition: location.state.scrollPosition 
      },
      replace: false 
    });
  } else if (location.state?.fromTinderPage) {
    // Navigate back to tinder with stored scroll position and index
    navigate('/tinder', { 
      state: { 
        scrollPosition: location.state.scrollPosition,
        tinderIndex: location.state.tinderIndex
      },
      replace: false 
    });
  } else if (location.state?.fromMoodRecommendationsPage) {
    // Navigate back to mood recommendations with stored scroll position
    navigate(`/mood-recommendations?mood=${encodeURIComponent(location.state.mood)}`, { 
      state: { 
        // scrollPosition: location.state.scrollPosition,
        fromHomePage: true,
        scrollPosition: location.state.homePageScrollPosition
      },
      replace: false 
    });
  } else if (location.state?.fromSearchResults) {
    // Navigate back to homepage with search results open
    navigate(`/?q=${encodeURIComponent(location.state.searchTerm)}`, { 
      state: { 
        scrollPosition: location.state.scrollPosition 
      },
      replace: false 
    });
  } else {
    // Fallback to browser back
    navigate(-1);
  }
};


  const handleWatchlistToggle = async () => {
    if (!user?.username || !movie) return;

    try {
      if (isInWatchlist) {
        // Find the watchlist item ID first
        const watchlistResponse = await backendApi.post('api/watchlist/', { 
          username: user.username 
        });
        const watchlistItem = watchlistResponse.data.find((item: any) => 
          item.movie_id.toString() === movie.id
        );
        
        if (watchlistItem) {
          await backendApi.post(`api/watchlist/remove/${watchlistItem.id}/`, {
            username: user.username
          });
          setIsInWatchlist(false);
        }
      } else {
        await backendApi.post('api/watchlist/add/', {
          username: user.username,
          movie_id: movie.id
        });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!user?.username || !movie) return;

    try {
      // Convert from 1-5 scale to your backend's 0-5 scale
      const backendRating = rating; // Adjust this if your backend expects different scale
      
      await backendApi.post('api/addRatings/', {
        username: user.username,
        movie_id: movie.id,
        rating: backendRating
      });
      setUserRating(rating);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleWatchTrailer = () => {
    // Since your backend doesn't have trailer URLs, search YouTube
    const searchQuery = `${movie?.title} trailer`;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  if (loading) {
    return <LoadingContainer>Loading movie details...</LoadingContainer>;
  }

  if (!movie) {
    return <LoadingContainer>Movie not found</LoadingContainer>;
  }

  // Handle poster URL - your backend returns full URLs
  const posterUrl = movie.poster_url;

  return (
    <PageContainer>
      <BackButton onClick={handleBackNavigation}>
        ←
      </BackButton>

      <HeroSection>
        <PosterContainer>
          <PosterImage src={posterUrl} alt={movie.title} />
        </PosterContainer>

        <MovieInfo>
          <MovieTitle>{movie.title}</MovieTitle>
          
          <GenreContainer>
            {movie.genres?.map((genre, index) => (
              <GenreTag key={index}>{genre}</GenreTag>
            ))}
          </GenreContainer>

          <RatingContainer>
            {movie.our_rating && (
              <RatingBadge>
                ⭐ {movie.our_rating.toFixed(1)}
              </RatingBadge>
            )}
            {movie.imdb_rating && (
              <RatingBadge>
                🎬 {movie.imdb_rating.toFixed(1)}
              </RatingBadge>
            )}
          </RatingContainer>

          <ActionButtons>
            <ActionButton variant="primary" onClick={handleWatchlistToggle}>
              {isInWatchlist ? '✓' : '+'} {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </ActionButton>
            <ActionButton variant="secondary" onClick={handleWatchTrailer}>
              ▶ Watch Trailer
            </ActionButton>
          </ActionButtons>
        </MovieInfo>
      </HeroSection>

      <ContentSection>
        <SectionTitle>Overview</SectionTitle>
        <Overview>{movie.movie_info}</Overview>

        <InfoGrid>
          {movie.director && (
            <InfoItem>
              <InfoLabel>Director:</InfoLabel>
              <InfoValue>{movie.director}</InfoValue>
            </InfoItem>
          )}
          {movie.release_date && (
            <InfoItem>
              <InfoLabel>Release Date:</InfoLabel>
              <InfoValue>{new Date(movie.release_date).getFullYear()}</InfoValue>
            </InfoItem>
          )}
          {(movie.star1 || movie.star2) && (
            <InfoItem>
              <InfoLabel>Starring:</InfoLabel>
              <InfoValue>
                {[movie.star1, movie.star2].filter(Boolean).join(', ')}
              </InfoValue>
            </InfoItem>
          )}
        </InfoGrid>

        <RatingSection>
          <SectionTitle>How would you rate this movie?</SectionTitle>
          <StarContainer>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                filled={star <= userRating}
                onClick={() => handleRating(star)}
              >
                ★
              </Star>
            ))}
          </StarContainer>
        </RatingSection>
      </ContentSection>
    </PageContainer>
  );
};

export default MovieDetailsPage;
