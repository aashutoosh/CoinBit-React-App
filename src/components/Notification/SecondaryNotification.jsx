import { useEffect, useRef, useState } from "react";
import { SECONDARY_NOTIFICATION_SEC } from "../../config";

import "./secondaryNotification.scss";

export default function SecondaryNotification({ message, icon }) {
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

    return () => clearTimeout(timeoutId);
  }, [isVisible, message]);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
    }

    return () => {
      setIsVisible(false);
    };
  }, [message]);

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
