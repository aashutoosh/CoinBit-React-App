import { DISCORD_FOOTER_TEXT } from '../config';
import { getFromLocalStorage } from './localStorageUtils';

export function sendDiscordAlert(alert, notfCallback) {
  const webhookURL = getFromLocalStorage('discordWebhookUrl');
  const discordEnabled = getFromLocalStorage('sendDiscordAlerts');

  if (discordEnabled) {
    if (typeof webhookURL === 'string' && webhookURL !== '') {
      const payload = {
        embeds: [
          {
            type: 'rich',
            title: alert.title,
            description: alert.description,
            color: 0xf0ba09,
            fields: [
              {
                name: '\u200B',
                value: `${alert.symbol} ${alert.condition} ${alert.price}`,
              },
            ],
            footer: {
              text: DISCORD_FOOTER_TEXT,
            },
          },
        ],
      };

      try {
        fetch(webhookURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            if (response.status === 405) {
              notfCallback(`Discord Webhook URL not valid`, 'ri-error-warning-line');
            }
          })
          .catch((error) => notfCallback(`Error: ${error}`, 'ri-error-warning-line'));
      } catch (error) {
        notfCallback(`Error: ${error.message}`, 'ri-error-warning-line');
      }
    } else {
      notfCallback('Please enter valid discord webhook URL.', 'ri-error-warning-line');
    }
  }
}
