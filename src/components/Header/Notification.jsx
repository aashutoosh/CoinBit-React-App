import React, { useCallback, useEffect, useRef } from 'react';

export default function Notification({ primaryNotification, onBellClick, showNotificationWindow }) {
  const notificationBellRef = useRef(null);
  const notificationLightRef = useRef(null);

  const onBellClickMemo = useCallback(onBellClick, [onBellClick]);

  const addNotificationLight = () => {
    notificationLightRef.current.classList.add('active');
  };

  const removeNotificationLight = () => {
    notificationLightRef.current.classList.remove('active');
  };

  const handleBellClick = () => {
    onBellClickMemo();
    removeNotificationLight();
  };

  useEffect(() => {
    function handleOutsideClick(event) {
      if (notificationBellRef.current.contains(event.target)) {
        event.stopPropagation();
      } else if (showNotificationWindow) {
        onBellClickMemo();
      }
    }

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showNotificationWindow, onBellClickMemo]);

  useEffect(() => {
    if (primaryNotification?.key) {
      addNotificationLight();
    }
  }, [primaryNotification]);

  const keyDownHandler = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBellClick();
    }
  };

  return (
    <div
      className="nav__notification"
      onClick={handleBellClick}
      ref={notificationBellRef}
      onKeyDown={keyDownHandler}
      role="button"
      tabIndex={0}
    >
      <svg
        className=""
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={16}
        height={16}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zm-2 0v-7a6 6 0 1 0-12 0v7h12zm-9 4h6v2H9v-2z" />
      </svg>
      <span className="nav__notification--light show" ref={notificationLightRef} />
    </div>
  );
}
