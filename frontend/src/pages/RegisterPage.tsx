/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';
import AuthFormContainer from '../components/AuthFormContainer';
import AuthButton from '../components/AuthButton';
import AuthInput from '../components/AuthInput';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Register attempt:', { email, username, password });
    // TODO: Integrate with your Django backend for registration
  };

  return (
    <AuthFormContainer>
      <h2 css={titleStyle}>REGISTER</h2>
      <form onSubmit={handleSubmit} css={formStyle}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthInput
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <AuthButton type="submit">Show me some movies</AuthButton>
      </form>
      <p css={switchAuthTextStyle}>
        Already have an account?{' '}
        <Link to="/login" css={switchAuthLinkStyle}>Login here</Link>
      </p>
    </AuthFormContainer>
  );
};

export default RegisterPage;

// Emotion styles
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
