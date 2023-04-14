import React, { useEffect, useState } from 'react';
import { getFromLocalStorage, updateLocalStorage } from '../../utils/localStorageUtils';

import Heading from './Heading';
import DiscordToggle from './DiscordToggle';
import WebhookInput from './WebhookInput';

import './settingsSection.scss';

function SettingsSection({ activeSection }) {
  const [discordChecked, setDiscordChecked] = useState(
    getFromLocalStorage('sendDiscordAlerts') || false,
  );

  const toggleDiscordCheckbox = () => {
    setDiscordChecked(!discordChecked);
  };

  useEffect(() => {
    updateLocalStorage('sendDiscordAlerts', discordChecked);
  }, [discordChecked]);

  return (
    <section
      className={`settings rightside ${activeSection === 'settings' ? 'showsection' : ''}`}
      id="settings"
    >
      <Heading />
      <div className="rightside__container">
        <DiscordToggle discordChecked={discordChecked} onToggle={toggleDiscordCheckbox} />
        <WebhookInput discordChecked={discordChecked} />
      </div>
    </section>
  );
}

export default React.memo(SettingsSection);
