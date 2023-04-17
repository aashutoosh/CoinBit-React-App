import React, { useEffect, useRef, useState } from 'react';
import {
  addToLocalStorage,
  getFromLocalStorage,
  updateLocalStorage,
} from '../../utils/localStorageUtils';

import './notificationWindow.scss';
import { ariaSymbolName } from '../../utils/helper';

function NotificationItem({ notf, showWindow, removeNotification }) {
  let symbolName = notf.condition.split(' ')[0];
  symbolName = ariaSymbolName(symbolName);
  return (
    <li className="notification">
      <span className="notification__time">{notf.time}</span>
      <div className="notification__container">
        <span className="notification__condition">{notf.condition}</span>
        <span className="notification__title">{notf.title}</span>
        <span className="notification__desc">{notf.description}</span>
      </div>
      <i
        className="notification__button--close ri-close-line"
        tabIndex={showWindow ? 0 : -1}
        role="button"
        aria-label={`Delete ${symbolName} notification`}
        onClick={() => removeNotification(notf.key)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            removeNotification(notf.key);
          }
        }}
      />
    </li>
  );
}

export default function NotificationWindow({ primaryNotification, showWindow }) {
  const [allNotifications, setAllNotifications] = useState(
    getFromLocalStorage('notifications') || [],
  );
  const notificationWindowRef = useRef(null);
  const allNotificationsRef = useRef(allNotifications);

  useEffect(() => {
    if (primaryNotification?.key) {
      setAllNotifications((prevNotifications) => [primaryNotification, ...prevNotifications]);

      if (allNotificationsRef.current.length === 0) {
        addToLocalStorage('notifications', [primaryNotification, ...allNotificationsRef.current]);
      } else {
        updateLocalStorage('notifications', [primaryNotification, ...allNotificationsRef.current]);
      }
    }
  }, [primaryNotification]);

  function clearWindow() {
    setAllNotifications([]);
    updateLocalStorage('notifications', []);
  }

  function removeNotification(key) {
    const filteredNotifications = allNotifications.filter((notf) => notf.key !== key);
    setAllNotifications(filteredNotifications);

    updateLocalStorage('notifications', filteredNotifications);
  }
  function handleClickInside(event) {
    event.stopPropagation();
  }

  const allNotificationItem = allNotifications.map((notf) => (
    <NotificationItem
      key={notf.key}
      showWindow={showWindow}
      notf={notf}
      removeNotification={() => removeNotification(notf.key)}
    />
  ));

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`notificationlist ${showWindow ? 'show' : ''}`}
      onClick={handleClickInside}
      ref={notificationWindowRef}
      aria-hidden={!showWindow}
    >
      <span className="notificationlist__title">
        Notification{' '}
        <span
          className="notificationlist__clearall"
          role="button"
          tabIndex={showWindow ? 0 : -1}
          onClick={clearWindow}
          aria-label="Clear all alert notifications."
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              clearWindow();
            }
          }}
        >
          Clear all
        </span>
      </span>
      <ul className="notificationlist__container">
        {allNotifications.length > 0 && allNotificationItem}
      </ul>
      {allNotifications.length === 0 && (
        <span className="notificationlist__empty show">Empty!</span>
      )}
    </div>
  );
}
