import React from 'react';

export default function NavLinks({ children }) {
  return (
    <div className="nav__links" id="nav__links" aria-label="Navigation links">
      {children}
    </div>
  );
}
