import React, { useEffect, useRef, useState } from "react";
import { SECONDARY_NOTIFICATION_SEC } from "../../config";

import "./secondaryNotification.scss";

function SecondaryNotification({ notification }) {
  const message = notification.message;
  const icon = notification.icon ? notification.icon : "ri-notification-4-line";
  const [isVisible, setIsVisible] = useState(false);
  const notfElement = useRef(null);

  useEffect(() => {
    let timeoutId;

    if (isVisible) {
      timeoutId = setTimeout(() => {
        notfElement.current.classList.remove("show");
        notfElement.current.classList.add("hide");

        setTimeout(() => {
          setIsVisible(false);
        }, 200);
      }, SECONDARY_NOTIFICATION_SEC);
    }

    if (timeoutId) {
      return () => clearTimeout(timeoutId);
    }
  }, [isVisible, message]);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
    }

    return () => {
      setIsVisible(false);
    };
  }, [notification]);

  return (
    <>
      {isVisible && (
        <div className="secondary__notification show" ref={notfElement}>
          <i className={`icon ${icon}`}></i>
          <span className="message">{message}</span>
        </div>
      )}
    </>
  );
}

export default React.memo(SecondaryNotification);
