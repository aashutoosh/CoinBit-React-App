import React from 'react';

import NavLogo from './NavLogo';
import NavLinks from './NavLinks';
import Links from './Links';
import NavIcons from './NavIcons';
import Theme from './Theme';
import Notification from './Notification';

import './header.scss';

function Header({
  primaryNotification,
  activeSectionHandler,
  onBellClick,
  showNotificationWindow,
}) {
  return (
    <header className="header" id="header" aria-label="Header">
      <nav className="nav container" aria-label="Header">
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
