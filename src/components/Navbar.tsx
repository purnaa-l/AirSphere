// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTree, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

// function Navbar({ theme, toggleTheme }) {
//   return (
//     <nav className="navbar navbar-expand-md" style={{ backgroundColor: '#000', padding: '1rem 0' }}>
//       <div className="container-fluid">
//         {/* Logo Section */}
//         <Link to="/" className="navbar-brand d-flex align-items-center" style={{ color: '#fff', fontFamily: 'Poiret One' }}>
//           <FontAwesomeIcon icon={faTree} className="me-2" />
//           AirSphere
//         </Link>

//         {/* Navbar Toggler for Mobile View */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* Navigation Links */}
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto">
//             <li className="nav-item">
//               <Link to="/" className="nav-link" style={{ color: '#fff' }}>Home</Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/fetch-aqi" className="nav-link" style={{ color: '#fff' }}>Fetch AQI</Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/predict-aqi" className="nav-link" style={{ color: '#fff' }}>Predict AQI</Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/view-past-aqis" className="nav-link" style={{ color: '#fff' }}>View Past AQIs</Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/contact-form" className="nav-link" style={{ color: '#fff' }}>Contact Us</Link>
//             </li>
//           </ul>
//           {/* Theme Toggle Button */}
//           <button 
//             className="theme-toggle-button" 
//             onClick={toggleTheme} 
//             style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', marginLeft: '1rem', cursor: 'pointer' }}
//           >
//             {theme === 'light' ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTree, faSun, faMoon, faRobot } from '@fortawesome/free-solid-svg-icons';
import Chatbot from './pages/Chatbot';
function Navbar({ theme, toggleTheme }) {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  return (
    <>
      <nav className="navbar navbar-expand-md" style={{ backgroundColor: '#000', padding: '1rem 0' }}>
        <div className="container-fluid">
          {/* Logo Section */}
          <Link to="/" className="navbar-brand d-flex align-items-center" style={{ color: '#fff', fontFamily: 'Poiret One' }}>
            <FontAwesomeIcon icon={faTree} className="me-2" />
            AirSphere
          </Link>

          {/* Navbar Toggler for Mobile View */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link" style={{ color: '#fff' }}>Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/fetch-aqi" className="nav-link" style={{ color: '#fff' }}>Fetch AQI</Link>
              </li>
              {/* <li className="nav-item">
                <Link to="/predict-aqi" className="nav-link" style={{ color: '#fff' }}>Predict AQI</Link>
              </li> */}
              <li className="nav-item">
                <Link to="/view-past-aqis" className="nav-link" style={{ color: '#fff' }}>View Past AQIs</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact-form" className="nav-link" style={{ color: '#fff' }}>Contact Us</Link>
              </li>
            </ul>
            {/* Theme Toggle Button */}
            <button
              className="theme-toggle-button"
              onClick={toggleTheme}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', marginLeft: '1rem', cursor: 'pointer' }}
            >
              {theme === 'light' ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
            </button>
            {/* Chatbot Button */}
            <button
              onClick={toggleChatbot}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                marginLeft: '1rem',
                cursor: 'pointer'
              }}
            >
              <FontAwesomeIcon icon={faRobot} />
            </button>
          </div>
        </div>
      </nav>
      {/* Chatbot Component */}
      {chatbotOpen && <Chatbot closeChatbot={toggleChatbot} />}
    </>
  );
}

export default Navbar;
