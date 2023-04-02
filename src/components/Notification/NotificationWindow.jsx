import React, { useEffect, useRef, useState } from "react";
import { addToLocalStorage, getFromLocalStorage, updateLocalStorage } from "../../utils/localStorageUtils";
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
  const [allNotifications, setAllNotifications] = useState(getFromLocalStorage("notifications") || []);
  const notificationWindowRef = useRef(null);

  useEffect(() => {
    if (primaryNotification?.key) {
      setAllNotifications((prevNotifications) => [primaryNotification, ...prevNotifications]);

      if (allNotifications.length === 0) {
        addToLocalStorage("notifications", [primaryNotification, ...allNotifications]);
      } else {
        updateLocalStorage("notifications", [primaryNotification, ...allNotifications]);
      }
    }
  }, [primaryNotification]);

  function clearWindow() {
    setAllNotifications([]);
    updateLocalStorage("notifications", []);
  }

  function removeNotification(key) {
    const filteredNotifications = allNotifications.filter((notf) => notf.key !== key);
    setAllNotifications(filteredNotifications);

    updateLocalStorage("notifications", filteredNotifications);
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
