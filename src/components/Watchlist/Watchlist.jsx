import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import { fetchAllSymbols } from '../../binance';
import { WebSocketContext } from '../../context/websocketContext';
import {
  addToLocalStorage,
  getFromLocalStorage,
  updateLocalStorage,
} from '../../utils/localStorageUtils';
import SearchResults from '../SearchResult/SearchResult';

import WatchlistSearchInput from './WatchlistSearchInput';
import WatchlistItems from './WatchlistItems';

import './watchlist.scss';

export default function Watchlist({ createAlert, activeSection, websocketActions }) {
  const [queryString, setQueryString] = useState('');
  const [exchangeSymbols, setExchangeSymbols] = useState([]);
  const exchangeSymbolsMemo = useMemo(() => exchangeSymbols, [exchangeSymbols]);
  const [watchlistSymbols, setWatchlistSymbols] = useState(getFromLocalStorage('watchlist') || []);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [watchlistData, setWatchlistData] = useState({});
  const searchInputRef = useRef(null);
  const searchResultRef = useRef(null);

  const wsData = useContext(WebSocketContext);

  useEffect(() => {
    const initialData = {};
    watchlistSymbols.forEach((symbol) => {
      initialData[symbol] = {
        price: 0.0,
        priceColor: '',
        priceChange: 0.0,
        priceChangeColor: '',
        direction: 'ri-arrow-up-s-fill',
      };
    });
    setWatchlistData(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wsData) {
      const { data } = wsData;
      const { s: symbol, c: currentPrice, P: currentPriceChange } = data;
      const prevData = watchlistData[symbol];
      let priceColor = '';
      if (prevData?.price) {
        priceColor = currentPrice > prevData.price ? 'green' : 'red';
      }

      const newSymbolData = {
        price: Number(currentPrice),
        priceColor,
        priceChange: Number(currentPriceChange),
        priceChangeColor: currentPriceChange > 0 ? 'green' : 'red',
        direction: currentPriceChange > 0 ? 'ri-arrow-up-s-fill' : 'ri-arrow-down-s-fill',
      };
      setWatchlistData({ ...watchlistData, [symbol]: newSymbolData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsData]);

  const searchInputHandler = (event) => {
    setQueryString(event.target.value);
    setShowSearchResults(true);
  };

  const addToWatchlistHandler = (symbol) => {
    if (!watchlistSymbols.includes(symbol)) {
      setWatchlistSymbols((prevSymbols) => [...prevSymbols, symbol]);
      addToLocalStorage('watchlist', [...watchlistSymbols, symbol]);

      websocketActions.wsSubscribe(symbol);
    }
  };

  const watchlistActionHandler = (event) => {
    if (event.target.classList.contains('delete')) {
      const listElement = event.target.closest('.watchlist__item');
      const selectedSymbol = listElement.querySelector('.symbol__name').textContent;
      const filteredSymbols = watchlistSymbols.filter((symbol) => symbol !== selectedSymbol);

      websocketActions.wsUnsubscribe(selectedSymbol, 'watchlist');
      updateLocalStorage('watchlist', filteredSymbols);
      setWatchlistSymbols((prevSymbols) =>
        prevSymbols.filter((symbol) => symbol !== selectedSymbol),
      );

      const updatedData = { ...watchlistData };
      delete updatedData[selectedSymbol];
      setWatchlistData(updatedData);
    } else if (event.target.classList.contains('createNewAlert')) {
      const listElement = event.target.closest('.watchlist__item');
      const selectedSymbol = listElement.querySelector('.symbol__name').textContent;
      createAlert({
        type: 'create',
        symbol: selectedSymbol,
      });
    }
  };

  useEffect(() => {
    if (exchangeSymbolsMemo.length === 0) {
      fetchAllSymbols().then((fetchedSymbols) => setExchangeSymbols(fetchedSymbols));
    }
  }, [queryString, exchangeSymbolsMemo]);

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (
        searchInputRef.current?.contains(event.target) ||
        searchResultRef.current?.contains(event.target)
      )
        return;

      setShowSearchResults(false);
      setQueryString('');
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowSearchResults(false);
        setQueryString('');
      }
    };

    // Hides searchResults when clicked outside of searchInput or searchResults
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      className={`watchlist leftside ${activeSection === 'watchlist' ? 'showsection' : ''}`}
      id="watchlist"
    >
      <WatchlistSearchInput
        queryString={queryString}
        inputHandler={searchInputHandler}
        searchInputRef={searchInputRef}
      />
      {showSearchResults && (
        <SearchResults
          searchQuery={queryString}
          allSymbols={exchangeSymbolsMemo}
          watchlistSymbols={watchlistSymbols}
          searchResultRef={searchResultRef}
          onAddButtonClick={addToWatchlistHandler}
        />
      )}

      <WatchlistItems
        watchlistSymbols={watchlistSymbols}
        itemsAction={watchlistActionHandler}
        watchlistData={watchlistData}
      />
    </section>
  );
}
