import './aboutSection.scss';

import React from 'react';

function Heading() {
  return (
    <div className="heading">
      <h2 className="rightside__title">
        <i className="ri-user-line" />
        About
      </h2>
    </div>
  );
}

function Github() {
  return (
    <div className="github">
      <i className="ri-github-fill github__icon" />
      <a href="https://github.com/aashutoosh/CoinBit-React-App" target="_blank" rel="noreferrer">
        View this project on Github
      </a>
    </div>
  );
}

function Features() {
  return (
    <div className="features">
      <h3>✅ Features:</h3>
      <ul>
        <li>- Real-time cryptocurrency data updates from Binance websocket API.</li>
        <li>- Custom watchlist to monitor favorite cryptocurrencies.</li>
        <li>- Custom price alerts with options to send to Discord.</li>
        <li>- Responsive design for mobile, tablet and desktop.</li>
        <li>- Dark and light mode options for user preference.</li>
      </ul>
    </div>
  );
}

function Technology() {
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

function Disclaimer() {
  return (
    <div className="disclaimer">
      <h3>💡 Disclaimer:</h3>
      <ul>
        <li>- This app does not store any user data on the server.</li>
        <li>- It uses the browser&apos;s local storage to store user preferences and settings.</li>
        <li>
          - This app is intended for demonstration purposes only and should not be used for actual
          trading. We are not liable for any losses incurred through the use of this app.
        </li>
        <li>
          - If you encounter any 🐛 bugs or issues, please report them on our{' '}
          <a
            href="https://github.com/aashutoosh/CoinBit-App/issues"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Issues
          </a>{' '}
          page.
        </li>
      </ul>
    </div>
  );
}

function AboutSection({ activeSection }) {
  return (
    <section
      className={`about rightside ${activeSection === 'about' ? 'showsection' : ''}`}
      id="about"
    >
      <Heading />
      <div className="rightside__container">
        <Github />
        <Features />
        <Technology />
        <Disclaimer />
      </div>
    </section>
  );
}

export default React.memo(AboutSection);
