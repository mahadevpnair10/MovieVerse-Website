// src/components/MoodButton.tsx
import React from 'react';

interface MoodButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined'; // 'filled' for dark background, 'outlined' for white background
}

const MoodButton: React.FC<MoodButtonProps> = ({ children, variant = 'filled', ...props }) => {
  const buttonStyle = variant === 'filled' ? buttonStyles.filled : buttonStyles.outlined;
  const buttonHoverStyle = variant === 'filled' ? buttonStyles.filledHover : buttonStyles.outlinedHover;

  return (
    <button
      style={{ ...buttonStyles.base, ...buttonStyle }}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, buttonHoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, buttonStyle); // Revert to base style
      }}
      {...props}
    >
      {children}
    </button>
  );
};

const buttonStyles: { [key: string]: React.CSSProperties } = {
  base: {
    padding: '18px 25px',
    borderRadius: '15px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.1s ease',
    boxSizing: 'border-box', // Include padding in width/height
  },
  filled: {
    backgroundColor: 'var(--card-dark)', // Dark background
    color: 'var(--text-light)', // Light text
    border: '1px solid var(--card-dark)', // Border to match background
  },
  outlined: {
    backgroundColor: 'var(--text-light)', // White background
    color: 'var(--card-dark)', // Dark text
    border: '1px solid var(--text-light)', // Border to match background
  },
  filledHover: {
    backgroundColor: '#2e2e2e', // Slightly lighter dark on hover
    transform: 'translateY(-2px)',
  },
  outlinedHover: {
    backgroundColor: '#e0e0e0', // Slightly darker white on hover
    transform: 'translateY(-2px)',
  },
};

export default MoodButton;