// src/components/AuthFormContainer.tsx
import React from 'react';

interface AuthFormContainerProps {
  children: React.ReactNode;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children }) => {
  return (
    <div style={containerStyles.wrapper}>
      <div style={containerStyles.contentBox}>
        {children}
      </div>
    </div>
  );
};

const containerStyles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    backgroundColor: 'var(--background-dark)',
    minHeight: '100vh', // Full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px', // Some padding around the content
  },
  contentBox: {
    backgroundColor: 'var(--card-dark)', // Slightly lighter card dark for the form background
    borderRadius: '25px', // Rounded corners
    padding: '40px 30px', // Ample padding inside
    width: '100%',
    maxWidth: '450px', // Constrain width for a compact form
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', // Deeper shadow
    textAlign: 'center', // Center content inside
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center items like logo and title
  },
};

export default AuthFormContainer;