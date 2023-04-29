import React, { useRef } from 'react';

export default function CloseButton({ closeHandler }) {
  const closeButtonRef = useRef(null);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') closeHandler();
  };

  return (
    <button
      ref={closeButtonRef}
      className="alertmodal__close"
      onClick={closeHandler}
      onKeyDown={handleKeyDown}
      aria-label="Close"
      type="button"
    >
      <i className="ri-close-line" />
    </button>
  );
}
