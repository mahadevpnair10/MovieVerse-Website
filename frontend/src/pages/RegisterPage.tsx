/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { backendApi } from '../context/AuthContext';
import styled from '@emotion/styled';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-dark) 0%, rgba(15, 17, 27, 0.95) 100%);
  color: var(--text-light);
  padding: 20px;
  padding-top: 100px; /* Add top padding to account for navbar */
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #007BFF, #00c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  letter-spacing: 1px;
  margin-top: 0; /* Remove default top margin */
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4757;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 500;
`;

const SuccessMessage = styled.p`
  color: #32c852;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background: rgba(30, 34, 54, 0.8);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  
  @media (max-width: 768px) {
    padding: 30px 25px;
    max-width: 350px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 15px 20px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${props => props.hasError ? '#ff4757' : 'rgba(255, 255, 255, 0.2)'};
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-light);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${props => props.hasError ? '#ff4757' : '#007BFF'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(255, 71, 87, 0.1)' : 'rgba(0, 123, 255, 0.1)'};
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: #888;
  }
`;

const ValidationMessage = styled.span<{ type: 'error' | 'success' | 'info' }>`
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
  color: ${props => {
    switch (props.type) {
      case 'error': return '#ff4757';
      case 'success': return '#32c852';
      case 'info': return '#007BFF';
      default: return '#888';
    }
  }};
`;

const Button = styled.button`
  padding: 15px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #007BFF, #00c6ff);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginLinkContainer = styled.p`
  margin-top: 30px;
  color: #b8c1ec;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 20px; /* Add bottom margin for mobile */
`;

const StyledLink = styled(Link)`
  color: #007BFF;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #00c6ff;
    text-decoration: underline;
  }
`;

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      navigate('/');
    }
  }, [isLoggedIn, isLoading, navigate]);

  // Check username availability with debounce
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length >= 3) {
        setCheckingUsername(true);
        try {
          const response = await backendApi.get(`api/auth/check-username/?username=${formData.username}`);
          setUsernameAvailable(response.data.available);
        } catch (error) {
          console.error('Error checking username:', error);
        } finally {
          setCheckingUsername(false);
        }
      } else {
        setUsernameAvailable(null);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (usernameAvailable === false) {
      newErrors.username = 'Username is already taken';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(null);

    try {
      const response = await backendApi.post('api/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setSuccess('Registration successful! Redirecting to login...');
      
      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Registration error:', err);
      
      if (err.response?.data) {
        // Handle specific field errors from backend
        if (typeof err.response.data === 'object') {
          setErrors(err.response.data);
        } else if (err.response.data.error) {
          setErrors({ general: err.response.data.error });
        } else if (err.response.data.message) {
          setErrors({ general: err.response.data.message });
        }
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          Loading authentication status...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>Register</Title>
      
      {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            hasError={!!errors.username}
            disabled={isSubmitting}
          />
          {checkingUsername && (
            <ValidationMessage type="info">Checking availability...</ValidationMessage>
          )}
          {usernameAvailable === true && formData.username.length >= 3 && (
            <ValidationMessage type="success">Username is available!</ValidationMessage>
          )}
          {errors.username && (
            <ValidationMessage type="error">{errors.username}</ValidationMessage>
          )}
        </InputContainer>

        <InputContainer>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            hasError={!!errors.email}
            disabled={isSubmitting}
          />
          {errors.email && (
            <ValidationMessage type="error">{errors.email}</ValidationMessage>
          )}
        </InputContainer>

        <InputContainer>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            hasError={!!errors.password}
            disabled={isSubmitting}
          />
          {errors.password && (
            <ValidationMessage type="error">{errors.password}</ValidationMessage>
          )}
        </InputContainer>

        <InputContainer>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            hasError={!!errors.confirmPassword}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <ValidationMessage type="error">{errors.confirmPassword}</ValidationMessage>
          )}
        </InputContainer>

        <Button 
          type="submit" 
          disabled={isSubmitting || usernameAvailable === false || checkingUsername}
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </Button>
      </Form>
      
      <LoginLinkContainer>
        Already have an account? <StyledLink to="/login">Log In</StyledLink>
      </LoginLinkContainer>
    </PageContainer>
  );
};

export default RegisterPage;
