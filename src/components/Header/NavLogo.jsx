import React from 'react';

export default function NavLogo() {
  return (
    <div className="nav__left">
      <a className="nav__logo" href="/">
        <svg
          className="nav__logo--icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={36}
          height={36}
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M23 12v2c0 3.314-4.925 6-11 6-5.967 0-10.824-2.591-10.995-5.823L1 14v-2c0 3.314 4.925 6 11 6s11-2.686 11-6zM12 4c6.075 0 11 2.686 11 6s-4.925 6-11 6-11-2.686-11-6 4.925-6 11-6z"
            fill="rgba(240,185,11,1)"
          />
        </svg>
        <span className="nav__logo--title">CoinBit</span>
      </a>
    </div>
  );
}
