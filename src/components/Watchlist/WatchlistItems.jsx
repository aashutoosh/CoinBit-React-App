import React from 'react';
import { ariaSymbolName } from '../../utils/helper';

export default function WatchlistItems({ watchlistSymbols, itemsAction, watchlistData }) {
  const watchlistItems = watchlistSymbols.map((symbol) => {
    const symbolData = watchlistData[symbol];
    const ariaSymbol = ariaSymbolName(symbol);
    return (
      <li className="watchlist__item symbol " key={symbol} aria-label={ariaSymbol}>
        <span className="symbol__name" aria-label={ariaSymbol}>
          {symbol}
        </span>
        <div className="symbol__price">
          <span className={`symbol__price--latest ${symbolData?.priceColor}`}>
            {symbolData?.price || '0.0'}
          </span>
          <div>
            <span className={`symbol__price--24change ${symbolData?.priceChangeColor}`}>
              ({symbolData?.priceChange || '0.0'}%)
            </span>
            <i
              className={`symbol__price--direction ${symbolData?.direction} ${symbolData?.priceChangeColor}`}
            />
          </div>
        </div>
        <div className="symbol__action">
          <i
            className="createNewAlert button__item button__item--green ri-alarm-line"
            role="button"
            tabIndex={0}
            aria-label={`Create alert for ${ariaSymbol}`}
          />
          <i
            className="delete button__item button__item--red ri-delete-bin-6-line"
            tabIndex={0}
            role="button"
            aria-label={`Delete ${ariaSymbol} from watchlist`}
          />
        </div>
      </li>
    );
  });

  const keyActionHandler = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      itemsAction(event);
    }
  };

  return (
    <ul
      className="watchlist__items"
      onClick={itemsAction}
      onKeyDown={keyActionHandler}
      role="listbox"
      aria-label="Watchlist Symbols"
    >
      {watchlistItems}
    </ul>
  );
}
