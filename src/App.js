import React, { useState } from 'react';
import './App.css'; // Import your CSS file here
import TimeZoneConverter from './TimeZoneConverter';

function App() {

  //toggle dark and light mode button is defined in the TimeZoneConverter.js and imported appstyles in that file

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const appStyles = {
    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    color: darkMode ? '#ffffff' : '#000000',
    minHeight: '100vh', // Set minimum height to fill the entire viewport
    transition: 'background-color 0.3s, color 0.3s', // Add a smooth transition
  };

  return (
    <div className="app" style={appStyles}>
      <TimeZoneConverter darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
}

export default App;

