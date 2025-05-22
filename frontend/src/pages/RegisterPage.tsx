// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    // On success, navigate to login page or directly home
  };

  return (
    <AuthFormContainer>
      <h2 style={registerStyles.title}>REGISTER</h2>
      <form onSubmit={handleSubmit} style={registerStyles.form}>
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
      <p style={registerStyles.switchAuthText}>
        Already have an account? <Link to="/login" style={registerStyles.switchAuthLink}>Login here</Link>
      </p>
    </AuthFormContainer>
  );
};

const registerStyles: { [key: string]: React.CSSProperties } = {
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: 'var(--text-light)',
    marginBottom: '30px',
    letterSpacing: '2px',
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
registerStyles.switchAuthLink[':hover'] = {
  color: 'var(--text-light)',
};

export default RegisterPage;