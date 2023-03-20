import "./searchResult.scss";

export default function SearchResults({
  allSymbols,
  searchQuery,
  watchlistSymbols,
  searchResultRef,
  onAddButtonClick,
}) {
  const filteredSymbols = allSymbols.filter((symbol) => symbol.indexOf(searchQuery.toUpperCase()) !== -1);

  const handleClick = (event) => {
    const button = event.target.closest(".button__item");
    if (button) {
      const coinName = button.previousSibling.textContent;
      onAddButtonClick(coinName);
    }
  };

  const items = filteredSymbols.map((symbol) => {
    const isWatchlisted = watchlistSymbols.includes(symbol);
    const iconClass = isWatchlisted
      ? "button__item button__item--green ri-check-line active"
      : "button__item button__item--green ri-add-line";
    return (
      <li key={symbol} className="searchresults__item">
        <span className="coinname">{symbol}</span>
        <i className={iconClass}></i>
      </li>
    );
  });

  return (
    <ul className="searchresults" ref={searchResultRef} onClick={handleClick}>
      {items}
    </ul>
  );
}
