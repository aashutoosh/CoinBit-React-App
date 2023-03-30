import { useState, useEffect } from "react";
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

export default function PrimaryNotification({ notification }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (notification?.id) {
      setItems((prevItems) => [...prevItems, notification]);
    }
  }, [notification]);

  const handleClose = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="primary__notifications" id="primary__notifications">
      {items.map((item) => (
        <NotificationItem
          key={item.id}
          title={item.title}
          description={item.description}
          condition={item.condition}
          icon={item.icon}
          onClose={() => handleClose(item.id)}
        />
      ))}
    </div>
  );
}
