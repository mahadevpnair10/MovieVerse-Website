// src/pages/MoodPage.tsx
import React from 'react';
import MoodButton from '../components/MoodButton';

const MoodPage: React.FC = () => {
  const handleMoodSelect = (mood: string) => {
    console.log(`Selected mood: ${mood}`);
    // In a real app, you'd send this mood to your backend
    // to get personalized movie recommendations.
  };

  return (
    <div style={pageStyles.container}>
      <header style={pageStyles.header}>
        <h1 style={pageStyles.title}>How are you feeling today?</h1>
        <p style={pageStyles.subtitle}>Get movies personalized for your mood</p>
      </header>

      <main style={pageStyles.mainContent}>
        <div style={moodButtonsStyles.gridContainer}>
          {/* Mood Buttons with alternating styles based on your image */}
          <MoodButton onClick={() => handleMoodSelect('Happy')} variant="filled">
            I'm feeling Happy
          </MoodButton>
          <MoodButton onClick={() => handleMoodSelect('Sad')} variant="outlined">
            I'm feeling Sad
          </MoodButton>
          <MoodButton onClick={() => handleMoodSelect('Romantic')} variant="filled">
            I'm feeling Romantic
          </MoodButton>
          <MoodButton onClick={() => handleMoodSelect('Lonely')} variant="outlined">
            I'm feeling Lonely
          </MoodButton>
          <MoodButton onClick={() => handleMoodSelect('Adventurous')} variant="filled">
            I'm feeling Adventurous
          </MoodButton>
          <MoodButton onClick={() => handleMoodSelect('Bad')} variant="outlined">
            I'm feeling Bad
          </MoodButton>
          <MoodButton onClick={() => handleMoodSelect('Other/Custom')} variant="filled">
            Other/Custom
          </MoodButton>
        </div>
      </main>
    </div>
  );
};

const pageStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 70px)', // Adjust for NavBar height
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-light)',
    padding: '20px', // General padding
    alignItems: 'center', // Center content horizontally
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px', // Space between header and buttons
    marginTop: '20px',
    maxWidth: '500px', // Constrain header width
    width: '100%',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align content to the top
    width: '100%',
    paddingBottom: '40px', // Space at the bottom
  },
};

const moodButtonsStyles: { [key: string]: React.CSSProperties } = {
  gridContainer: {
    display: 'grid',
    gap: '15px', // Space between buttons
    width: '100%',
    maxWidth: '400px', // Constrain width to keep buttons phone-like size
  },
};

export default MoodPage;