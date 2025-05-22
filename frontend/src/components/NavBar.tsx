// src/components/NavBar.tsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <nav style={navStyles.navbar}>
      <div style={navStyles.navContainer}>
        <Link to="/" style={navStyles.logoLink}>
          <div style={navStyles.logo}>MovieVerse</div> {/* Changed text to MovieVerse */}
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
        </div>
      </div>
    </nav>
  );
};

const navStyles: { [key: string]: React.CSSProperties } = {
  navbar: {
    backgroundColor: 'var(--card-dark)', // Slightly different from background to stand out
    padding: '15px 20px',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: 'var(--text-light)',
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
    transition: 'color 0.2s ease',
  },
  activeLink: {
    color: 'var(--text-light)',
  },
};

// Underline on hover and active state
const styleElement = document.createElement('style');
styleElement.innerHTML = `
.links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px; /* Adjust as needed */
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
  background-color: var(--accent-blue); /* Ensure active link has the underline */
}
`;
document.head.appendChild(styleElement);

export default NavBar;