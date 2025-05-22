// src/components/MoodSelector.tsx
import React, { useState } from 'react';

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
    // In a real app, you'd make an API call or update a global state here
    console.log(`Mood selected: ${mood}`);
  };

  return (
    <section style={moodStyles.container}>
      <h2 style={moodStyles.title}>How are you feeling today?</h2>
      <p style={moodStyles.description}>Get movies personalized for your mood.</p>
      <div style={moodStyles.buttonsContainer}>
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => handleMoodSelect(mood)}
            style={{
              ...moodStyles.button,
              ...(selectedMood === mood ? moodStyles.buttonSelected : {}),
            }}
          >
            {mood}
          </button>
        ))}
      </div>
    </section>
  );
};

const moodStyles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'var(--card-dark)',
    borderRadius: '15px',
    padding: '20px',
    margin: '20px auto', // Center the section
    maxWidth: '1200px', // Constrain width for larger screens
    width: '100%',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    color: 'var(--text-light)',
  },
  description: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    margin: '0 0 20px 0',
  },
  buttonsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Responsive grid
    gap: '10px',
  },
  button: {
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-light)',
    padding: '12px 15px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    textAlign: 'center',
  },
  buttonSelected: {
    backgroundColor: 'var(--accent-blue)', // Highlight when selected
  },
};

// Hover effects
moodStyles.button[':hover'] = {
  backgroundColor: '#333',
  transform: 'scale(1.02)',
};
moodStyles.buttonSelected[':hover'] = {
  backgroundColor: 'var(--accent-blue)', // No change if already selected
};


export default MoodSelector;