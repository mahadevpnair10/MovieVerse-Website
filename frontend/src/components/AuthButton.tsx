/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({ children, ...props }) => {
  return (
    <button css={buttonStyle} {...props}>
      {children}
    </button>
  );
};

const buttonStyle = css({
  backgroundColor: '#34d399', // Vibrant green
  color: 'white',
  padding: '15px 30px',
  borderRadius: '10px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  marginTop: '30px',
  transition: 'background-color 0.2s ease, transform 0.1s ease',
  boxShadow: '0 5px 15px rgba(52, 211, 153, 0.4)',
  '&:hover': {
    backgroundColor: '#28a77d',
    transform: 'translateY(-2px)',
  },
});

export default AuthButton;
