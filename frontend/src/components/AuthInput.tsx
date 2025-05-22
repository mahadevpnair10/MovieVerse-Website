// src/components/AuthInput.tsx
import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, id, ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s/g, '-'); // Generate ID if not provided

  return (
    <div style={inputStyles.wrapper}>
      <label htmlFor={inputId} style={inputStyles.label}>
        {label}
      </label>
      <input
        id={inputId}
        style={inputStyles.input}
        {...props}
      />
    </div>
  );
};

const inputStyles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    width: '100%',
    marginBottom: '20px', // Space between inputs
    textAlign: 'left', // Align label to the left
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '8px',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '15px 20px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--background-dark)', // Input background
    color: 'var(--text-light)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
};

// Focus effect for inputs
const styleElement = document.createElement('style');
styleElement.innerHTML = `
  .auth-input-field:focus {
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
  }
`;
document.head.appendChild(styleElement);
inputStyles.input['className'] = 'auth-input-field'; // Apply class for focus effect


export default AuthInput;