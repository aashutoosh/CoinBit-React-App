import React, { useContext, useEffect, useRef, useState } from 'react';
import { SecondaryNotificationsContext } from '../../context/secondaryNotificationsContext';
import { getFromLocalStorage, updateLocalStorage } from '../../utils/localStorageUtils';
import { VALID_WEBHOOK_STARTSWITH } from '../../config';
import './settingsSection.scss';

function Heading() {
  return (
    <div className="heading">
      <h2 className="rightside__title">
        <i className="ri-settings-3-line" />
        Settings
      </h2>
    </div>
  );
}

function DiscordToggle({ discordChecked, onToggle }) {
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

function WebhookInput({ discordChecked }) {
  const secondaryNotification = useContext(SecondaryNotificationsContext);
  const [webhookUrl, setWebhookUrl] = useState(getFromLocalStorage('discordWebhookUrl') || '');

  const updateWebhookUrl = () => {
    const url = webhookUrl.trim();

    const isValidWebhookUrl = url.startsWith(VALID_WEBHOOK_STARTSWITH);
    if (!isValidWebhookUrl && !(url === '')) {
      secondaryNotification('Please enter a valid Discord webhook URL.', 'ri-error-warning-line');
      return;
    }

    updateLocalStorage('discordWebhookUrl', url);
    secondaryNotification('Webhook URL saved!', 'ri-checkbox-circle-line');
  };

  const onInputChange = (event) => {
    setWebhookUrl(event.target.value);
  };

  return (
    <div className={`webhook ${discordChecked ? 'show' : ''}`}>
      <label className="webhook__label" htmlFor="webhookURL">
        <span>Discord Webhook URL</span> <i className="ri-question-line" />
        <div className="tooltip">
          <span>How to get Discord Webhook Url ?</span>
          <ul>
            <li>1. Open channel settings.</li>
            <li>2. Go to Integrations.</li>
            <li>3. Select Webhooks.</li>
            <li>4. Create a new webhook.</li>
            <li>5. Copy unique URL.</li>
          </ul>
        </div>
      </label>
      <div className="webhook__input">
        <input
          type="text"
          name="webhookURL"
          id="webhookURL"
          value={webhookUrl}
          onChange={onInputChange}
        />
        <i className="ri-link-m" />
        <button className="save__url" type="button" onClick={updateWebhookUrl}>
          Save
        </button>
      </div>
    </div>
  );
}

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
