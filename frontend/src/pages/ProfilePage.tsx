// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import AuthInput from '../components/AuthInput'; // Reusing AuthInput component

const ProfilePage: React.FC = () => {
  // Dummy state for user info
  const [name, setName] = useState('FoxPotato');
  const [email, setEmail] = useState('foxpotato@example.com');
  const [phone, setPhone] = useState('123-456-7890');

  // In a real application, you'd fetch user data here
  useEffect(() => {
    // Simulate fetching user data
    // fetch('/api/user/profile')
    //   .then(res => res.json())
    //   .then(data => {
    //     setName(data.name);
    //     setEmail(data.email);
    //     setPhone(data.phone);
    //   });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving profile info:', { name, email, phone });
    // TODO: Send updated info to your Django backend
    alert('Profile updated successfully!'); // Simple feedback
  };

  return (
    <div style={pageStyles.container}>
      <header style={pageStyles.header}>
        <h1 style={pageStyles.title}>Profile</h1>
      </header>

      <main style={pageStyles.mainContent}>
        <div style={profileCardStyles.card}>
          <div style={profileCardStyles.userInfo}>
            <div style={profileCardStyles.iconContainer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--icon-purple)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={profileCardStyles.userIcon}
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span style={profileCardStyles.username}>{name}</span>
          </div>

          <h3 style={profileCardStyles.editInfoText}>Edit your Info</h3>

          <form onSubmit={handleSave} style={profileCardStyles.form}>
            <AuthInput
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthInput
              label="Ph No"
              type="tel" // Use type="tel" for phone numbers
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {/* You might want a save button here */}
            <button type="submit" style={profileCardStyles.saveButton}>
              Save Changes
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

const pageStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 70px)', // Adjust for NavBar height
    backgroundColor: 'var(--background-dark)',
    color: 'var(--text-light)',
    padding: '20px', // Overall padding
    alignItems: 'center', // Center content horizontally
  },
  header: {
    width: '100%',
    maxWidth: '1200px', // Match NavBar content width
    margin: '0 auto',
    marginBottom: '30px',
    textAlign: 'left', // Align "Profile" title to the left
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: 'var(--text-light)',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align card to the top
    width: '100%',
    paddingBottom: '40px', // Space at the bottom
  },
};

const profileCardStyles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: 'var(--card-dark)',
    borderRadius: '25px',
    padding: '30px',
    width: '100%',
    maxWidth: '450px', // Consistent width with auth forms
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center content inside the card
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    width: '100%', // Take full width to align elements
    justifyContent: 'flex-start', // Align icon and name to the left
  },
  iconContainer: {
    backgroundColor: 'var(--background-dark)', // Background for the icon
    borderRadius: '50%',
    padding: '15px', // Padding around the icon
    marginRight: '20px',
    flexShrink: 0, // Prevent shrinking
  },
  userIcon: {
    display: 'block', // Ensure SVG behaves as a block
  },
  username: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'var(--text-light)',
    flexGrow: 1, // Allow username to take space
    textAlign: 'left', // Ensure text aligns left
  },
  editInfoText: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    marginBottom: '25px',
    width: '100%',
    textAlign: 'left', // Align text to the left
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'var(--button-green)', // Reusing the green button color
    color: 'white',
    padding: '15px 30px',
    borderRadius: '10px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginTop: '30px',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    boxShadow: '0 5px 15px rgba(52, 211, 153, 0.4)',
  },
};

// Hover effect for save button
profileCardStyles.saveButton[':hover'] = {
  backgroundColor: '#28a77d',
  transform: 'translateY(-2px)',
};

export default ProfilePage;