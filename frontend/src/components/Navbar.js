// src/components/Navbar.js
import React from 'react';
import './Navbar.css';
import Logo from '../logo.svg';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={Logo} alt="Logo" />
      </div>
      <ul className="navbar-menu">
        <li><a href="#">Try Now</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#" className="demo-button">Sign Up</a></li>
        <li><a href="#" className="login-button">Log In</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;