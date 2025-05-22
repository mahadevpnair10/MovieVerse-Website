/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';
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
  };

  return (
    <AuthFormContainer>
      {/* MV Logo */}
      <div css={logoContainerStyle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          css={logoSVGStyle}
        >
          <polygon points="12 2 2 12 12 22 22 12 12 2" />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="black"
            fontSize="10px"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            MV
          </text>
        </svg>
      </div>

      <h2 css={titleStyle}>LOGIN</h2>
      <form onSubmit={handleSubmit} css={formStyle}>
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
      <p css={switchAuthTextStyle}>
        Don&apos;t have an account?{' '}
        <Link to="/register" css={switchAuthLinkStyle}>Register here</Link>
      </p>
    </AuthFormContainer>
  );
};

export default LoginPage;

// Emotion styles
const logoContainerStyle = css({
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
});

const logoSVGStyle = css({
  width: '80px',
  height: '80px',
});

const titleStyle = css({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: 'var(--text-light)',
  marginBottom: '30px',
  letterSpacing: '2px',
});

const formStyle = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const switchAuthTextStyle = css({
  marginTop: '25px',
  color: 'var(--text-muted)',
  fontSize: '0.95rem',
});

const switchAuthLinkStyle = css({
  color: 'var(--accent-blue)',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginLeft: '5px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: 'var(--text-light)',
  },
});
