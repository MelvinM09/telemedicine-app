// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Logo from '../logo.svg';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/"><img src={Logo} alt="Logo" /></Link>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Try Now</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/signup" className="demo-button">Sign Up</Link></li>
        <li><Link to="/signin" className="login-button">Log In</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
