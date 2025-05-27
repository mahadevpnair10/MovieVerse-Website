// src/pages/MoodPage.tsx
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MoodButton from '../components/MoodButton';
import NavBar from '../components/NavBar';

const MoodPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Restore scroll position when coming back from mood recommendations
  useLayoutEffect(() => {
    if (location.state?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollPosition);
      }, 0);
    }
  }, [location.state]);

  // Scroll detection logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        setNavVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setNavVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleMoodSelect = (mood: string) => {
    console.log(`Selected mood: ${mood}`);
    setSelectedMood(mood);
    
    // Extract the actual mood from the sentence (remove "I'm feeling ")
    const moodValue = mood.replace("I'm feeling ", "").toLowerCase();
    
    // Store current scroll position before navigating
    const scrollPosition = window.scrollY;
    navigate(`/mood-recommendations?mood=${encodeURIComponent(moodValue)}`, {
      state: { 
        fromMoodPage: true, // Different from homepage to distinguish navigation source
        scrollPosition: scrollPosition 
      }
    });
  };

  return (
    <>
      <NavBar isVisible={navVisible} />
      <div style={pageStyles.container}>
        <header style={pageStyles.header}>
          <h1 style={pageStyles.title}>How are you feeling today?</h1>
          <p style={pageStyles.subtitle}>Get movies personalized for your mood</p>
        </header>

        <main style={pageStyles.mainContent}>
          <div style={moodButtonsStyles.gridContainer}>
            <MoodButton 
              onClick={() => handleMoodSelect("I'm feeling Happy")} 
              variant={selectedMood === "I'm feeling Happy" ? "filled" : "outlined"}
            >
              I'm feeling Happy
            </MoodButton>
            <MoodButton 
              onClick={() => handleMoodSelect("I'm feeling Sad")} 
              variant={selectedMood === "I'm feeling Sad" ? "filled" : "outlined"}
            >
              I'm feeling Sad
            </MoodButton>
            <MoodButton 
              onClick={() => handleMoodSelect("I'm feeling Romantic")} 
              variant={selectedMood === "I'm feeling Romantic" ? "filled" : "outlined"}
            >
              I'm feeling Romantic
            </MoodButton>
            <MoodButton 
              onClick={() => handleMoodSelect("I'm feeling Lonely")} 
              variant={selectedMood === "I'm feeling Lonely" ? "filled" : "outlined"}
            >
              I'm feeling Lonely
            </MoodButton>
            <MoodButton 
              onClick={() => handleMoodSelect("I'm feeling Adventurous")} 
              variant={selectedMood === "I'm feeling Adventurous" ? "filled" : "outlined"}
            >
              I'm feeling Adventurous
            </MoodButton>
            <MoodButton 
              onClick={() => handleMoodSelect("I'm feeling Bad")} 
              variant={selectedMood === "I'm feeling Bad" ? "filled" : "outlined"}
            >
              I'm feeling Bad
            </MoodButton>
            <MoodButton 
              onClick={() => handleMoodSelect("Other/Custom")} 
              variant={selectedMood === "Other/Custom" ? "filled" : "outlined"}
            >
              Other/Custom
            </MoodButton>
          </div>
        </main>
      </div>
    </>
  );
};

const pageStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-light)',
    padding: '20px',
    paddingTop: '100px', // Increased top padding for better spacing
    alignItems: 'center',
    background: 'linear-gradient(135deg, var(--background-dark) 0%, rgba(30, 34, 54, 0.95) 100%)', // Subtle gradient
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px', // Increased margin for better spacing
    marginTop: '20px',
    maxWidth: '600px', // Increased max width
    width: '100%',
    padding: '0 20px',
  },
  title: {
    fontSize: '3.2rem', // Increased font size
    fontWeight: '800', // Bolder weight
    margin: '0 0 20px 0', // Increased bottom margin
    background: 'linear-gradient(135deg, #fff 0%, #b8c1ec 100%)', // Gradient text
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Enhanced shadow
    letterSpacing: '1px',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '1.3rem', // Increased font size
    color: '#b8c1ec', // Better color
    margin: 0,
    fontWeight: '400',
    opacity: 0.9,
    letterSpacing: '0.5px',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: '60px', // Increased bottom padding
    maxWidth: '800px', // Added max width for better layout
  },
};

const moodButtonsStyles: { [key: string]: React.CSSProperties } = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Better responsive columns
    gap: '20px', // Increased gap
    width: '100%',
    maxWidth: '600px', // Increased max width
    padding: '20px', // Added padding
    background: 'rgba(30, 34, 54, 0.4)', // Subtle background
    borderRadius: '20px', // Rounded corners
    backdropFilter: 'blur(10px)', // Glassmorphism effect
    border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', // Enhanced shadow
  },
};

export default MoodPage;
