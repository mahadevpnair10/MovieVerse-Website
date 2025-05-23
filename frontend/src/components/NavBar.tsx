// src/components/NavBar.tsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import MvLogo from '../assets/MVV.png'; // Assuming your logo is in src/assets/MVV.png

// Define prop interface for NavBar
interface NavBarProps {
  isVisible: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isVisible }) => { // Accept isVisible prop
  return (
    <nav style={{
        ...navStyles.navbar,
        // Apply transform based on isVisible prop
        transform: isVisible ? 'translateY(0%)' : 'translateY(-100%)',
      }}>
      <div style={navStyles.navContainer}>
        <Link to="/">
          <img
            src={MvLogo}
            alt="MovieVerse Logo"
            style={navStyles.logo}
          />
        </Link>
        <div style={navStyles.links}>
          <NavLink
            to="/"
            style={({ isActive }) => ({ ...navStyles.link, ...(isActive ? navStyles.activeLink : {}) })}
          >
            Home
          </NavLink>
          <NavLink
            to="/watchlist"
            style={({ isActive }) => ({ ...navStyles.link, ...(isActive ? navStyles.activeLink : {}) })}
          >
            Watchlist
          </NavLink>
          <NavLink
            to="/tinder"
            style={({ isActive }) => ({ ...navStyles.link, ...(isActive ? navStyles.activeLink : {}) })}
          >
            Tinder
          </NavLink>
          <NavLink
            to="/mood"
            style={({ isActive }) => ({ ...navStyles.link, ...(isActive ? navStyles.activeLink : {}) })}
          >
            Mood
          </NavLink>
          <NavLink
            to="/profile"
            style={({ isActive }) => ({ ...navStyles.link, ...(isActive ? navStyles.activeLink : {}) })}
          >
            Profile
          </NavLink>
          <NavLink
            to="/login"
            style={({ isActive }) => ({ ...navStyles.link, ...(isActive ? navStyles.activeLink : {}) })}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            style={({ isActive }) => ({ ...navStyles.link, ...(isActive ? navStyles.activeLink : {}) })}
          >
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const navStyles: { [key: string]: React.CSSProperties } = {
  navbar: {
    backgroundColor: 'var(--card-dark)',
    padding: '15px 20px',
    borderBottom: '1px solid var(--border-color)',
    position: 'fixed', // Changed from sticky to fixed for smoother transitions
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    width: '100%',
    transition: 'transform 0.3s ease-in-out', // Smooth transition for hide/show
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
  },
  links: {
    display: 'flex',
    gap: '25px',
  },
  link: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '5px 0',
    position: 'relative',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  activeLink: {
    color: 'var(--text-light)',
  },
};

// Underline on hover and active state (Emotion-compatible if you were using it)
// For now, assuming you're still using this direct style injection
const styleElement = document.createElement('style');
styleElement.innerHTML = `
.links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 0;
  height: 2px;
  background-color: var(--accent-blue);
  transition: width 0.3s ease;
}

.links a:hover::after {
  width: 100%;
}

.links .activeLink::after {
  width: 100%;
  background-color: var(--accent-blue);
}
`;
if (!document.head.querySelector('style[data-navbar-styles]')) {
  styleElement.setAttribute('data-navbar-styles', 'true');
  document.head.appendChild(styleElement);
}

export default NavBar;