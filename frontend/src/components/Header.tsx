// src/components/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  initialSearchTerm?: string;
  onSearchSubmit: (term: string) => void;
  showSearchBar?: boolean; // Controls whether search bar is visible
}

const Header: React.FC<HeaderProps> = ({ initialSearchTerm = '', onSearchSubmit, showSearchBar = true }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const {user} = useAuth();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Header: Search form submitted with term:', searchTerm); // Debug log
    if (searchTerm.trim()) {
      console.log('Header: Calling onSearchSubmit with:', searchTerm.trim()); // Debug log
      onSearchSubmit(searchTerm.trim());
      // Remove the navigate call - we want to stay on homepage and show overlay
    }
  };

  return (
    <header style={headerStyles.header}>
      <div style={headerStyles.topRow}>
        <div style={headerStyles.greeting}>
          <h1 style={headerStyles.greetingText}>Good Morning,</h1>
          <h1 style={headerStyles.username}>{user?.username}</h1>
        </div>
        <Link to="/profile" style={headerStyles.profileIconContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={headerStyles.profileIcon}
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>
      </div>

      {showSearchBar && (
        <form onSubmit={handleSearch} style={headerStyles.searchContainer}>
          <input
            type="text"
            placeholder="Search Movies Here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={headerStyles.searchInput}
          />
          <button type="submit" style={headerStyles.searchButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      )}
    </header>
  );
};

const headerStyles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: 'var(--background-dark)',
    padding: '20px',
    paddingBottom: '0px',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  greeting: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  greetingText: {
    fontSize: '1rem',
    fontWeight: 'normal',
    margin: 0,
    color: 'var(--text-muted)',
  },
  username: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: 0,
    marginTop: '5px',
    color: 'var(--text-light)',
  },
  profileIconContainer: {
    color: 'var(--text-light)',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.2s ease',
    textDecoration: 'none',
  },
  profileIcon: {
    width: '24px',
    height: '24px',
  },
  searchContainer: {
    display: 'flex',
    backgroundColor: 'var(--card-dark)',
    borderRadius: '10px',
    padding: '12px 15px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-light)',
    fontSize: '1rem',
    padding: '0 10px',
  },
  searchButton: {
    color: 'var(--text-muted)',
    transition: 'color 0.2s ease',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Header;
