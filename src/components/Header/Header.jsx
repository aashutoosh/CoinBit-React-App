import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getFromLocalStorage, addToLocalStorage } from '../../utils/localStorageUtils';
import './header.scss';

function NavLogo() {
  return (
    <div className="nav__left">
      <a className="nav__logo" href="/">
        <svg
          className="nav__logo--icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={36}
          height={36}
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M23 12v2c0 3.314-4.925 6-11 6-5.967 0-10.824-2.591-10.995-5.823L1 14v-2c0 3.314 4.925 6 11 6s11-2.686 11-6zM12 4c6.075 0 11 2.686 11 6s-4.925 6-11 6-11-2.686-11-6 4.925-6 11-6z"
            fill="rgba(240,185,11,1)"
          />
        </svg>
        <span className="nav__logo--title">CoinBit</span>
      </a>
    </div>
  );
}

function NavLinks({ children }) {
  return (
    <div className="nav__links" id="nav__links">
      {children}
    </div>
  );
}

function NavLink({ name, icon, activeLink, handleClick, handleKeyDown }) {
  return (
    <a
      href={`#${name}`}
      className={`nav__link nav__link--${name} ${activeLink === name ? 'active' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div>
        <span>{name}</span>
        <i className={icon} />
      </div>
    </a>
  );
}

function Links({ activeSection }) {
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

function NavIcons({ children }) {
  return <div className="nav__icons">{children}</div>;
}

function Theme() {
  const [theme, setTheme] = useState(getFromLocalStorage('theme') || 'dark');
  const moonIcon = useRef(null);
  const sunIcon = useRef(null);

  useEffect(() => {
    const html = document.querySelector('html');

    addToLocalStorage('theme', theme);

    if (html.dataset.theme !== theme) {
      if (theme === 'light') {
        html.dataset.theme = 'light';
        sunIcon.current.classList.remove('active');
        moonIcon.current.classList.add('active');
      } else {
        html.dataset.theme = 'dark';
        moonIcon.current.classList.remove('active');
        sunIcon.current.classList.add('active');
      }
    }
  }, [theme]);

  const themeToggleHandler = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const keyDownHandler = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      themeToggleHandler();
    }
  };

  return (
    <div
      className="nav__theme"
      onClick={themeToggleHandler}
      onKeyDown={keyDownHandler}
      role="button"
      tabIndex={0}
    >
      {/* Moon Icon */}
      <svg
        ref={moonIcon}
        className="icon icon-moon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={16}
        height={16}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z" />
      </svg>
      {/* Sun Icon */}
      <svg
        ref={sunIcon}
        className="icon icon-sun active"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={16}
        height={16}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
      </svg>
    </div>
  );
}

function Notification({ primaryNotification, onBellClick, showNotificationWindow }) {
  const notificationBellRef = useRef(null);
  const notificationLightRef = useRef(null);

  const onBellClickMemo = useCallback(onBellClick, [onBellClick]);

  const addNotificationLight = () => {
    notificationLightRef.current.classList.add('active');
  };

  const removeNotificationLight = () => {
    notificationLightRef.current.classList.remove('active');
  };

  const handleBellClick = () => {
    onBellClickMemo();
    removeNotificationLight();
  };

  useEffect(() => {
    function handleOutsideClick(event) {
      if (notificationBellRef.current.contains(event.target)) {
        event.stopPropagation();
      } else if (showNotificationWindow) {
        onBellClickMemo();
      }
    }

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showNotificationWindow, onBellClickMemo]);

  useEffect(() => {
    if (primaryNotification?.key) {
      addNotificationLight();
    }
  }, [primaryNotification]);

  const keyDownHandler = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBellClick();
    }
  };

  return (
    <div
      className="nav__notification"
      onClick={handleBellClick}
      ref={notificationBellRef}
      onKeyDown={keyDownHandler}
      role="button"
      tabIndex={0}
    >
      <svg
        className=""
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={16}
        height={16}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zm-2 0v-7a6 6 0 1 0-12 0v7h12zm-9 4h6v2H9v-2z" />
      </svg>
      <span className="nav__notification--light show" ref={notificationLightRef} />
    </div>
  );
}

function Header({
  primaryNotification,
  activeSectionHandler,
  onBellClick,
  showNotificationWindow,
}) {
  return (
    <header className="header" id="header">
      <nav className="nav container">
        <NavLogo />
        <NavLinks>
          <Links activeSection={activeSectionHandler} />
          <NavIcons>
            <Theme />
            <Notification
              primaryNotification={primaryNotification}
              onBellClick={onBellClick}
              showNotificationWindow={showNotificationWindow}
            />
          </NavIcons>
        </NavLinks>
      </nav>
    </header>
  );
}

export default React.memo(Header);
