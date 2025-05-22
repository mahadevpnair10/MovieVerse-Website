// src/components/AuthButton.tsx
import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({ children, ...props }) => {
  return (
    <button style={buttonStyles.button} {...props}>
      {children}
    </button>
  );
};

const buttonStyles: { [key: string]: React.CSSProperties } = {
  button: {
    backgroundColor: '#34d399', // A vibrant green similar to the image
    color: 'white',
    padding: '15px 30px',
    borderRadius: '10px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginTop: '30px', // Space above the button
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    boxShadow: '0 5px 15px rgba(52, 211, 153, 0.4)', // Green shadow
  },
};

// Hover effect for the button
buttonStyles.button[':hover'] = {
  backgroundColor: '#28a77d', // Darker green on hover
  transform: 'translateY(-2px)',
};

export default AuthButton;