/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react'; // Import css from emotion
import AuthFormContainer from '../components/AuthFormContainer';
import AuthButton from '../components/AuthButton';
import AuthInput from '../components/AuthInput';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { backendApi } from '../context/AuthContext'; // Import the configured axios instance

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State for error messages

  const navigate = useNavigate();
  const { login, isLoggedIn, getCSRFToken } = useAuth(); // Get CSRF token and login function

  useEffect(() => {
    // If user is already logged in, redirect them away from register page
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      await getCSRFToken(); // Ensure CSRF token is fetched before POST request

      // Make the registration API call to your Django backend
      const response = await backendApi.post('api/auth/register/', { username, email, password });

      if (response.status === 201) {
        // Registration successful
        // Now, attempt to log the user in automatically
        const loginSuccess = await login(username, password);
        if (loginSuccess) {
          navigate('/'); // Redirect to home on successful registration AND login
        } else {
          // This case might happen if registration is successful but login fails (e.g., backend issue)
          setError('Registration successful, but automatic login failed. Please try logging in manually.');
        }
      } else {
        // Handle non-201 responses from the backend
        setError(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      // Handle network errors or errors from the backend (e.g., 400 Bad Request for existing username)
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed. Check your input.');
    }
  };

  return (
    <AuthFormContainer>
      <h2 css={titleStyle}>REGISTER</h2>
      {error && <p css={errorMessageStyle}>{error}</p>} {/* Display error message */}
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
  color: 'var(--text-light)', // Assuming you have --text-light CSS variable
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
  color: 'var(--text-muted)', // Assuming you have --text-muted CSS variable
  fontSize: '0.95rem',
});

const switchAuthLinkStyle = css({
  color: 'var(--accent-blue)', // Assuming you have --accent-blue CSS variable
  textDecoration: 'none',
  fontWeight: 'bold',
  marginLeft: '5px',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: 'var(--text-light)', // Hover effect using --text-light
  },
});

const errorMessageStyle = css({
  color: 'var(--error-red)', // Assuming you have --error-red CSS variable
  marginBottom: '15px',
  textAlign: 'center',
});