import React from 'react';

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
