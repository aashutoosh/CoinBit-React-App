import React, { useState, useEffect, useCallback } from 'react';
import { PRIMARY_NOTIFICATION_SEC } from '../../config';

import './primaryNotification.scss';

function NotificationItem({ title, description, condition, icon, onClose }) {
  const [show, setShow] = useState(false);

  const closeHandler = useCallback(() => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);

    // Hide the notification item after a certain amount of time
    const timeout = setTimeout(() => {
      closeHandler();
    }, PRIMARY_NOTIFICATION_SEC);

    // Clear the timeout if the notification item is closed before it is hidden
    return () => clearTimeout(timeout);
  }, [closeHandler]);

  const closeKeyDownHandler = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      closeHandler();
    }
  };

  return (
    <div
      className={`notification ${show ? 'show' : 'hide'}`}
      aria-live="assertive"
      aria-atomic="true"
    >
      <i className={`notification__icon ${icon}`} />
      <div className="notification__text">
        <p className="notification__text--condition">{condition}</p>
        <p className="notification__text--title">{title}</p>
        <p className="notification__text--description">{description}</p>
      </div>
      <i
        className="notification__close ri-close-line"
        onClick={closeHandler}
        onKeyDown={closeKeyDownHandler}
        role="button"
        tabIndex={0}
        aria-label="Close"
      />
    </div>
  );
}

function PrimaryNotification({ notification }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (notification?.key) {
      setItems((prevItems) => [...prevItems, notification]);
    }
  }, [notification]);

  const handleClose = (key) => {
    setItems((prevItems) => prevItems.filter((item) => item.key !== key));
  };

  return (
    <div className="primary__notifications" id="primary__notifications">
      {items.map((item) => (
        <NotificationItem
          key={item.key}
          title={item.title}
          description={item.description}
          condition={item.condition}
          icon={item.icon}
          onClose={() => handleClose(item.key)}
        />
      ))}
    </div>
  );
}

export default React.memo(PrimaryNotification);
