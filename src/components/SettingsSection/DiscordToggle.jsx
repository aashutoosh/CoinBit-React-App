import React, { useEffect, useRef } from 'react';

export default function DiscordToggle({ discordChecked, onToggle }) {
  const toggleSwitch = useRef(null);

  useEffect(() => {
    if (toggleSwitch.current) {
      toggleSwitch.current.checked = discordChecked;
    }
  }, [discordChecked]);

  return (
    <div className="discord">
      <label className="discord__label" htmlFor="discord__checkbox">
        Send Discord Alert
      </label>
      <input
        ref={toggleSwitch}
        type="checkbox"
        id="discord__checkbox"
        className="discord__checkbox"
        onClick={onToggle}
      />
    </div>
  );
}
