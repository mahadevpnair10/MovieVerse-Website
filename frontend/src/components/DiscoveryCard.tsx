// src/components/DiscoveryCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface DiscoveryCardProps {
  title: string;
  description: string;
  linkTo: string;
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ title, description, linkTo }) => {
  return (
    <Link to={linkTo} style={cardStyles.container}>
      <h3 style={cardStyles.title}>{title}</h3>
      <p style={cardStyles.description}>{description}</p>
      <span style={cardStyles.arrow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </span>
    </Link>
  );
};

const cardStyles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'var(--card-dark)',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '120px', // Ensure some height
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: 'var(--text-light)',
  },
  description: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    margin: '0',
    flexGrow: 1, // Allows description to take available space
  },
  arrow: {
    color: 'var(--text-light)',
    alignSelf: 'flex-end', // Aligns arrow to bottom right
    marginTop: '10px',
  },
};

// Hover effects
cardStyles.container[':hover'] = {
  backgroundColor: '#2b2b2b', // Slightly lighter on hover
  transform: 'translateY(-3px)', // Slight lift
};

export default DiscoveryCard;