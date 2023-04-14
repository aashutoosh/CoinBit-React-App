import React from 'react';

export default function Disclaimer() {
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
