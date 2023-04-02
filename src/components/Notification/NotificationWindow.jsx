import React, { useEffect, useRef, useState } from "react";
import "./notificationWindow.scss";

function NotificationItem({ notf, removeNotification }) {
  // console.log(notf);
  return (
    <li className="notification">
      <span className="notification__time">{notf.time}</span>
      <div className="notification__container">
        <span className="notification__condition">{notf.condition}</span>
        <span className="notification__title">{notf.title}</span>
        <span className="notification__desc">{notf.description}</span>
      </div>
      <i className="notification__button--close ri-close-line" onClick={() => removeNotification(notf.key)}></i>
    </li>
  );
}

export default function NotificationWindow({ primaryNotification, showWindow }) {
  const [allNotifications, setAllNotifications] = useState([]);
  const notificationWindowRef = useRef(null);

  useEffect(() => {
    if (primaryNotification?.key) {
      setAllNotifications((prevNotifications) => [primaryNotification, ...prevNotifications]);
    }
  }, [primaryNotification]);

  function clearWindow() {
    setAllNotifications([]);
  }

  function removeNotification(key) {
    setAllNotifications(allNotifications.filter((notf) => notf.key !== key));
  }
  function handleClickInside(event) {
    event.stopPropagation();
  }

  return (
    <div
      className={`notificationlist ${showWindow ? "show" : ""}`}
      onClick={handleClickInside}
      ref={notificationWindowRef}
    >
      <span className="notificationlist__title">
        Notification{" "}
        <span className="notificationlist__clearall" onClick={clearWindow}>
          Clear all
        </span>
      </span>
      <ul className="notificationlist__container">
        {allNotifications.length > 0 &&
          allNotifications.map((notf) => (
            <NotificationItem key={notf.key} notf={notf} removeNotification={removeNotification} />
          ))}
      </ul>
      {allNotifications.length === 0 && <span className="notificationlist__empty show">Empty!</span>}
    </div>
  );
}
