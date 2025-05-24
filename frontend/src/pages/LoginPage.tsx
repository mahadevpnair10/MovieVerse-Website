/** @jsxImportSource @emotion/react */
// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from '@emotion/styled'; // Import styled from emotion

// Styled components for LoginPage
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px); /* Adjust for navbar height */
  background-color: var(--background-dark);
  color: var(--text-light);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: var(--accent-blue);
`;

const ErrorMessage = styled.p`
  color: var(--error-red);
  margin-bottom: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  background-color: var(--card-dark);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  padding: 12px 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--background-light);
  color: var(--text-light);
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: var(--accent-blue);
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  background-color: var(--accent-blue);
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3; /* A slightly darker blue on hover */
  }
`;

const RegisterLinkContainer = styled.p`
  margin-top: 25px;
  color: var(--text-muted);
  font-size: 0.95rem;
`;

const StyledLink = styled(Link)`
  color: var(--accent-blue);
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await login(username, password);
    if (!success) {
      setError('Login failed. Invalid username or password.');
    }
  };

  return (
    <PageContainer>
      <Title>Login</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Log In</Button>
      </Form>
      <RegisterLinkContainer>
        Don't have an account? <StyledLink to="/register">Register</StyledLink>
      </RegisterLinkContainer>
    </PageContainer>
  );
};

export default LoginPage;