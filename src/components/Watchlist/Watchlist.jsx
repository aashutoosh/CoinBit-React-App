import React, { useEffect, useState, useRef, useContext } from "react";
import { fetchAllSymbols } from "../../binance";
import { WebSocketContext } from "../../context/websocketContext";
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

function WatchlistItems({ watchlistSymbols, deleteItems, watchlistData }) {
  const watchlistItems = watchlistSymbols.map((symbol) => {
    const symbolData = watchlistData[symbol];
    return (
      <li className="watchlist__item symbol " key={symbol}>
        <span className="symbol__name">{symbol}</span>
        <div className="symbol__price">
          <span className={`symbol__price--latest ${symbolData?.priceColor}`}>{symbolData?.price || "0.0"}</span>
          <div>
            <span className={`symbol__price--24change ${symbolData?.priceChangeColor}`}>
              ({symbolData?.priceChange || "0.0"}%)
            </span>
            <i className={`symbol__price--direction ${symbolData?.direction} ${symbolData?.priceChangeColor}`} />
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

export default function Watchlist({ createAlert, activeSection, websocketActions }) {
  const [queryString, setQueryString] = useState("");
  const [exchangeSymbols, setExchangeSymbols] = useState([]);
  const [watchlistSymbols, setWatchlistSymbols] = useState(getFromLocalStorage("watchlist") || []);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [watchlistData, setWatchlistData] = useState({});
  const searchInputRef = useRef(null);
  const searchResultRef = useRef(null);

  const wsData = useContext(WebSocketContext);

  useEffect(() => {
    const initialData = {};
    watchlistSymbols.map((symbol) => {
      initialData[symbol] = {
        price: 0.0,
        priceColor: "",
        priceChange: 0.0,
        priceChangeColor: "",
        direction: "ri-arrow-up-s-fill",
      };
    });
    setWatchlistData(initialData);
  }, []);

  useEffect(() => {
    if (wsData) {
      const prevData = watchlistData[wsData.data.s];
      const currentPrice = Number(wsData.data.c);
      const currentPiceChange = Number(wsData.data.P);
      const newSymbolData = {
        price: currentPrice,
        priceColor: prevData?.price ? (currentPrice > prevData.price ? "green" : "red") : "",
        priceChange: currentPiceChange,
        priceChangeColor: currentPiceChange > 0 ? "green" : "red",
        direction: currentPiceChange > 0 ? "ri-arrow-up-s-fill" : "ri-arrow-down-s-fill",
      };
      setWatchlistData({ ...watchlistData, [wsData.data.s]: newSymbolData });
    }
  }, [wsData]);

  const searchInputHandler = (event) => {
    setQueryString(event.target.value);
    setShowSearchResults(true);
  };

  const addToWatchlistHandler = (symbol) => {
    if (!watchlistSymbols.includes(symbol)) {
      setWatchlistSymbols((prevSymbols) => [...prevSymbols, symbol]);
      addToLocalStorage("watchlist", [...watchlistSymbols, symbol]);

      websocketActions.wsSubscribe(symbol);
    }
  };

  const deleteFromWatchlistHandler = (event) => {
    if (event.target.classList.contains("delete")) {
      const listElement = event.target.closest(".watchlist__item");
      const selectedSymbol = listElement.querySelector(".symbol__name").textContent;
      const filteredSymbols = watchlistSymbols.filter((symbol) => symbol !== selectedSymbol);

      websocketActions.wsUnsubscribe(selectedSymbol, "watchlist");
      updateLocalStorage("watchlist", filteredSymbols);
      setWatchlistSymbols((prevSymbols) => prevSymbols.filter((symbol) => symbol !== selectedSymbol));

      const updatedData = { ...watchlistData };
      delete updatedData[selectedSymbol];
      setWatchlistData(updatedData);
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
    <section className={`watchlist leftside ${activeSection === "watchlist" ? "showsection" : ""}`} id="watchlist">
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

      <WatchlistItems
        watchlistSymbols={watchlistSymbols}
        deleteItems={deleteFromWatchlistHandler}
        watchlistData={watchlistData}
      />
    </section>
  );
}
