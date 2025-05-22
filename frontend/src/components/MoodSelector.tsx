/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css } from '@emotion/react';

const moods = [
  "I'm feeling Happy",
  "I'm feeling Sad",
  "I'm feeling Adventurous",
  "Other/Custom",
];

const MoodSelector: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    console.log(`Mood selected: ${mood}`);
  };

  return (
    <section css={containerStyle}>
      <h2 css={titleStyle}>How are you feeling today?</h2>
      <p css={descriptionStyle}>Get movies personalized for your mood.</p>
      <div css={buttonsContainerStyle}>
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => handleMoodSelect(mood)}
            css={[
              buttonStyle,
              selectedMood === mood && buttonSelectedStyle
            ]}
          >
            {mood}
          </button>
        ))}
      </div>
    </section>
  );
};

export default MoodSelector;

// Emotion CSS styles
const containerStyle = css({
  backgroundColor: 'var(--card-dark)',
  borderRadius: '15px',
  padding: '20px',
  margin: '20px auto',
  maxWidth: '1200px',
  width: '100%',
});

const titleStyle = css({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  color: 'var(--text-light)',
});

const descriptionStyle = css({
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
  margin: '0 0 20px 0',
});

const buttonsContainerStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '10px',
});

const buttonStyle = css({
  backgroundColor: 'var(--background-dark)',
  color: 'var(--text-light)',
  padding: '12px 15px',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  transition: 'background-color 0.2s ease, transform 0.1s ease',
  textAlign: 'center',
  cursor: 'pointer',
  border: 'none',
  '&:hover': {
    backgroundColor: '#333',
    transform: 'scale(1.02)',
  },
});

const buttonSelectedStyle = css({
  backgroundColor: 'var(--accent-blue)',
  '&:hover': {
    backgroundColor: 'var(--accent-blue)', // No change on hover
  },
});
