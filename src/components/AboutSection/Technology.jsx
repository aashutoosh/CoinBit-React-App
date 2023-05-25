import React from 'react';

export default function Technology() {
  return (
    <div className="technology">
      <h3 aria-label="Technologies used">⚡️ Technologies used:</h3>
      <ul>
        <li>- HTML, CSS (SCSS), and React.</li>
        <li>
          - Hosted on{' '}
          <a href="https://www.netlify.com/" target="_blank" rel="noreferrer">
            Netlify.
          </a>
        </li>
        <li>
          -{' '}
          <a
            href="https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams"
            target="_blank"
            rel="noreferrer"
          >
            Binance WebSocket API.
          </a>
        </li>
        <li>- Discord Webhook API.</li>
      </ul>
    </div>
  );
}
