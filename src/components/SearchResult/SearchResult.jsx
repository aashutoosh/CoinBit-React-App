import React from 'react';
import './searchResult.scss';

export default function SearchResults({
  searchQuery,
  allSymbols,
  watchlistSymbols,
  searchResultRef,
  onAddButtonClick,
}) {
  const filteredSymbols = allSymbols.filter(
    (symbol) => symbol.indexOf(searchQuery.toUpperCase()) !== -1,
  );

  const handleClick = (event) => {
    const button = event.target.closest('.button__item');
    if (button) {
      const coinName = button.previousSibling.textContent;
      onAddButtonClick(coinName);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  };

  const items = filteredSymbols.map((symbol) => {
    const isWatchlisted = watchlistSymbols.includes(symbol);
    const iconClass = isWatchlisted
      ? 'button__item button__item--green ri-check-line active'
      : 'button__item button__item--green ri-add-line';
    return (
      <li key={symbol} className="searchresults__item" tabIndex={isWatchlisted ? -1 : 0}>
        <span className="coinname">{symbol}</span>
        <i
          className={iconClass}
          tabIndex={isWatchlisted ? -1 : 0}
          role="button"
          aria-label={`Add ${symbol} to watchlist`}
        />
      </li>
    );
  });

  return (
    <ul
      className="searchresults"
      ref={searchResultRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="listbox"
      aria-label="Search Results"
    >
      {items}
    </ul>
  );
}
