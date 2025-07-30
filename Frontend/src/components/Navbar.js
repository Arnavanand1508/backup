import React from 'react';
import './Navbar.css';
import FssaiLogo from '../assets/images/FSSAI_Logo-2.png';
import EatRight from '../assets/images/EatRightIndia.png';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* --- UPDATED: FSSAI logo now links to the Home page ('/') --- */}
        <a href="/">
          <img src={FssaiLogo} alt="FSSAI Logo" className="navbar-logo" />
        </a>
      </div>

      {/* --- UPDATED: "Home" text link has been removed --- */}
      <nav className="navbar-center">
        <a href="https://fssai.gov.in/" target="_blank" rel="noopener noreferrer">FSSAI</a>
        <a href="https://fssai.gov.in/index.php?page=about-us.php" target="_blank" rel="noopener noreferrer">About FSSAI</a>
        <a href="https://eatrightindia.gov.in/" target="_blank" rel="noopener noreferrer">Eat Right India</a>
      </nav>

      <div className="navbar-right">
        {/* This logo remains a clickable link. Remember to add your URL. */}
        <a href="https://eatrightindia.gov.in/" target="_blank" rel="noopener noreferrer">
          <img src={EatRight} alt="Eat Right India" className="navbar-logo" />
        </a>
      </div>
    </header>
  );
};

export default Navbar;