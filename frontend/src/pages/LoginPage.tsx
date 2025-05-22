// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../components/AuthFormContainer';
import AuthButton from '../components/AuthButton';
import AuthInput from '../components/AuthInput';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // TODO: Integrate with your Django backend for login
    // On success, navigate to home page or dashboard
  };

  return (
    <AuthFormContainer>
      {/* MV Logo */}
      <div style={loginStyles.logoContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={loginStyles.logoSVG}
        >
          {/* Simple diamond-like shape representing MV */}
          <polygon points="12 2 2 12 12 22 22 12 12 2" />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black" // MV letters inside the diamond
            fontSize="10px"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            MV
          </text>
        </svg>
      </div>

      <h2 style={loginStyles.title}>LOGIN</h2>
      <form onSubmit={handleSubmit} style={loginStyles.form}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <AuthButton type="submit">Show me some movies</AuthButton>
      </form>
      <p style={loginStyles.switchAuthText}>
        Don't have an account? <Link to="/register" style={loginStyles.switchAuthLink}>Register here</Link>
      </p>
    </AuthFormContainer>
  );
};

const loginStyles: { [key: string]: React.CSSProperties } = {
  logoContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoSVG: {
    width: '80px', // Consistent size
    height: '80px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'var(--text-light)',
    marginBottom: '30px',
    letterSpacing: '2px', // Add some spacing for "LOGIN"
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  switchAuthText: {
    marginTop: '25px',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  switchAuthLink: {
    color: 'var(--accent-blue)',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginLeft: '5px',
    transition: 'color 0.2s ease',
  },
};

// Hover effect for the link
loginStyles.switchAuthLink[':hover'] = {
  color: 'var(--text-light)', // Lighten on hover
};

export default LoginPage;