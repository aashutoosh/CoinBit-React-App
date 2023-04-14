import React from 'react';

export default function Technology() {
  return (
    <div className="technology">
      <h3>⚡️ Technologies used:</h3>
      <ul>
        <li>- HTML, CSS (SCSS), and React.</li>
        <li>
          - Hosted on{' '}
          <a href="https://developers.cloudflare.com/pages/" target="_blank" rel="noreferrer">
            Cloudflare Pages.
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
