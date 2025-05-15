import React from 'react';
import logoImage from '../assets/Logo.png';

function Logo({ className = '', width = '130px' }) {
  return (
    <div>
      <img 
        src={logoImage} 
        alt="Logo" 
        className={className} 
        style={{ width }} 
      />
    </div>
  );
}

export default Logo;
