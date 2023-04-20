import React from 'react';

export default function Features() {
  return (
    <div className="features">
      <h3 aria-label="Features">✅ Features:</h3>
      <ul>
        <li>- Real-time cryptocurrency data updates from Binance websocket API.</li>
        <li>- Custom watchlist to monitor favorite cryptocurrencies.</li>
        <li>- Custom price alerts with options to send to Discord.</li>
        <li>- Responsive design for mobile, tablet and desktop.</li>
        <li>- Dark and light mode options for user preference.</li>
        <li>- Accessible via screen reader, easy Tab key navigation.</li>
      </ul>
    </div>
  );
}
