import React, { useState } from 'react';

function NavLink({ name, icon, activeLink, handleClick, handleKeyDown }) {
  const isLinkActive = activeLink === name;
  return (
    <a
      href={`#${name}`}
      className={`nav__link nav__link--${name} ${isLinkActive ? 'active' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={isLinkActive ? `${name} page active` : `Go to ${name} page`}
    >
      <div>
        <span aria-label={isLinkActive ? `${name} page active` : `Go to ${name} page`}>{name}</span>
        <i className={icon} />
      </div>
    </a>
  );
}

export default function Links({ activeSection }) {
  const [activeLink, setActiveLink] = useState('alerts');

  const handleClick = (event) => {
    const clickedLinkText = event.currentTarget.querySelector('span').textContent.toLowerCase();
    setActiveLink(clickedLinkText);
    activeSection(clickedLinkText);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  };

  return (
    <div className="links__container">
      <NavLink
        name="watchlist"
        icon="ri-apps-2-line"
        activeLink={activeLink}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />
      <NavLink
        name="alerts"
        icon="ri-alarm-line"
        activeLink={activeLink}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />
      <NavLink
        name="settings"
        icon="ri-settings-3-line"
        activeLink={activeLink}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />
      <NavLink
        name="about"
        icon="ri-user-line"
        activeLink={activeLink}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );
}
