import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Importing the CSS file for the Navbar styling
const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Navigation links to different pages of the application */}
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Home
      </NavLink>
      <NavLink
        to="/publishers"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Publishers
      </NavLink>
      <NavLink
        to="/categories"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Categories
      </NavLink>
      <NavLink
        to="/authors"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Authors
      </NavLink>
      <NavLink
        to="/books"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Books
      </NavLink>
      <NavLink
        to="/borrow"
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        Borrowing
      </NavLink>
    </nav>
  );
};

export default Navbar;
