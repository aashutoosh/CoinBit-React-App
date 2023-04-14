import React from 'react';

export default function EmptyText() {
  return (
    <div className="alerts__empty show">
      <i className="ri-error-warning-line" />
      <span>To create an alert, please add symbols to your watchlist.</span>
    </div>
  );
}
