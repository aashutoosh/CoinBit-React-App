import React, { useContext, useState } from 'react';
import { getFromLocalStorage, updateLocalStorage } from '../../utils/localStorageUtils';
import { SecondaryNotificationsContext } from '../../context/secondaryNotificationsContext';
import { VALID_WEBHOOK_STARTSWITH } from '../../config';

export default function WebhookInput({ discordChecked }) {
  const secondaryNotification = useContext(SecondaryNotificationsContext);
  const [webhookUrl, setWebhookUrl] = useState(getFromLocalStorage('discordWebhookUrl') || '');

  const updateWebhookUrl = () => {
    const url = webhookUrl.trim();

    const isValidWebhookUrl = url.startsWith(VALID_WEBHOOK_STARTSWITH);
    if (!isValidWebhookUrl) {
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
        <span>Discord Webhook URL</span>{' '}
        <i
          className="ri-question-line"
          // eslint-disable-next-line
          tabIndex={discordChecked ? 0 : -1}
          role="tooltip"
          aria-describedby="tooltip"
          aria-label="Tooltip"
        />
        <div className="tooltip" id="tooltip">
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
          tabIndex={discordChecked ? 0 : -1}
        />
        <i className="ri-link-m webhook__input--icon" />
        <button
          className="save__url"
          type="button"
          onClick={updateWebhookUrl}
          tabIndex={discordChecked ? 0 : -1}
        >
          Save
        </button>
      </div>
    </div>
  );
}
