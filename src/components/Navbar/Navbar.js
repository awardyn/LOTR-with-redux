import React from 'react';
import { Link } from 'react-router-dom';

const navStyle = {
  backgroundColor: '#333',
  overflow: 'hidden',
};

const linkStyle = {
  float: 'left',
  color: '#f2f2f2',
  textAlign: 'center',
  padding: '14px 16px',
  textDecoration: 'none',
  fontSize: '17px',
};

const Navbar = () => (
  <div style={navStyle}>
    <Link to="/" style={linkStyle}>
      Main
    </Link>
    <Link to="/books" style={linkStyle}>
      Books
    </Link>
    <Link to="/characters" style={linkStyle}>
      Characters
    </Link>
    <Link to="/movies" style={linkStyle}>
      Movies
    </Link>
    <Link to="/quotes" style={linkStyle}>
      Quotes
    </Link>
    <Link to="/import" style={linkStyle}>
      Import
    </Link>
    <Link to="/image" style={linkStyle}>
      Show Image
    </Link>
  </div>
);

export default Navbar;
