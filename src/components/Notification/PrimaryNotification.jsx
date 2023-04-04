import React, { useState, useEffect } from "react";
import { PRIMARY_NOTIFICATION_SEC } from "../../config";

import "./primaryNotification.scss";

function NotificationItem({ title, description, condition, icon, onClose }) {
  const [show, setShow] = useState(false);

  const closeHandler = () => {
    setShow(false);
    setTimeout(() => onClose(), 300);
  };

  useEffect(() => {
    setTimeout(() => setShow(true), 100);

    // Hide the notification item after a certain amount of time
    const timeout = setTimeout(() => {
      closeHandler();
    }, PRIMARY_NOTIFICATION_SEC);

    // Clear the timeout if the notification item is closed before it is hidden
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`notification ${show ? "show" : "hide"}`}>
      <i className={`notification__icon ${icon}`}></i>
      <div className="notification__text">
        <p className="notification__text--condition">{condition}</p>
        <p className="notification__text--title">{title}</p>
        <p className="notification__text--description">{description}</p>
      </div>
      <i className="notification__close ri-close-line" onClick={closeHandler}></i>
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
