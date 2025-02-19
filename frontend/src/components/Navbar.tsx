// frontend/src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Create this file if you want to add custom styles
import logo from '../assets/logo-c.png'; // Adjust the path as necessary

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/customers">Customers</Link>
      </div>
    </nav>
  );
};

export default Navbar;