import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SECONDARY_NOTIFICATION_SEC } from '../../config';

import './secondaryNotification.scss';

function SecondaryNotification({ notification }) {
  const { message } = notification;
  const messageMemo = useMemo(() => message, [message]);
  const icon = notification.icon ? notification.icon : 'ri-notification-4-line';
  const [isVisible, setIsVisible] = useState(false);
  const notfElement = useRef(null);

  useEffect(() => {
    let timeoutId;

    if (isVisible) {
      timeoutId = setTimeout(() => {
        notfElement.current.classList.remove('show');
        notfElement.current.classList.add('hide');

        setTimeout(() => {
          setIsVisible(false);
        }, 200);
      }, SECONDARY_NOTIFICATION_SEC);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, messageMemo]);

  useEffect(() => {
    if (messageMemo) {
      setIsVisible(true);
    }

    return () => {
      setIsVisible(false);
    };
  }, [notification, messageMemo]);

  return (
    isVisible && (
      <div
        className="secondary__notification show"
        ref={notfElement}
        aria-live="assertive"
        aria-atomic="true"
      >
        <i className={`icon ${icon}`} />
        <span className="message">{messageMemo}</span>
      </div>
    )
  );
}

export default React.memo(SecondaryNotification);
