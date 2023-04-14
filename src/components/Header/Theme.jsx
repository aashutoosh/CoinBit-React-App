import React, { useEffect, useRef, useState } from 'react';
import { addToLocalStorage, getFromLocalStorage } from '../../utils/localStorageUtils';

export default function Theme() {
  const [theme, setTheme] = useState(getFromLocalStorage('theme') || 'dark');
  const moonIcon = useRef(null);
  const sunIcon = useRef(null);

  useEffect(() => {
    const html = document.querySelector('html');

    addToLocalStorage('theme', theme);

    if (html.dataset.theme !== theme) {
      if (theme === 'light') {
        html.dataset.theme = 'light';
        sunIcon.current.classList.remove('active');
        moonIcon.current.classList.add('active');
      } else {
        html.dataset.theme = 'dark';
        moonIcon.current.classList.remove('active');
        sunIcon.current.classList.add('active');
      }
    }
  }, [theme]);

  const themeToggleHandler = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const keyDownHandler = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      themeToggleHandler();
    }
  };

  return (
    <div
      className="nav__theme"
      onClick={themeToggleHandler}
      onKeyDown={keyDownHandler}
      role="button"
      tabIndex={0}
    >
      {/* Moon Icon */}
      <svg
        ref={moonIcon}
        className="icon icon-moon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={16}
        height={16}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z" />
      </svg>
      {/* Sun Icon */}
      <svg
        ref={sunIcon}
        className="icon icon-sun active"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={16}
        height={16}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
      </svg>
    </div>
  );
}
