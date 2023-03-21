import React, { useEffect, useState, useRef } from "react";
import { fetchAllSymbols } from "../../binance";
import { addToLocalStorage, getFromLocalStorage, updateLocalStorage } from "../../utils/localStorageUtils";
import SearchResults from "../SearchResult/SearchResult";
import "./watchlist.scss";

function WatchlistSearchInput({ queryString, inputHandler, searchInputRef }) {
  return (
    <div className="watchlist__search" ref={searchInputRef}>
      <span>
        <svg className="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={14} height={14}>
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"
            fill="#7A7A7A"
          />
        </svg>
      </span>
      <input
        type="text"
        className="watchlist__search--input"
        placeholder="Search crypto pairs like btcusdt, ethbtc"
        onChange={inputHandler}
        value={queryString}
      />
    </div>
  );
}

function WatchlistItems({ watchlistSymbols, deleteItems }) {
  const watchlistItems = watchlistSymbols.map((symbol) => {
    return (
      <li className="watchlist__item symbol " key={symbol}>
        <span className="symbol__name">{symbol}</span>
        <div className="symbol__price">
          <span className="symbol__price--latest">0.00</span>
          <div>
            <span className="symbol__price--24change">(+0.00%)</span>
            <i className="symbol__price--direction ri-arrow-up-s-fill" />
          </div>
        </div>
        <div className="symbol__action">
          <i className="createNewAlert button__item button__item--green ri-alarm-line" />
          <i className="delete button__item button__item--red ri-delete-bin-6-line" />
        </div>
      </li>
    );
  });
  return (
    <ul className="watchlist__items" onClick={deleteItems}>
      {watchlistItems}
    </ul>
  );
}

export default function Watchlist({ secondaryNotification, createAlert }) {
  const [queryString, setQueryString] = useState("");
  const [exchangeSymbols, setExchangeSymbols] = useState([]);
  const [watchlistSymbols, setWatchlistSymbols] = useState(getFromLocalStorage("watchlist") || []);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultRef = useRef(null);

  const searchInputHandler = (event) => {
    setQueryString(event.target.value);
    setShowSearchResults(true);
  };

  const addToWatchlistHandler = (symbol) => {
    if (!watchlistSymbols.includes(symbol)) {
      setWatchlistSymbols((prevSymbols) => [...prevSymbols, symbol]);
      addToLocalStorage("watchlist", [...watchlistSymbols, symbol]);
      secondaryNotification(`Subscribed: ${symbol}`, "ri-checkbox-circle-line");
    }
  };

  const deleteFromWatchlistHandler = (event) => {
    if (event.target.classList.contains("delete")) {
      const listElement = event.target.closest(".watchlist__item");
      const selectedSymbol = listElement.querySelector(".symbol__name").textContent;
      const filteredSymbols = watchlistSymbols.filter((symbol) => symbol !== selectedSymbol);
      secondaryNotification(`Unsubscribed: ${selectedSymbol}`, "ri-delete-bin-line");

      updateLocalStorage("watchlist", filteredSymbols);
      setWatchlistSymbols((prevSymbols) => prevSymbols.filter((symbol) => symbol !== selectedSymbol));
    } else if (event.target.classList.contains("createNewAlert")) {
      const listElement = event.target.closest(".watchlist__item");
      const selectedSymbol = listElement.querySelector(".symbol__name").textContent;
      createAlert({
        type: "create",
        symbol: selectedSymbol,
      });
    }
  };

  useEffect(() => {
    fetchAllSymbols().then((fetchedSymbols) => setExchangeSymbols(fetchedSymbols));

    // Hides searchResults when clicked outside of searchInput or searchResults
    document.addEventListener("mousedown", (event) => {
      if (searchInputRef.current?.contains(event.target) || searchResultRef.current?.contains(event.target)) return;

      setShowSearchResults(false);
      setQueryString("");
    });
  }, []);

  return (
    <section className="watchlist leftside" id="watchlist">
      <WatchlistSearchInput
        queryString={queryString}
        inputHandler={searchInputHandler}
        searchInputRef={searchInputRef}
      />
      {showSearchResults && (
        <SearchResults
          searchQuery={queryString}
          allSymbols={exchangeSymbols}
          watchlistSymbols={watchlistSymbols}
          searchResultRef={searchResultRef}
          onAddButtonClick={addToWatchlistHandler}
        />
      )}

      <WatchlistItems watchlistSymbols={watchlistSymbols} deleteItems={deleteFromWatchlistHandler} />
    </section>
  );
}
