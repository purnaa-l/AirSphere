import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add this import
import './AdminHeroPage.css';

function AdminHeroPage() {
    const phrases = [
            "Hello Admin! Hope you are having a great AIR day!",
            "Manage data effortlessly and make impactful decisions.",
            "Track user engagement and resolve queries with ease.",
            "Dive into insights and lead the way to cleaner air.",
            "Empowering you with tools to monitor and manage!",
          ];
        

  const [loadingText, setLoadingText] = useState(''); // Current text being typed
  const [index, setIndex] = useState(0); // Current phrase index
  const [typingIndex, setTypingIndex] = useState(0); // Current character index for typing

  useEffect(() => {
    const currentPhrase = phrases[index];
    if (typingIndex < currentPhrase.length) {
      const typingTimeout = setTimeout(() => {
        setLoadingText((prevText) => prevText + currentPhrase[typingIndex]); // Add one character at a time
        setTypingIndex((prevIndex) => prevIndex + 1); // Increment character index
      }, 100); // Typing speed (adjust as needed)
      return () => clearTimeout(typingTimeout); // Cleanup timeout on unmount or re-run
    } else {
      // When phrase is fully typed, wait before starting the next phrase
      const phraseTimeout = setTimeout(() => {
        setLoadingText(''); // Clear text for the next phrase
        setTypingIndex(0); // Reset character index
        setIndex((prevIndex) => (prevIndex + 1) % phrases.length); // Move to the next phrase (loop)
      }, 2000); // Wait 2 seconds before clearing text
      return () => clearTimeout(phraseTimeout); // Cleanup timeout on unmount or re-run
    }
  }, [typingIndex, index, phrases]);

  return (
    <div className="hero-container">
      <video src="/videos/video-1.mp4" autoPlay loop muted />
      <h2 className="hero-heading">Welcome, Admin!</h2>
      <p className="loading-text-hero">{loadingText}</p>
      <div className="button-group">
           <Link to="/add-data" className="cta-button">Add Data</Link>
           <Link to="/view-engagement" className="cta-button">View User Engagement</Link>
           <Link to="/admin/dashboard" className="cta-button">View AQI Data</Link>
           <Link to="/resolve-queries" className="cta-button">Resolve Queries</Link>
           <Link to="/apilogs" className="cta-button">View API Logs</Link>
      </div>
    </div>
  );
}

export default AdminHeroPage;
