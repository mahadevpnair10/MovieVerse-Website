/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-dark) 0%, rgba(15, 17, 27, 0.95) 100%);
  color: var(--text-light);
  padding-top: 70px;
  position: relative;
  overflow-x: hidden;
`;

const ContentArea = styled.main`
  flex-grow: 1;
  padding: 40px 20px 100px 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const ProfileTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 800;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #fff 0%, #b8c1ec 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.6rem;
  }
`;

const ProfileSubtitle = styled.p`
  font-size: 1.3rem;
  color: #b8c1ec;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
`;

const ProfileCard = styled.div`
  background: rgba(30, 34, 54, 0.8);
  border-radius: 25px;
  padding: 40px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #007BFF, #00c6ff, #007BFF);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { background-position: 200% 0; }
    50% { background-position: -200% 0; }
  }

  @media (max-width: 768px) {
    padding: 30px 25px;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007BFF, #00c6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0, 123, 255, 0.4);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: avatarShine 4s ease-in-out infinite;
  }

  @keyframes avatarShine {
    0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
`;

const UserName = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
  text-align: center;
`;

const UserRole = styled.p`
  font-size: 1.1rem;
  color: #007BFF;
  margin: 8px 0 0 0;
  font-weight: 600;
  text-align: center;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const InfoItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const InfoLabel = styled.span`
  display: block;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`;

const InfoValue = styled.span`
  display: block;
  font-size: 1.2rem;
  color: #fff;
  font-weight: 600;
`;


const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  position: relative;
  overflow: hidden;

  ${props => props.variant === 'danger' ? css`
    background: linear-gradient(135deg, #ff4757, #ff3742);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 71, 87, 0.5);
    }
  ` : css`
    background: linear-gradient(135deg, #007BFF, #00c6ff);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 123, 255, 0.5);
    }
  `}

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:before {
    left: 100%;
  }

  &:active {
    transform: translateY(0);
  }
`;

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setNavVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setNavVisible(false); // scrolling down
      } else {
        setNavVisible(true); // scrolling up
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (term: string) => {
    console.log(`Search from Profile: ${term}`);
  };

  const handleLogout = async () => {
    await logout();
  };

  // const handleEditProfile = () => {
  //   // Add edit profile functionality
  //   console.log('Edit profile clicked');
  // };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };


  return (
    <>
      <NavBar isVisible={navVisible} />
      <PageContainer>
        <Header onSearchSubmit={handleSearch} showSearchBar={false} />
        <ContentArea>
          <ProfileHeader>
            <ProfileTitle>Profile</ProfileTitle>
            <ProfileSubtitle>Manage your account and preferences</ProfileSubtitle>
          </ProfileHeader>

          {user ? (
            <ProfileCard>
              <AvatarSection>
                <Avatar>
                  {getInitials(user.username)}
                </Avatar>
                <UserName>{user.username}</UserName>
                <UserRole>Movie Enthusiast</UserRole>
              </AvatarSection>

              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Username</InfoLabel>
                  <InfoValue>{user.username}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>User ID</InfoLabel>
                  <InfoValue>#{user.id}</InfoValue>
                </InfoItem>
               
              </InfoGrid>

              

              <ActionButtons>
                {/* <ActionButton variant="primary" onClick={handleEditProfile}>
                  Edit Profile
                </ActionButton> */}
                <ActionButton variant="danger" onClick={handleLogout}>
                  Log Out
                </ActionButton>
              </ActionButtons>
            </ProfileCard>
          ) : (
            <ProfileCard>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ fontSize: '1.2rem', color: '#b8c1ec' }}>
                  User not logged in or profile data not available.
                </p>
              </div>
            </ProfileCard>
          )}
        </ContentArea>
      </PageContainer>
    </>
  );
};

export default ProfilePage;
