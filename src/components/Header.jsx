import React from "react";
import { Link } from "react-router-dom";
import iLogo from '../assets/logo.png';

export default function Header() {
  return (
    <header>
      <span style={{ display: 'inline-block'}}>
        <img src={iLogo} alt="Logo" style={{ height: '40px', verticalAlign: 'middle', marginRight: '10px' }} />
      </span>
      <h1 style={{ display: 'inline', verticalAlign: 'middle' }}>
        Personality Quiz 
      </h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/quiz">Quiz</Link>
      </nav>
    </header>
  );
}