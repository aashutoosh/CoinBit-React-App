import React, { useRef } from 'react';

export default function Heading({ tabChange, createAlert }) {
  const pendingTab = useRef(null);
  const triggeredTab = useRef(null);

  const tabChangeHandler = (event) => {
    const isPendingType = event.target.classList.contains('alerts__title--pending');
    if (isPendingType) {
      triggeredTab.current.classList.remove('active');
      pendingTab.current.classList.add('active');
      tabChange('pending');
    } else {
      pendingTab.current.classList.remove('active');
      triggeredTab.current.classList.add('active');
      tabChange('triggered');
    }

    // Update aria-label for active tab
    pendingTab.current.setAttribute(
      'aria-label',
      isPendingType ? 'Pending alerts tab - Active' : 'Pending alerts tab',
    );
    triggeredTab.current.setAttribute(
      'aria-label',
      !isPendingType ? 'Triggered alerts tab - Active' : 'Triggered alerts tab',
    );
  };

  const keyTabChangeHandler = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      tabChangeHandler(event);
    }
  };

  const createNewAlert = () => {
    createAlert({
      type: 'create',
      symbol: '',
    });
  };

  return (
    <div className="heading">
      <div className="heading__window">
        <button
          className="alerts__title alerts__title--pending active"
          onClick={tabChangeHandler}
          ref={pendingTab}
          onKeyDown={keyTabChangeHandler}
          aria-label="Pending alerts tab"
          type="button"
        >
          <i className="ri-eye-line" />
          Pending
        </button>
        <button
          className="alerts__title alerts__title--triggered"
          onClick={tabChangeHandler}
          ref={triggeredTab}
          onKeyDown={keyTabChangeHandler}
          aria-label="Triggered alerts tab"
          type="button"
        >
          <i className="ri-eye-close-line" />
          Triggered
        </button>
      </div>
      <button
        className="alerts__create--button text"
        onClick={createNewAlert}
        type="button"
        aria-label="Create Alert"
      >
        Create Alert
      </button>
      <button
        className="alerts__create--button icon"
        onClick={createNewAlert}
        type="button"
        aria-label="Create Alert"
      >
        <i className="ri-add-line" />
      </button>
    </div>
  );
}
