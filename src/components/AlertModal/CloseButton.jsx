import React, { useRef } from 'react';

export default function CloseButton({ closeHandler }) {
  const closeButtonRef = useRef(null);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') closeHandler();
  };

  return (
    <i
      ref={closeButtonRef}
      className="alertmodal__close ri-close-line"
      onClick={closeHandler}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    />
  );
}
